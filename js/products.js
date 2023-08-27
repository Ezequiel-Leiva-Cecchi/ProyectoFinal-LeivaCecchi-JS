let numeritoDeCarrito = document.getElementById(`numeroDeCarrito`);
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
const cartItem = document.getElementById("cartItems");
numeritoDeCarrito.textContent =  JSON.parse(localStorage.getItem("cantidad")) || 0

// Carga datos desde un archivo JSON de manera asíncrona 
async function loadJSON() {
  const res = await fetch('./productos.json');
  return await res.json();
}
// Aca se esta utilizando la funcion asincronica
loadJSON().then(products => {
  const contenedor = document.getElementById("contentProducts");
  for (let i = 0; i < products.length; i++) {
    contenedor.innerHTML += `
      <div class="product">
        <img src="${products[i].image}">
        <div class="product-info">
          <h4 class="product-title">${products[i].titulo}</h4>
          <p class="product-price">$${products[i].precio}</p>
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