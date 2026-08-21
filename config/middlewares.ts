import type { Core } from '@strapi/strapi';

/**
 * CORS.
 *
 * En desarrollo se permite cualquier origen. En producción hay que declarar los
 * dominios del front en FRONTEND_URLS, separados por comas. Se admiten comodines,
 * útiles porque Vercel crea un dominio distinto por cada vista previa:
 *
 *   FRONTEND_URLS=https://bmc-web.vercel.app,https://bmc-web-*.vercel.app
 *
 * El middleware compara por igualdad exacta, así que cuando el origen encaja con
 * un patrón se devuelve ese mismo origen; si no encaja, una lista vacía lo bloquea.
 */

const aExpresion = (patron: string) =>
  new RegExp(
    `^${patron
      .split('*')
      .map((trozo) => trozo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('.*')}$`,
  );

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Middlewares => {
  const esProduccion = env('NODE_ENV') === 'production';
  const patrones = env
    .array('FRONTEND_URLS', ['http://localhost:5173', 'http://localhost:4173'])
    .map((p: string) => p.trim())
    .filter(Boolean);

  const expresiones = patrones.map(aExpresion);
  const permitido = (origen: string) =>
    patrones.includes('*') || expresiones.some((re) => re.test(origen));

  return [
    'strapi::logger',
    'strapi::errors',
    'strapi::security',
    {
      name: 'strapi::cors',
      config: {
        origin: esProduccion
          ? (ctx: { get: (n: string) => string }) => {
              const solicitado = ctx.get('Origin');
              return solicitado && permitido(solicitado) ? [solicitado] : [];
            }
          : ['*'],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      },
    },
    'strapi::poweredBy',
    'strapi::query',
    'strapi::body',
    'strapi::session',
    'strapi::favicon',
    'strapi::public',
  ];
};

export default config;
