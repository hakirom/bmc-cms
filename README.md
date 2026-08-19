# apps/cms — Strapi 5

CMS headless que sirve el contenido del front en `apps/web`. Ver el
[README raíz](../../README.md) para el arranque completo.

```bash
npm install
npm run develop     # http://localhost:1337/admin
npm run build       # build de producción del admin
```

## Personalización del admin (línea gráfica BMC)

Todo vive en `src/admin/`:

| Archivo | Qué hace |
|---|---|
| `app.tsx` | Configuración del panel: logos, tema, idioma, textos y `bootstrap` |
| `theme.ts` | Paleta BMC mapeada a los tokens de `@strapi/design-system` |
| `extensions/bmc-logo.svg` | Logo de la pantalla de login (placa navy, legible en tema claro y oscuro) |
| `extensions/bmc-mark.svg` | Marca del menú lateral |
| `extensions/favicon.svg` | Favicon del panel |

**Paleta aplicada** (tomada del sitio público):

| Token de Strapi | Color | Uso en el panel |
|---|---|---|
| `primary600` / `buttonPrimary600` | `#013365` navy | botones principales, elementos activos |
| `primary500` | `#1E88D3` azul | hover y estados intermedios |
| `primary700` | `#001F42` | pressed |
| `primary100` / `neutral100` | `#F2F9FE` | fondos con el tinte azulado del sitio |
| `secondary*` / `alternative*` | familia azul | sustituyen el morado por defecto de Strapi |

El tema define claro **y** oscuro: en oscuro se invierte la jerarquía (azul claro para
las acciones) para mantener el contraste.

**Detalle de implementación:** en Strapi 5.52 el `index.html` del admin se genera sin
`<link rel="icon">` y con el título fijo *Strapi Admin*, así que `config.head.favicon` no
llega a aplicarse. El favicon y el título se inyectan desde `bootstrap()` en `app.tsx`,
que corre igual en desarrollo y en el build.

Tras cambiar cualquier cosa de `src/admin/`, reinicia `npm run develop` para que el
panel se reconstruya.

## Contenido

- Content-types: `src/api/*/content-types/*/schema.json`
- Componentes: `src/components/{shared,home,nav}/*.json`
- Seed y permisos públicos: `src/seed/` (se ejecuta desde `src/index.ts`)

### Qué hace el seed, en orden

| Archivo | Responsabilidad |
|---|---|
| `locales.ts` | Crea `es`/`en` y fija el español por defecto |
| `index.ts` | Permisos públicos, siembra inicial y relleno de campos nuevos |
| `data.ts` · `data-config.ts` | Contenido en español |
| `data-en.ts` | Traducciones, aplicadas **sobre el mismo documento** |
| `admin-views.ts` | Vistas del Content Manager (columnas, orden, ayudas) |

Todo es idempotente: en un arranque sin cambios el seed no escribe nada. Las traducciones
y el relleno de campos nunca sobrescriben lo que ya tenga valor, para no pisar ediciones
hechas desde el panel.

> Al añadir campos localizados a un content-type que ya tiene contenido, activa primero el
> locale por defecto y solo después marca el esquema como `localized`. Si se hace al revés,
> las entradas existentes quedan asignadas al idioma equivocado.

Para recargar el contenido desde cero: borra `.tmp/data.db` y reinicia. Para desactivar
el seed: `SEED_DISABLED=true` en `.env`.
