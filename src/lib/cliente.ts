// Único script del sitio (JS vanilla, sin librerías).
import { ahoraEn, enVivo, proxima, type DatosHorario } from './horario';

const $$ = <T extends Element = HTMLElement>(s: string, raiz: ParentNode = document) => [...raiz.querySelectorAll<T>(s)];
const datos: DatosHorario = JSON.parse(document.getElementById('datos-horario')?.textContent || '{}');

/* ---------- Aparición «rv» al entrar en pantalla ---------- */
const io = new IntersectionObserver((entradas) => {
  for (const e of entradas) if (e.isIntersecting) { e.target.classList.add('visto'); io.unobserve(e.target); }
}, { threshold: 0.2, rootMargin: '0px 0px -5% 0px' });
$$('.rv, .barrido').forEach((el) => io.observe(el));

/* ---------- Header: fondo papel al bajar ---------- */
const header = document.querySelector<HTMLElement>('[data-header]');
if (header?.classList.contains('sobre-noche')) {
  const revisar = () => header.classList.toggle('con-fondo', scrollY > 40);
  addEventListener('scroll', revisar, { passive: true });
  revisar();
}

/* ---------- Menú móvil: Esc, foco atrapado, bloqueo de scroll ---------- */
const menu = document.querySelector<HTMLElement>('[data-menu]');
const abrir = document.querySelector<HTMLButtonElement>('[data-menu-abrir]');
if (menu && abrir) {
  const enfocables = () => $$<HTMLElement>('a[href], button', menu);
  const cerrar = () => {
    menu.hidden = true; menu.classList.remove('abierto'); document.body.classList.remove('bloqueado');
    abrir.setAttribute('aria-expanded', 'false'); abrir.focus();
  };
  abrir.addEventListener('click', () => {
    menu.hidden = false; requestAnimationFrame(() => menu.classList.add('abierto'));
    document.body.classList.add('bloqueado'); abrir.setAttribute('aria-expanded', 'true');
    menu.querySelector<HTMLElement>('[data-menu-cerrar]')?.focus();
  });
  menu.querySelector('[data-menu-cerrar]')?.addEventListener('click', cerrar);
  menu.addEventListener('click', (e) => { if ((e.target as Element).closest('nav a')) cerrar(); });
  menu.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') return cerrar();
    if (e.key !== 'Tab') return;
    const f = enfocables(); const primero = f[0]; const ultimo = f[f.length - 1];
    if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
  });
}

/* ---------- En vivo, próxima reunión y cuenta regresiva ---------- */
const pad = (n: number) => String(Math.floor(n)).padStart(2, '0');
function actualizarEstado() {
  if (!datos.reuniones) return;
  const ahora = new Date();
  const vivo = enVivo(datos, ahora);
  const proxTx = proxima(datos, ahora, true);
  const prox = proxima(datos, ahora);
  const estado = vivo ? 'en-vivo' : 'proximo';
  document.documentElement.dataset.vivo = estado;
  for (const p of $$('[data-vivo]')) {
    p.dataset.estado = estado;
    const t = p.querySelector('[data-vivo-texto]');
    if (t) t.textContent = vivo ? 'En vivo' : proxTx ? `Próximo: ${proxTx.r.dia_corto} ${proxTx.r.hora}` : '';
  }
  for (const el of $$('[data-solo-vivo]')) el.hidden = !vivo;
  for (const el of $$('[data-solo-proximo]')) el.hidden = !!vivo;
  for (const t of $$('[data-reunion]')) {
    const et = t.querySelector<HTMLElement>('[data-proxima]');
    if (et) et.hidden = !(prox && prox.r.id === t.dataset.reunion);
  }
  for (const el of $$('[data-proxima-texto]')) if (prox) el.textContent = `${prox.r.dia} ${prox.r.hora} hrs`;
  for (const el of $$('[data-proxima-principal]')) {
    const p = ocurrenciaPrincipal(ahora);
    if (p) el.textContent = p;
  }
  return proxTx;
}
function ocurrenciaPrincipal(ahora: Date) {
  const sig = proxima({ ...datos, reuniones: datos.reuniones.filter((r) => r.principal) }, ahora);
  if (!sig) return null;
  const hoy = sig.r.dia_semana === ahoraEn(datos.zona, ahora).dia && sig.faltan < 1440;
  return hoy ? `hoy a las ${sig.r.hora}` : `este ${sig.r.dia.toLowerCase()} a las ${sig.r.hora}`;
}

const cuenta = document.querySelector<HTMLElement>('[data-cuenta]');
function tic() {
  const proxTx = actualizarEstado();
  if (cuenta && proxTx) {
    const s = Math.max(0, proxTx.faltan * 60);
    const d = Math.floor(s / 86400), h = (s % 86400) / 3600, m = (s % 3600) / 60, seg = s % 60;
    cuenta.querySelector('[data-dias]')!.textContent = d > 0 ? `${d} ${d === 1 ? 'día' : 'días'} · ` : '';
    cuenta.querySelector('[data-hms]')!.textContent = `${pad(h)}:${pad(m)}:${pad(seg)}`;
    cuenta.setAttribute('aria-label', `Faltan ${d ? d + ' días, ' : ''}${Math.floor(h)} horas y ${Math.floor(m)} minutos`);
  }
}
tic();
setInterval(tic, cuenta ? 1000 : 30000);

