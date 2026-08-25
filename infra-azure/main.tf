terraform {
  required_version = ">= 1.6"
  required_providers {
    azurerm = { source = "hashicorp/azurerm", version = "~> 4.0" }
    random  = { source = "hashicorp/random", version = "~> 3.6" }
  }
}

provider "azurerm" {
  features {}
  subscription_id = var.suscripcion
}

# El grupo de recursos ya existe y lo administra el cliente: se consulta, no se
# crea. Así este despliegue no puede alterar nada fuera de él.
data "azurerm_resource_group" "bmc" {
  name = var.grupo_recursos
}

# Registro de imágenes. Basic es suficiente: una imagen, un consumidor.
resource "azurerm_container_registry" "acr" {
  name                = replace("${var.nombre}acr", "-", "")
  resource_group_name = data.azurerm_resource_group.bmc.name
  location            = data.azurerm_resource_group.bmc.location
  sku                 = "Basic"

  # Se usan credenciales del registro en lugar de una identidad administrada:
  # asignar el rol AcrPull requiere permisos de administrador de accesos, que
  # en una suscripción delegada normalmente no se tienen.
  admin_enabled = true
}

resource "azurerm_log_analytics_workspace" "logs" {
  name                = "${var.nombre}-logs"
  resource_group_name = data.azurerm_resource_group.bmc.name
  location            = data.azurerm_resource_group.bmc.location
  sku                 = "PerGB2018"
  retention_in_days   = 30
}

resource "azurerm_container_app_environment" "entorno" {
  name                       = "${var.nombre}-entorno"
  resource_group_name        = data.azurerm_resource_group.bmc.name
  location                   = data.azurerm_resource_group.bmc.location
  log_analytics_workspace_id = azurerm_log_analytics_workspace.logs.id
}

# Secretos de Strapi generados aquí: no hay que crearlos ni pegarlos a mano.
locals {
  nombres_secretos = toset([
    "app-key-1",
    "app-key-2",
    "api-token-salt",
    "admin-jwt",
    "jwt",
    "transfer-salt",
    "encryption-key",
  ])
}

resource "random_password" "secretos" {
  for_each = local.nombres_secretos
  length   = 32
  special  = false
}

resource "azurerm_container_app" "cms" {
  name                         = var.nombre
  resource_group_name          = data.azurerm_resource_group.bmc.name
  container_app_environment_id = azurerm_container_app_environment.entorno.id
  revision_mode                = "Single"

  registry {
    server               = azurerm_container_registry.acr.login_server
    username             = azurerm_container_registry.acr.admin_username
    password_secret_name = "acr-password"
  }

  # Los valores sensibles van como secretos de la aplicación, no como variables
  # en claro: no aparecen en el portal ni en los registros.
  dynamic "secret" {
    for_each = random_password.secretos
    content {
      name  = secret.key
      value = secret.value.result
    }
  }

  secret {
    name  = "database-url"
    value = var.database_url
  }

  secret {
    name  = "acr-password"
    value = azurerm_container_registry.acr.admin_password
  }

  ingress {
    external_enabled = true
    target_port      = 1337
    transport        = "auto"

    traffic_weight {
      latest_revision = true
      percentage      = 100
    }
  }

  template {
    min_replicas = var.replicas_minimas
    max_replicas = 1 # Strapi no está preparado para varias instancias sin sesión compartida

    container {
      name   = "cms"
      image  = "${azurerm_container_registry.acr.login_server}/${var.nombre}:latest"
      cpu    = 1.0
      memory = "2Gi"

      env {
        name  = "NODE_ENV"
        value = "production"
      }
      env {
        name  = "HOST"
        value = "0.0.0.0"
      }
      env {
        name  = "PORT"
        value = "1337"
      }
      env {
        name  = "DATABASE_CLIENT"
        value = "postgres"
      }
      env {
        name  = "DATABASE_POOL_MIN"
        value = "0"
      }
      env {
        name  = "DATABASE_POOL_MAX"
        value = "5"
      }
      env {
        name  = "FRONTEND_URLS"
        value = var.frontend_urls
      }

      env {
        name        = "APP_KEYS"
        secret_name = "app-key-1"
      }
      env {
        name        = "API_TOKEN_SALT"
        secret_name = "api-token-salt"
      }
      env {
        name        = "ADMIN_JWT_SECRET"
        secret_name = "admin-jwt"
      }
      env {
        name        = "JWT_SECRET"
        secret_name = "jwt"
      }
      env {
        name        = "TRANSFER_TOKEN_SALT"
        secret_name = "transfer-salt"
      }
      env {
        name        = "ENCRYPTION_KEY"
        secret_name = "encryption-key"
      }
      env {
        name        = "DATABASE_URL"
        secret_name = "database-url"
      }

      liveness_probe {
        transport = "HTTP"
        port      = 1337
        path      = "/_health"
        # Strapi tarda en levantar: sin margen, Azure lo mata en el arranque.
        initial_delay = 60
      }
    }
  }
}
