let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let numeroDeCarrito = JSON.parse(localStorage.getItem("cantidad")) || 0
let number = document.getElementById(`numeroDeCarrito`);
const borrarDeCarrito = document.getElementById("vaciarCarrito");
const textCart = document.querySelector(".textCart");
const botonComprar = document.querySelector(`.boton-comprar`);
const obtenerTotal = (carrito) =>{
    let total = 0;
    for(something of carrito){
        total += Number(something.precio)
    }
    return total
}
console.log(obtenerTotal(carrito)) // esto imprime el total  en la consola (se debe de hacer para que se vea en html)
borrarDeCarrito.onclick = vaciarCarrito;

botonComprar.addEventListener("click", () => {
    Swal.fire({
        icon: 'success',
        title: 'Compra Realizada',
        text: 'Se ha realizado la compra exitosamente'
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
        li.innerHTML += `
    <img style="width: 92px" src = "${producto.image}">
    <h6 >${producto.titulo}</h6>
    <p class="product-price">$${producto.precio}</p>
    <button class="eliminar" onclick="eliminarProducto(${index})">Eliminar</button>`;
        carritoLista.appendChild(li);

    });
}

function eliminarProducto(index) {
    if (index >= 0 && index < carrito.length) {
        carrito.splice(index, 1);
        console.log(obtenerTotal(carrito))
        localStorage.setItem('carrito', JSON.stringify(carrito));
        number.textContent = carrito.length;
        localStorage.setItem(`cantidad`,JSON.stringify(carrito.length));
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