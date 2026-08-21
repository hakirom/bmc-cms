import { redactar } from '../../../../utils/redactor-bmc'
import type { CategoriaBoletin } from '../../../../utils/reglas-bmc'

/**
 * Redacción asistida de boletines.
 *
 * El editor escribe una idea en `ideaBase`, activa `generarConIA` y guarda: al
 * guardar se redactan título, resumen y cuerpo siguiendo las reglas de la BMC.
 * El interruptor se apaga solo, para que una edición posterior no vuelva a
 * sobrescribir el texto que el editor haya ajustado a mano.
 */

type Datos = {
  ideaBase?: string | null
  generarConIA?: boolean | null
  categoria?: CategoriaBoletin | null
  fecha?: string | null
  titulo?: string | null
  resumen?: string | null
  contenido?: unknown
  redactadoPor?: string
  slug?: string | null
}

const aSlug = (texto: string) =>
  texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    // Se corta en el último guion para no partir una palabra por la mitad.
    .replace(/^(.{0,80})(?:-.*)?$/s, '$1')
    .replace(/-+$/, '')

async function generar(datos: Datos) {
  if (!datos.generarConIA || !datos.ideaBase?.trim()) return

  const redaccion = await redactar({
    idea: datos.ideaBase,
    categoria: (datos.categoria as CategoriaBoletin) ?? 'boletin-diario',
    fecha: datos.fecha ?? undefined,
  })

  datos.titulo = redaccion.titulo
  datos.resumen = redaccion.resumen
  datos.contenido = redaccion.contenido
  datos.redactadoPor = redaccion.origen
  if (!datos.slug) datos.slug = aSlug(redaccion.titulo)

  // Se apaga el interruptor: la generación es una acción puntual, no un estado.
  datos.generarConIA = false

  strapi.log.info(`[redactor] Boletín redactado (${redaccion.origen}): ${redaccion.titulo}`)
}

export default {
  async beforeCreate(event: { params: { data: Datos } }) {
    await generar(event.params.data)
  },
  async beforeUpdate(event: { params: { data: Datos } }) {
    await generar(event.params.data)
  },
}
