/**
 * Contenido inicial de la demo. Se carga una sola vez, cuando la colección
 * correspondiente está vacía (ver src/seed/index.ts).
 */

export const plataformas = [
  {
    titulo: 'Plataforma de Negociación',
    slug: 'plataforma-de-negociacion',
    descripcion:
      'En la BMC se compran y/o se venden bienes o servicios agropecuarios, agroindustriales, gas, energía, facturas, repos, otros commodities y títulos valores.',
    icono: 'exchange',
    orden: 1,
  },
  {
    titulo: 'Plataforma de Registro',
    slug: 'plataforma-de-registro',
    descripcion:
      'En la BMC se registran convenios con entidades públicas, valores, títulos, derechos y servicios, bienes, productos y commodities, contratos y derivados.',
    icono: 'clipboard',
    orden: 2,
  },
  {
    titulo: 'Plataforma de Liquidación y Compensación',
    slug: 'plataforma-de-liquidacion-y-compensacion',
    descripcion:
      'En la BMC compensamos y liquidamos las operaciones. Esto garantiza que se cumplan las obligaciones contraídas entre las partes, garantizando operaciones seguras.',
    icono: 'scale',
    orden: 3,
  },
  {
    titulo: 'Administración de Datos',
    slug: 'administracion-de-datos',
    descripcion:
      'En la BMC proveemos información y análisis al mercado para la toma oportuna de decisiones.',
    icono: 'chart',
    orden: 4,
  },
  {
    titulo: 'Administración de programas',
    slug: 'administracion-de-programas',
    descripcion:
      'En la BMC administramos programas del Ministerio de Agricultura y Desarrollo Rural para apoyar la ejecución de proyectos que apoyen la comercialización de commodities.',
    icono: 'sprout',
    orden: 5,
  },
]

export const servicios = [
  {
    titulo: 'Mercados',
    slug: 'mercados',
    descripcion:
      'Administramos mercados especializados para la comercialización de productos y servicios, atendiendo las necesidades de compra y/o venta de Entidades estatales, empresas privadas o mixtas y personas naturales.',
    icono: 'exchange',
    orden: 1,
    enlaces: [
      { etiqueta: 'Mercado de Compras Públicas (MCP)', url: '#' },
      { etiqueta: 'Mercado de Comercialización entre privados (Mercop)', url: '#' },
      { etiqueta: 'Mercados Energéticos', url: '#' },
    ],
  },
  {
    titulo: 'Financiación no bancaria y productos de inversión',
    slug: 'financiacion-no-bancaria-y-productos-de-inversion',
    descripcion: 'Promovemos fuentes de financiación no bancaria de fácil acceso.',
    icono: 'coins',
    orden: 2,
    enlaces: [
      { etiqueta: 'Registro de Facturas', url: '#' },
      { etiqueta: 'Repos sobre Certificados de Depósito de Mercancías - CDM', url: '#' },
      { etiqueta: 'Órdenes Irrevocables de Giro', url: '#' },
      { etiqueta: 'SIMM | Registro de cesión de derechos económicos', url: '#' },
    ],
  },
  {
    titulo: 'Información y análisis',
    slug: 'informacion-y-analisis',
    descripcion:
      'Proveemos información y análisis al mercado para la toma oportuna de decisiones.',
    icono: 'chart',
    orden: 3,
    enlaces: [
      { etiqueta: 'Analítica', url: '#' },
      { etiqueta: 'Estudios Económicos', url: '#' },
    ],
  },
  {
    titulo: 'Administración de Programas',
    slug: 'administracion-de-programas',
    descripcion:
      'En la BMC administramos programas del Ministerio de Agricultura y Desarrollo Rural para apoyar la ejecución de proyectos que apoyen la comercialización de commodities.',
    icono: 'sprout',
    orden: 4,
    enlaces: [{ etiqueta: 'Programas Ministerio de Agricultura', url: '#' }],
  },
]

const FECHA_CIERRE = '2026-08-19'

