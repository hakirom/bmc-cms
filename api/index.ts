import type { IncomingMessage, ServerResponse } from 'node:http'
import path from 'node:path'
import { createStrapi } from '@strapi/strapi'

/**
 * Entrada serverless para Vercel: arranca Strapi una vez por instancia y
 * delega en el callback de Koa.
 *
 * AVISO: Strapi no soporta oficialmente entornos serverless. Aquí el arranque
 * completo ocurre en cada arranque en frío (segundos), el disco es de solo
 * lectura —así que la subida de archivos necesita un proveedor externo— y el
 * `bootstrap`, incluido nuestro seed, se ejecuta en cada instancia nueva.
 * Para producción real use un host con proceso persistente (ver README).
 */

type Handler = (req: IncomingMessage, res: ServerResponse) => void

let arranque: Promise<Handler> | null = null

async function iniciar(): Promise<Handler> {
  const app = createStrapi({
    appDir: process.cwd(),
    distDir: path.join(process.cwd(), 'dist'),
  })

  await app.load()
  // `mount` engancha el router de Strapi sin abrir un puerto TCP.
  app.server.mount()

  return app.server.app.callback() as Handler
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  // Memorizamos la promesa: si llegan dos peticiones a la vez durante el
  // arranque en frío, ambas esperan al mismo Strapi en lugar de arrancar dos.
  arranque ??= iniciar().catch((error) => {
    arranque = null
    throw error
  })

  try {
    const callback = await arranque
    return callback(req, res)
  } catch (error) {
    // Sin esto, un fallo de arranque (falta JWT_SECRET, base inaccesible…)
    // se ve como un 500 genérico de Vercel y hay que ir a los logs para saber
    // qué pasó. Devolvemos el motivo, que en una demo ahorra mucho tiempo.
    const motivo = error instanceof Error ? error.message : String(error)
    console.error('[strapi] El CMS no pudo arrancar:', error)

    res.statusCode = 500
    res.setHeader('content-type', 'text/plain; charset=utf-8')
    res.end(
      [
        'El CMS no pudo arrancar.',
        '',
        motivo,
        '',
        'Revise las variables de entorno del proyecto: APP_KEYS, JWT_SECRET,',
        'ADMIN_JWT_SECRET, API_TOKEN_SALT, TRANSFER_TOKEN_SALT, ENCRYPTION_KEY,',
        'DATABASE_CLIENT y DATABASE_URL.',
      ].join('\n'),
    )
  }
}
