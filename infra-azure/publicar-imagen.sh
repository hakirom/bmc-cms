#!/usr/bin/env bash
# Construye la imagen del CMS y la publica en Azure Container Registry.
#
# Ejecútelo después de `terraform apply` y cada vez que quiera desplegar
# cambios. La aplicación toma la imagen nueva al crear una revisión.
set -euo pipefail

cd "$(dirname "$0")"

REGISTRO="$(terraform output -raw registro_de_imagenes)"
GRUPO="$(terraform output -raw grupo_recursos)"
IMAGEN="$REGISTRO/bmc-cms:latest"

echo "▸ Registro: $REGISTRO"

echo "▸ Autenticando en el registro…"
az acr login --name "${REGISTRO%%.*}"

# --platform es obligatorio: Container Apps ejecuta linux/amd64 y en un Mac con
# Apple Silicon la imagen saldría arm64. El contenedor moriría con
# "exec format error", que no menciona la arquitectura por ninguna parte.
echo "▸ Construyendo la imagen para linux/amd64…"
docker buildx build --platform linux/amd64 --push -t "$IMAGEN" ..

echo "▸ Creando una revisión nueva…"
az containerapp update --name bmc-cms --resource-group "$GRUPO" --image "$IMAGEN" --output none

echo "✓ Listo. CMS en: $(terraform output -raw url_del_cms)"
