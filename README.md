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

## Despliegue

Strapi necesita **proceso persistente y base de datos externa**. El driver `pg` ya está
incluido: `create-strapi` solo instala el de la base elegida al crear el proyecto (SQLite),
y sin él cualquier despliegue con Postgres falla con *Cannot find module 'pg'*.

### Render (recomendado)

`render.yaml` es un blueprint: **New → Blueprint** sobre este repositorio crea el servicio
y un Postgres gratuito, con los secretos generados solos. Después defina `FRONTEND_URLS`
con el dominio del front.

> El plan gratuito duerme el servicio tras 15 minutos: la primera petición tarda ~30 s.

### Neon u otro Postgres gestionado

Borre el bloque `databases` de `render.yaml` y defina `DATABASE_URL` a mano. Use el
endpoint **pooled** en serverless y el **directo** en hosts persistentes. Variables
completas en `.env.production.example`.

Pruebe la conexión antes de desplegar:

```bash
DATABASE_CLIENT=postgres DATABASE_URL='su-cadena' NODE_ENV=production npm run start
```

### Vercel (experimental, no recomendado)

`api/index.ts` arranca Strapi y delega en el callback de Koa; `vercel.json` enruta
`/admin`, `/api` y las rutas de plugins a esa función. Limitaciones asumidas:

- **Arranque en frío** de varios segundos en cada instancia nueva; el primer acceso al
  panel puede expirar.
- **`bootstrap` repetido**: el seed corre en cada arranque en frío. Ponga
  `SEED_DISABLED=true` cuando el contenido ya esté cargado.
- **Disco de solo lectura**: la subida de archivos necesita Cloudinary o S3.
- Strapi **no soporta serverless oficialmente**.
