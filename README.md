# Falcon Lab

Reimaginación completa de mi proyecto final de JavaScript: una tienda de notebooks construida con **HTML, CSS y JavaScript puro**, sin frameworks de frontend.

El proyecto original de 2023 separaba el catálogo por páginas y scripts de marca, utilizaba Bootstrap y simulaba usuarios guardando credenciales en `localStorage`. Esta versión mantiene la idea de e-commerce, pero rehace la experiencia y la arquitectura para convertirla en un proyecto de portfolio actual.

## Demo

La aplicación es 100% estática y está preparada para publicarse con GitHub Pages. Los precios y la disponibilidad que aparecen en pantalla son **ilustrativos**; el checkout es únicamente una simulación y no procesa pagos.

## Funcionalidades

- Catálogo unificado de Lenovo, Asus y HP.
- Búsqueda instantánea por modelo, marca o perfil.
- Filtros por marca y tipo de uso.
- Orden por precio o nombre.
- Atajos para elegir notebooks por perfil: gaming, trabajo, creatividad y uso diario.
- Favoritos persistentes con `localStorage`.
- Carrito lateral con cantidades, subtotales y total.
- Estado del carrito persistente entre recargas.
- Quick view de cada producto mediante `dialog` nativo.
- Comparador de hasta tres notebooks.
- Diseño responsive sin Bootstrap.
- Interfaz accesible con navegación semántica, labels y estados ARIA.
- Avisos propios sin dependencias como Toastify o SweetAlert.

## Stack

- HTML5 semántico
- CSS moderno: Grid, Flexbox, custom properties, media queries y `clamp()`
- JavaScript ES6+
- Fetch API
- Web Storage API (`localStorage`)
- `Intl.NumberFormat`
- HTML Dialog API

No requiere npm, bundler ni proceso de build.

## Ejecutar localmente

Como el catálogo se carga con `fetch`, el proyecto debe servirse mediante HTTP en lugar de abrir `index.html` directamente con `file://`.

Con VS Code podés usar **Live Server**. Otra opción, si tenés Python instalado:

```bash
python -m http.server 5500
```

Después abrí `http://localhost:5500`.

## Estructura principal

```text
.
├── index.html
├── productos.json
├── assets/
│   ├── Asus/
│   ├── HP/
│   └── Lenovo/
├── css/
│   └── style.css
└── js/
    └── app.js
```

## Qué cambió respecto de la entrega original

La versión original tenía páginas duplicadas para Lenovo, HP y Asus, scripts independientes con prácticamente la misma lógica, handlers inline para el carrito y pantallas de registro/login que almacenaban una contraseña codificada en Base64 dentro del navegador.

La modernización:

- centraliza toda la lógica del storefront en un único flujo de estado;
- elimina la duplicación por marca;
- reemplaza dependencias visuales externas por componentes propios;
- elimina la falsa autenticación del frontend;
- utiliza eventos delegados en vez de `onclick` inline;
- separa persistencia, renderizado, filtros y acciones de usuario;
- añade funcionalidades que demuestran manipulación real del DOM y estado en JavaScript.

## Nota

Este repositorio es un proyecto educativo/portfolio. No representa una tienda real ni afirma que los precios o especificaciones correspondan a ofertas comerciales actuales.
