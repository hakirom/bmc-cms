/**
 * Reglas editoriales de la Bolsa Mercantil de Colombia.
 *
 * Son la referencia única para cualquier contenido generado: las usa el
 * redactor local y viajan como instrucciones al modelo cuando hay uno
 * configurado. Editarlas aquí cambia el estilo de todo lo que se genere.
 */

export const IDENTIDAD = {
  nombre: 'Bolsa Mercantil de Colombia',
  sigla: 'BMC',
  queEs:
    'la bolsa de productos y servicios de Colombia: administra mercados de commodities ' +
    'agropecuarios, agroindustriales y minero-energéticos, facilita financiación no bancaria ' +
    'y opera el Mercado de Compras Públicas.',
  vigilancia: 'Vigilada por la Superintendencia Financiera de Colombia.',
}

export const VALORES = ['transparencia', 'seguridad', 'eficiencia', 'neutralidad'] as const

/** Lo que el contenido SIEMPRE debe cumplir. */
export const OBLIGATORIO = [
  'Escribir en español de Colombia, en tercera persona y tono institucional.',
  'Tratar de usted al lector; nunca tutear.',
  'Nombrar la entidad como «Bolsa Mercantil de Colombia» la primera vez y «BMC» después.',
  'Frases cortas y directas: una idea por frase.',
  'Explicar los tecnicismos la primera vez que aparezcan.',
  'Cerrar indicando a quién se dirige la información y dónde ampliarla.',
]

/** Lo que el contenido NUNCA debe hacer. */
export const PROHIBIDO = [
  'Prometer rentabilidades, precios futuros o resultados de inversión.',
  'Dar recomendaciones de compra o venta a un inversionista concreto.',
  'Usar lenguaje publicitario, superlativos o signos de exclamación.',
  'Atribuir declaraciones a personas o entidades que no estén en el texto base.',
  'Inventar cifras, fechas o nombres que no aparezcan en el texto base.',
]

export const CATEGORIAS = {
  'boletin-diario': {
    nombre: 'Boletín diario',
    enfoque: 'informar del cierre de la rueda y del comportamiento de los mercados en la jornada',
  },
  'estudio-economico': {
    nombre: 'Estudio económico',
    enfoque: 'analizar una tendencia con contexto, datos y una lectura para el sector',
  },
  comunicado: {
    nombre: 'Comunicado',
    enfoque: 'anunciar una decisión o cambio operativo y sus implicaciones para los participantes',
  },
} as const

export type CategoriaBoletin = keyof typeof CATEGORIAS

/** Instrucciones en texto plano, para enviarlas a un modelo de lenguaje. */
export function instruccionesDeMarca(categoria: CategoriaBoletin) {
  const c = CATEGORIAS[categoria] ?? CATEGORIAS['boletin-diario']

  return [
    `Usted redacta para ${IDENTIDAD.nombre} (${IDENTIDAD.sigla}), ${IDENTIDAD.queEs}`,
    `Valores que debe transmitir el texto: ${VALORES.join(', ')}.`,
    `Tipo de pieza: ${c.nombre}. Objetivo: ${c.enfoque}.`,
    '',
    'Reglas obligatorias:',
    ...OBLIGATORIO.map((r) => `- ${r}`),
    '',
    'Prohibido:',
    ...PROHIBIDO.map((r) => `- ${r}`),
    '',
    `Cierre siempre recordando: ${IDENTIDAD.vigilancia}`,
  ].join('\n')
}
