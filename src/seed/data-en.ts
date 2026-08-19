/**
 * Traducciones al inglés. No crean documentos nuevos: se aplican como la
 * versión `en` de los documentos en español (ver seedTranslations en ./index).
 * La clave de emparejamiento va primero en cada objeto.
 */

const enlaces = (...labels: string[]) => labels.map((etiqueta) => ({ etiqueta, url: '#' }))

/** Emparejadas por el campo `orden`. */
export const plataformasEn = [
  {
    orden: 1,
    titulo: 'Trading Platform',
    slug: 'trading-platform',
    descripcion:
      'On the BMC, agricultural, agro-industrial, gas, energy, invoices, repos, other commodities and securities are bought and/or sold.',
  },
  {
    orden: 2,
    titulo: 'Registration Platform',
    slug: 'registration-platform',
    descripcion:
      'The BMC registers agreements with public entities, securities, titles, rights and services, goods, products and commodities, contracts and derivatives.',
  },
  {
    orden: 3,
    titulo: 'Clearing and Settlement Platform',
    slug: 'clearing-and-settlement-platform',
    descripcion:
      'The BMC clears and settles transactions, guaranteeing that the obligations between the parties are met and that operations remain secure.',
  },
  {
    orden: 4,
    titulo: 'Data Management',
    slug: 'data-management',
    descripcion: 'The BMC provides market information and analysis for timely decision-making.',
  },
  {
    orden: 5,
    titulo: 'Programme Management',
    slug: 'programme-management',
    descripcion:
      'The BMC manages programmes of the Ministry of Agriculture and Rural Development to support projects that boost commodity trading.',
  },
]

/** Emparejados por el campo `orden`. */
export const serviciosEn = [
  {
    orden: 1,
    titulo: 'Markets',
    slug: 'markets',
    descripcion:
      'We run specialised markets for trading products and services, serving the buying and selling needs of state entities, private or mixed companies and individuals.',
    enlaces: enlaces('Public Procurement Market (MCP)', 'Private Trading Market (Mercop)', 'Energy Markets'),
  },
  {
    orden: 2,
    titulo: 'Non-bank financing and investment products',
    slug: 'non-bank-financing-and-investment-products',
    descripcion: 'We promote easily accessible non-bank financing sources.',
    enlaces: enlaces(
      'Invoice Registration',
      'Repos on Merchandise Deposit Certificates - CDM',
      'Irrevocable Payment Orders',
      'SIMM | Registration of assignment of economic rights',
    ),
  },
  {
    orden: 3,
    titulo: 'Information and analysis',
    slug: 'information-and-analysis',
    descripcion: 'We provide market information and analysis for timely decision-making.',
    enlaces: enlaces('Analytics', 'Economic Studies'),
  },
  {
    orden: 4,
    titulo: 'Programme Management',
    slug: 'programme-management-service',
    descripcion:
      'The BMC manages programmes of the Ministry of Agriculture and Rural Development to support projects that boost commodity trading.',
    enlaces: enlaces('Ministry of Agriculture Programmes'),
  },
]

/** Emparejados por el `slug` en español. */
export const boletinesEn = [
  {
    slugEs: 'boletin-diario-2026-08-19',
    titulo: 'Daily market bulletin — 19 August 2026',
    slug: 'daily-bulletin-2026-08-19',
    resumen:
      'Trading session closed with 12 registered transactions and a traded value of COP 25,635 million. The financial market accounted for 78% of the volume.',
  },
  {
    slugEs: 'estudio-maiz-amarillo-2026',
    titulo: 'Economic study: yellow maize performance in 2026',
    slug: 'economic-study-yellow-maize-2026',
    resumen:
      'Analysis of prices, volumes and seasonality of the yellow maize traded on the BMC during the first half of the year.',
  },
  {
    slugEs: 'comunicado-horarios-rueda',
    titulo: 'Announcement: new trading session hours',
    slug: 'announcement-new-trading-hours',
    resumen:
      'From September the trading session extends its closing time for the financial market.',
  },
]

