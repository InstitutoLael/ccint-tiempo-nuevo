# Registro de cambios · Sitio CCINT Tiempo Nuevo

> **Para el agente de IA que continúe este trabajo.** Este documento resume todo lo hecho el 25-10-2026 al rehacer el sitio. Léelo junto con `BRIEF.md` (especificación original, está en el paquete `~/Downloads/web-tiempo-nuevo/`), `README.md` y `PENDIENTES.md` de este repositorio. Si algo de aquí contradice al brief, **manda este documento**: son decisiones posteriores tomadas con el cliente.

---

## 1. Contexto

- **Cliente:** iglesia CCINT Tiempo Nuevo, Calera de Tango, Chile. CCINT = Centro Cristiano Internacional.
- **Punto de partida:** existía un sitio anterior en este mismo repositorio (`~/ccint-tiempo-nuevo`): HTML generado con `build.mjs` desde `data/content.json`, con GSAP/Lenis/SplitText, fuentes Archivo/Figtree/Instrument Serif, concepto «noche → amanecer» en una sola página y arcos rojo/azul como firma gráfica.
- **Encargo:** fusionar ese sitio con un paquete nuevo de identidad (`BRIEF.md`, `identidad/tokens.css`, `identidad/identidad.html`, `contenido/iglesia.json`, logos, QR, fuentes, `referencias/`), conservar los textos y datos útiles del sitio anterior y reemplazar todo el estilo (BRIEF §12.1).
- **Respaldo del sitio anterior:** `~/ccint-tiempo-nuevo-respaldo-2026-10-25` (copia completa con `.git`). También está en el historial git (commit `a5241e0`).
- **Estado de git:** nada commiteado ni subido. Todos los cambios están en el árbol de trabajo.

---

## 2. Decisiones del cliente (no revertir)

1. **Pastores:** se presentan como **«Pastor David Núñez A.»** y **«Pastora Rosita Jara C.»**. Nunca «José David» ni «Rosa Elena» (aunque así aparecían en el sitio anterior). La «A.» es de Álvarez, pero solo se pone la inicial.
2. **Pastores generales de CCI:** **Apóstol Billy Bunster** y **Pastora Claudia Bunster**. Fundaron CCI en 1999 (fuente: ccint.cl/nuestra-iglesia/equipo/pastores/).
3. **No mencionar al Apóstol Sergio Enríquez** ni a «Ministerios Ebenezer» (venían en el sitio anterior como cobertura).
4. **Nunca usar «iglesia madre».** El cliente lo considera teológicamente incorrecto («se ve como Dios madre»). Se usa «Somos parte de CCI» o «familia de iglesias». Evitar también «iglesia hija».
5. **La iglesia ya NO tiene WhatsApp.** Se eliminó todo rastro (el sitio anterior usaba +56 9 6393 8057 y un selector de motivos por WhatsApp). El contacto es por **mensaje directo a Instagram o Facebook**, o por correo.
6. **Facebook oficial:** `https://www.facebook.com/iglesia1tiempo1nuevo` (el sitio anterior tenía un enlace a un video).
7. **Datos bancarios:** confirmados, se muestran como texto copiable.
8. **Duración del culto:** cerca de **dos horas y media**.
9. **Bautismos:** más o menos **una vez al año**.
10. **Hosting:** **Cloudflare Pages** (todavía sin publicar y sin dominio pagado). Se quitó la publicación en GitHub Pages.
11. **Ministerios reales** (lista cerrada, reemplaza la del sitio anterior):
    - Escuela Bíblica (como escuela dominical, niños de **5 a 9 años**)
    - Preadolescentes
    - Adolescentes
    - Jóvenes (hacen **cultos de jóvenes algunos viernes**, ocasionales)
    - Mujeres
    - Varones
    - Matrimonios (cultos **muy de vez en cuando**)
    - **Danza «Exaltarte»** (tiene logo propio, aún no entregado)
    - Servidores
    - Se eliminaron los del sitio anterior que el cliente no nombró: Intercesión, Evangelismo, Discipulado, Área Social, Emprendedores, Cuna Profética.
