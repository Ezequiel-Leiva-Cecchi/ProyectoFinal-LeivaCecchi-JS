// Selecciona un elemento del DOM y lo almacena en una variables
let navBar = document.querySelector("#nav");
let menuAbrir = document.querySelector("#menuAbrir");
let menuCerrar = document.querySelector("#menuCerrar");
let numDeCarrito= document.getElementById(`numeroDeCarrito`);
numDeCarrito.textContent =  JSON.parse(localStorage.getItem("cantidad")) || 0
// Menu hamburguesa funcionalidad
menuAbrir.addEventListener("click", () => {
    navBar.classList.add("visible");
});
menuCerrar.addEventListener("click", () => {
    navBar.classList.remove("visible");
});