import type { Core } from '@strapi/strapi';

/**
 * En desarrollo se permite cualquier origen. En producción hay que declarar los
 * dominios del front en FRONTEND_URLS (separados por comas), por ejemplo:
 *   FRONTEND_URLS=https://bmc-demo.vercel.app,https://www.ejemplo.com
 */
const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Middlewares => {
  const origenes = env.array('FRONTEND_URLS', ['http://localhost:5173', 'http://localhost:4173']);

  return [
    'strapi::logger',
    'strapi::errors',
    'strapi::security',
    {
      name: 'strapi::cors',
      config: {
        origin: env('NODE_ENV') === 'production' ? origenes : ['*'],
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