export const operaciones = [
  { numeroNegocio: '104882', tipoMercado: 'fisicos', concepto: 'Maíz amarillo', cantidad: '520 t', valor: 1842300000, fecha: FECHA_CIERRE },
  { numeroNegocio: '104883', tipoMercado: 'fisicos', concepto: 'Arroz paddy verde', cantidad: '310 t', valor: 1129500000, fecha: FECHA_CIERRE },
  { numeroNegocio: '104884', tipoMercado: 'fisicos', concepto: 'Azúcar sulfitada', cantidad: '180 t', valor: 742680000, fecha: FECHA_CIERRE },
  { numeroNegocio: '104885', tipoMercado: 'fisicos', concepto: 'Aceite crudo de palma', cantidad: '95 t', valor: 613225000, fecha: FECHA_CIERRE },
  { numeroNegocio: '104886', tipoMercado: 'fisicos', concepto: 'Café pergamino seco', cantidad: '64 t', valor: 1036400000, fecha: FECHA_CIERRE },
  { numeroNegocio: '104887', tipoMercado: 'fisicos', concepto: 'Gas natural', cantidad: '1.200 MBTU', valor: 268940000, fecha: FECHA_CIERRE },
  { numeroNegocio: 'F-20114', tipoMercado: 'financieros', concepto: 'Registro de facturas', valor: 8420115000, tasa: 13.85, fecha: FECHA_CIERRE },
  { numeroNegocio: 'F-20115', tipoMercado: 'financieros', concepto: 'Repo sobre CDM', valor: 5310000000, tasa: 12.4, fecha: FECHA_CIERRE },
  { numeroNegocio: 'F-20116', tipoMercado: 'financieros', concepto: 'Orden Irrevocable de Giro', valor: 2905780000, tasa: 11.95, fecha: FECHA_CIERRE },
  { numeroNegocio: 'F-20117', tipoMercado: 'financieros', concepto: 'Registro de facturas', valor: 1640220000, tasa: 14.1, fecha: FECHA_CIERRE },
  { numeroNegocio: 'F-20118', tipoMercado: 'financieros', concepto: 'Repo sobre CDM', valor: 980500000, tasa: 12.75, fecha: FECHA_CIERRE },
  { numeroNegocio: 'F-20119', tipoMercado: 'financieros', concepto: 'SIMM | Cesión de derechos', valor: 745300000, tasa: 13.2, fecha: FECHA_CIERRE },
]

export const boletines = [
  {
    titulo: 'Boletín diario del mercado — 19 de agosto de 2026',
    slug: 'boletin-diario-2026-08-19',
    fecha: FECHA_CIERRE,
    resumen:
      'Cierre de la rueda con 12 operaciones registradas y un valor negociado de $25.635 millones. El mercado de financieros concentró el 78 % del volumen.',
    categoria: 'boletin-diario',
    destacado: true,
  },
  {
    titulo: 'Estudio económico: comportamiento del maíz amarillo en 2026',
    slug: 'estudio-maiz-amarillo-2026',
    fecha: '2026-08-12',
    resumen:
      'Análisis de precios, volúmenes y estacionalidad del maíz amarillo negociado en la BMC durante el primer semestre.',
    categoria: 'estudio-economico',
    destacado: false,
  },
  {
    titulo: 'Comunicado: nuevos horarios de la rueda de negocios',
    slug: 'comunicado-horarios-rueda',
    fecha: '2026-08-05',
    resumen:
      'A partir de septiembre la rueda de negocios amplía su horario de cierre para el mercado de financieros.',
    categoria: 'comunicado',
    destacado: false,
  },
]

