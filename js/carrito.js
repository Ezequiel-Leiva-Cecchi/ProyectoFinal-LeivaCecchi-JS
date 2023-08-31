// Trayendo elementos del DOM y los productos guardados en el localStorage
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let numeroDeCarrito = JSON.parse(localStorage.getItem("cantidad")) || 0;
let numero = document.getElementById(`numeroDeCarrito`);
const borrarDeCarrito = document.getElementById("vaciarCarrito");
const textCart = document.querySelector(".textCart");
const botonComprar = document.querySelector(`.boton-comprar`);
const carritoLista = document.getElementById('carrito-lista');
const precioTotal = document.createElement('div');
// Función para calcular el subtotal individual
const obtenerSubtotalIndividual = (producto) => {
    return producto.precio * producto.cantidad;
};

// Función para calcular el precio total del carrito
const obtenerTotal = () => {
    return Object.values(carrito).reduce((total, producto) => total + obtenerSubtotalIndividual(producto), 0);
};
// Función para mostrar los productos en el carrito
function mostrarProductosEnCarrito() {
    carritoLista.innerHTML = '';

    if (carrito.length === 0) {
        textCart.style.display = 'block';
        precioTotal.style.display = 'none';
    } else {
        textCart.style.display = 'none';

        carrito.forEach((producto, index) => {
            const li = document.createElement('li');
            // const cantidad = carrito.filter(item => item.id === producto.id).length;
            li.innerHTML = `
                <img style="width: 92px" src="${producto.image}">
                <h6>${producto.titulo}</h6>
                <p class="product-price">Precio:$${producto.precio} Cantidad:${producto.cantidad} Subtotal:$${obtenerSubtotalIndividual(producto)}</p>
                <button class="eliminar" onclick="eliminarProducto(${index})"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
              </svg></button>`;
            carritoLista.appendChild(li);
        });

        precioTotal.innerHTML = `
            <p>Su precio total es de: $${obtenerTotal(carrito)}</p>`;
        carritoLista.appendChild(precioTotal);
        precioTotal.style.display = 'block';
    }

    numero.textContent = carrito.length;
    localStorage.setItem(`cantidad`, JSON.stringify(carrito.length));
}

// Función para eliminar un producto del carrito
function eliminarProducto(index) {
    if (index >= 0 && index < carrito.length) {
        carrito.splice(index, 1);
        localStorage.setItem('carrito', JSON.stringify(carrito));
        mostrarProductosEnCarrito();
    }
}

// Evento para vaciar el carrito
borrarDeCarrito.addEventListener(`click`, () => {
    Swal.fire({
        icon: 'success',
        title: 'Se vació el carrito con éxito',
        text: 'Se ha vaciado el carrito con éxito'
    });
    vaciarCarrito();
});

// Evento para simular una compra
botonComprar.addEventListener("click", () => {
    Swal.fire({
        icon: 'success',
        title: 'Compra Realizada',
        text: 'Se ha realizado la compra exitosamente'
    });
    vaciarCarrito();
});

// Función para vaciar el carrito
function vaciarCarrito() {
    localStorage.removeItem('carrito');
    localStorage.removeItem(`cantidad`);
    carrito = [];
    mostrarProductosEnCarrito();
}

// Cargar los productos en el carrito al cargar la página
window.onload = function () {
    mostrarProductosEnCarrito();
};