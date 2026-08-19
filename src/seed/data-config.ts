/** Configuración del sitio: navegación, pie de página e institucional (español). */

const enlaces = (...etiquetas: string[]) => etiquetas.map((etiqueta) => ({ etiqueta, url: '#' }))

export const configuracionSitio = {
  barraUtilidades: [
    { etiqueta: 'Boletines del mercado', url: '/#boletines' },
    { etiqueta: 'Información de Mercados', url: '/#top' },
    { etiqueta: 'PQRSF', url: '/pqrsf' },
    { etiqueta: 'Línea ética', url: '#' },
    { etiqueta: 'Pague facturas negociadas', url: '#' },
  ],
  etiquetaAcceso: 'Acceso',
  menuPrincipal: [
    {
      titulo: 'Nuestra compañía',
      enlaces: enlaces(
        'Nosotros',
        'Trabaje con nosotros',
        'BMC en medios',
        'Sostenibilidad',
        'Sociedades comisionistas',
        'Regulación',
        'Administración integral de riesgos',
        '¿Por qué invertir en nosotros?',
      ),
    },
    {
      titulo: 'Mercados',
      enlaces: enlaces(
        'Mercado de Compras Públicas (MCP)',
        'Mercado de Comercialización entre privados (Mercop)',
        'Mercados Energéticos',
        'Programas Ministerio de Agricultura',
      ),
    },
    {
      titulo: 'Financiación e inversión',
      enlaces: enlaces(
        'Registro de Facturas',
        'Repos sobre Certificados de Depósito de Mercancías - CDM',
        'Órdenes Irrevocables de Giro',
        'SIMM | Registro de cesión de derechos económicos',
      ),
    },
    {
      titulo: 'Información y análisis',
      enlaces: enlaces('Analítica', 'Estudios Económicos', 'Boletines del mercado', 'Preguntas Frecuentes'),
    },
  ],
  descripcionFooter:
    'Bolsa de productos y servicios de Colombia. Mercados eficientes, transparentes y seguros.',
  columnasFooter: [
    {
      titulo: 'Nuestra compañía',
      enlaces: enlaces(
        'Nosotros',
        'Trabaje con nosotros',
        'BMC en medios',
        'Sostenibilidad',
        'Sociedades comisionistas',
        'Regulación',
        'Administración integral de riesgos',
        '¿Por qué invertir en nosotros?',
      ),
    },
    {
      titulo: 'Productos',
      enlaces: enlaces(
        'MCP',
        'MERCOP',
        'Mercados energéticos',
        'Repos sobre CDM',
        'Registro de facturas',
        'OIG',
        'Programas MADR',
        'Analítica',
        'Estudios económicos',
        'SIMM | Registro de cesión de derechos económicos',
      ),
    },
    {
      titulo: 'Políticas',
      enlaces: enlaces(
        'Términos y condiciones de uso',
        'Política de privacidad',
        'Línea Ética',
        'Política del Sistema de Gestión Integrado',
        'Política de Seguridad de la Información',
      ),
    },
    {
      titulo: 'Autorregulación',
      enlaces: enlaces('Cámara Disciplinaria', 'Área de Seguimiento', 'Contáctenos', 'PQRSF', 'Preguntas Frecuentes'),
    },
  ],
  redesSociales: enlaces('LinkedIn', 'X', 'YouTube', 'Facebook', 'Instagram'),
  certificaciones: [
    { etiqueta: 'Certificado:', codigo: 'TR-CO22.07533' },
    { etiqueta: 'Certificado:', codigo: 'TR-CO22.07748' },
    { etiqueta: 'Certificado:', codigo: 'CN-2002544' },
  ],
  vigilancia: 'Vigilada: Superintendencia Financiera de Colombia',
  listadoEn: 'Listado en: BVC',
  legal: 'Derechos Reservados 2026 Bolsa Mercantil de Colombia S.A. - Bogotá D.C., Colombia',
}
