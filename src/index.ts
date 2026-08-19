import type { Core } from '@strapi/strapi'
import { seed } from './seed'

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * Al arrancar: habilita la lectura pública de la API y carga el contenido
   * inicial de la demo si la base de datos está vacía.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    if (process.env.SEED_DISABLED === 'true') {
      strapi.log.info('[seed] Omitido por SEED_DISABLED=true')
      return
    }

    try {
      await seed(strapi)
    } catch (error) {
      strapi.log.error('[seed] Falló la carga inicial de contenido')
      strapi.log.error(error)
    }
  },
}
