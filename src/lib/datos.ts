// Acceso único a los datos de la iglesia. Los componentes leen desde aquí, nunca escriben datos a mano.
import iglesia from '../datos/iglesia.json';

export { iglesia };
export type Reunion = (typeof iglesia.reuniones)[number];

/** Valor de un campo que puede venir como texto simple o como { valor, confirmar }. */
export function valor<T>(campo: T | { valor: T; confirmar?: boolean } | null | undefined): T | null {
  if (campo && typeof campo === 'object' && 'valor' in (campo as object)) return (campo as { valor: T }).valor ?? null;
  return (campo as T) ?? null;
}

/** Ruta interna respetando la subcarpeta de publicación (BASE). */
export function ruta(p = '/'): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  if (p.startsWith('#')) return p;
  return (base + (p.startsWith('/') ? p : '/' + p)).replace(/\/+$/, '') || '/';
}

// null si la iglesia no tiene un correo de contacto en uso (entonces no se muestra en ninguna parte).
export const correo = valor(iglesia.contacto.correo) as string | null;
export const principal = iglesia.reuniones.find((r) => r.principal) ?? iglesia.reuniones[0];
export const transmitidas = iglesia.reuniones.filter((r) => r.transmite);

export const red = (nombre: string) => iglesia.redes.find((r) => r.red === nombre);
export const facebook = red('Facebook')!;
export const instagram = red('Instagram')!;
export const youtube = red('YouTube')!;

const { lat, lng } = iglesia.direccion;
export const mapaUrl = iglesia.direccion.mapa_url;
export const wazeUrl = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
export const mapaEmbed = `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`;

/** «Domingo 10:30 hrs» */
export const horaTexto = (r: Reunion) => `${r.dia} ${r.hora} hrs`;

/** Datos que necesita el navegador para calcular «en vivo» y «próxima reunión». */
export const datosHorario = {
  zona: iglesia.zona_horaria,
  reuniones: iglesia.reuniones.map(({ id, dia, dia_corto, dia_semana, hora, nombre, transmite, principal }) => ({
    id, dia, dia_corto, dia_semana, hora, nombre, transmite: !!transmite, principal: !!principal,
  })),
  antes: iglesia.transmision.minutos_antes_en_vivo,
  duracion: iglesia.transmision.duracion_estimada_min,
};
