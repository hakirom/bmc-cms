# El CMS en Azure

Despliega el CMS en **Azure Container Apps** usando la misma imagen Docker que en AWS.
La base de datos sigue siendo Neon.

```
Navegador ──HTTPS──> Container Apps ──> Neon
                     (imagen desde ACR)
```

Container Apps trae HTTPS y certificado incluidos, así que aquí no hace falta CDN por
delante ni servidor que administrar: sale más simple que el montaje de AWS, donde se
necesitó EC2 más CloudFront.

## Aislamiento

Este directorio tiene **su propio estado de Terraform**. El despliegue de AWS
(`../infra/`) no se lee ni se modifica: son dos infraestructuras independientes que
comparten la misma base de datos.

Además, el grupo de recursos se **consulta, no se crea**: los recursos entran en el grupo
que ya administra el cliente y nada se toca fuera de él.

## Requisitos

- Terraform ≥ 1.6 y Docker (`brew install colima docker && colima start`)
- Azure CLI con sesión iniciada: `az login`
- Si tiene varias suscripciones: `az account set --subscription "<id>"`

## Uso

```bash
cd infra-azure
cp terraform.tfvars.example terraform.tfvars   # rellene la cadena de Neon

terraform init
terraform apply          # crea registro, entorno y aplicación
./publicar-imagen.sh     # construye la imagen, la publica y crea una revisión
```

`terraform apply` deja la aplicación creada pero sin imagen; el CMS responde cuando
`publicar-imagen.sh` termina. Para desplegar cambios más adelante basta con repetir ese
script.

## Decisiones que verá en el código

**Credenciales de registro en lugar de identidad administrada.** Lo natural sería dar a la
aplicación el rol `AcrPull`, pero crear asignaciones de rol exige permisos de
administrador de accesos que una suscripción delegada normalmente no concede. La
contraseña del registro se guarda como secreto de la aplicación.

**`min_replicas = 1`.** Con 0 escalaría a cero y casi no consumiría, pero la primera
visita esperaría unos 20 segundos a que Strapi levante. Para enseñarlo en vivo, no
compensa.

**`max_replicas = 1`.** Strapi no está preparado para varias instancias sin sesión
compartida: dos réplicas provocarían cierres de sesión aleatorios en el panel.

**Sonda de vida con 60 segundos de margen.** Strapi tarda en arrancar; sin ese margen
Azure lo da por muerto y lo reinicia en bucle.

**La imagen se construye para `linux/amd64`.** Container Apps no ejecuta `arm64`: en un
Mac con Apple Silicon, omitir `--platform` produce una imagen que arranca y muere con
`exec format error`, sin mencionar la arquitectura.

## Coste aproximado

Con 1 vCPU y 2 GB encendidos todo el mes, Container Apps ronda los 30-40 USD y el registro
Basic unos 5. Poniendo `replicas_minimas = 0` baja a casi nada, a cambio del arranque en
frío.

Para desmontarlo: `terraform destroy` (no afecta a AWS ni al contenido en Neon).
