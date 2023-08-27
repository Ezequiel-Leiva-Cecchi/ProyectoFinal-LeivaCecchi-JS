// Trayendo elementos del DOM y los productos guardados en el localStorage
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let numeroDeCarrito = JSON.parse(localStorage.getItem("cantidad")) || 0
let numero = document.getElementById(`numeroDeCarrito`);
const borrarDeCarrito = document.getElementById("vaciarCarrito");
const textCart = document.querySelector(".textCart");
const botonComprar = document.querySelector(`.boton-comprar`);

// Obtiene el total de todos los productos agregados al carrito
const obtenerTotal = (carrito) => {
    let total = 0;
    for (something of carrito) {
        total += Number(something.precio)
    }
    return total;
}

// Funcion encargada de vaciar el carrito y llamarla al apretar un boton
function vaciarCarrito() {
    localStorage.removeItem('carrito');
    carrito = [];
    mostrarProductosEnCarrito();
}

borrarDeCarrito.onclick = vaciarCarrito;

// Evento en el que simula comprar los productos agregados al carrito
botonComprar.addEventListener("click", () => {
    Swal.fire({
        icon: 'success',
        title: 'Compra Realizada',
        text: 'Se ha realizado la compra exitosamente'
    });
    vaciarCarrito();
});

// Funcion utilizada para mostrar los productos que se seleccionaron
function mostrarProductosEnCarrito() {
    let carritoLista = document.getElementById('carrito-lista');

    carritoLista.innerHTML = '';

    if (carrito.length === 0) {
        textCart.style.display = 'block';
    } else {
        textCart.style.display = 'none';
    }

    carrito.forEach((producto, index) => {
        let li = document.createElement('li');
        let precioTotal = document.createElement(`div`)
        li.innerHTML += `
    <img style="width: 92px" src = "${producto.image}">
    <h6 >${producto.titulo}</h6>
    <p class="product-price">$${producto.precio}</p>
    <button class="eliminar" onclick="eliminarProducto(${index})">Eliminar</button>`;
    precioTotal.innerHTML += `
    <p>Su precio total es de:$${obtenerTotal(carrito)}</p>`; 
        carritoLista.appendChild(li);
        carritoLista.appendChild(precioTotal);
    });
}

// Funcion que agrega un boton para eliminar los productos
function eliminarProducto(index) {
    if (index >= 0 && index < carrito.length) {
        carrito.splice(index, 1);
        console.log(obtenerTotal(carrito))
        localStorage.setItem('carrito', JSON.stringify(carrito));
        numero.textContent = carrito.length;
        localStorage.setItem(`cantidad`, JSON.stringify(carrito.length));
        mostrarProductosEnCarrito();

    }
}

// Esta funcion se usa para verificar que la funcion de adentro se ejecute correctamente
window.onload = function () {
    mostrarProductosEnCarrito();
};