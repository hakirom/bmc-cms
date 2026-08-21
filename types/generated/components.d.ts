import type { Schema, Struct } from '@strapi/strapi';

export interface HomeCifra extends Struct.ComponentSchema {
  collectionName: 'components_home_cifras';
  info: {
    description: 'Dato destacado de la franja de cifras';
    displayName: 'Cifra';
    icon: 'chartBubble';
  };
  attributes: {
    etiqueta: Schema.Attribute.String & Schema.Attribute.Required;
    progreso: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 100;
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<50>;
    tendencia: Schema.Attribute.String;
    valor: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomeMensajeValor extends Struct.ComponentSchema {
  collectionName: 'components_home_mensajes_valor';
  info: {
    description: 'Diapositiva de \u00BFC\u00F3mo agregamos valor a Colombia?';
    displayName: 'Mensaje de valor';
    icon: 'quote';
  };
  attributes: {
    texto: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface HomePanelBi extends Struct.ComponentSchema {
  collectionName: 'components_home_panel_bi';
  info: {
    description: 'Marco del tablero embebido de indicadores (simula un informe de Power BI)';
    displayName: 'Panel de indicadores';
    icon: 'chartPie';
  };
  attributes: {
    actualizado: Schema.Attribute.String;
    descripcion: Schema.Attribute.String;
    enlaceInforme: Schema.Attribute.Component<'shared.enlace', false>;
    fuente: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Power BI'>;
    titulo: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomeTarjetaContacto extends Struct.ComponentSchema {
  collectionName: 'components_home_tarjetas_contacto';
  info: {
    description: 'Bloque del \u00E1rea Cont\u00E1ctenos';
    displayName: 'Tarjeta de contacto';
    icon: 'phone';
  };
  attributes: {
    cta: Schema.Attribute.String;
    icono: Schema.Attribute.Enumeration<['phone', 'headset', 'pin']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'phone'>;
    lineas: Schema.Attribute.Text & Schema.Attribute.Required;
    titulo: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface InterfazAcceso extends Struct.ComponentSchema {
  collectionName: 'components_interfaz_acceso';
  info: {
    description: 'Textos del inicio de sesi\u00F3n y del alta de usuarios';
    displayName: 'Acceso y registro';
    icon: 'lock';
  };
  attributes: {
    botonEntrar: Schema.Attribute.String & Schema.Attribute.Required;
    botonRegistrar: Schema.Attribute.String & Schema.Attribute.Required;
    campoContrasena: Schema.Attribute.String & Schema.Attribute.Required;
    campoCorreo: Schema.Attribute.String & Schema.Attribute.Required;
    campoNombre: Schema.Attribute.String & Schema.Attribute.Required;
    cerrarSesion: Schema.Attribute.String & Schema.Attribute.Required;
    errorCredenciales: Schema.Attribute.String & Schema.Attribute.Required;
    errorRegistro: Schema.Attribute.String & Schema.Attribute.Required;
    irAEntrar: Schema.Attribute.String & Schema.Attribute.Required;
    irARegistro: Schema.Attribute.String & Schema.Attribute.Required;
    procesando: Schema.Attribute.String & Schema.Attribute.Required;
    subtituloEntrar: Schema.Attribute.String & Schema.Attribute.Required;
    subtituloRegistro: Schema.Attribute.String & Schema.Attribute.Required;
    tituloEntrar: Schema.Attribute.String & Schema.Attribute.Required;
    tituloRegistro: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface InterfazAcciones extends Struct.ComponentSchema {
  collectionName: 'components_interfaz_acciones';
  info: {
    description: 'Botones y etiquetas de accesibilidad';
    displayName: 'Acciones y navegaci\u00F3n';
    icon: 'cursor';
  };
  attributes: {
    abrirMenu: Schema.Attribute.String & Schema.Attribute.Required;
    anterior: Schema.Attribute.String & Schema.Attribute.Required;
    avisoDemo: Schema.Attribute.String & Schema.Attribute.Required;
    buscar: Schema.Attribute.String & Schema.Attribute.Required;
    buscarPlaceholder: Schema.Attribute.String & Schema.Attribute.Required;
    cambiarIdioma: Schema.Attribute.String & Schema.Attribute.Required;
    cambiarTema: Schema.Attribute.String & Schema.Attribute.Required;
    cerrarMenu: Schema.Attribute.String & Schema.Attribute.Required;
    conocerMas: Schema.Attribute.String & Schema.Attribute.Required;
    contactoWhatsapp: Schema.Attribute.String & Schema.Attribute.Required;
    irAlInicio: Schema.Attribute.String & Schema.Attribute.Required;
    leerBoletin: Schema.Attribute.String & Schema.Attribute.Required;
    navegacionPrincipal: Schema.Attribute.String & Schema.Attribute.Required;
    saltarContenido: Schema.Attribute.String & Schema.Attribute.Required;
    seccionCifras: Schema.Attribute.String & Schema.Attribute.Required;
    seccionMercados: Schema.Attribute.String & Schema.Attribute.Required;
    siguiente: Schema.Attribute.String & Schema.Attribute.Required;
    temaClaro: Schema.Attribute.String & Schema.Attribute.Required;
    temaOscuro: Schema.Attribute.String & Schema.Attribute.Required;
    verTodosServicios: Schema.Attribute.String & Schema.Attribute.Required;
    volverInicio: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface InterfazBoletines extends Struct.ComponentSchema {
  collectionName: 'components_interfaz_boletines';
  info: {
    description: 'Nombres de las categor\u00EDas y distintivos';
    displayName: 'Etiquetas de boletines';
    icon: 'file';
  };
  attributes: {
    catBoletinDiario: Schema.Attribute.String & Schema.Attribute.Required;
    catComunicado: Schema.Attribute.String & Schema.Attribute.Required;
    catEstudioEconomico: Schema.Attribute.String & Schema.Attribute.Required;
    destacado: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface InterfazPasoChat extends Struct.ComponentSchema {
  collectionName: 'components_interfaz_pasos_chat';
  info: {
    description: 'Mensaje que env\u00EDa el asistente PQRSF en cada punto de la conversaci\u00F3n';
    displayName: 'Paso del asistente';
    icon: 'message';
  };
  attributes: {
    clave: Schema.Attribute.Enumeration<
      [
        'saludo',
        'tipo',
        'asunto',
        'detalle',
        'nombre',
        'correo',
        'confirmacion',
        'cierre',
        'noEntendido',
      ]
    > &
      Schema.Attribute.Required;
    mensaje: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface InterfazPortal extends Struct.ComponentSchema {
  collectionName: 'components_interfaz_portal';
  info: {
    description: 'Textos del tablero posterior al inicio de sesi\u00F3n';
    displayName: 'Portal privado';
    icon: 'layer';
  };
  attributes: {
    abrir: Schema.Attribute.String & Schema.Attribute.Required;
    requiereSesion: Schema.Attribute.String & Schema.Attribute.Required;
    saludo: Schema.Attribute.String & Schema.Attribute.Required;
    sinComponentes: Schema.Attribute.String & Schema.Attribute.Required;
    subtitulo: Schema.Attribute.String & Schema.Attribute.Required;
    titulo: Schema.Attribute.String & Schema.Attribute.Required;
    volverAlSitio: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface InterfazPqrsf extends Struct.ComponentSchema {
  collectionName: 'components_interfaz_pqrsf';
  info: {
    description: 'Textos del chat de peticiones, quejas y reclamos';
    displayName: 'Asistente PQRSF';
    icon: 'message';
  };
  attributes: {
    enviar: Schema.Attribute.String & Schema.Attribute.Required;
    errorEnvio: Schema.Attribute.String & Schema.Attribute.Required;
    escribiendo: Schema.Attribute.String & Schema.Attribute.Required;
    placeholder: Schema.Attribute.String & Schema.Attribute.Required;
    radicadoAviso: Schema.Attribute.String & Schema.Attribute.Required;
    radicadoTitulo: Schema.Attribute.String & Schema.Attribute.Required;
    reiniciar: Schema.Attribute.String & Schema.Attribute.Required;
    subtitulo: Schema.Attribute.String & Schema.Attribute.Required;
    titulo: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface InterfazTablero extends Struct.ComponentSchema {
  collectionName: 'components_interfaz_tablero';
  info: {
    description: 'Cabeceras y r\u00F3tulos del cierre de rueda';
    displayName: 'Tablero de mercado';
    icon: 'grid';
  };
  attributes: {
    colCantidad: Schema.Attribute.String & Schema.Attribute.Required;
    colInstrumento: Schema.Attribute.String & Schema.Attribute.Required;
    colNegocio: Schema.Attribute.String & Schema.Attribute.Required;
    colProducto: Schema.Attribute.String & Schema.Attribute.Required;
    colTasa: Schema.Attribute.String & Schema.Attribute.Required;
    colValor: Schema.Attribute.String & Schema.Attribute.Required;
    fechaCierre: Schema.Attribute.String & Schema.Attribute.Required;
    mercadoFinancieros: Schema.Attribute.String & Schema.Attribute.Required;
    mercadoFisicos: Schema.Attribute.String & Schema.Attribute.Required;
    numeroOperaciones: Schema.Attribute.String & Schema.Attribute.Required;
    valorNegociado: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface NavColumna extends Struct.ComponentSchema {
  collectionName: 'components_nav_columnas';
  info: {
    description: 'Grupo de enlaces con t\u00EDtulo: sirve para el mega men\u00FA y para el footer';
    displayName: 'Columna de enlaces';
    icon: 'bulletList';
  };
  attributes: {
    enlaces: Schema.Attribute.Component<'shared.enlace', true>;
    titulo: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedCertificacion extends Struct.ComponentSchema {
  collectionName: 'components_shared_certificaciones';
  info: {
    description: 'Sello o certificado mostrado en el pie de p\u00E1gina';
    displayName: 'Certificaci\u00F3n';
    icon: 'shield';
  };
  attributes: {
    codigo: Schema.Attribute.String & Schema.Attribute.Required;
    etiqueta: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Certificado:'>;
  };
}

export interface SharedEnlace extends Struct.ComponentSchema {
  collectionName: 'components_shared_enlaces';
  info: {
    description: 'Enlace a un producto o mercado';
    displayName: 'Enlace';
    icon: 'link';
  };
  attributes: {
    etiqueta: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#'>;
  };
}

export interface SharedPunto extends Struct.ComponentSchema {
  collectionName: 'components_shared_puntos';
  info: {
    description: 'Elemento de una lista de caracter\u00EDsticas';
    displayName: 'Punto de lista';
    icon: 'check';
  };
  attributes: {
    texto: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: 'Metadatos para buscadores';
    displayName: 'SEO';
    icon: 'search';
  };
  attributes: {
    metaDescripcion: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    metaTitulo: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 70;
      }>;
    palabrasClave: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'home.cifra': HomeCifra;
      'home.mensaje-valor': HomeMensajeValor;
      'home.panel-bi': HomePanelBi;
      'home.tarjeta-contacto': HomeTarjetaContacto;
      'interfaz.acceso': InterfazAcceso;
      'interfaz.acciones': InterfazAcciones;
      'interfaz.boletines': InterfazBoletines;
      'interfaz.paso-chat': InterfazPasoChat;
      'interfaz.portal': InterfazPortal;
      'interfaz.pqrsf': InterfazPqrsf;
      'interfaz.tablero': InterfazTablero;
      'nav.columna': NavColumna;
      'shared.certificacion': SharedCertificacion;
      'shared.enlace': SharedEnlace;
      'shared.punto': SharedPunto;
      'shared.seo': SharedSeo;
    }
  }
}