12. **Fotos de los pastores:** se van a cambiar. Mientras tanto se usa la foto antigua.
13. **Correo `igltiemponuevo@gmail.com`:** existe pero **no se usa** → no se publica en ninguna parte. `contacto.correo.valor` es `null`; si algún día lo usan, basta con ponerlo ahí y vuelve a aparecer (footer, contacto, JSON-LD).
14. **Viernes 20:00 = «Reunión general»**: discipulado para toda la iglesia, **no se transmite**.
15. **Horarios de ministerios confirmados:** Escuela Bíblica (5 a 9 años) y Preadolescentes (9 a 12 años) los domingos durante el culto · Jóvenes y Adolescentes (12 a 17 años) viernes por medio a las 20:00, juntos · Mujeres los lunes a las 18:00 · Varones sábados por medio a las 18:00 · Danza Exaltarte: reflexión en grupo los martes y ensayos sábados por medio a las 10:00.
16. **Hay estacionamiento.**
17. **Cómo llegar:** el cliente pidió indicaciones y sugirió fotos de Google. **No se usaron fotos de Google** (derechos de autor); se dibujó un mapa propio con datos libres de OpenStreetMap.

---

## 3. Stack y estructura nueva

- **Astro 5** (estático) + TypeScript + CSS propio. Sin librerías de interfaz ni de animación. Un solo script cliente en JS vanilla (~3 KB gzip).
- Se eliminaron del repo: `index.html`, `404.html`, `build.mjs`, `css/`, `js/` (incluye GSAP, Lenis, SplitText), `fonts/`, `data/`, `img/`, `robots.txt`, `sitemap.xml`, `site.webmanifest`, `.nojekyll`.

```
astro.config.mjs        site = env SITIO (por defecto https://ccint-tiempo-nuevo.pages.dev), base = env BASE (por defecto /)
package.json            scripts: dev, build, preview. Única dependencia: astro
.nvmrc                  22
README.md               Guía para la iglesia: cómo editar, cambiar fotos, ver local y publicar en Cloudflare
PENDIENTES.md           Lo que falta confirmar o conseguir
CAMBIOS.md              Este documento
public/
  _headers              Cloudflare: caché 1 año en /_astro/*, cabeceras de seguridad, noindex en /guia, .ics como text/calendar
  favicon.svg, favicon-16.png, favicon-32.png, apple-touch-icon.png, icon-192.png, icon-512.png
  site.webmanifest      theme_color #0C1D42, background_color #ECE8DF
  logo/                 isotipos SVG (blanco, color, azul) sin metadatos c2pa + PNG + logo completo
  qr/                   qr-mapa.png, qr-ofrendas.png
  og/                   inicio.jpg, visitanos.jpg, en-vivo.jpg, general.jpg (1200×630)
  fuentes/              solo las licencias OFL (las woff2 están en src/assets/fuentes)
src/
  datos/iglesia.json    ÚNICA fuente de datos (ver §4)
  estilos/tokens.css    copia de identidad/tokens.css con rutas de fuentes a ../assets/fuentes/
  estilos/base.css      reset, utilidades y TODOS los estilos de componentes
  assets/fuentes/       Anton, Montserrat 400–800 (+500 itálica), Playfair Display 500/600 itálica (woff2, auto-alojadas)
  assets/fotos/         fotos procesadas por Astro (AVIF/WebP/JPG con srcset)
  assets/mapa/templo.svg  mapa dibujado con OpenStreetMap
  assets/logo-completo-color.png  para optimizar con <Image> (el PNG original pesa 889 KB)
  lib/datos.ts          lectura del JSON, helpers (ruta(), valor(), enlaces de mapa/Waze, redes)
  lib/horario.ts        cálculo de «en vivo», próxima reunión (America/Santiago), sin dependencias
  lib/cliente.ts        el único script del navegador
  layouts/Base.astro    <head> con SEO, Open Graph, JSON-LD Church, precarga de 2 fuentes
  componentes/          ver §6
  pages/                ver §7
```

---

## 4. Datos: `src/datos/iglesia.json`

Se fusionó el JSON del brief con datos del sitio anterior y las correcciones del cliente. Los campos con `"confirmar": true` siguen pendientes.

