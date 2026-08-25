output "url_del_cms" {
  description = "URL pública del CMS. Úsela como VITE_CMS_URL en el front"
  value       = "https://${azurerm_container_app.cms.ingress[0].fqdn}"
}

output "panel_de_administracion" {
  value = "https://${azurerm_container_app.cms.ingress[0].fqdn}/admin"
}

output "registro_de_imagenes" {
  value = azurerm_container_registry.acr.login_server
}

output "grupo_recursos" {
  value = data.azurerm_resource_group.bmc.name
}
