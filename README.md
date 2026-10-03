# CCINT Tiempo Nuevo

Sitio web de la iglesia CCINT Tiempo Nuevo, Calera de Tango.

## Estructura

```
index.html          Página principal (solo el esqueleto)
css/styles.css      Estilos, colores y modo oscuro
js/app.js           Renderiza todas las secciones a partir del contenido
data/content.json   Todos los textos, horarios, eventos, ministerios y contacto
img/                Fotos y logos
```

La mayoría de los cambios de contenido se hacen editando `data/content.json`; no hace falta tocar el código.

## Ver el sitio en tu computador

El sitio carga `data/content.json`, así que hay que abrirlo con un servidor local (no con doble clic):

```sh
npx serve .
# o
python3 -m http.server 8000
```

Luego abre http://localhost:8000 (o la dirección que indique `serve`).

## Pendiente

- Datos de transferencia en `ofrendas.datos` (dicen "Por completar").
- Los eventos con `"ejemplo": true` son de muestra: confirmar o reemplazar.
