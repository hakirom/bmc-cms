import type { Core } from '@strapi/strapi'
import { boletines, home, operaciones, plataformas, servicios } from './data'

/** Content-types que la API pública puede leer (find + findOne). */
const PUBLIC_READ_UIDS = [
  'api::plataforma.plataforma',
  'api::servicio.servicio',
  'api::operacion-mercado.operacion-mercado',
  'api::boletin.boletin',
  'api::home.home',
] as const

/** Da permiso de lectura al rol Public para que el front pueda consumir la API sin token. */
async function grantPublicReadAccess(strapi: Core.Strapi) {
  const publicRole = await strapi
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } })

  if (!publicRole) {
    strapi.log.warn('[seed] No se encontró el rol Public; se omiten los permisos.')
    return
  }

  for (const uid of PUBLIC_READ_UIDS) {
    // El single type solo expone find.
    const actions = uid === 'api::home.home' ? ['find'] : ['find', 'findOne']

    for (const action of actions) {
      const permission = `${uid}.${action}`
      const existing = await strapi
        .query('plugin::users-permissions.permission')
        .findOne({ where: { action: permission, role: publicRole.id } })

      if (!existing) {
        await strapi
          .query('plugin::users-permissions.permission')
          .create({ data: { action: permission, role: publicRole.id } })
        strapi.log.info(`[seed] Permiso público habilitado: ${permission}`)
      }
    }
  }
}

/** Crea las entradas solo si la colección está vacía, para no duplicar en cada arranque. */
async function seedCollection<T extends Record<string, unknown>>(
  strapi: Core.Strapi,
  uid: Parameters<Core.Strapi['documents']>[0],
  entries: T[],
  published = true,
) {
  const count = await strapi.documents(uid).count({})
  if (count > 0) {
    strapi.log.debug(`[seed] ${uid} ya tiene ${count} entradas; se omite.`)
    return
  }

  for (const data of entries) {
    await strapi.documents(uid).create({
      data: data as never,
      ...(published ? { status: 'published' as const } : {}),
    })
  }

  strapi.log.info(`[seed] ${entries.length} entradas creadas en ${uid}`)
}

export async function seed(strapi: Core.Strapi) {
  await grantPublicReadAccess(strapi)

  await seedCollection(strapi, 'api::plataforma.plataforma', plataformas)
  await seedCollection(strapi, 'api::servicio.servicio', servicios)
  await seedCollection(strapi, 'api::boletin.boletin', boletines)
  // Draft & Publish está desactivado en las operaciones: son datos, no contenido editorial.
  await seedCollection(strapi, 'api::operacion-mercado.operacion-mercado', operaciones, false)

  const existingHome = await strapi.documents('api::home.home').findFirst({})
  if (!existingHome) {
    await strapi.documents('api::home.home').create({ data: home as never, status: 'published' })
    strapi.log.info('[seed] Single type Home creado')
  }
}