/* ---------- Copiar al portapapeles ---------- */
async function copiarTexto(t: string) {
  try { await navigator.clipboard.writeText(t); return true; } catch {
    const a = Object.assign(document.createElement('textarea'), { value: t });
    a.setAttribute('readonly', ''); a.style.cssText = 'position:fixed;opacity:0';
    document.body.append(a); a.select();
    const ok = document.execCommand('copy'); a.remove(); return ok;
  }
}
for (const b of $$<HTMLButtonElement>('[data-copiar]')) {
  b.addEventListener('click', async () => {
    if (!(await copiarTexto(b.dataset.copiar!))) return;
    const txt = b.querySelector('[data-texto]') ?? b.firstChild!;
    const antes = txt.textContent;
    b.dataset.ok = ''; txt.textContent = 'Copiado';
    const aviso = b.closest('.datos-ofrenda')?.querySelector('[data-aviso-copia]') ?? document.querySelector('[data-aviso-copia]');
    if (aviso) aviso.textContent = b.dataset.aviso ?? `${b.dataset.etiqueta ?? "Texto"} copiado`;
    setTimeout(() => { delete b.dataset.ok; txt.textContent = antes; }, 1800);
  });
}

/* ---------- Fachadas: reproductor y mapa ---------- */
for (const r of $$('[data-reproductor]')) {
  r.querySelector('.portada')?.addEventListener('click', () => {
    const f = Object.assign(document.createElement('iframe'), {
      src: r.dataset.reproductor!, title: 'Transmisión en vivo de CCINT Tiempo Nuevo', allowFullscreen: true,
    });
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    r.replaceChildren(f); f.focus();
  }, { once: true });
}
for (const m of $$('[data-mapa]')) {
  m.querySelector('[data-mapa-cargar]')?.addEventListener('click', (e) => {
    const f = Object.assign(document.createElement('iframe'), { src: m.dataset.mapa!, title: 'Mapa interactivo de Google Maps', loading: 'lazy' });
    f.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
    m.querySelector('[data-mapa-lienzo]')!.replaceChildren(f);
    (e.currentTarget as HTMLElement).remove();
  }, { once: true });
}

/* ---------- Formulario de oración ---------- */
const form = document.querySelector<HTMLFormElement>('[data-oracion]');
if (form) {
  const motivo = form.querySelector<HTMLTextAreaElement>('textarea')!;
  const error = form.querySelector<HTMLElement>('[data-error-motivo]')!;
  const estado = form.querySelector<HTMLElement>('[data-estado-form]')!;
  const boton = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const exito = document.querySelector<HTMLElement>('[data-oracion-exito]');
  const contador = form.querySelector<HTMLElement>('[data-contador]');
  motivo.addEventListener('input', () => {
    if (contador) contador.textContent = `${motivo.value.length} de ${motivo.maxLength} caracteres`;
    if (motivo.value.trim()) { motivo.removeAttribute('aria-invalid'); error.hidden = true; }
  });
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!motivo.value.trim()) {
      motivo.setAttribute('aria-invalid', 'true'); error.hidden = false; motivo.focus(); return;
    }
    if ((form.elements.namedItem('sitio_web') as HTMLInputElement)?.value) return; // trampa antispam
    const fd = new FormData(form);
    const endpoint = form.dataset.endpoint;
    const texto = [
      'Petición de oración',
      `Nombre: ${fd.get('nombre') || '(sin nombre)'}`,
      `Contacto: ${fd.get('contacto') || '(no indicó)'}`,
      `Quiere que lo contacten: ${fd.get('quiere_contacto') ? 'Sí' : 'No'}`,
      `Confidencial (solo pastores): ${fd.get('confidencial') ? 'Sí' : 'No'}`,
      '', String(fd.get('motivo')),
    ].join('\n');
    if (!endpoint) {
      // DECISIÓN: la iglesia no usa correo ni tiene servidor. Se copia la petición y se abre
      // un mensaje directo de Instagram para que la persona solo tenga que pegarla.
      const copiado = await copiarTexto(texto);
      window.open(form.dataset.mensaje, '_blank', 'noopener');
      estado.textContent = copiado
        ? 'Copiamos tu petición. Se abrió Instagram: pégala en el mensaje y envíala.'
        : 'Se abrió Instagram. Copia tu petición y envíala por mensaje directo.';
      return;
    }
    boton.disabled = true; boton.dataset.enviando = '';
    estado.textContent = 'Enviando petición…';
    try {
      const r = await fetch(endpoint, { method: 'POST', body: fd, headers: { Accept: 'application/json' } });
      if (!r.ok) throw new Error();
      form.hidden = true;
      if (exito) { exito.hidden = false; exito.focus(); }
    } catch {
      estado.textContent = 'No pudimos enviar. Intenta otra vez o escríbenos por mensaje directo a nuestro Instagram.';
    } finally {
      boton.disabled = false; delete boton.dataset.enviando;
    }
  });
}