| Bloque | Qué contiene / qué cambió |
|---|---|
| `nombre` | Marca, nombre corto, nombre legal (pendiente), comuna, región |
| `pastores` | `presentacion`: «Pastores David Núñez A. y Rosita Jara C.»; `personas` con rol; `foto: "pastores.jpg"` (**temporal**, del sitio anterior); `texto` (pendiente); `cita`: «Dios viene a restituir nuestra identidad de hijos.» del Pastor David Núñez A. (rescatada del sitio anterior) |
| `familia_espiritual` | Red CCI, `red_url` ccint.cl, lema «Creemos en nuevos comienzos», `fundacion: 1999`, `pastores_generales` (Apóstol Billy Bunster y Pastora Claudia Bunster, con foto e Instagram), `foto_predicando`, `texto` |
| `direccion` | Texto «Avenida Calera de Tango, paradero 7 ½»; `mapa_url` de Google Maps del sitio anterior (`maps.app.goo.gl/btfzkVHF91SRTCpW9`); `qr_url`; **lat/lng -33.6298654, -70.7647277** (centroide del templo en OpenStreetMap, donde figura como «Centro Cristiano Internacional Tiempo Nuevo»); `como_llegar` (micro, auto, referencia, estacionamiento «Sí, hay estacionamiento.») |
| `reuniones` | Viernes 20:00 «Reunión general» (discipulado para toda la iglesia; `transmite: false`); Domingo 09:00 «Oración»; Domingo 10:30 «Culto» (`principal`, `transmite: true`). Cada una con `dia_corto` y `descripcion` |
| `duracion_culto` | «Cerca de dos horas y media» |
| `transmision` | Plataforma principal Facebook; URL de Facebook; canal de YouTube `UCWFYvVktvmoRO_n-bYv8DFw` (del sitio anterior); `minutos_antes_en_vivo: 10`; `duracion_estimada_min: 150` |
| `redes` | Facebook, Instagram (@ccint_tiemponuevo), YouTube, con `mensaje_url` (`m.me/iglesia1tiempo1nuevo`, `ig.me/m/ccint_tiemponuevo`) |
| `contacto` | `correo.valor: null` (el correo existe pero no se usa); `formulario_endpoint: null`. **Sin WhatsApp** |
| `ofrendas` | BancoEstado · Cuenta Corriente · Iglesia Tiempo Nuevo · RUT 65.171.004-9 · N° 036700019696 · iei.tiemponuevo@gmail.com · QR · Proverbios 3:9-10 |
| `ministerios` | Los 9 del cliente, con `para` (edades confirmadas), `texto`, `cuando` (confirmado salvo Matrimonios, «algunas veces al año») y `logo` (Exaltarte, pendiente) |
| `creemos` | Misión + 5 afirmaciones (Palabra, Jesús, presencia, Espíritu Santo, familia), basadas en los pilares del sitio anterior. Pendiente de validar |
| `historia` | 2 párrafos genéricos verídicos; año de fundación y aniversario pendientes |
| `primera_vez` | 5 pasos (Llegas, Alabamos, Escuchamos la Palabra, Oramos, Compartimos) |
| `preguntas` | Preguntas frecuentes del sitio anterior y del brief, incluida «¿Hay estacionamiento?» → «Sí». Las que tengan `"a": null` no se publican |
| `primer_paso` | Rescatado del sitio anterior («Acepté a Jesús»): qué significa, bautismo (ajustado a «una vez al año»), crecer acompañado (antes «Discipulado»), oración. Versículos RV1960 |
| `versiculos` | Lema: Isaías 43:19 (pendiente de confirmar), versión Reina-Valera 1960 |
| `seo` | Título, descripción, dominio pendiente |

---

## 5. Identidad aplicada (BRIEF §3 y §4)

- Solo tokens de `tokens.css`. El único hex fuera de tokens es el `theme-color` del `<meta>`.
- Rojo solo en el logo y en el punto «EN VIVO». Se eliminaron los arcos rojo/azul y el tono «carmesí» del sitio anterior.
- Fuentes: Anton (titulares en mayúsculas), Montserrat (todo lo demás), Playfair Display itálica (frases). Auto-alojadas; se precargan solo Anton 400 y Montserrat 500.
- Alternancia papel ↔ noche en todas las páginas. Nunca dos secciones noche seguidas, salvo hero + franja de vivo en En vivo.
- Firmas usadas:
  - kicker con línea degradada y numeración editorial («01 · Te esperamos»)
  - par titular Anton + frase Playfair
  - una palabra en contorno por página
  - grano de papel
  - cielo noche con marca de agua del isotipo (deriva lenta de 30 s)
  - placa «lower third» con chip azul y vidrio con brillo
  - píldora EN VIVO con latido
  - marco de transmisión con acento celeste
  - tarjetas de horario con hora gigante
  - rayos de luz en hero y cierres
