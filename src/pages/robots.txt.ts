import type { APIRoute } from 'astro';
export const GET: APIRoute = ({ site }) =>
  new Response(`User-agent: *\nDisallow: ${import.meta.env.BASE_URL.replace(/\/?$/, '/')}guia\nSitemap: ${new URL(import.meta.env.BASE_URL.replace(/\/?$/, '/') + 'sitemap.xml', site)}\n`);
