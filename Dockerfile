# schema.org Agent - Astro + Fabric.js (SurrealDB external)
FROM node:22-alpine

WORKDIR /app

# Install Astro
RUN npm install -g astro

# Copy app files
COPY package.json ./
COPY astro.config.mjs ./
COPY src ./src
COPY surrealql ./surrealql
COPY server.mjs ./
COPY .env.example ./

# Install deps (legacy-peer-deps for zod transitively required by Astro)
RUN npm install --legacy-peer-deps

# Build Astro
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/server/entry.mjs"]