- Animaciones: aparición «rv» (IntersectionObserver, una vez), letras del hero en cascada (con `aria-label` en el contenedor), barrido tipo TV en las placas. Todo se anula con `prefers-reduced-motion`.
- Sin emojis, sin fotos de stock, sin grillas de 3 tarjetas con íconos, sin «Descubre más».

---

## 6. Componentes (`src/componentes/`)

| Componente | Función |
|---|---|
| `Header` | Fijo, 64/76 px. Transparente sobre hero noche y papel al bajar 40 px. Nav: Visítanos · En vivo · Nosotros · Ofrendas · Contacto + «Cómo llegar». Píldora EN VIVO solo si hay transmisión. Menú móvil a pantalla completa (modo noche, Anton 44 px, cascada, horarios, redes, botón), con Esc, foco atrapado y bloqueo de scroll |
| `Footer` | Noche profunda. 4 columnas: firma vertical + «aquí hay lugar para ti», reuniones, dirección, redes + «Escríbenos por Instagram» (el correo solo aparece si `contacto.correo` tiene valor). Franja inferior con Ministerios, Acepté a Jesús, Ofrendas y Contacto |
| `Firma` | Logo compacto horizontal/vertical. Variante «doble» (isotipo color/blanco según fondo) |
| `EncabezadoSeccion` | Kicker + titular + frase, con slot `titulo` para contornos o saltos de línea |
| `TarjetaHorario` | Día, hora gigante, nombre, descripción opcional, etiqueta «PRÓXIMA» (la pone el script) y enlace «Agregar a mi calendario» (.ics estático) |
| `PildoraVivo` | Estado `en-vivo` / `proximo` calculado en build y corregido en el navegador cada 30 s |
| `Placa` | Lower third. Variante `chica` |
| `DatosOfrenda` | `<dl>` con botón «Copiar» por fila **dentro del `<dd>`** (requisito de accesibilidad), «Copiar todos los datos», aviso `aria-live` («RUT copiado», «Todos los datos copiados»). `<wbr>` antes de la @ del correo |
| `Cita` | Versículo con referencia en kicker. Variantes `grande` y `centro` |
| `Mapa` | SVG propio de OpenStreetMap con la avenida, los paraderos 7 y 8 y el pin «TIEMPO NUEVO». Botones Google Maps y Waze. Google Maps embebido solo al pulsar «Cargar mapa interactivo». Atribución OSM |
| `Reproductor` | Fachada 16:9 con foto del escenario, botón play y placa. Al hacer clic inserta `youtube-nocookie.com/embed/live_stream?channel=ID` |
| `Foto` | Busca el archivo en `src/assets/fotos/` por nombre (desde el JSON) y genera `<picture>` AVIF/WebP/JPG con srcset. Si no existe, muestra un bloque azul «Foto: …» con lo que falta (nunca stock) |
| `Icono` | Set mínimo de trazo 2 px: play, pin, calendario, reloj, copiar, check, flecha, cerrar, correo, mensaje, facebook, instagram, youtube, externo |
| `MarcaAgua`, `Rayos`, `Marco` | Decoración (todas `aria-hidden`) |

---

## 7. Páginas (`src/pages/`)

