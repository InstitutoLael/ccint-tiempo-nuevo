# Sitio web · CCINT Tiempo Nuevo

Sitio de la iglesia CCINT Tiempo Nuevo, Calera de Tango. Hecho con la misma identidad visual de la transmisión en vivo: **papel crema** de día y **noche azul** de transmisión.

## Lo que más vas a cambiar (sin saber programar)

Casi todo lo que se edita está en **un solo archivo**: `src/datos/iglesia.json`. Ábrelo, cambia el texto entre comillas y guarda.

| Quiero cambiar… | Dónde, dentro de `iglesia.json` |
|---|---|
| Un horario o el nombre de una reunión | `reuniones` → `hora`, `nombre`, `descripcion` |
| Si una reunión se transmite | `reuniones` → `"transmite": true` o `false` |
| Datos de transferencia | `ofrendas` |
| Correo, Instagram, Facebook, YouTube | `contacto` y `redes` |
| Un ministerio | `ministerios` (nombre, para quién, texto, cuándo) |
| Preguntas frecuentes | `preguntas` (las que tengan `"a": null` no se muestran) |
| Texto de los pastores | `pastores` |
| Pastores generales de CCI | `familia_espiritual` |

Reglas para no romper nada:
- Mantén las comillas `"` y las comas `,` como están.
- Lo marcado `"confirmar": true` todavía está pendiente de verificar (ver `PENDIENTES.md`).

### Cambiar una foto

1. Deja la foto en `src/assets/fotos/` (JPG, idealmente de 2000 px o más de ancho).
2. En `iglesia.json`, escribe el nombre del archivo donde corresponda. Por ejemplo, para los pastores: `"foto": "pastores-2026.jpg"`; para los pastores generales: `familia_espiritual → pastores_generales → foto`.
3. El sitio genera solo las versiones livianas (AVIF, WebP) en todos los tamaños.

Si una foto no existe todavía, el sitio muestra un bloque azul que dice qué foto falta. Nunca se usan fotos de banco de imágenes.

## Ver el sitio en tu computador

Necesitas Node 20 o más reciente.

```sh
npm install        # solo la primera vez
npm run dev        # abre http://localhost:4321/
```

## Publicar en Cloudflare Pages

1. Sube este proyecto a GitHub (el repositorio `ccint-tiempo-nuevo`).
2. En Cloudflare: **Workers & Pages → Create → Pages → Connect to Git** y elige el repositorio.
3. Configuración de compilación:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Variables de entorno: `NODE_VERSION` = `22` y `SITIO` = la dirección pública (por ejemplo `https://ccint-tiempo-nuevo.pages.dev`, o `https://tiemponuevo.cl` cuando tengan dominio).
4. Desde ese momento, cada cambio que se sube a `main` se publica solo.
5. Dominio propio: en el proyecto de Cloudflare, **Custom domains → Set up a domain**. Después cambia la variable `SITIO` y vuelve a publicar, para que buscadores y redes usen la dirección correcta.

`public/_headers` define la caché y cabeceras de seguridad. La página 404 se usa automáticamente.

## Cómo está hecho (para quien programe)

- [Astro](https://astro.build) estático + CSS propio. Sin librerías de interfaz ni de animación.
- `src/estilos/tokens.css`: colores, tipos, espacios, sombras y movimiento. **Fuente única**: no inventar valores.
- `src/estilos/base.css`: utilidades (`.kicker`, `.display`, `.acento`, `.contorno`, `.modo-papel`, `.modo-noche`) y componentes.
- `src/componentes/`: Header, Footer, TarjetaHorario, PildoraVivo, Placa, DatosOfrenda, Cita, Mapa, Reproductor, Foto…
- `src/lib/horario.ts`: «en vivo» y próxima reunión en hora de Chile, sin servidor.
- `src/lib/cliente.ts`: el único script del sitio (aparición al hacer scroll, menú, copiar, cuenta regresiva, mapa y video al hacer clic, formulario).
- `src/pages/calendario/[id].ics.ts`: archivos de calendario semanales con zona America/Santiago.
- `/guia`: muestra todos los componentes (no aparece en buscadores).
- El mapa de «Cómo llegar» está dibujado con datos de OpenStreetMap (`src/assets/mapa/templo.svg`); Google Maps solo se carga si la persona lo pide.
- Las imágenes para redes sociales están en `public/og/`.
