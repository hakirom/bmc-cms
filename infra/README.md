# Infraestructura del CMS en AWS

Levanta el CMS completo con un comando: EC2 `t3.micro` (capa gratuita), IP fija,
CloudFront delante para el HTTPS y la base de datos Neon que ya existe.

Son 11 recursos. La instancia se aprovisiona sola: swap, Node 22, clonado del
repositorio, compilación y servicio de systemd.

## Requisitos

- Terraform ≥ 1.6 — `brew install hashicorp/tap/terraform`
- AWS CLI con sesión iniciada — `aws sts get-caller-identity` debe responder
- La cadena de conexión de Neon (endpoint **directo**, sin `-pooler`)

El CMS corre **como contenedor Docker**: la imagen se construye en su equipo, se publica
en ECR y la instancia solo la descarga. Así la máquina no clona el repositorio —que es
privado y exigiría credenciales— ni compila nada.

## Uso

```bash
cd infra
cp terraform.tfvars.example terraform.tfvars
# rellene terraform.tfvars: su IP, la cadena de Neon y el dominio del front

terraform init
terraform apply          # crea los 17 recursos, incluido el registro ECR
./publicar-imagen.sh     # construye la imagen, la publica y reinicia el CMS
```

`terraform apply` termina en unos minutos, pero el CMS no responderá hasta que la imagen
exista: el servicio reintenta cada 15 segundos, así que en cuanto `publicar-imagen.sh`
acaba, arranca solo.

Para desplegar cambios más adelante basta con volver a ejecutar `./publicar-imagen.sh`.

Requiere Docker en su equipo. En macOS: `brew install colima docker && colima start`.

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

**El swap de 2 GB no es un extra.** Aunque la imagen ya viene compilada, Strapi supera el
gigabyte de la `t3.micro` al arrancar y el proceso moriría.

**`typescript` es dependencia de producción**, no de desarrollo. Strapi lo usa en ejecución
para detectar que el proyecto es TypeScript y buscar la configuración en `dist/`; sin él
arranca creyendo que es JavaScript y falla con un error que no menciona TypeScript por
ninguna parte.

**La imagen pesa ~1,3 GB** y es lo que cuesta Strapi: `@strapi` 119 MB, `@swc` 65 MB,
sharp 44 MB. Podar las dependencias de desarrollo apenas la reduce. La política de ciclo
de vida de ECR conserva solo las tres últimas para no acumular almacenamiento.

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
