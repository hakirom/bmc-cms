import type { Core } from '@strapi/strapi'

type Fila = { name: string; size: number }

type Ajuste = {
  uid: string
  /** Orden, campo principal y tamaño de página del listado. */
  settings?: Record<string, unknown>
  /** Columnas visibles en el listado. */
  list?: string[]
  /** Disposición del editor, por filas de 12 columnas. */
  edit?: Fila[][]
  /** Textos de ayuda que ve el editor bajo cada campo. */
  ayudas?: Record<string, { description?: string; placeholder?: string; label?: string }>
}

const COMPARTIDO = 'Compartido entre idiomas: al cambiarlo se actualizan español e inglés.'

const AJUSTES: Ajuste[] = [
  {
    uid: 'api::plataforma.plataforma',
    settings: { mainField: 'titulo', defaultSortBy: 'orden', defaultSortOrder: 'ASC', pageSize: 20 },
    list: ['orden', 'titulo', 'icono', 'updatedAt'],
    edit: [
      [{ name: 'titulo', size: 6 }, { name: 'slug', size: 6 }],
      [{ name: 'descripcion', size: 12 }],
      [{ name: 'icono', size: 6 }, { name: 'orden', size: 6 }],
    ],
    ayudas: {
      titulo: { description: 'Nombre de la plataforma tal como aparece en el carrusel del inicio.' },
      slug: { description: 'Se genera solo a partir del título. Cámbielo únicamente si necesita una URL concreta.' },
      descripcion: { description: 'Texto de la tarjeta. Máximo 500 caracteres; funciona mejor entre 200 y 300.' },
      icono: { description: `Ícono que acompaña a la tarjeta. ${COMPARTIDO}` },
      orden: { description: `Posición en el carrusel, de menor a mayor. ${COMPARTIDO}` },
    },
  },
  {
    uid: 'api::servicio.servicio',
    settings: { mainField: 'titulo', defaultSortBy: 'orden', defaultSortOrder: 'ASC', pageSize: 20 },
    list: ['orden', 'titulo', 'icono', 'updatedAt'],
    edit: [
      [{ name: 'titulo', size: 6 }, { name: 'slug', size: 6 }],
      [{ name: 'descripcion', size: 12 }],
      [{ name: 'icono', size: 6 }, { name: 'orden', size: 6 }],
      [{ name: 'enlaces', size: 12 }],
    ],
    ayudas: {
      titulo: { description: 'Encabezado de la tarjeta en la sección «Nuestros servicios».' },
      descripcion: { description: 'Explique el servicio en dos o tres líneas.' },
      enlaces: { description: 'Productos o mercados que se listan dentro de la tarjeta, en orden de aparición.' },
      icono: { description: `Ícono de la tarjeta. ${COMPARTIDO}` },
      orden: { description: `Posición dentro de la cuadrícula de servicios. ${COMPARTIDO}` },
    },
  },
  {
    uid: 'api::boletin.boletin',
    settings: { mainField: 'titulo', defaultSortBy: 'fecha', defaultSortOrder: 'DESC', pageSize: 20 },
    list: ['titulo', 'categoria', 'fecha', 'destacado'],
    edit: [
      [{ name: 'titulo', size: 8 }, { name: 'categoria', size: 4 }],
      [{ name: 'slug', size: 6 }, { name: 'fecha', size: 6 }],
      [{ name: 'resumen', size: 12 }],
      [{ name: 'contenido', size: 12 }],
      [{ name: 'adjunto', size: 6 }, { name: 'destacado', size: 6 }],
    ],
    ayudas: {
      titulo: { description: 'Titular del boletín. Aparece en la tarjeta del inicio.' },
      resumen: { description: 'Entradilla de máximo 400 caracteres; es lo único que se ve en la portada.' },
      contenido: { description: 'Cuerpo completo del boletín. Solo se muestra en la página de detalle.' },
      fecha: { description: `Fecha de publicación; ordena el listado. ${COMPARTIDO}` },
      categoria: { description: `Determina la etiqueta de color de la tarjeta. ${COMPARTIDO}` },
      adjunto: { description: `PDF descargable, opcional. ${COMPARTIDO}` },
      destacado: { description: `Resalta la tarjeta en la portada. ${COMPARTIDO}` },
    },
  },
  {
    uid: 'api::operacion-mercado.operacion-mercado',
    settings: {
      mainField: 'numeroNegocio',
      defaultSortBy: 'numeroNegocio',
      defaultSortOrder: 'ASC',
      pageSize: 50,
    },
    list: ['numeroNegocio', 'tipoMercado', 'concepto', 'valor', 'fecha'],
    edit: [
      [
        { name: 'numeroNegocio', size: 4 },
        { name: 'tipoMercado', size: 4 },
        { name: 'fecha', size: 4 },
      ],
      [{ name: 'concepto', size: 8 }, { name: 'cantidad', size: 4 }],
      [{ name: 'valor', size: 6 }, { name: 'tasa', size: 6 }],
    ],
    ayudas: {
      numeroNegocio: { description: 'Identificador único de la operación.', placeholder: '104888 o F-20120' },
      tipoMercado: { description: 'Define en qué pestaña del tablero aparece la fila.' },
      concepto: { description: 'Producto en el mercado de físicos; instrumento en el de financieros.' },
      cantidad: { description: 'Solo para físicos. Incluya la unidad.', placeholder: '520 t' },
      valor: { description: 'Valor negociado en pesos, sin puntos ni símbolo.' },
      tasa: { description: 'Solo para financieros. Tasa efectiva anual.', placeholder: '13.85' },
    },
  },
  {
    uid: 'api::home.home',
    edit: [
      [{ name: 'eyebrow', size: 6 }, { name: 'titulo', size: 6 }],
      [{ name: 'subtitulo', size: 12 }],
      [{ name: 'ctaPrimario', size: 6 }, { name: 'ctaSecundario', size: 6 }],
      [{ name: 'etiquetaPlataformas', size: 12 }],
      [{ name: 'tituloTablero', size: 6 }, { name: 'ctaTablero', size: 6 }],
      [{ name: 'notaTablero', size: 12 }],
      [{ name: 'tituloServicios', size: 12 }],
      [{ name: 'introServicios', size: 12 }],
      [{ name: 'tituloValor', size: 6 }, { name: 'eyebrowBoletines', size: 6 }],
      [{ name: 'tituloBoletines', size: 12 }],
      [{ name: 'eyebrowContacto', size: 6 }, { name: 'tituloContacto', size: 6 }],
      [{ name: 'cifras', size: 12 }],
      [{ name: 'mensajesValor', size: 12 }],
      [{ name: 'tarjetasContacto', size: 12 }],
      [{ name: 'seo', size: 12 }],
    ],
    ayudas: {
      eyebrow: { description: 'Línea pequeña sobre el titular.', placeholder: '46 años de experiencia' },
      titulo: { description: 'Titular principal de la portada.' },
      subtitulo: { description: 'Párrafo de apoyo bajo el titular.' },
      ctaPrimario: { description: 'Botón blanco del hero.' },
      ctaSecundario: { description: 'Botón secundario, con borde.' },
      etiquetaPlataformas: { description: 'Rótulo sobre el carrusel de plataformas.' },
      tituloTablero: { description: 'Encabezado del panel de cierre de rueda.' },
      notaTablero: { description: 'Aviso al pie del tablero. Aquí se aclara que las cifras son de demostración.' },
      tituloServicios: { description: 'Titular de la sección «Nuestros servicios».' },
      tituloValor: { description: 'Encabezado del carrusel de mensajes de valor.' },
      cifras: { description: 'Franja azul de indicadores. Cuatro entradas encajan bien; con más se apilan.' },
      mensajesValor: { description: 'Cada entrada es una diapositiva del carrusel.' },
      tarjetasContacto: { description: 'Tres tarjetas del bloque «Contáctenos». Use un salto de línea por cada renglón.' },
      seo: { description: 'Metadatos para buscadores y redes sociales.' },
    },
  },
  {
    uid: 'api::configuracion-sitio.configuracion-sitio',
    edit: [
      [{ name: 'etiquetaAcceso', size: 6 }],
      [{ name: 'barraUtilidades', size: 12 }],
      [{ name: 'menuPrincipal', size: 12 }],
      [{ name: 'descripcionFooter', size: 12 }],
      [{ name: 'columnasFooter', size: 12 }],
      [{ name: 'redesSociales', size: 12 }],
      [{ name: 'certificaciones', size: 12 }],
      [{ name: 'vigilancia', size: 6 }, { name: 'listadoEn', size: 6 }],
      [{ name: 'legal', size: 12 }],
    ],
    ayudas: {
      barraUtilidades: { description: 'Enlaces de la franja superior, visible solo en escritorio.' },
      etiquetaAcceso: { description: 'Texto del botón de acceso en la cabecera.' },
      menuPrincipal: { description: 'Columnas del menú que se abre con el botón de hamburguesa.' },
      descripcionFooter: { description: 'Párrafo bajo el logo en el pie de página.' },
      columnasFooter: { description: 'Bloques de enlaces del pie. Cuatro columnas es lo que mejor encaja.' },
      redesSociales: { description: `Perfiles enlazados en el pie. ${COMPARTIDO}` },
      certificaciones: { description: `Sellos mostrados en la franja inferior. ${COMPARTIDO}` },
      vigilancia: { description: 'Texto de vigilancia estatal exigido en el pie.' },
      legal: { description: 'Aviso de derechos reservados.' },
    },
  },
]

