let numeritoDeCarrito = document.getElementById(`numeroDeCarrito`);
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
async function loadJSON() {
    const resultado = await fetch('../productos.json');
    return await resultado.json();
}

loadJSON().then(data => {
    const productosAsus = data.filter(product => product.categoria.nombre === "Asus");
    const contenedorProductosAsus = document.getElementById("contentProducts-Asus");
    for (let i = 0; i < productosAsus.length; i++) {
        productosAsus[i].image = "." + productosAsus[i].image;
        contenedorProductosAsus.innerHTML += `
            <div class="product">
                <img src="${productosAsus[i].image}">
                <div class="product-info">
                    <h4 class="product-title">${productosAsus[i].titulo}</h4>
                    <p class="product-price">$${productosAsus[i].precio}</p>
                    <button class="product-btn" onclick="agregarAlCarrito(${i})">Agregar al carrito</button>
                </div>
            </div>
        `;
    }
});

// Agrega al carrito el producto al que se le indique tocando el boton
function agregarAlCarrito(i) {
    loadJSON().then(data => {
        const productosAsus = data.filter(product => product.categoria.nombre === "Asuss");
      let producto = productosAsus[i]
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