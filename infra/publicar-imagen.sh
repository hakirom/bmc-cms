#!/usr/bin/env bash
# Construye la imagen del CMS y la publica en ECR.
#
# Ejecútelo después de `terraform apply` (que crea el registro) y cada vez que
# quiera desplegar cambios. La instancia descarga la imagen al reiniciar el
# servicio; el último paso lo hace por usted si tiene permisos de SSM.
set -euo pipefail

cd "$(dirname "$0")"

REGION="$(terraform output -raw region 2>/dev/null || aws configure get region)"
REGISTRO="$(terraform output -raw registro_de_imagenes)"
CUENTA="${REGISTRO%%/*}"

echo "▸ Registro: $REGISTRO"

echo "▸ Autenticando en ECR…"
aws ecr get-login-password --region "$REGION" \
  | docker login --username AWS --password-stdin "$CUENTA"

echo "▸ Construyendo la imagen (varios minutos la primera vez)…"
docker build -t "$REGISTRO:latest" ..

echo "▸ Publicando…"
docker push "$REGISTRO:latest"

echo "▸ Reiniciando el CMS en la instancia…"
INSTANCIA="$(terraform output -raw id_de_la_instancia)"
if aws ssm send-command \
  --instance-ids "$INSTANCIA" \
  --document-name AWS-RunShellScript \
  --parameters 'commands=["systemctl restart bmc-cms"]' \
  --query 'Command.CommandId' --output text >/dev/null 2>&1; then
  echo "  reinicio solicitado por SSM"
else
  echo "  no se pudo usar SSM; reinicie a mano: sudo systemctl restart bmc-cms"
fi

echo "✓ Listo. CMS en: $(terraform output -raw url_del_cms)"
