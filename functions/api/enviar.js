// Cloudflare Pages Function: recibe los formularios del sitio y los reenvía al Apps Script
// de info@iglesiatiemponuevo.cl (que envía el correo y guarda en la planilla).
// Variable secreta en Cloudflare Pages: APPS_SCRIPT_URL.
const TIPOS = new Set(['oracion', 'aniversario']);
const LIMITES = { nombre: 120, contacto: 160, motivo: 1000, institucion: 160, correo: 160, telefono: 30, asistentes: 3, mensaje: 600, quiere_contacto: 3, confidencial: 3 };

const json = (cuerpo, estado = 200) => new Response(JSON.stringify(cuerpo), {
  status: estado, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
});

export async function onRequestPost({ request, env }) {
  const tipo = new URL(request.url).searchParams.get('tipo');
  if (!TIPOS.has(tipo)) return json({ ok: false, error: 'tipo' }, 400);
  const origen = request.headers.get('Origin');
  if (origen && !/^https:\/\/(www\.)?iglesiatiemponuevo\.cl$|^https:\/\/[a-z0-9-]+\.ccint-tiempo-nuevo\.pages\.dev$|^https:\/\/ccint-tiempo-nuevo\.pages\.dev$/.test(origen)) {
    return json({ ok: false, error: 'origen' }, 403);
  }
  let fd;
  try { fd = await request.formData(); } catch { return json({ ok: false, error: 'datos' }, 400); }
  if (fd.get('sitio_web')) return json({ ok: true }); // trampa antispam: se responde ok y se descarta

  const datos = { tipo };
  for (const [k, max] of Object.entries(LIMITES)) {
    const v = fd.get(k);
    if (typeof v === 'string' && v.trim()) datos[k] = v.trim().slice(0, max);
  }
  if (tipo === 'oracion' && !datos.motivo) return json({ ok: false, error: 'motivo' }, 422);
  if (tipo === 'aniversario') {
    if (!datos.nombre || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo || '')) return json({ ok: false, error: 'campos' }, 422);
    const n = parseInt(datos.asistentes || '1', 10);
    datos.asistentes = String(Math.min(30, Math.max(1, Number.isFinite(n) ? n : 1)));
  }
  if (!env.APPS_SCRIPT_URL) return json({ ok: false, error: 'config' }, 503);

  try {
    const r = await fetch(env.APPS_SCRIPT_URL, {
      method: 'POST', redirect: 'follow',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...datos, clave: env.FORM_CLAVE || '' }),
    });
    const texto = await r.text();
    let res = {};
    try { res = JSON.parse(texto); } catch { /* respuesta no JSON */ }
    if (!r.ok || res.ok === false) return json({ ok: false, error: 'envio' }, 502);
    return json({ ok: true });
  } catch {
    return json({ ok: false, error: 'red' }, 502);
  }
}

export const onRequest = () => json({ ok: false, error: 'metodo' }, 405);
