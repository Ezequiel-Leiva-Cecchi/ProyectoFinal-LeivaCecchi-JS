let numeritoDeCarrito = document.getElementById(`numeroDeCarrito`);
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
async function loadJSON() {
    const resultado = await fetch('../productos.json');
    return await resultado.json();
}

loadJSON().then(data => {
    const productosLenovo = data.filter(product => product.categoria.nombre === "lenovos");
    const contenedorProductosLenovo = document.getElementById("contentProducts-Lenovo");
    for (let i = 0; i < productosLenovo.length; i++) {
        productosLenovo[i].image = "." + productosLenovo[i].image;
        contenedorProductosLenovo.innerHTML += `
            <div class="product">
                <img src="${productosLenovo[i].image}">
                <div class="product-info">
                    <h4 class="product-title">${productosLenovo[i].titulo}</h4>
                    <p class="product-price">$${productosLenovo[i].precio}</p>
                    <button class="product-btn" onclick="agregarAlCarrito(${i})">Agregar al carrito</button>
                </div>
            </div>
        `;
    }
});

// Agrega al carrito el producto al que se le indique tocando el boton
function agregarAlCarrito(i) {
    loadJSON().then(data => {
      let producto = data[i]
      producto.image = "."+producto.image
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
      localStorage.setItem(`cantidad`, carrito.length);
     
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