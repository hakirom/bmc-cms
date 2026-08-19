import type { StrapiApp } from '@strapi/strapi/admin'
import favicon from './extensions/favicon.svg'
import authLogo from './extensions/bmc-logo.svg'
import menuLogo from './extensions/bmc-mark.svg'
import { bmcTheme } from './theme'

export default {
  config: {
    locales: ['es'],

    auth: { logo: authLogo },
    menu: { logo: menuLogo },
    head: { favicon },

    theme: bmcTheme,

    // Panel limpio para la demo: sin videotutoriales ni avisos de versión
    tutorials: false,
    notifications: { releases: false },

    translations: {
      es: {
        'app.components.LeftMenu.navbrand.title': 'BMC Content Hub',
        'app.components.LeftMenu.navbrand.workplace': 'Bolsa Mercantil de Colombia',
        'Auth.form.welcome.title': 'BMC Content Hub',
        'Auth.form.welcome.subtitle': 'Administre el contenido del portal de la BMC',
        'app.components.HomePage.welcome': 'Bienvenido al Content Hub de la BMC',
        'HomePage.header.title': 'Panel de contenido BMC',
      },
      en: {
        'app.components.LeftMenu.navbrand.title': 'BMC Content Hub',
        'app.components.LeftMenu.navbrand.workplace': 'Bolsa Mercantil de Colombia',
        'Auth.form.welcome.title': 'BMC Content Hub',
        'Auth.form.welcome.subtitle': 'Manage the content of the BMC portal',
      },
    },
  },

  /**
   * Strapi 5.52 genera el index.html del admin sin <link rel="icon"> y con el
   * título fijo "Strapi Admin", así que `config.head.favicon` no llega a
   * aplicarse. Lo inyectamos aquí, que sí corre en dev y en el build.
   */
  bootstrap(_app: StrapiApp) {
    if (typeof document === 'undefined') return

    const link =
      document.querySelector<HTMLLinkElement>('link[rel="icon"]') ??
      document.createElement('link')
    link.rel = 'icon'
    link.type = 'image/svg+xml'
    link.href = favicon
    document.head.appendChild(link)

    document.title = 'BMC Content Hub'
  },
}
