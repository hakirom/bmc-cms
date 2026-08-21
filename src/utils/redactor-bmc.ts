import {
  CATEGORIAS,
  IDENTIDAD,
  instruccionesDeMarca,
  VALORES,
  type CategoriaBoletin,
} from './reglas-bmc'

/**
 * Redactor de boletines.
 *
 * Toma una idea suelta y devuelve el boletín redactado con las reglas de la
 * BMC. Hay dos implementaciones tras la misma interfaz:
 *
 *  - `redactorLocal`: determinista, sin dependencias ni claves. Es la que corre
 *    en la demo, y la que garantiza que el CMS funcione siempre.
 *  - `redactorClaude`: usa la API de Anthropic si existe ANTHROPIC_API_KEY.
 *
 * `redactar()` elige una u otra y, si el modelo falla, cae al redactor local en
 * lugar de dejar al editor sin contenido.
 */

export type Peticion = {
  idea: string
  categoria: CategoriaBoletin
  fecha?: string
}

/** Bloque de texto enriquecido en el formato que espera el campo `blocks`. */
type Bloque =
  | { type: 'heading'; level: 2 | 3; children: { type: 'text'; text: string }[] }
  | { type: 'paragraph'; children: { type: 'text'; text: string; bold?: boolean }[] }
  | {
      type: 'list'
      format: 'unordered'
      children: { type: 'list-item'; children: { type: 'text'; text: string }[] }[]
    }

export type Redaccion = {
  titulo: string
  resumen: string
  contenido: Bloque[]
  origen: 'local' | 'modelo'
}

/** «2026-08-21» → «21 de agosto de 2026». */
function fechaLegible(iso?: string) {
  if (!iso) return ''
  const fecha = new Date(`${iso}T12:00:00`)
  if (Number.isNaN(fecha.getTime())) return iso
  return new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'long', year: 'numeric' }).format(
    fecha,
  )
}

const parrafo = (texto: string): Bloque => ({
  type: 'paragraph',
  children: [{ type: 'text', text: texto }],
})

const titular = (texto: string, level: 2 | 3 = 2): Bloque => ({
  type: 'heading',
  level,
  children: [{ type: 'text', text: texto }],
})

const lista = (puntos: string[]): Bloque => ({
  type: 'list',
  format: 'unordered',
  children: puntos.map((p) => ({ type: 'list-item', children: [{ type: 'text', text: p }] })),
})

/** Primera letra en mayúscula y punto final, sin tocar el resto. */
function comoFrase(texto: string) {
  const limpio = texto.trim().replace(/\s+/g, ' ')
  if (!limpio) return ''
  const conMayuscula = limpio[0]!.toUpperCase() + limpio.slice(1)
  return /[.!?]$/.test(conMayuscula) ? conMayuscula : `${conMayuscula}.`
}

/** Titular corto a partir de la idea: se queda con la primera frase. */
function titularDesde(idea: string, categoria: CategoriaBoletin) {
  const primera = idea.split(/[.\n]/)[0]?.trim() ?? idea.trim()
  const base = primera.length > 90 ? `${primera.slice(0, 87).trimEnd()}…` : primera
  const nombre = CATEGORIAS[categoria]?.nombre ?? CATEGORIAS['boletin-diario'].nombre

  return base.length < 25 ? `${nombre}: ${comoFrase(base).replace(/\.$/, '')}` : comoFrase(base).replace(/\.$/, '')
}

