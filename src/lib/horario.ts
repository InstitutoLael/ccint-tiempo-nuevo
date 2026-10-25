// Cálculo de «en vivo», próxima reunión y cuenta regresiva, todo en hora de Chile (America/Santiago).
// Sin dependencias: se usa en el navegador y también en el build.

export interface ReunionHorario {
  id: string;
  dia: string;
  dia_corto: string;
  dia_semana: number; // 0 = domingo
  hora: string; // «HH:MM»
  nombre: string;
  transmite: boolean;
  principal: boolean;
}

export interface DatosHorario {
  zona: string;
  reuniones: ReunionHorario[];
  antes: number; // minutos antes del inicio en que ya se considera «en vivo»
  duracion: number; // duración estimada de la transmisión, en minutos
}

const DIAS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** Día de la semana y minuto del día (con segundos) en la zona de la iglesia. */
export function ahoraEn(zona: string, fecha = new Date()) {
  const f = new Intl.DateTimeFormat('en-US', {
    timeZone: zona, hour12: false, weekday: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  const p = Object.fromEntries(f.formatToParts(fecha).map((x) => [x.type, x.value]));
  const hora = Number(p.hour) % 24;
  return { dia: DIAS.indexOf(p.weekday), minutos: hora * 60 + Number(p.minute) + Number(p.second) / 60 };
}

const aMinutos = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

/** Minutos que faltan para cada ocurrencia de las reuniones en los próximos 7 días (negativo = ya empezó hoy). */
function ocurrencias(d: DatosHorario, fecha: Date) {
  const { dia, minutos } = ahoraEn(d.zona, fecha);
  const lista: { r: ReunionHorario; faltan: number }[] = [];
  for (let dias = -1; dias <= 7; dias++) {
    for (const r of d.reuniones) {
      if (r.dia_semana !== (dia + dias + 7) % 7) continue;
      // DECISIÓN: se ignoran los cambios de horario de verano dentro de la ventana (máx. 1 h de error, dos noches al año).
      lista.push({ r, faltan: dias * 1440 + aMinutos(r.hora) - minutos });
    }
  }
  return lista.sort((a, b) => a.faltan - b.faltan);
}

/** Próxima reunión que aún no empieza (opcionalmente solo las transmitidas). */
export function proxima(d: DatosHorario, fecha = new Date(), soloTransmitidas = false) {
  return ocurrencias(d, fecha).find((o) => o.faltan > 0 && (!soloTransmitidas || o.r.transmite)) ?? null;
}

/** Reunión transmitida que está en vivo ahora (desde «antes» minutos previos hasta el fin estimado). */
export function enVivo(d: DatosHorario, fecha = new Date()) {
  return ocurrencias(d, fecha).find((o) => o.r.transmite && o.faltan <= d.antes && o.faltan >= -d.duracion) ?? null;
}
