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
        const productosHp = data.filter(product => product.categoria.nombre === "HPs");
      let producto = productosHp[i]
      producto.image = "."+producto.image
      carrito.push(producto);
      localStorage.setItem('carrito', JSON.stringify(carrito));
      // Actualiza el numerito al lado del carrito después de actualizar el carrito
      numeritoDeCarrito.textContent = carrito.length;
      localStorage.setItem(`cantidad`,JSON.stringify(carrito.length));
     
    });
    Toastify({
  
      text: "Se a agregado el producto correctamente",
     gravity: "bottom",
      position:"right",
      avatar:"/assets/Falcon.gaming.png",
      backgroundColor: "#000000",
      duration: 1000
  
      }).showToast();
  }