import type { Core } from '@strapi/strapi'

export const LOCALE_ES = 'es'
export const LOCALE_EN = 'en'

type LocalesService = {
  findByCode: (code: string) => Promise<{ id: number; code: string } | null>
  create: (locale: { code: string; name: string }) => Promise<unknown>
  setDefaultLocale: (params: { code: string }) => Promise<void>
  getDefaultLocale: () => Promise<string | null>
}

/**
 * Deja el español como idioma por defecto y el inglés disponible.
 *
 * Se ejecuta antes de activar `localized` en los esquemas: así, cuando Strapi
 * añade la columna de locale, las entradas que ya existen quedan en español y
 * no hay que borrar la base (ni el usuario administrador).
 */
export async function ensureLocales(strapi: Core.Strapi) {
  const service = strapi.plugin('i18n').service('locales') as LocalesService

  for (const [code, name] of [
    [LOCALE_ES, 'Español (es)'],
    [LOCALE_EN, 'English (en)'],
  ] as const) {
    const existing = await service.findByCode(code)
    if (!existing) {
      await service.create({ code, name })
      strapi.log.info(`[seed] Locale creado: ${code}`)
    }
  }

  // `findByCode` no informa cuál es el predeterminado: hay que preguntarlo aparte.
  const actual = await service.getDefaultLocale()
  if (actual !== LOCALE_ES) {
    await service.setDefaultLocale({ code: LOCALE_ES })
    strapi.log.info(`[seed] Idioma por defecto: ${LOCALE_ES} (antes: ${actual ?? 'ninguno'})`)
  }
}
