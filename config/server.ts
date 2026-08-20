import type { Core } from '@strapi/strapi';

/**
 * Una variable definida pero vacía no es lo mismo que ausente: `env()` devuelve
 * la cadena vacía y no aplica el valor por defecto. Con HOST o PORT vacíos
 * Strapi compone `http://:1337` y el arranque muere con `TypeError: Invalid URL`,
 * un mensaje que no apunta a la causa. Esto ocurre con facilidad al importar
 * variables de entorno en un panel como el de Vercel.
 */
const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Server => {
  const host = env('HOST', '0.0.0.0') || '0.0.0.0';
  const port = env.int('PORT', 1337) || 1337;

  // URL pública del CMS. Si se define, Strapi la usa tal cual en lugar de
  // componerla con host y puerto: es lo correcto detrás de un proxy o CDN.
  const publicUrl = env('PUBLIC_URL', '');

  return {
    host,
    port,
    ...(publicUrl ? { url: publicUrl } : {}),
    app: {
      keys: env.array('APP_KEYS', ['clave-de-desarrollo-1', 'clave-de-desarrollo-2']),
    },
    webhooks: {
      populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
    },
  };
};

export default config;
