import type { Core } from '@strapi/strapi'
import { boletines, home, operaciones, plataformas, servicios } from './data'
import { configuracionSitio } from './data-config'
import {
  boletinesEn,
  configuracionSitioEn,
  homeEn,
  plataformasEn,
  serviciosEn,
} from './data-en'
import { configureAdminViews } from './admin-views'
import { textosInterfaz, textosInterfazEn } from './data-interfaz'
import {
  componentesPortal,
  componentesPortalEn,
  detallePlataformas,
  detallePlataformasEn,
} from './data-portal'
import { ensureLocales, LOCALE_EN, LOCALE_ES } from './locales'

/** Content-types que la API pública puede leer (find + findOne). */
const PUBLIC_READ_UIDS = [
  'api::plataforma.plataforma',
  'api::servicio.servicio',
  'api::operacion-mercado.operacion-mercado',
  'api::boletin.boletin',
  'api::home.home',
  'api::configuracion-sitio.configuracion-sitio',
  'api::componente-portal.componente-portal',
  'api::textos-interfaz.textos-interfaz',
] as const

/** El asistente PQRSF radica sin sesión, así que Public necesita `create`. */
const PUBLIC_CREATE_UIDS = ['api::solicitud-pqrsf.solicitud-pqrsf'] as const

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
    const isSingleType =
      uid === 'api::home.home' ||
      uid === 'api::configuracion-sitio.configuracion-sitio' ||
      uid === 'api::textos-interfaz.textos-interfaz'
    const actions = isSingleType ? ['find'] : ['find', 'findOne']

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

  for (const uid of PUBLIC_CREATE_UIDS) {
    const permission = `${uid}.create`
    const existing = await strapi
      .query('plugin::users-permissions.permission')
      .findOne({ where: { action: permission, role: publicRole.id } })

    if (!existing) {
      await strapi
        .query('plugin::users-permissions.permission')
        .create({ data: { action: permission, role: publicRole.id } })
      strapi.log.info(`[seed] Permiso público de creación habilitado: ${permission}`)
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

/** Crea (una sola vez) el contenido de un single type. */
async function seedSingleType(
  strapi: Core.Strapi,
  uid: Parameters<Core.Strapi['documents']>[0],
  data: Record<string, unknown>,
  etiqueta: string,
) {
  const existing = await strapi.documents(uid).findFirst({ locale: LOCALE_ES })
  if (existing) return

  await strapi.documents(uid).create({ data: data as never, locale: LOCALE_ES, status: 'published' })
  strapi.log.info(`[seed] Single type ${etiqueta} creado`)
}

/**
 * Añade la versión en inglés sobre documentos que ya existen en español.
 * `clave` empareja cada traducción con su documento; si la versión `en` ya
 * está creada no se toca, para no pisar ediciones hechas desde el panel.
 */
async function translateCollection<T extends Record<string, unknown>>(
  strapi: Core.Strapi,
  uid: Parameters<Core.Strapi['documents']>[0],
  traducciones: T[],
  clave: keyof T,
  /** Campo real por el que se busca el original, si no coincide con `clave`. */
  campo: string = clave as string,
) {
  let creadas = 0

  for (const traduccion of traducciones) {
    const { [clave]: valorClave, ...resto } = traduccion

    // Si la propiedad es el propio campo (y no un alias de búsqueda como
    // `slugEs`), hay que reenviarla: un campo compartido llega nulo si se omite.
    const data = campo === (clave as string) ? { ...resto, [campo]: valorClave } : resto

    const original = await strapi
      .documents(uid)
      .findFirst({ locale: LOCALE_ES, filters: { [campo]: valorClave } as never })

    if (!original) {
      strapi.log.warn(`[seed] Sin original en español para ${campo}=${String(valorClave)}`)
      continue
    }

    const yaTraducido = await strapi
      .documents(uid)
      .findOne({ documentId: original.documentId, locale: LOCALE_EN })
    if (yaTraducido) continue

    await strapi.documents(uid).update({
      documentId: original.documentId,
      locale: LOCALE_EN,
      data: data as never,
      status: 'published',
    })
    creadas += 1
  }

  if (creadas > 0) strapi.log.info(`[seed] ${creadas} traducciones al inglés en ${uid}`)
}

/** Misma idea que translateCollection, para single types. */
async function translateSingleType(
  strapi: Core.Strapi,
  uid: Parameters<Core.Strapi['documents']>[0],
  data: Record<string, unknown>,
) {
  const original = await strapi.documents(uid).findFirst({ locale: LOCALE_ES })
  if (!original) return

  const yaTraducido = await strapi.documents(uid).findFirst({ locale: LOCALE_EN })
  if (yaTraducido) return

  await strapi.documents(uid).update({
    documentId: original.documentId,
    locale: LOCALE_EN,
    data: data as never,
    status: 'published',
  })
  strapi.log.info(`[seed] Traducción al inglés en ${uid}`)
}

/**
 * Rellena los campos que estén vacíos en un documento ya existente. Sirve
 * cuando se añaden campos nuevos al esquema y el contenido ya está creado:
 * no pisa nada que el editor haya escrito.
 */
async function patchMissingFields(
  strapi: Core.Strapi,
  uid: Parameters<Core.Strapi['documents']>[0],
  data: Record<string, unknown>,
  locale: string,
) {
  // `populate` es imprescindible: sin él los componentes llegan vacíos y se
  // reescribirían, pisando lo que el editor haya cambiado en el panel.
  const actual = await strapi.documents(uid).findFirst({ locale, populate: '*' })
  if (!actual) return

  const faltantes = Object.entries(data).filter(([campo]) => {
    const valor = (actual as Record<string, unknown>)[campo]
    return valor === null || valor === undefined || (Array.isArray(valor) && valor.length === 0)
  })

  if (faltantes.length === 0) return

  await strapi.documents(uid).update({
    documentId: actual.documentId,
    locale,
    data: Object.fromEntries(faltantes) as never,
    status: 'published',
  })
  strapi.log.info(
    `[seed] ${uid} (${locale}): ${faltantes.length} campos nuevos rellenados — ${faltantes
      .map(([campo]) => campo)
      .join(', ')}`,
  )
}

/** Igual que patchMissingFields, pero para un elemento concreto de una colección. */
async function patchCollectionItem(
  strapi: Core.Strapi,
  uid: Parameters<Core.Strapi['documents']>[0],
  campoClave: string,
  valorClave: unknown,
  data: Record<string, unknown>,
  locale: string,
) {
  const actual = await strapi
    .documents(uid)
    .findFirst({ locale, populate: '*', filters: { [campoClave]: valorClave } as never })
  if (!actual) return

  const faltantes = Object.entries(data).filter(([campo]) => {
    const valor = (actual as Record<string, unknown>)[campo]
    return valor === null || valor === undefined || (Array.isArray(valor) && valor.length === 0)
  })
  if (faltantes.length === 0) return

  await strapi.documents(uid).update({
    documentId: actual.documentId,
    locale,
    data: Object.fromEntries(faltantes) as never,
    status: 'published',
  })
  strapi.log.info(
    `[seed] ${uid} ${campoClave}=${String(valorClave)} (${locale}): +${faltantes
      .map(([c]) => c)
      .join(', ')}`,
  )
}

/**
 * La barra de utilidades se sembró sin URLs reales. Esta migración las pone,
 * pero solo si siguen todas en `#`: si alguien ya las editó, no se toca nada.
 */
async function migrarUrlsBarraUtilidades(
  strapi: Core.Strapi,
  locale: string,
  barra: { etiqueta: string; url: string }[],
) {
  const uid = 'api::configuracion-sitio.configuracion-sitio' as const
  const actual = await strapi.documents(uid).findFirst({ locale, populate: '*' })
  if (!actual) return

  const actuales = (actual as unknown as { barraUtilidades?: { url: string }[] }).barraUtilidades ?? []
  const sinEditar = actuales.length > 0 && actuales.every((e) => e.url === '#')
  if (!sinEditar) return

  await strapi.documents(uid).update({
    documentId: actual.documentId,
    locale,
    data: { barraUtilidades: barra } as never,
    status: 'published',
  })
  strapi.log.info(`[seed] URLs de la barra de utilidades actualizadas (${locale})`)
}

export async function seed(strapi: Core.Strapi) {
  await ensureLocales(strapi)
  await grantPublicReadAccess(strapi)

  await seedCollection(strapi, 'api::plataforma.plataforma', plataformas)
  await seedCollection(strapi, 'api::servicio.servicio', servicios)
  await seedCollection(strapi, 'api::boletin.boletin', boletines)
  // Draft & Publish está desactivado en las operaciones: son datos, no contenido editorial.
  await seedCollection(strapi, 'api::operacion-mercado.operacion-mercado', operaciones, false)

  await seedSingleType(strapi, 'api::home.home', home, 'Home')
  await seedSingleType(
    strapi,
    'api::configuracion-sitio.configuracion-sitio',
    configuracionSitio,
    'Configuración del sitio',
  )

  // Campos añadidos al esquema después de la primera siembra
  await patchMissingFields(strapi, 'api::home.home', home, LOCALE_ES)
  await patchMissingFields(strapi, 'api::home.home', homeEn, LOCALE_EN)

  // Versiones en inglés sobre los mismos documentos
  await translateCollection(strapi, 'api::plataforma.plataforma', plataformasEn, 'orden')
  await translateCollection(strapi, 'api::servicio.servicio', serviciosEn, 'orden')
  await translateCollection(strapi, 'api::boletin.boletin', boletinesEn, 'slugEs', 'slug')
  await translateSingleType(strapi, 'api::home.home', homeEn)
  await translateSingleType(
    strapi,
    'api::configuracion-sitio.configuracion-sitio',
    configuracionSitioEn,
  )

  // Portal privado y microcopy
  await seedCollection(strapi, 'api::componente-portal.componente-portal', componentesPortal)
  await translateCollection(
    strapi,
    'api::componente-portal.componente-portal',
    componentesPortalEn,
    'clave',
  )

  await seedSingleType(
    strapi,
    'api::textos-interfaz.textos-interfaz',
    textosInterfaz,
    'Textos de interfaz',
  )
  await translateSingleType(strapi, 'api::textos-interfaz.textos-interfaz', textosInterfazEn)
  await patchMissingFields(strapi, 'api::textos-interfaz.textos-interfaz', textosInterfaz, LOCALE_ES)
  await patchMissingFields(strapi, 'api::textos-interfaz.textos-interfaz', textosInterfazEn, LOCALE_EN)

  // Contenido de demostración de cada plataforma (campos añadidos después)
  for (const detalle of detallePlataformas) {
    const { orden, ...datos } = detalle
    await patchCollectionItem(strapi, 'api::plataforma.plataforma', 'orden', orden, datos, LOCALE_ES)
  }
  for (const detalle of detallePlataformasEn) {
    const { orden, ...datos } = detalle
    await patchCollectionItem(strapi, 'api::plataforma.plataforma', 'orden', orden, datos, LOCALE_EN)
  }

  await migrarUrlsBarraUtilidades(strapi, LOCALE_ES, configuracionSitio.barraUtilidades)
  await migrarUrlsBarraUtilidades(strapi, LOCALE_EN, configuracionSitioEn.barraUtilidades)

  // Ergonomía del panel: columnas, orden y textos de ayuda
  await configureAdminViews(strapi)
}
