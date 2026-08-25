# Desplegar el CMS en AWS

Guía por consola, pensada para una cuenta en **Free Plan**. Al final el CMS queda
publicado con HTTPS y conectado a la base de datos Neon que ya existe.

> **¿Prefiere no hacerlo a mano?** La misma arquitectura está automatizada con Terraform
> en [`infra/`](../infra/README.md): un `terraform apply` crea los 11 recursos y
> aprovisiona la instancia sola. Esta guía sigue siendo útil para entender qué se crea y
> para diagnosticar si algo falla.

## Por qué EC2 y no App Runner

App Runner sería más cómodo, pero **no está disponible en el Free Plan**: la API responde
`SubscriptionRequiredException`. Requiere pasar la cuenta a Paid Plan, y con la memoria
que Strapi necesita ronda varias decenas de dólares al mes aunque nadie entre.

Una **EC2 `t3.micro`** sí entra en la capa gratuita durante 12 meses. Tiene 1 GB de RAM,
que no le alcanza a Strapi para compilar el panel: se resuelve con memoria de intercambio
(swap), como indica el paso 4.

## Lo que va a quedar montado

```
Navegador ──HTTPS──> CloudFront ──HTTP──> EC2 t3.micro ──> Neon (Postgres)
                     (certificado)        (Strapi + systemd)
```

CloudFront aporta el HTTPS **sin necesidad de tener un dominio propio**. Es imprescindible:
el front está en HTTPS y un navegador bloquea las llamadas a un backend en HTTP.

---

## 1. Crear la instancia

**EC2 → Launch instance**

| Campo | Valor |
|---|---|
| Name | `bmc-cms` |
| AMI | Amazon Linux 2023 |
| Tipo | `t3.micro` (marcado como *Free tier eligible*) |
| Key pair | Cree uno nuevo y descargue el `.pem` (lo necesitará para entrar) |
| Almacenamiento | 20 GB gp3 |

En **Network settings → Edit**, cree un grupo de seguridad con estas reglas de entrada:

| Tipo | Puerto | Origen |
|---|---|---|
| SSH | 22 | *My IP* |
| Custom TCP | 1337 | `0.0.0.0/0` |

> El 1337 abierto es temporal: solo mientras CloudFront no esté delante. En el paso 7 se
> restringe.

Lance la instancia y **asócele una IP elástica** (EC2 → Elastic IPs → Allocate → Associate).
Sin ella, la IP cambia en cada reinicio.

## 2. Conectarse

Desde la consola con **Connect → EC2 Instance Connect**, o desde su equipo:

```bash
chmod 400 ~/Descargas/bmc-cms.pem
ssh -i ~/Descargas/bmc-cms.pem ec2-user@SU_IP_ELASTICA
```

## 3. Instalar lo necesario

```bash
sudo dnf update -y
sudo dnf install -y git
curl -fsSL https://rpm.nodesource.com/setup_22.x | sudo bash -
sudo dnf install -y nodejs
node -v    # debe decir v22.x
```

## 4. Memoria de intercambio (imprescindible)

Con 1 GB de RAM, la compilación del panel de Strapi falla por falta de memoria. Estos
2 GB de swap lo resuelven:

```bash
sudo dd if=/dev/zero of=/swapfile bs=1M count=2048
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
free -h    # debe aparecer Swap: 2.0Gi
```

## 5. Desplegar el CMS

```bash
cd /opt
sudo git clone https://github.com/hakirom/bmc-cms.git
sudo chown -R ec2-user:ec2-user bmc-cms
cd bmc-cms
npm ci
```

Cree el archivo de entorno. **Genere cada secreto** con `openssl rand -base64 32` y pegue
su cadena de Neon (endpoint **directo**, sin `-pooler`):

```bash
nano .env
```

```
NODE_ENV=production
HOST=0.0.0.0
PORT=1337

APP_KEYS=<secreto1>,<secreto2>
API_TOKEN_SALT=<secreto>
ADMIN_JWT_SECRET=<secreto>
JWT_SECRET=<secreto>
TRANSFER_TOKEN_SALT=<secreto>
ENCRYPTION_KEY=<secreto>

DATABASE_CLIENT=postgres
DATABASE_URL=postgresql://...neon.tech/neondb?sslmode=require
DATABASE_POOL_MIN=0
DATABASE_POOL_MAX=5

FRONTEND_URLS=https://SU-FRONT.vercel.app,https://SU-FRONT-*.vercel.app
```

Compile:

```bash
npm run build
```

Tarda varios minutos en esta máquina. Si aun así falla por memoria, revise que el swap
esté activo con `free -h`.

## 6. Dejarlo corriendo como servicio

```bash
sudo nano /etc/systemd/system/bmc-cms.service
```

```ini
[Unit]
Description=BMC CMS (Strapi)
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/opt/bmc-cms
EnvironmentFile=/opt/bmc-cms/.env
ExecStart=/usr/bin/npm run start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now bmc-cms
sudo systemctl status bmc-cms --no-pager    # debe decir active (running)
curl -i localhost:1337/_health              # debe responder 204
```

En el primer arranque el seed carga el contenido en Neon. Siga el registro con
`journalctl -u bmc-cms -f`.

## 7. HTTPS con CloudFront

**CloudFront → Create distribution**

| Campo | Valor |
|---|---|
| Origin domain | su IP elástica |
| Protocol | **HTTP only**, puerto `1337` |
| Viewer protocol policy | **Redirect HTTP to HTTPS** |
| Allowed HTTP methods | **GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE** |
| Cache policy | **CachingDisabled** |
| Origin request policy | **AllViewerExceptHostHeader** |

Los tres últimos son críticos: sin todos los métodos, el panel no puede guardar; sin
desactivar la caché, se sirven respuestas viejas de la API; y sin la política de origen,
no llegan las cabeceras de autenticación.

Al crearse obtendrá un dominio `https://dxxxxxxxx.cloudfront.net`. Ese es el CMS.

Ahora cierre el puerto: en el grupo de seguridad, cambie el origen del 1337 de
`0.0.0.0/0` a la lista gestionada **`com.amazonaws.global.cloudfront.origin-facing`**.

## 8. Conectar las dos puntas

1. En la EC2, edite `.env` y ponga en `FRONTEND_URLS` el dominio real del front.
   Reinicie: `sudo systemctl restart bmc-cms`.
2. En Vercel, `VITE_CMS_URL=https://dxxxxxxxx.cloudfront.net` y **vuelva a desplegar**
   (Vite incrusta la variable al compilar).
3. Abra `https://dxxxxxxxx.cloudfront.net/admin` y cree el usuario administrador.

Comprobación desde su terminal:

```bash
curl -s -D - -o /dev/null -H "Origin: https://SU-FRONT.vercel.app" \
  https://dxxxxxxxx.cloudfront.net/api/plataformas | grep -i access-control-allow-origin
```

Si aparece la cabecera con su dominio, está listo.

## Actualizar el CMS más adelante

```bash
cd /opt/bmc-cms && git pull && npm ci && npm run build && sudo systemctl restart bmc-cms
```

## Qué queda pendiente

**Las subidas de archivos no persisten entre despliegues** si algún día migra a
contenedores, y en esta EC2 viven en el disco de la instancia: si la termina, se pierden.
Para producción, conecte `@strapi/provider-upload-aws-s3` con un bucket.

**Coste:** la `t3.micro` y 20 GB de disco entran en la capa gratuita 12 meses. CloudFront
tiene 1 TB mensual siempre gratis. La IP elástica es gratis **mientras esté asociada** a
una instancia encendida; si apaga la instancia y la deja reservada, se factura.
