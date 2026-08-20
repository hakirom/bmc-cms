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

  const callback = await arranque
  return callback(req, res)
}
