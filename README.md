# Falcon Lab

Reimaginación de mi proyecto final de JavaScript como una experiencia interactiva de e-commerce construida con **HTML, CSS y JavaScript puro**.

## Qué muestra esta versión

- Identidad visual clara y tecnológica, con una paleta propia de violeta, aqua, coral y tonos suaves.
- Símbolo de marca inspirado en un ala/halcón en lugar de una letra genérica.
- Catálogo unificado de Lenovo, Asus y HP.
- Búsqueda por modelo, marca, CPU o GPU.
- Filtros por marca, perfil, RAM y almacenamiento.
- Favoritos y carrito persistentes con `localStorage`.
- Comparador de hasta tres notebooks.
- Fichas detalladas con procesador, RAM, SSD, GPU, pantalla, batería, peso y sistema operativo.
- Animaciones al hacer scroll y efecto de profundidad en dispositivos con mouse.
- Interacciones táctiles y filtros en drawer para mobile.
- Respeto por `prefers-reduced-motion`.
- Sin Bootstrap, React ni librerías visuales.

## Stack

- HTML5 semántico
- CSS Grid, Flexbox, custom properties y media queries
- JavaScript ES6+
- Fetch API
- Web Storage API
- HTML Dialog API
- Intersection Observer
- Intl.NumberFormat

## Ejecutar localmente

El catálogo usa `fetch`, por lo que conviene servir el proyecto mediante HTTP:

```bash
python -m http.server 5500
```

Luego abrí `http://localhost:5500`.

## Nota sobre los productos

Los nombres e imágenes provienen del proyecto educativo original. **Los precios y configuraciones técnicas de la demo son ilustrativos** y se usan únicamente para enriquecer la experiencia de portfolio; no representan necesariamente una variante comercial exacta ni una oferta vigente.

## Deploy

El repositorio incluye un workflow de GitHub Pages para publicar la rama `main`.