export const home = {
  eyebrow: '46 años de experiencia',
  titulo: 'Somos la bolsa de productos y servicios de Colombia.',
  subtitulo:
    'Contribuimos al desarrollo sostenible y generamos valor al país promoviendo, facilitando y administrando mercados eficientes y financiación no bancaria a través de:',
  // Los CTA son enlaces: el destino se edita en el panel, no está en el código.
  ctaPrimario: { etiqueta: 'Conozca nuestros mercados', url: '/portal' },
  ctaSecundario: { etiqueta: 'Acceso a plataformas', url: '/acceso' },
  tituloServicios:
    'Brindamos transparencia, seguridad y eficiencia en los mercados que administramos.',
  introServicios:
    'Somos un escenario de negociación de productos agropecuarios, industriales, minero-energéticos y otros commodities, donde se puede comprar o vender productos, obtener financiación o hacer inversiones.',
  tituloValor: '¿Cómo agregamos valor a Colombia?',
  etiquetaPlataformas: 'Nuestras plataformas',
  tituloTablero: 'Cierre | Rueda de negocios',
  ctaTablero: { etiqueta: 'Más información del mercado', url: '/portal' },
  notaTablero: 'Cifras de demostración. No corresponden a operaciones reales del mercado.',
  eyebrowBoletines: 'Boletines del mercado',
  tituloBoletines: 'Información y análisis para decidir a tiempo',
  eyebrowContacto: 'Contáctenos',
  tituloContacto: 'Estamos para atenderle',
  panelCifras: {
    titulo: 'Indicadores de la BMC',
    descripcion: 'Consolidado institucional del último cierre',
    fuente: 'Power BI',
    actualizado: 'Actualizado hoy, 06:00',
    enlaceInforme: { etiqueta: 'Abrir informe completo', url: '/portal' },
  },
  cifras: [
    { valor: '46', etiqueta: 'años de experiencia', tendencia: 'estable', progreso: 92 },
    { valor: '+3.500', etiqueta: 'entidades y empresas atendidas', tendencia: '+8,4 % anual', progreso: 74 },
    { valor: '+40', etiqueta: 'sociedades comisionistas', tendencia: '+2 este año', progreso: 58 },
    { valor: '24/7', etiqueta: 'plataformas de registro disponibles', tendencia: '99,9 % disponibilidad', progreso: 99 },
  ],
  mensajesValor: [
    { texto: 'Damos acceso al mercado a PYMES para que vendan sus productos y servicios a grandes empresas y al Estado.' },
    { texto: 'Administramos, creamos y facilitamos mercados eficientes desde el sector agropecuario, el energético hasta el de compras públicas, permitiendo la formación transparente y eficiente de precios, contribuyendo así a la competitividad del país.' },
    { texto: 'Cubrimos fallas de mercado en materia de financiación, facilitando financiación no bancaria para el sector agropecuario, proveedores del Estado y pequeñas y medianas empresas.' },
    { texto: 'Nuestros escenarios de negociación son independientes, transparentes, neutros y objetivos.' },
    { texto: 'Somos aliados del Estado en la lucha contra la corrupción y el ahorro de los recursos públicos con nuestro mercado de compras públicas que es eficiente, transparente y seguro.' },
  ],
  tarjetasContacto: [
    {
      titulo: 'Contáctenos',
      icono: 'phone',
      lineas: 'Contáctenos por WhatsApp\nEscríbanos\nLínea ética',
      cta: 'Conoce más',
    },
    {
      titulo: 'Atención al Cliente',
      icono: 'headset',
      lineas: 'Plataforma PQRSF\nPreguntas Frecuentes',
      cta: 'Ir a PQRSF',
    },
    {
      titulo: 'Visítenos',
      icono: 'pin',
      lineas: 'Calle 113 # 7-21 Torre A Piso 15.\nEdif. Teleport Business Park\nBogotá D.C., Colombia',
      cta: 'Ver en el mapa',
    },
  ],
  seo: {
    metaTitulo: 'Home | Bolsa Mercantil de Colombia (DEMO)',
    metaDescripcion:
      'Demo no oficial: bolsa de productos y servicios de Colombia. Mercados eficientes, transparentes y seguros.',
    palabrasClave: 'bmc, bolsa mercantil, commodities, mercado de compras públicas',
  },
}
