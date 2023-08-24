// Selecciona un elemento del DOM y lo almacena en una variables
let nav = document.querySelector("#nav");
let abrir = document.querySelector("#abrir");
let cerrar = document.querySelector("#cerrar");
let productsBotons = document.getElementById(`boton-productos`);
// Menu hamburguesa funcionalidad
abrir.addEventListener("click", () => {
    nav.classList.add("visible");
})
cerrar.addEventListener("click", () => {
    nav.classList.remove("visible");
})
// Codigo para mostrar cada categoria de productos
productsBotons.innerHTML = `
<a href>Productos</a>
<ul class="menu-vertical">
<li>
    <button id="lenovo" class="boton-categoria">Lenovo</button>
</li>
<li>
    <button id="hp" class="boton-categoria">Hp</button>
</li>
<li>
    <button id="Asus" class="boton-categoria">Asus</button>
</li>
</ul>`;