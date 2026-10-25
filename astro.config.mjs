// @ts-check
import { defineConfig } from 'astro/config';

// DECISIÓN: el sitio se publica en Cloudflare Pages, en la raíz del dominio.
// La dirección pública se define con la variable SITIO (en Cloudflare: Settings → Variables).
//   Mientras no haya dominio: https://ccint-tiempo-nuevo.pages.dev
//   Con dominio propio:       SITIO=https://tiemponuevo.cl
// BASE solo se usa si algún día se publica dentro de una subcarpeta.
export default defineConfig({
  site: process.env.SITIO || 'https://ccint-tiempo-nuevo.pages.dev',
  base: process.env.BASE || '/',
  trailingSlash: 'ignore',
  build: { inlineStylesheets: 'always' },
  devToolbar: { enabled: false },
});
