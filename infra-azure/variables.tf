variable "suscripcion" {
  description = "ID de la suscripción de Azure"
  type        = string
  default     = "c361fb71-9bc7-4bad-8c1f-a57c7e4c40d2"
}

variable "nombre" {
  description = "Prefijo para los recursos"
  type        = string
  default     = "bmc-cms"
}

variable "grupo_recursos" {
  description = "Grupo de recursos EXISTENTE donde se crearán los recursos"
  type        = string
  default     = "rg-Demo-BMC"
}

variable "database_url" {
  description = "Cadena de conexión de Neon (endpoint directo, sin -pooler)"
  type        = string
  sensitive   = true
}

variable "frontend_urls" {
  description = "Dominios del front autorizados para CORS, separados por comas"
  type        = string
}

variable "replicas_minimas" {
  description = "0 = escala a cero cuando no hay tráfico (más barato, arranque en frío de ~20 s). 1 = siempre encendido"
  type        = number
  default     = 1
}
