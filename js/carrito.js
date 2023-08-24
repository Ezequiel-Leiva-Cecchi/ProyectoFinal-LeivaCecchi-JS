let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
const borrarDeCarrito = document.getElementById("vaciarCarrito");
const textCart = document.querySelector(".textCart");
const botonComprar = document.querySelector(`.boton-comprar`);
borrarDeCarrito.onclick = vaciarCarrito;
botonComprar.addEventListener("click", () => {
    Swal.fire({
        icon: 'success',
        title: 'Compra Realizada',
        text: 'Se a realizado la compra exitosamente'
    });
    vaciarCarrito();
});
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
        let img = document.createElement(`img`);
        li.textContent = producto.titulo + " - $" + producto.precio;
        li.innerHTML += `<button class="eliminar" onclick="eliminarProducto(${index})">Eliminar</button>`;
        carritoLista.appendChild(img);
        carritoLista.appendChild(li);
    
    });
}

function eliminarProducto(index) {
    if (index >= 0 && index < carrito.length) {
        carrito.splice(index, 1);
        localStorage.setItem('carrito', JSON.stringify(carrito));
        mostrarProductosEnCarrito();
    }
}

function vaciarCarrito() {
    localStorage.removeItem('carrito');
    carrito = [];
    mostrarProductosEnCarrito();
}

window.onload = function () {
    mostrarProductosEnCarrito();
};