// Archivo .ics por reunión, generado en el build (sin JavaScript en el navegador).
// Repetición semanal en hora de Chile, con la definición de zona America/Santiago incluida.
import type { APIRoute, GetStaticPaths } from 'astro';
import { iglesia } from '../../lib/datos';

export const getStaticPaths: GetStaticPaths = () => iglesia.reuniones.map((r) => ({ params: { id: r.id }, props: { r } }));

const pad = (n: number) => String(n).padStart(2, '0');
const DIAS_ICS = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
const escapar = (s: string) => s.replace(/[\;,]/g, (c) => '\\' + c).replace(/\n/g, '\\n');

export const GET: APIRoute = ({ props }) => {
  const r = props.r as (typeof iglesia.reuniones)[number];
  // Primera ocurrencia: el primer día de esa semana a partir del 1 de enero de 2026.
  const d = new Date(Date.UTC(2026, 0, 1));
  while (d.getUTCDay() !== r.dia_semana) d.setUTCDate(d.getUTCDate() + 1);
  const fecha = `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}`;
  const [h, m] = r.hora.split(':');
  const ahora = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
  const lugar = `${iglesia.direccion.texto}, ${iglesia.direccion.comuna}`;
  const duracion = r.principal ? 'PT2H30M' : 'PT2H';
  const lineas = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//CCINT Tiempo Nuevo//Sitio web//ES', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    'BEGIN:VTIMEZONE', 'TZID:America/Santiago',
    'BEGIN:STANDARD', 'DTSTART:19700405T000000', 'TZOFFSETFROM:-0300', 'TZOFFSETTO:-0400', 'TZNAME:-04', 'RRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=1SU', 'END:STANDARD',
    'BEGIN:DAYLIGHT', 'DTSTART:19700906T000000', 'TZOFFSETFROM:-0400', 'TZOFFSETTO:-0300', 'TZNAME:-03', 'RRULE:FREQ=YEARLY;BYMONTH=9;BYDAY=1SU', 'END:DAYLIGHT',
    'END:VTIMEZONE',
    'BEGIN:VEVENT',
    `UID:${r.id}@tiemponuevo`,
    `DTSTAMP:${ahora}`,
    `DTSTART;TZID=America/Santiago:${fecha}T${h}${m}00`,
    `DURATION:${duracion}`,
    `RRULE:FREQ=WEEKLY;BYDAY=${DIAS_ICS[r.dia_semana]}`,
    `SUMMARY:${escapar(`${r.nombre} · ${iglesia.nombre.marca}`)}`,
    `LOCATION:${escapar(lugar)}`,
    `DESCRIPTION:${escapar(`${r.descripcion ?? ''}\n${iglesia.lema}.`)}`,
    `GEO:${iglesia.direccion.lat};${iglesia.direccion.lng}`,
    'END:VEVENT', 'END:VCALENDAR',
  ];
  return new Response(lineas.join('\r\n') + '\r\n', { headers: { 'Content-Type': 'text/calendar; charset=utf-8' } });
};
