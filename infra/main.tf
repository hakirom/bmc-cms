terraform {
  required_version = ">= 1.6"
  required_providers {
    aws    = { source = "hashicorp/aws", version = "~> 5.0" }
    random = { source = "hashicorp/random", version = "~> 3.6" }
  }
}

provider "aws" {
  region = var.region
}

# La AMI más reciente de Amazon Linux 2023, sin fijarla a mano.
data "aws_ami" "al2023" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-2023.*-x86_64"]
  }
}

# Rango de direcciones desde el que CloudFront alcanza a los orígenes: permite
# cerrar el puerto de la aplicación a todo lo demás.
data "aws_ec2_managed_prefix_list" "cloudfront" {
  name = "com.amazonaws.global.cloudfront.origin-facing"
}

# Políticas gestionadas necesarias para que el panel de Strapi funcione tras
# CloudFront: sin caché y reenviando todo salvo la cabecera Host.
data "aws_cloudfront_cache_policy" "sin_cache" {
  name = "Managed-CachingDisabled"
}

data "aws_cloudfront_origin_request_policy" "todo_menos_host" {
  name = "Managed-AllViewerExceptHostHeader"
}

# Secretos de Strapi generados aquí: no hay que crearlos ni pegarlos a mano.
# Quedan guardados en el estado de Terraform; protéjalo como un secreto más.
locals {
  nombres_secretos = toset([
    "app_key_1",
    "app_key_2",
    "api_token_salt",
    "admin_jwt",
    "jwt",
    "transfer_salt",
    "encryption_key",
  ])
}

resource "random_password" "secretos" {
  for_each = local.nombres_secretos
  length   = 32
  special  = false
}

# Registro de la imagen. La instancia descarga de aquí: no clona el repositorio,
# que además es privado y exigiría credenciales en la máquina.
resource "aws_ecr_repository" "cms" {
  name                 = var.nombre
  image_tag_mutability = "MUTABLE"
  force_delete         = true

  image_scanning_configuration {
    scan_on_push = true
  }
}

# Conserva solo las últimas 3 imágenes: ECR cobra por almacenamiento.
resource "aws_ecr_lifecycle_policy" "cms" {
  repository = aws_ecr_repository.cms.name

  policy = jsonencode({
    rules = [{
      rulePriority = 1
      description  = "Conservar solo las 3 imagenes mas recientes"
      selection = {
        tagStatus   = "any"
        countType   = "imageCountMoreThan"
        countNumber = 3
      }
      action = { type = "expire" }
    }]
  })
}

data "aws_iam_policy_document" "asumir_ec2" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "instancia" {
  name               = "${var.nombre}-rol"
  assume_role_policy = data.aws_iam_policy_document.asumir_ec2.json
}

# Permiso de solo lectura sobre ECR: la instancia descarga, nunca publica.
resource "aws_iam_role_policy_attachment" "ecr_lectura" {
  role       = aws_iam_role.instancia.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}

# Permite entrar por Session Manager sin abrir el puerto 22 ni usar llaves.
resource "aws_iam_role_policy_attachment" "ssm" {
  role       = aws_iam_role.instancia.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_instance_profile" "instancia" {
  name = "${var.nombre}-perfil"
  role = aws_iam_role.instancia.name
}

resource "aws_security_group" "cms" {
  name        = "${var.nombre}-sg"
  description = "CMS: SSH restringido y puerto de aplicacion solo desde CloudFront"

  ingress {
    description = "SSH de administracion"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.ip_administracion]
  }

  ingress {
    description     = "Trafico de CloudFront hacia Strapi"
    from_port       = 1337
    to_port         = 1337
    protocol        = "tcp"
    prefix_list_ids = [data.aws_ec2_managed_prefix_list.cloudfront.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "${var.nombre}-sg" }
}

resource "aws_instance" "cms" {
  ami                    = data.aws_ami.al2023.id
  instance_type          = "t3.micro" # capa gratuita durante 12 meses
  vpc_security_group_ids = [aws_security_group.cms.id]
  key_name               = var.nombre_llave_ssh != "" ? var.nombre_llave_ssh : null
  iam_instance_profile   = aws_iam_instance_profile.instancia.name

  root_block_device {
    volume_size = 20
    volume_type = "gp3"
    encrypted   = true
  }

  # Exige IMDSv2: evita el acceso a metadatos por peticiones simples.
  metadata_options {
    http_tokens   = "required"
    http_endpoint = "enabled"
  }

  user_data = templatefile("${path.module}/user-data.sh.tftpl", {
    imagen         = "${aws_ecr_repository.cms.repository_url}:latest"
    region         = var.region
    database_url   = var.database_url
    frontend_urls  = var.frontend_urls
    app_keys       = "${random_password.secretos["app_key_1"].result},${random_password.secretos["app_key_2"].result}"
    api_token_salt = random_password.secretos["api_token_salt"].result
    admin_jwt      = random_password.secretos["admin_jwt"].result
    jwt            = random_password.secretos["jwt"].result
    transfer_salt  = random_password.secretos["transfer_salt"].result
    encryption_key = random_password.secretos["encryption_key"].result
  })

  tags = { Name = var.nombre }
}

# IP fija: sin ella la dirección cambia en cada reinicio y CloudFront apuntaría al vacío.
resource "aws_eip" "cms" {
  instance = aws_instance.cms.id
  domain   = "vpc"
  tags     = { Name = "${var.nombre}-ip" }
}

resource "aws_cloudfront_distribution" "cms" {
  enabled = true
  comment = "${var.nombre}: HTTPS para el CMS sin dominio propio"

  origin {
    # CloudFront rechaza una IP como origen; se usa el nombre DNS público que
    # AWS asocia a la IP elástica, estable mientras no se libere.
    domain_name = aws_eip.cms.public_dns
    origin_id   = "ec2"

    custom_origin_config {
      http_port              = 1337
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  default_cache_behavior {
    target_origin_id       = "ec2"
    viewer_protocol_policy = "redirect-to-https"

    # Todos los métodos: el panel de administración necesita escribir.
    allowed_methods = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods  = ["GET", "HEAD"]

    cache_policy_id          = data.aws_cloudfront_cache_policy.sin_cache.id
    origin_request_policy_id = data.aws_cloudfront_origin_request_policy.todo_menos_host.id
  }

  restrictions {
    geo_restriction { restriction_type = "none" }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = { Name = var.nombre }
}