export const homeEn = {
  eyebrow: '46 years of experience',
  titulo: 'We are the commodity and services exchange of Colombia.',
  subtitulo:
    'We contribute to sustainable development and create value for the country by promoting, facilitating and managing efficient markets and non-bank financing through:',
  ctaPrimario: 'Explore our markets',
  ctaSecundario: 'Platform access',
  tituloServicios: 'We bring transparency, security and efficiency to the markets we run.',
  introServicios:
    'We are a trading venue for agricultural, industrial, mining-energy and other commodities, where you can buy or sell products, obtain financing or invest.',
  tituloValor: 'How do we add value to Colombia?',
  cifras: [
    { valor: '46', etiqueta: 'years of experience' },
    { valor: '+3,500', etiqueta: 'entities and companies served' },
    { valor: '+40', etiqueta: 'brokerage firms' },
    { valor: '24/7', etiqueta: 'registration platforms available' },
  ],
  mensajesValor: [
    { texto: 'We give SMEs market access so they can sell their products and services to large companies and to the State.' },
    { texto: 'We manage, create and facilitate efficient markets from agriculture and energy to public procurement, enabling transparent and efficient price formation and boosting the country’s competitiveness.' },
    { texto: 'We cover market failures in financing, providing non-bank funding for agriculture, State suppliers and small and medium-sized companies.' },
    { texto: 'Our trading venues are independent, transparent, neutral and objective.' },
    { texto: 'We are allies of the State in the fight against corruption and in saving public resources through a public procurement market that is efficient, transparent and secure.' },
  ],
  tarjetasContacto: [
    { titulo: 'Contact us', icono: 'phone', lineas: 'Contact us on WhatsApp\nWrite to us\nEthics line', cta: 'Learn more' },
    { titulo: 'Customer service', icono: 'headset', lineas: 'PQRSF platform\nFAQ', cta: 'Go to PQRSF' },
    {
      titulo: 'Visit us',
      icono: 'pin',
      lineas: 'Calle 113 # 7-21 Tower A Floor 15.\nTeleport Business Park\nBogotá D.C., Colombia',
      cta: 'View on the map',
    },
  ],
  seo: {
    metaTitulo: 'Home | Bolsa Mercantil de Colombia (DEMO)',
    metaDescripcion:
      'Unofficial demo: the commodity and services exchange of Colombia. Efficient, transparent and secure markets.',
    palabrasClave: 'bmc, commodity exchange, commodities, public procurement market',
  },
}

export const configuracionSitioEn = {
  barraUtilidades: enlaces('Market bulletins', 'Market information', 'PQRSF', 'Ethics line', 'Pay traded invoices'),
  etiquetaAcceso: 'Sign in',
  menuPrincipal: [
    {
      titulo: 'Our company',
      enlaces: enlaces(
        'About us',
        'Work with us',
        'BMC in the media',
        'Sustainability',
        'Brokerage firms',
        'Regulation',
        'Integrated risk management',
        'Why invest in us?',
      ),
    },
    {
      titulo: 'Markets',
      enlaces: enlaces(
        'Public Procurement Market (MCP)',
        'Private Trading Market (Mercop)',
        'Energy Markets',
        'Ministry of Agriculture Programmes',
      ),
    },
    {
      titulo: 'Financing and investment',
      enlaces: enlaces(
        'Invoice Registration',
        'Repos on Merchandise Deposit Certificates - CDM',
        'Irrevocable Payment Orders',
        'SIMM | Registration of assignment of economic rights',
      ),
    },
    {
      titulo: 'Information and analysis',
      enlaces: enlaces('Analytics', 'Economic Studies', 'Market bulletins', 'FAQ'),
    },
  ],
  descripcionFooter:
    'The commodity and services exchange of Colombia. Efficient, transparent and secure markets.',
  columnasFooter: [
    {
      titulo: 'Our company',
      enlaces: enlaces(
        'About us',
        'Work with us',
        'BMC in the media',
        'Sustainability',
        'Brokerage firms',
        'Regulation',
        'Integrated risk management',
        'Why invest in us?',
      ),
    },
    {
      titulo: 'Products',
      enlaces: enlaces(
        'MCP',
        'MERCOP',
        'Energy markets',
        'Repos on CDM',
        'Invoice registration',
        'OIG',
        'MADR Programmes',
        'Analytics',
        'Economic studies',
        'SIMM | Registration of assignment of economic rights',
      ),
    },
    {
      titulo: 'Policies',
      enlaces: enlaces(
        'Terms and conditions of use',
        'Privacy policy',
        'Ethics line',
        'Integrated Management System policy',
        'Information Security policy',
      ),
    },
    {
      titulo: 'Self-regulation',
      enlaces: enlaces('Disciplinary Chamber', 'Monitoring Area', 'Contact us', 'PQRSF', 'FAQ'),
    },
  ],
  vigilancia: 'Supervised by: Superintendencia Financiera de Colombia',
  listadoEn: 'Listed on: BVC',
  legal: 'All rights reserved 2026 Bolsa Mercantil de Colombia S.A. - Bogotá D.C., Colombia',
}
