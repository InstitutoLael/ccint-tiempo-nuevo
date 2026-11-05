// Evento único del aniversario (no se repite), en hora de Chile.
import type { APIRoute } from 'astro';
import { iglesia } from '../../lib/datos';

const escapar = (s: string) => s.replace(/[\;,]/g, (c) => '\\' + c).replace(/\n/g, '\\n');

export const GET: APIRoute = () => {
  const a = iglesia.aniversario;
  // a.inicio = 2026-12-05T19:00:00-03:00 → hora local 20261205T190000
  const [f, h] = a.inicio.split('T');
  const local = `${f.replace(/-/g, '')}T${h.slice(0, 5).replace(':', '')}00`;
  const ahora = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
  const lugar = `${iglesia.direccion.texto}, ${iglesia.direccion.comuna}`;
  const hh = Math.floor(a.duracion_min / 60), mm = a.duracion_min % 60;
  const lineas = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//CCINT Tiempo Nuevo//Sitio web//ES', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    'BEGIN:VTIMEZONE', 'TZID:America/Santiago',
    'BEGIN:STANDARD', 'DTSTART:19700405T000000', 'TZOFFSETFROM:-0300', 'TZOFFSETTO:-0400', 'TZNAME:-04', 'RRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=1SU', 'END:STANDARD',
    'BEGIN:DAYLIGHT', 'DTSTART:19700906T000000', 'TZOFFSETFROM:-0400', 'TZOFFSETTO:-0300', 'TZNAME:-03', 'RRULE:FREQ=YEARLY;BYMONTH=9;BYDAY=1SU', 'END:DAYLIGHT',
    'END:VTIMEZONE',
    'BEGIN:VEVENT',
    `UID:aniversario-${f}@iglesiatiemponuevo.cl`,
    `DTSTAMP:${ahora}`,
    `DTSTART;TZID=America/Santiago:${local}`,
    `DURATION:PT${hh}H${mm ? mm + 'M' : ''}`,
    `SUMMARY:${escapar(`${a.titulo} · con el ${a.invitado.titulo} ${a.invitado.nombre}`)}`,
    `LOCATION:${escapar(lugar)}`,
    `DESCRIPTION:${escapar(`«${a.lema}» (${a.lema_cita}).\nDetalles: https://iglesiatiemponuevo.cl/aniversario`)}`,
    'URL:https://iglesiatiemponuevo.cl/aniversario',
    `GEO:${iglesia.direccion.lat};${iglesia.direccion.lng}`,
    'BEGIN:VALARM', 'TRIGGER:-PT3H', 'ACTION:DISPLAY', `DESCRIPTION:${escapar(a.titulo)}`, 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR',
  ];
  return new Response(lineas.join('\r\n') + '\r\n', { headers: { 'Content-Type': 'text/calendar; charset=utf-8' } });
};
