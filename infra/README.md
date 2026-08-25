# Infraestructura del CMS en AWS

Levanta el CMS completo con un comando: EC2 `t3.micro` (capa gratuita), IP fija,
CloudFront delante para el HTTPS y la base de datos Neon que ya existe.

Son 11 recursos. La instancia se aprovisiona sola: swap, Node 22, clonado del
repositorio, compilación y servicio de systemd.

## Requisitos

- Terraform ≥ 1.6 — `brew install hashicorp/tap/terraform`
- AWS CLI con sesión iniciada — `aws sts get-caller-identity` debe responder
- La cadena de conexión de Neon (endpoint **directo**, sin `-pooler`)

## Uso

```bash
cd infra
cp terraform.tfvars.example terraform.tfvars
# rellene terraform.tfvars: su IP, la cadena de Neon y el dominio del front

terraform init
terraform plan     # revise qué se va a crear
terraform apply
```

Al terminar imprime la URL del CMS. La instancia tarda **entre 5 y 10 minutos más** en
quedar operativa: la compilación del panel de Strapi es lenta en una `t3.micro`.

Para seguir el aprovisionamiento:

```bash
ssh ec2-user@$(terraform output -raw ip_de_la_instancia) 'tail -f /var/log/arranque-bmc.log'
```

Cuando `https://.../_health` responda 204, entre a `/admin` y cree el administrador.

## Después

1. En Vercel: `VITE_CMS_URL` con la URL que imprimió Terraform, y **redesplegar**.
2. Si el dominio del front cambia, actualice `frontend_urls` en `terraform.tfvars` y
   vuelva a aplicar.

## Decisiones que verá en el código

**Los secretos de Strapi se generan aquí** con `random_password`: no hay que crearlos ni
pegarlos. Solo aporta usted la cadena de Neon y los dominios del front.

**CloudFront no es opcional.** Da HTTPS sin dominio propio, y sin él un front en HTTPS no
puede llamar a un backend en HTTP: el navegador lo bloquea. Va configurado sin caché, con
todos los métodos y con `AllViewerExceptHostHeader`; los tres son necesarios para que el
panel funcione detrás del CDN.

**El puerto 1337 solo acepta a CloudFront**, mediante la lista de rangos gestionada
`com.amazonaws.global.cloudfront.origin-facing`. La instancia no queda expuesta.

**El swap de 2 GB no es un extra.** Con 1 GB de RAM la compilación del panel falla sin
decir por qué.

## Advertencias

> **El estado de Terraform contiene los secretos en claro.** `terraform.tfstate` está en
> `.gitignore`; no lo suba ni lo comparta. Para trabajo en equipo, use un backend en S3
> con cifrado y bloqueo en DynamoDB.

> **Coste.** La instancia y su disco entran en capa gratuita 12 meses; CloudFront tiene
> 1 TB mensual siempre gratis. La IP elástica es gratis **mientras esté asociada a una
> instancia encendida**: si apaga la instancia y conserva la IP, se factura.

> **Las subidas de archivos viven en el disco de la instancia.** Si la destruye, se
> pierden. Para producción, conecte `@strapi/provider-upload-aws-s3`.

Para desmontarlo todo: `terraform destroy`.
