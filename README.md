# BMC CMS — Strapi 5

CMS headless de la demo de la Bolsa Mercantil de Colombia. Strapi 5.52 con TypeScript,
seed automático, contenido bilingüe y panel con la marca BMC. Lo consume el front
([bmc-web](https://github.com/hakirom/bmc-web)).

> ⚠️ **Demo no oficial**, sin afiliación con la Bolsa Mercantil de Colombia S.A. Las
> operaciones de mercado son datos simulados.

## Arranque local

```bash
npm install
npm run develop        # http://localhost:1337/admin
```

En el primer arranque cree su usuario administrador en el panel. El contenido de ejemplo
y los permisos públicos los deja listos el seed. La base es SQLite en `.tmp/data.db`.

## Modelo de contenido

| Content-type | Tipo | Endpoint |
|---|---|---|
| `Home` | single | `/api/home?populate=*` |
| `Configuración del sitio` | single | `/api/configuracion-sitio` |
| `Textos de interfaz` | single | `/api/textos-interfaz` |
| `Plataforma` | colección | `/api/plataformas` |
| `Servicio` | colección | `/api/servicios` |
| `Boletín` | colección | `/api/boletines` |
| `Operación de mercado` | colección | `/api/operaciones-mercado` |
| `Componente de portal` | colección | `/api/componentes-portal` |
| `Solicitud PQRSF` | colección | `/api/solicitudes-pqrsf` (creación pública) |

Todos localizados es/en salvo las operaciones de mercado. Componentes reutilizables en
`src/components/{shared,home,nav,interfaz}/`.

## El seed

`src/index.ts` ejecuta `src/seed/` en cada arranque, y es **idempotente**: si no hay nada
que hacer no escribe. Nunca sobrescribe un campo que ya tenga valor, para no pisar lo que
se edite desde el panel.

| Archivo | Responsabilidad |
|---|---|
| `locales.ts` | Crea `es`/`en` y fija el español por defecto |
| `index.ts` | Permisos públicos, siembra inicial y relleno de campos nuevos |
| `data*.ts` | Contenido en español, traducciones y datos del portal |
| `admin-views.ts` | Vistas del Content Manager: columnas, orden y ayudas |

Ponga `SEED_DISABLED=true` para desactivarlo.

> Al añadir campos localizados a un content-type con contenido, active primero el locale
> por defecto y solo después marque el esquema como `localized`; al revés, las entradas
> existentes quedan en el idioma equivocado.

## Panel con la marca BMC

En `src/admin/`: `theme.ts` traduce la paleta del sitio a los tokens del design system
(navy `#013365`, azul `#1E88D3`, tinte `#F2F9FE`), y `app.tsx` define logos, favicon,
idioma y textos. Tras cambiar algo ahí hay que reiniciar `npm run develop`.

En Strapi 5.52 el `index.html` del admin se genera sin `<link rel="icon">` y con título
fijo, así que `config.head.favicon` no se aplica: ambos se inyectan desde `bootstrap()`.

## Redacción asistida de boletines

El editor escribe la idea en bruto en **`ideaBase`**, activa **`generarConIA`** y guarda:
al guardar se redactan título, resumen y cuerpo siguiendo las reglas editoriales de la
BMC. El interruptor se apaga solo, para que una edición posterior no sobrescriba lo que
el editor haya ajustado a mano, y `redactadoPor` deja constancia del origen del texto.

| Archivo | Qué hace |
|---|---|
| `src/utils/reglas-bmc.ts` | Identidad, valores, obligaciones y prohibiciones editoriales |
| `src/utils/redactor-bmc.ts` | Redactor local + adaptador de modelo |
| `src/api/boletin/content-types/boletin/lifecycles.ts` | Dispara la redacción al guardar |

**Sin claves ni llamadas externas por defecto.** El redactor local es determinista y es el
que corre en la demo. Si define `ANTHROPIC_API_KEY` (y opcionalmente `ANTHROPIC_MODEL`),
se usa el modelo real y, si este falla, cae al redactor local: el editor nunca se queda
sin borrador.

Las reglas viven en un solo archivo: cambiar el tono de todo lo que se genera es editar
`reglas-bmc.ts`.

> Lo que produce es un **borrador**. El flujo es redactar, revisar y publicar; por eso el
> contenido queda en borrador hasta que alguien pulsa Publicar.

## CORS: autorizar al front

`FRONTEND_URLS` declara qué dominios pueden llamar a la API. Separados por comas y **sin
barra final**. Admite comodines, necesarios porque Vercel crea un dominio por cada vista
previa:

```
FRONTEND_URLS=https://bmc-web.vercel.app,https://bmc-web-*.vercel.app
```

En desarrollo se permite cualquier origen; la restricción solo aplica con
`NODE_ENV=production`. Si falta la variable, el CMS solo autoriza `localhost` y el
navegador bloqueará al front con un error de *Access-Control-Allow-Origin*.

Para comprobarlo sin abrir el navegador:

```bash
curl -s -D - -o /dev/null -H "Origin: https://su-front.vercel.app" \
  https://su-cms.onrender.com/api/plataformas | grep -i access-control-allow-origin
```

Si no aparece la cabecera, el origen no está autorizado.

## Despliegue

Strapi necesita **proceso persistente y base de datos externa**. El driver `pg` ya está
incluido: `create-strapi` solo instala el de la base elegida al crear el proyecto (SQLite),
y sin él cualquier despliegue con Postgres falla con *Cannot find module 'pg'*.

### AWS App Runner

`apprunner.yaml` permite desplegar **desde el código fuente**: App Runner clona el
repositorio y compila solo, sin Docker ni ECR. En la consola: **Create service → Source
code → GitHub**, rama `main`, y en configuración elegir *Use a configuration file*.

Variables que hay que añadir en el servicio (las de `.env.production.example`):
`APP_KEYS`, `JWT_SECRET`, `ADMIN_JWT_SECRET`, `API_TOKEN_SALT`, `TRANSFER_TOKEN_SALT`,
`ENCRYPTION_KEY`, `DATABASE_URL` y `FRONTEND_URLS`.

Ajustes recomendados: **1 vCPU / 2 GB** (con menos, la compilación del panel se queda
corta de memoria) y health check en `/_health`.

> Las subidas de archivos necesitan `@strapi/provider-upload-aws-s3` y un bucket: el
> disco del contenedor es efímero y lo subido se pierde en cada despliegue.

### Render

`render.yaml` es un blueprint: **New → Blueprint** sobre este repositorio crea el servicio
y un Postgres gratuito, con los secretos generados solos. Después defina `FRONTEND_URLS`
con el dominio del front.

> El plan gratuito duerme el servicio tras 15 minutos: la primera petición tarda ~30 s.

La imagen conserva `tsconfig.json` a propósito: Strapi comprueba que exista para saber
que es un proyecto TypeScript y buscar la configuración en `dist/config`. Sin ese archivo
arranca creyendo que es JavaScript, no encuentra `./config` y falla con *Cannot
destructure property 'client' of 'db.config.connection'*.

### Neon u otro Postgres gestionado

Borre el bloque `databases` de `render.yaml` y defina `DATABASE_URL` a mano. Use el
endpoint **pooled** en serverless y el **directo** en hosts persistentes. Variables
completas en `.env.production.example`.

Pruebe la conexión antes de desplegar:

```bash
DATABASE_CLIENT=postgres DATABASE_URL='su-cadena' NODE_ENV=production npm run start
```

### Vercel: no funciona (comprobado)

`api/index.ts` y `vercel.json` quedan en el repositorio como registro del intento, pero
**el CMS no puede desplegarse en Vercel**. El obstáculo no es de configuración:

Strapi resuelve sus plugins en tiempo de ejecución (`require.resolve(
'@strapi/content-manager/package.json')`). El empaquetador de Vercel solo incluye lo que
puede rastrear de forma estática, así que la función arranca y muere con
`Cannot find module '@strapi/content-manager/package.json'`.

La solución sería incluir `node_modules` en el bundle, y ahí está el muro:

| | Tamaño |
|---|---|
| `node_modules` de este proyecto | **672 MB** |
| Solo `@strapi` | 113 MB |
| Límite de una función en Vercel | **250 MB** descomprimido |

Ni siquiera incluyendo únicamente `@strapi` cabría, y seguirían apareciendo otros
`require` dinámicos. Antes de llegar aquí hubo que sortear la clave `"//"` en
`vercel.json`, el rango de `engines.node`, los límites de memoria del plan Hobby, las
variables vacías y los secretos ausentes: todos resolubles, este no.

**Despliegue el front en Vercel y el CMS en un host con proceso persistente.**
