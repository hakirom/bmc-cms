import type { Core } from '@strapi/strapi';

/**
 * Los secretos son obligatorios en producción. En desarrollo se usan valores
 * fijos para que un clon recién hecho arranque con `npm install && npm run
 * develop` sin tener que crear un `.env` a mano: sin ellos Strapi aborta con
 * "Missing apiToken.salt", que no dice nada sobre qué falta configurar.
 */
const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Admin => {
  const esProduccion = env('NODE_ENV') === 'production';

  const secreto = (nombre: string, porDefectoEnDesarrollo: string) => {
    const valor = env(nombre, '');
    if (valor) return valor;

    if (esProduccion) {
      throw new Error(
        `Falta la variable de entorno ${nombre}. Genérela con: openssl rand -base64 32`,
      );
    }
    return porDefectoEnDesarrollo;
  };

  return {
    auth: {
      secret: secreto('ADMIN_JWT_SECRET', 'desarrollo-admin-jwt'),
    },
    apiToken: {
      salt: secreto('API_TOKEN_SALT', 'desarrollo-api-token-salt'),
    },
    transfer: {
      token: {
        salt: secreto('TRANSFER_TOKEN_SALT', 'desarrollo-transfer-salt'),
      },
    },
    secrets: {
      encryptionKey: secreto('ENCRYPTION_KEY', 'desarrollo-encryption-key'),
    },
    flags: {
      nps: env.bool('FLAG_NPS', true),
      promoteEE: env.bool('FLAG_PROMOTE_EE', true),
      docLinks: env.bool('FLAG_DOC_LINKS', true),
    },
  };
};

export default config;
