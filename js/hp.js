let numeritoDeCarrito = document.getElementById(`numeroDeCarrito`);
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
async function loadJSON() {
    const resultado = await fetch('../productos.json');
    return await resultado.json();
}

loadJSON().then(data => {
    const productosHp = data.filter(product => product.categoria.nombre === "HPs");
    const contenedorProductosHp = document.getElementById("contentProducts-Hp");
    for (let i = 0; i < productosHp.length; i++) {
        productosHp[i].image = "." + productosHp[i].image;
        contenedorProductosHp.innerHTML += `
            <div class="product">
                <img src="${productosHp[i].image}">
                <div class="product-info">
                    <h4 class="product-title">${productosHp[i].titulo}</h4>
                    <p class="product-price">$${productosHp[i].precio}</p>
                    <button class="product-btn" onclick="agregarAlCarrito(${i})">Agregar al carrito</button>
                </div>
            </div>
        `;
    }
});

// Agrega al carrito el producto al que se le indique tocando el boton
function agregarAlCarrito(i) {
    loadJSON().then(data => {
        const productosAsus = data.filter(product => product.categoria.nombre === "HPs");
        if (i >= 0 && i < productosAsus.length) {
            let producto = productosAsus[i];
            producto.image = "." + producto.image;
            const index = carrito.findIndex(item => item.id === producto.id);
            if (index !== -1) {
                carrito[index].cantidad++;
            } else {
                // Si no está en el carrito, agregarlo con cantidad 1
                carrito.push({ ...producto, cantidad: 1 });
            }
            // Actualizar los datos en el almacenamiento local
            localStorage.setItem('carrito', JSON.stringify(carrito));
            numeritoDeCarrito.textContent = carrito.length;
            localStorage.setItem('cantidad', carrito.length);
            Toastify({
                text: "Se ha agregado el producto correctamente",
                gravity: "bottom",
                position: "right",
                avatar: "/assets/Falcon.gaming.png",
                backgroundColor: "#000000",
                duration: 1000
            }).showToast();
        }
    });
}