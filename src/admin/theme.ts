/**
 * Línea gráfica de la Bolsa Mercantil de Colombia aplicada al panel de Strapi.
 *
 * Paleta tomada del sitio público:
 *   navy #013365 · navy oscuro #001F42 · navy medio #0B4C8C
 *   azul #1E88D3 · azul claro #55B0E8 · tinte #F2F9FE
 *
 * Los nombres de token vienen de @strapi/design-system (interface Colors).
 */

const BMC = {
  navy: '#013365',
  navyDark: '#001F42',
  navyMid: '#0B4C8C',
  azure: '#1E88D3',
  azureLight: '#55B0E8',
  azureSoft: '#C7E1F6',
  tint: '#F2F9FE',
} as const

export const bmcTheme = {
  light: {
    colors: {
      // Primario: navy para acciones, azul para estados activos
      primary100: BMC.tint,
      primary200: BMC.azureSoft,
      primary500: BMC.azure,
      primary600: BMC.navy,
      primary700: BMC.navyDark,

      buttonPrimary500: BMC.navyMid,
      buttonPrimary600: BMC.navy,

      // Secundario: familia azul (badges informativos, enlaces)
      secondary100: BMC.tint,
      secondary200: BMC.azureSoft,
      secondary500: BMC.azureLight,
      secondary600: BMC.azure,
      secondary700: BMC.navyMid,

      // "Alternative" es morado por defecto: lo llevamos al azul institucional
      alternative100: BMC.tint,
      alternative200: BMC.azureSoft,
      alternative500: BMC.azure,
      alternative600: BMC.navyMid,
      alternative700: BMC.navy,

      // Fondo con el tinte azulado del sitio
      neutral100: BMC.tint,
      neutral1000: BMC.navyDark,
    },
  },
  dark: {
    colors: {
      primary100: '#0B2545',
      primary200: '#123A63',
      primary500: BMC.azureLight,
      primary600: BMC.azure,
      primary700: BMC.navyMid,

      buttonPrimary500: BMC.azure,
      buttonPrimary600: BMC.azureLight,

      secondary100: '#0B2545',
      secondary200: '#123A63',
      secondary500: BMC.azureLight,
      secondary600: BMC.azure,
      secondary700: BMC.navyMid,

      alternative100: '#0B2545',
      alternative200: '#123A63',
      alternative500: BMC.azureLight,
      alternative600: BMC.azure,
      alternative700: BMC.navyMid,
    },
  },
}
