# Imagen del CMS. Sirve para Render, Railway, Fly.io o cualquier VPS con Docker.
FROM node:22-alpine AS build

# better-sqlite3 y sharp necesitan herramientas de compilación
RUN apk add --no-cache build-base python3 vips-dev

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:22-alpine AS runtime
RUN apk add --no-cache vips
WORKDIR /app
ENV NODE_ENV=production

# `strapi build` (proyecto TypeScript) deja todo en dist/, incluido el panel
# de administración en dist/build. No existe un build/ en la raíz.
#
# tsconfig.json es imprescindible en la imagen final aunque no se compile nada
# en ella: Strapi decide si el proyecto es TypeScript comprobando que ese archivo
# exista, y de ahí saca que la configuración vive en dist/config. Sin él busca
# en ./config, no encuentra nada y muere al arrancar con
# "Cannot destructure property 'client' of 'db.config.connection'".
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/tsconfig.json ./tsconfig.json
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/public ./public
COPY --from=build /app/database ./database
COPY --from=build /app/favicon.png ./favicon.png

EXPOSE 1337
CMD ["npm", "run", "start"]
