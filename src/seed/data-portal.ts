/** Componentes del portal privado y contenido de demostración de las plataformas. */

const puntos = (...textos: string[]) => textos.map((texto) => ({ texto }))

/** Se aplica sobre las plataformas ya sembradas, emparejando por `orden`. */
export const detallePlataformas = [
  {
    orden: 1,
    activa: true,
    requiereSesion: true,
    resumenDemo:
      'Rueda de negocios electrónica donde comisionistas registran puntas de compra y venta sobre productos agropecuarios, energéticos y otros commodities.',
    caracteristicas: puntos(
      'Rueda continua con formación pública de precios',
      'Puntas de compra y venta en tiempo real',
      'Cumplimiento garantizado por la cámara de compensación',
    ),
  },
  {
    orden: 2,
    activa: true,
    requiereSesion: true,
    resumenDemo:
      'Registro de convenios, contratos y derivados con entidades públicas y privadas, con trazabilidad completa del expediente.',
    caracteristicas: puntos(
      'Radicación en línea con número de expediente',
      'Trazabilidad y control de versiones',
      'Certificados descargables',
    ),
  },
  {
    orden: 3,
    activa: true,
    requiereSesion: true,
    resumenDemo:
      'Compensación y liquidación de las operaciones cerradas en rueda, con administración de garantías y control de riesgo de contraparte.',
    caracteristicas: puntos(
      'Liquidación diaria de posiciones',
      'Administración de garantías',
      'Reporte de cumplimiento por contraparte',
    ),
  },
  {
    orden: 4,
    activa: true,
    requiereSesion: false,
    resumenDemo:
      'Series históricas, indicadores y analítica del mercado para apoyar decisiones de compra, venta e inversión.',
    caracteristicas: puntos(
      'Series históricas descargables',
      'Indicadores por producto y región',
      'Boletines diarios y estudios económicos',
    ),
  },
  {
    orden: 5,
    activa: false,
    requiereSesion: true,
    resumenDemo:
      'Administración de los programas del Ministerio de Agricultura y Desarrollo Rural que apoyan la comercialización de commodities.',
    caracteristicas: puntos(
      'Convocatorias abiertas y cerradas',
      'Seguimiento de la ejecución',
      'Rendición de cuentas por proyecto',
    ),
  },
]

export const detallePlataformasEn = [
  {
    orden: 1,
    resumenDemo:
      'Electronic trading session where brokers post bids and offers on agricultural, energy and other commodities.',
    caracteristicas: puntos(
      'Continuous session with public price formation',
      'Real-time bids and offers',
      'Settlement guaranteed by the clearing house',
    ),
  },
  {
    orden: 2,
    resumenDemo:
      'Registration of agreements, contracts and derivatives with public and private entities, with full case traceability.',
    caracteristicas: puntos('Online filing with case number', 'Traceability and version control', 'Downloadable certificates'),
  },
  {
    orden: 3,
    resumenDemo:
      'Clearing and settlement of trades closed in the session, with collateral management and counterparty risk control.',
    caracteristicas: puntos('Daily position settlement', 'Collateral management', 'Counterparty settlement reporting'),
  },
  {
    orden: 4,
    resumenDemo:
      'Historical series, indicators and market analytics to support buying, selling and investment decisions.',
    caracteristicas: puntos('Downloadable historical series', 'Indicators by product and region', 'Daily bulletins and economic studies'),
  },
  {
    orden: 5,
    resumenDemo:
      'Management of the Ministry of Agriculture programmes that support commodity trading.',
    caracteristicas: puntos('Open and closed calls', 'Execution monitoring', 'Accountability by project'),
  },
]

export const componentesPortal = [
  {
    titulo: 'Cierre de rueda',
    clave: 'cierre-de-rueda',
    descripcion: 'Resumen de las operaciones del día con su valor negociado.',
    tipo: 'operaciones',
    icono: 'exchange',
    orden: 1,
    activo: true,
    requiereSesion: true,
    etiquetaAccion: 'Ver el tablero',
  },
  {
    titulo: 'Mis trámites',
    clave: 'mis-tramites',
    descripcion: 'Estado de los registros y solicitudes radicadas a su nombre.',
    tipo: 'tramites',
    icono: 'clipboard',
    orden: 2,
    activo: true,
    requiereSesion: true,
    etiquetaAccion: 'Abrir trámites',
  },
  {
    titulo: 'Boletines e informes',
    clave: 'boletines-e-informes',
    descripcion: 'Últimas publicaciones del área de estudios económicos.',
    tipo: 'boletines',
    icono: 'chart',
    orden: 3,
    activo: true,
    requiereSesion: false,
    etiquetaAccion: 'Ver publicaciones',
  },
  {
    titulo: 'Documentos y certificados',
    clave: 'documentos-y-certificados',
    descripcion: 'Descargue certificados de operaciones y constancias de registro.',
    tipo: 'documentos',
    icono: 'scale',
    orden: 4,
    activo: true,
    requiereSesion: true,
    etiquetaAccion: 'Descargar',
  },
  {
    titulo: 'Soporte y PQRSF',
    clave: 'soporte-y-pqrsf',
    descripcion: 'Radique una petición, queja, reclamo o sugerencia con el asistente.',
    tipo: 'soporte',
    icono: 'headset',
    orden: 5,
    activo: true,
    requiereSesion: false,
    etiquetaAccion: 'Abrir el asistente',
  },
  {
    titulo: 'Simulador de garantías',
    clave: 'simulador-de-garantias',
    descripcion: 'Calcule la garantía exigida según el producto y el monto de la operación.',
    tipo: 'enlace',
    icono: 'coins',
    orden: 6,
    activo: false,
    requiereSesion: true,
    etiquetaAccion: 'Abrir simulador',
  },
]

export const componentesPortalEn = [
  { clave: 'cierre-de-rueda', titulo: 'Session close', descripcion: 'Summary of the day’s transactions and traded value.', etiquetaAccion: 'View board' },
  { clave: 'mis-tramites', titulo: 'My filings', descripcion: 'Status of the registrations and requests filed under your name.', etiquetaAccion: 'Open filings' },
  { clave: 'boletines-e-informes', titulo: 'Bulletins and reports', descripcion: 'Latest publications from the economic studies area.', etiquetaAccion: 'View publications' },
  { clave: 'documentos-y-certificados', titulo: 'Documents and certificates', descripcion: 'Download trade certificates and registration records.', etiquetaAccion: 'Download' },
  { clave: 'soporte-y-pqrsf', titulo: 'Support and PQRSF', descripcion: 'File a request, complaint, claim or suggestion with the assistant.', etiquetaAccion: 'Open the assistant' },
  { clave: 'simulador-de-garantias', titulo: 'Collateral simulator', descripcion: 'Calculate the collateral required for a product and trade amount.', etiquetaAccion: 'Open simulator' },
]
