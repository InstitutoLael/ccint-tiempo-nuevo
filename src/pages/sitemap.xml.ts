import type { APIRoute } from 'astro';
const paginas = ['', 'visitanos', 'en-vivo', 'nosotros', 'ministerios', 'ofrendas', 'contacto', 'primer-paso'];
export const GET: APIRoute = ({ site }) => {
  const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');
  const urls = paginas.map((p) => `<url><loc>${new URL(base + p, site)}</loc></url>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
    headers: { 'Content-Type': 'application/xml' },
  });
};