| Ruta | Contenido |
|---|---|
| `/` | Hero noche con foto del escenario en duotono, letras en cascada «AQUÍ HAY LUGAR» / *para ti*, lead con la próxima reunión principal en vivo («hoy a las 10:30» o «este domingo…»), botones (el secundario pasa a «EN VIVO · Ver ahora» durante la transmisión) y placa «Próxima reunión» (escritorio). Siguen: 01 Reuniones (papel), 02 Somos familia (foto del pastor que sangra a la izquierda), 03 Transmisión (noche, «CONÉCTATE» en contorno, reproductor), 04 Ministerios (lista editorial con los 5 primeros), cita Isaías 43:19 (noche) y 05 Ofrendas (papel-2, con QR). La sección «Palabra destacada» (Fase 2) se omitió y se reemplazó por Ministerios para no juntar dos secciones noche |
| `/visitanos` | Intro con atajos; 01 Horarios con .ics; 02 Cómo llegar (noche: dirección en Anton, indicaciones en micro y auto, mapa, QR en escritorio); 03 Tu primera vez (línea de tiempo de 5 pasos, cabecera fija al hacer scroll en escritorio); 04 Preguntas (`<details>`); cierre «¿TE ANIMAS ESTE DOMINGO?». JSON-LD Church |
| `/en-vivo` | Cabecera noche con píldora grande y «ESTAMOS EN VIVO» o «PRÓXIMA TRANSMISIÓN» + cuenta regresiva `días · HH:MM:SS`; reproductor; botones Facebook/YouTube; horarios transmitidos; ayuda «¿Se cortó la transmisión?» |
| `/nosotros` | Intro; 01 Historia (columnas con capitular y foto del escenario); 02 Qué creemos (noche, números en contorno); 03 Pastores (foto temporal, placa, nombres, texto, cita); 04 «Somos parte de CCI» (texto, retratos del Apóstol Billy Bunster y la Pastora Claudia Bunster, foto chica del apóstol predicando con placa); cierre «AQUÍ HAY LUGAR / para ti» |
| `/ministerios` | Lista editorial numerada de los 9 ministerios + invitación a escribir por Instagram. Página nueva (en el brief era Fase 2) |
| `/ofrendas` | Datos copiables + logo + QR + «¡Dios te bendiga!» (como `referencias/12`); Proverbios 3:9-10; nota de que la ofrenda es voluntaria; comprobantes y dudas por Instagram o Facebook |
| `/contacto` | Contacto directo (Instagram y Messenger; el correo solo si existe) y formulario de oración `#oracion` (ver §8) |
| `/primer-paso` | «Acepté a Jesús», rescatado del sitio anterior: 3 pasos con versículos y oración |
| `/404` | «SEÑAL PERDIDA» / *pero aquí hay lugar para ti* |
| `/guia` | Todos los componentes (noindex y bloqueada en robots). El brief pedía `/_guia`, pero Astro no publica rutas que empiezan con «_» |
| `/calendario/{viernes,oracion-domingo,culto-domingo}.ics` | Generados en el build: RRULE semanal, VTIMEZONE America/Santiago, duración 2 h 30 min (culto) o 2 h |
| `/robots.txt`, `/sitemap.xml` | Generados con la URL de `SITIO` |

---

## 8. Funcionalidad (`src/lib/`)

- **En vivo** (`horario.ts`): en vivo desde 10 minutos antes hasta 150 minutos después del inicio de una reunión con `transmite: true`, en hora de Chile. Probado:
  - domingo 10:25 y 13:00 → en vivo
  - domingo 13:10 → próximo
  - viernes 19:55 → próximo (el viernes no se transmite)
  - invierno (UTC-4) → funciona
  - Se ignoran los cambios de horario de verano dentro de la ventana de 7 días (máximo 1 h de error dos noches al año; está documentado con `// DECISIÓN:`).
- **Copiar:** `navigator.clipboard` con respaldo `execCommand`. Botón verde «Copiado» durante 1,8 s y aviso `aria-live`.
- **Formulario de oración:** validación propia con `aria-invalid` y error asociado; contador de 1000 caracteres; honeypot `sitio_web`; casillas «Quiero que me contacten» y «Confidencial (solo pastores)».
  - **Sin servidor (`formulario_endpoint: null`):** copia la petición al portapapeles y abre un mensaje directo de Instagram (`ig.me/m/ccint_tiemponuevo`). El botón dice «Enviar por Instagram» y el estado avisa «Copiamos tu petición… pégala en el mensaje». Antes usaba `mailto:`, pero el correo no se usa. Probado en Chrome: copia bien y abre Instagram.
  - **Con endpoint (Formspree, una función de Cloudflare, etc.):** hace `fetch` POST, muestra **GRACIAS** / *estaremos orando por ti*, o un error con el correo.
- **Fachadas:** el video de YouTube y Google Maps solo se cargan al hacer clic.
- **Header, menú, aparición y cuenta regresiva:** en `cliente.ts`.

---

## 9. Fotos y recursos gráficos

