# Pendientes por confirmar con la iglesia

El sitio ya funciona con estos datos tal como están; esto es lo que falta verificar o conseguir. Todo se cambia en `src/datos/iglesia.json`.

## Fotos (lo más importante)

| Foto | Estado | Dónde va |
|---|---|---|
| Pastores David Núñez A. y Rosita Jara C. | **Temporal**: se usa la del sitio anterior (605 px, baja resolución) | `pastores → foto` |
| Apóstol Billy Bunster y Pastora Claudia Bunster | **Listo**: retratos oficiales de ccint.cl (720 px) y un recorte de la miniatura del video «Desenmascarando al enemigo». **Pedir permiso a CCI** antes de publicar | `familia_espiritual` |
| Muro de bienvenida «Aquí hay lugar para ti», de noche con el logo iluminado | Falta | Inicio (sección 2) y cierre de Nosotros |
| Escenario con luces azules/moradas, plano general, buena resolución | **Temporal**: recorte de un video de la transmisión (790 px) | Portada, reproductor, Nosotros |
| Alabanza desde atrás (espaldas, manos, contraluz real) | Falta | Inicio |
| Fachada / entrada del templo, de día | Falta | Visítanos → Cómo llegar |
| Logo del ministerio de danza Exaltarte (PNG transparente o SVG) | Falta | `ministerios → Danza Exaltarte → logo` |
| Logo de la iglesia en vectorial (original) | Falta | — |

Recomendación de toma: celular en horizontal, luz natural para retratos, 2000 px o más. Menores **nunca identificables** sin autorización escrita de sus padres; rostros adultos solo con permiso.

## Datos

### Ya resuelto (25-10-2026)

- Correo `igltiemponuevo@gmail.com`: existe pero no se usa → **ya no se muestra** en el sitio. Las peticiones de oración van por mensaje directo de Instagram.
- Viernes 20:00: **Reunión general**, discipulado para toda la iglesia, **no se transmite**.
- Escuela Bíblica (5 a 9 años): domingos durante el culto.
- Ministerios: Preadolescentes (9 a 12 años, domingos durante el culto) · Jóvenes y Adolescentes (12 a 17 años, viernes por medio, 20:00) · Mujeres (lunes 18:00) · Varones (sábados por medio, 18:00) · Danza (reflexión los martes, ensayos sábados por medio a las 10:00).
- Estacionamiento: sí hay (agregado a «Cómo llegar» y a las preguntas frecuentes).

### Falta

1. **Peticiones de oración por Instagram**: ¿quién lee los mensajes directos de la cuenta? El formulario promete que la petición confidencial la leen solo los pastores; si la cuenta la maneja otra persona (por ejemplo, multimedia), hay que ajustar ese texto o habilitar otra vía (Formspree o una función de Cloudflare que envíe a un correo de los pastores).
2. **Viernes**: los viernes de jóvenes y adolescentes (por medio, 20:00), ¿hay también reunión general a la misma hora, o se alternan?
3. **Danza**: ¿a qué hora es la reflexión de los martes?
4. **Cómo llegar**: revisar las indicaciones en auto y micro (se escribieron a partir del mapa).
5. **Correo para recibir peticiones**, si algún día quieren uno: se pone en `contacto → correo` y vuelve a aparecer en el sitio.
6. **Historia**: año de fundación, cómo nació, fecha de aniversario.
7. **Qué creemos**: revisar las 5 afirmaciones y la misión con los pastores.
8. **Texto de los pastores** y si la cita «Dios viene a restituir nuestra identidad de hijos» es la que quieren destacar.
9. **Familia CCI**: revisar el texto (dice que CCI fue fundada en 1999 por el Apóstol Billy Bunster y la pastora Claudia Bunster, según ccint.cl) y pedir a CCI permiso para usar sus fotos, idealmente en mayor resolución.
10. **Versículo lema**: se usa Isaías 43:19 («He aquí que yo hago cosa nueva…»). ¿Tienen otro?
11. **«Compartimos» después del culto** (paso 5 de «Tu primera vez»): ¿siempre hay tiempo para saludarse, o hay café?
12. **Nombre legal**: «Iglesia Evangélica Integral Tiempo Nuevo».
13. **Dominio**: `tiemponuevo.cl` o `ccinttiemponuevo.cl` (NIC Chile). Quién lo paga y administra.
14. **Hosting**: queda listo para Cloudflare Pages (ver README). El formulario de oración hoy copia la petición y abre un mensaje directo de Instagram; para que envíe directo se puede usar Formspree (poner la URL en `contacto → formulario_endpoint`) o una función de Cloudflare más adelante.

## Recomendación

Crear o reclamar la ficha de **Google Business Profile** con la misma dirección y horarios. Es lo que más visitas trae desde Google Maps.

---

## Fotos de CCI usadas (fuente)

- Retrato del Apóstol Billy Bunster: `ccint.cl/wp-content/uploads/2020/07/pastor-billy-ccint.png` (página «Pastores» de ccint.cl).
- Retrato de la Pastora Claudia Bunster: `ccint.cl/wp-content/uploads/2020/07/pastora-claudia-ccint.png` (misma página).
- Apóstol predicando: recorte de la miniatura del video de YouTube «Apóstol Billy Bunster – Desenmascarando al enemigo» (`youtube.com/watch?v=67vSmVDtTFU`), sin el texto ni el logo.
- No se usó `billybunster.com/assets/billy-5.png`: al frente aparecen caras de adolescentes reconocibles.