export const redactorLocal = {
  nombre: 'local' as const,

  redactar({ idea, categoria, fecha }: Peticion): Redaccion {
    const c = CATEGORIAS[categoria] ?? CATEGORIAS['boletin-diario']
    const frases = idea
      .split(/[.\n]/)
      .map((f) => f.trim())
      .filter((f) => f.length > 3)

    const entrada = comoFrase(frases[0] ?? idea)
    const detalle = frases.slice(1).map(comoFrase)

    const titulo = titularDesde(idea, categoria)
    const resumen = [
      entrada,
      `${IDENTIDAD.sigla} publica esta información con el fin de ${c.enfoque}.`,
    ]
      .join(' ')
      .slice(0, 380)

    const contenido: Bloque[] = [
      parrafo(
        `${IDENTIDAD.nombre} (${IDENTIDAD.sigla}) informa lo siguiente a los participantes de sus mercados.`,
      ),
      titular('Lo que ocurrió'),
      parrafo(entrada),
      ...(detalle.length > 0 ? [parrafo(detalle.join(' '))] : []),
      titular('Por qué es relevante'),
      parrafo(
        `Esta información contribuye a la ${VALORES.slice(0, 3).join(', ')} de los mercados que ` +
          `administra la ${IDENTIDAD.sigla}, y permite a los participantes tomar decisiones con ` +
          'datos verificables.',
      ),
      titular('A quién le sirve'),
      lista([
        'Comisionistas y sus clientes compradores y vendedores.',
        'Entidades estatales que participan en el Mercado de Compras Públicas.',
        'Empresas y personas que buscan financiación no bancaria.',
      ]),
      titular('Para ampliar la información'),
      parrafo(
        `Consulte el detalle en las plataformas de la ${IDENTIDAD.sigla} o comuníquese con su ` +
          `sociedad comisionista${fecha ? `. Información correspondiente al ${fechaLegible(fecha)}` : ''}.`,
      ),
      parrafo(IDENTIDAD.vigilancia),
    ]

    return { titulo, resumen, contenido, origen: 'local' }
  },
}

/** Convierte la respuesta del modelo (texto plano con títulos) a bloques. */
function texto_a_bloques(texto: string): Bloque[] {
  const bloques: Bloque[] = []
  let puntos: string[] = []

  const vaciarLista = () => {
    if (puntos.length > 0) {
      bloques.push(lista(puntos))
      puntos = []
    }
  }

  for (const linea of texto.split('\n').map((l) => l.trim())) {
    if (!linea) {
      vaciarLista()
      continue
    }
    if (linea.startsWith('## ')) {
      vaciarLista()
      bloques.push(titular(linea.slice(3)))
    } else if (/^[-*•]\s+/.test(linea)) {
      puntos.push(linea.replace(/^[-*•]\s+/, ''))
    } else {
      vaciarLista()
      bloques.push(parrafo(linea))
    }
  }
  vaciarLista()

  return bloques
}

export const redactorClaude = {
  nombre: 'modelo' as const,

  async redactar({ idea, categoria, fecha }: Peticion): Promise<Redaccion> {
    const clave = process.env.ANTHROPIC_API_KEY
    if (!clave) throw new Error('Sin ANTHROPIC_API_KEY')

    const respuesta = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': clave,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-5',
        max_tokens: 1500,
        system: instruccionesDeMarca(categoria),
        messages: [
          {
            role: 'user',
            content: [
              'Redacte un boletín a partir de esta idea base:',
              `«${idea}»`,
              fecha ? `Fecha de referencia: ${fecha}.` : '',
              '',
              'Devuelva exactamente este formato, sin comentarios adicionales:',
              'TITULO: <un titular de máximo 90 caracteres>',
              'RESUMEN: <entradilla de máximo 380 caracteres>',
              'CUERPO:',
              '## <subtítulo>',
              '<párrafos y viñetas con «- »>',
            ]
              .filter(Boolean)
              .join('\n'),
          },
        ],
      }),
    })

    if (!respuesta.ok) throw new Error(`La API respondió ${respuesta.status}`)

    const datos = (await respuesta.json()) as { content: { text?: string }[] }
    const texto = datos.content?.map((p) => p.text ?? '').join('') ?? ''

    const titulo = texto.match(/TITULO:\s*(.+)/)?.[1]?.trim()
    const resumen = texto.match(/RESUMEN:\s*([\s\S]+?)(?:\nCUERPO:)/)?.[1]?.trim()
    const cuerpo = texto.split(/\nCUERPO:\s*/)[1]?.trim()

    if (!titulo || !resumen || !cuerpo) throw new Error('Respuesta del modelo sin el formato pedido')

    return { titulo, resumen, contenido: texto_a_bloques(cuerpo), origen: 'modelo' }
  },
}

/** ¿Hay un modelo configurado? */
export const hayModelo = () => Boolean(process.env.ANTHROPIC_API_KEY)

/**
 * Redacta con el modelo si está configurado y, si falla, con el redactor local:
 * el editor nunca se queda sin borrador por un problema de red o de cuota.
 */
export async function redactar(peticion: Peticion): Promise<Redaccion> {
  if (hayModelo()) {
    try {
      return await redactorClaude.redactar(peticion)
    } catch (error) {
      console.warn('[redactor] El modelo falló, se usa el redactor local:', (error as Error).message)
    }
  }
  return redactorLocal.redactar(peticion)
}
