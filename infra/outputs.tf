output "url_del_cms" {
  description = "URL pública del CMS. Úsela como VITE_CMS_URL en el front"
  value       = "https://${aws_cloudfront_distribution.cms.domain_name}"
}

output "panel_de_administracion" {
  value = "https://${aws_cloudfront_distribution.cms.domain_name}/admin"
}

output "ip_de_la_instancia" {
  description = "Para conectarse por SSH"
  value       = aws_eip.cms.public_ip
}

output "comando_ssh" {
  value = var.nombre_llave_ssh != "" ? "ssh -i ~/.ssh/${var.nombre_llave_ssh}.pem ec2-user@${aws_eip.cms.public_ip}" : "Sin llave SSH: use EC2 Instance Connect desde la consola"
}

output "registro_de_imagenes" {
  description = "URL del repositorio ECR donde se publica la imagen"
  value       = aws_ecr_repository.cms.repository_url
}

output "id_de_la_instancia" {
  value = aws_instance.cms.id
}

output "region" {
  value = var.region
}