| Archivo | Origen | Estado |
|---|---|---|
| `escenario.jpg` | Recorte de `referencias/01-transmision-culto-banner.jpg` (790 px), sin gráficos ni personas | Temporal. Se usa en hero, reproductor e historia |
| `pastor-predicando.jpg` | Sitio anterior (`img/hero.jpg`); se recortaron 40 px a la derecha porque traía la flecha del carrusel de Instagram | Inicio, sección «Somos familia» |
| `pastores.jpg` | Sitio anterior (605 px) | **Temporal**, el cliente la va a cambiar |
| `apostol-billy-bunster.jpg`, `pastora-claudia-bunster.jpg` | `ccint.cl/wp-content/uploads/2020/07/pastor-billy-ccint.png` y `pastora-claudia-ccint.png`. Venían en máscara circular transparente: se quitó el canal alfa (la foto completa estaba debajo) y 8 px de borde blanco → 704 px | **Pedir permiso a CCI** |
| `apostol-billy-predicando.jpg` | Recorte de 288×360 de la miniatura de YouTube `67vSmVDtTFU` («Desenmascarando al enemigo»), sin el texto ni el logo | Solo en tamaño chico |
| *(no usada)* `billybunster.com/assets/billy-5.png` | — | Descartada: al frente hay caras de adolescentes reconocibles |
| `assets/mapa/templo.svg` | Calles de la API de OpenStreetMap (bbox alrededor del templo), proyectadas a SVG 1200×800 con `preserveAspectRatio slice` | Con atribución © OSM |
| Favicon e íconos | Isotipo blanco sobre `#0C1D42`, radio 22 % | Listo |
| `public/og/*.jpg` | Generadas con Chrome sin interfaz: cielo noche, marca de agua, kicker, titular Anton, frase Playfair, firma arriba a la derecha | Listo |

---

## 10. Calidad verificada

- **Lighthouse móvil:** 98–99 rendimiento / 100 accesibilidad / 100 buenas prácticas / 100 SEO en todas las páginas. LCP alrededor de 2,0–2,3 s y CLS ≤ 0,04 (medido en local).
- **Sin scroll horizontal** a 320 px en ninguna página.
- **JS total:** ~3 KB gzip.
- **Probado en Chrome:** menú móvil (foco, Esc, bloqueo), «Copiar todos los datos» (portapapeles correcto), validación del formulario.
- **Revisión visual** a 390 px y 1440 px de todas las páginas.
- **Errores corregidos durante la revisión:**
  - `[hidden]` no ocultaba los botones (se agregó `display: none !important`)
  - la tilde de las palabras en contorno chocaba con la línea de arriba
  - la firma vertical del footer se desarmaba
  - el correo de ofrendas se cortaba en «co / m»
  - las etiquetas del mapa quedaban sobre la avenida
  - el sticky no funcionaba por `overflow: hidden` (ahora `overflow: clip`)
  - la marca de agua con carga diferida empeoraba el LCP
  - el botón dentro de `<dl>` bajaba la accesibilidad a 96
  - **las placas no aparecían nunca:** el barrido recortaba el elemento observado y el IntersectionObserver no lo detectaba; ahora se recortan los hijos
- **No probado aún:** importar los .ics en iPhone y Google Calendar; copiar en Safari de iPhone y Chrome de Android; lector de pantalla real (NVDA/VoiceOver).

---

## 11. Publicación (Cloudflare Pages)

Configuración al conectar el repositorio:
- Preset: Astro
- Build command: `npm run build`
- Output: `dist`
- Variables: `NODE_VERSION=22` y `SITIO=<dirección pública>`

Con dominio propio, agregarlo en *Custom domains* y actualizar `SITIO`. `BASE` solo se usa si se publica en una subcarpeta.

---

## 12. Pendientes principales (detalle en `PENDIENTES.md`)

1. Fotos nuevas de los pastores; foto del muro «Aquí hay lugar para ti» de noche; escenario en alta resolución; alabanza de espaldas; fachada; logo de Exaltarte; logo vectorial.
2. Permiso de CCI para sus fotos.
3. Quién lee los mensajes directos de Instagram (el formulario promete «confidencial, solo pastores»); si los viernes de jóvenes coinciden o se alternan con la reunión general; hora de la reflexión de Danza los martes; revisar las indicaciones de cómo llegar (escritas a partir del mapa: el templo queda a la izquierda pasado el paradero 7, viniendo desde los paraderos bajos).
4. Historia (año de fundación, aniversario), «Qué creemos», texto de los pastores, versículo lema, nombre legal.
5. Dominio `.cl` y envío directo del formulario (Formspree o función de Cloudflare).

---

## 13. Reglas para seguir trabajando

- Todo dato editable va en `src/datos/iglesia.json`; nunca a mano en componentes.
- Solo valores de `src/estilos/tokens.css`. Nada de librerías de animación ni de UI.
- Respetar §2 (pastores, sin WhatsApp, sin «iglesia madre», sin Sergio Enríquez).
- Comandos: `npm run dev` (http://localhost:4321/), `npm run build`, `npm run preview`.
- Las decisiones que se aparten del brief se marcan con `// DECISIÓN:` en el código.
