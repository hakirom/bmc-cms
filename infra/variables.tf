variable "region" {
  description = "Región de AWS"
  type        = string
  default     = "us-east-1"
}

variable "nombre" {
  description = "Prefijo para los recursos"
  type        = string
  default     = "bmc-cms"
}

variable "repositorio" {
  description = "Repositorio Git del CMS"
  type        = string
  default     = "https://github.com/hakirom/bmc-cms.git"
}

variable "ip_administracion" {
  description = "Su IP pública con máscara, para el acceso SSH. Ejemplo: 190.1.2.3/32"
  type        = string
}

variable "nombre_llave_ssh" {
  description = "Nombre de un key pair existente en EC2. Vacío = sin acceso SSH (use EC2 Instance Connect)"
  type        = string
  default     = ""
}

variable "database_url" {
  description = "Cadena de conexión de Neon. Use el endpoint DIRECTO, sin -pooler"
  type        = string
  sensitive   = true
}

variable "frontend_urls" {
  description = "Dominios del front autorizados para CORS, separados por comas"
  type        = string
}