type ContentTypesService = {
  findConfiguration: (schema: unknown) => Promise<Record<string, any>>
  updateConfiguration: (schema: unknown, config: Record<string, any>) => Promise<unknown>
}

/**
 * Deja el Content Manager configurado: columnas del listado, orden por
 * defecto, disposición del editor y textos de ayuda por campo.
 *
 * Lee la configuración existente y solo escribe si el resultado difiere, así
 * que respeta los ajustes que se hagan a mano desde «Configurar la vista».
 */
export async function configureAdminViews(strapi: Core.Strapi) {
  const service = strapi
    .plugin('content-manager')
    .service('content-types') as unknown as ContentTypesService

  for (const ajuste of AJUSTES) {
    const schema = strapi.contentType(ajuste.uid as never)
    if (!schema) {
      strapi.log.warn(`[seed] No existe el content-type ${ajuste.uid}; se omite su vista.`)
      continue
    }

    const actual = await service.findConfiguration(schema)

    const metadatas = { ...actual.metadatas }
    for (const [campo, ayuda] of Object.entries(ajuste.ayudas ?? {})) {
      if (!metadatas[campo]) continue
      metadatas[campo] = {
        ...metadatas[campo],
        edit: { ...metadatas[campo].edit, ...ayuda },
      }
    }

    const siguiente = {
      settings: { ...actual.settings, ...(ajuste.settings ?? {}) },
      metadatas,
      layouts: {
        list: ajuste.list ?? actual.layouts.list,
        edit: ajuste.edit ?? actual.layouts.edit,
      },
      ...(actual.options ? { options: actual.options } : {}),
    }

    const sinCambios =
      JSON.stringify({
        settings: actual.settings,
        metadatas: actual.metadatas,
        layouts: actual.layouts,
      }) === JSON.stringify({
        settings: siguiente.settings,
        metadatas: siguiente.metadatas,
        layouts: siguiente.layouts,
      })

    if (sinCambios) continue

    await service.updateConfiguration(schema, siguiente as never)
    strapi.log.info(`[seed] Vista del panel configurada: ${ajuste.uid}`)
  }
}
