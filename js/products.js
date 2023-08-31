let numeritoDeCarrito = document.getElementById(`numeroDeCarrito`);
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
const cartItem = document.getElementById("cartItems");
numeritoDeCarrito.textContent = carrito.length || 0;

// Carga datos desde un archivo JSON de manera asíncrona 
async function loadJSON() {
  const res = await fetch('./productos.json');
  return await res.json();
}

// Aca se está utilizando la función asincrónica
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

// Agrega al carrito el producto al que se le indique tocando el botón
function agregarAlCarrito(i) {
  loadJSON().then(data => {
    let producto = data[i];
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
    localStorage.setItem(`cantidad`, carrito.length);

    Toastify({
      text: "Se ha agregado el producto correctamente",
      gravity: "bottom",
      position: "right",
      avatar: "/assets/Falcon.gaming.png",
      backgroundColor: "#000000",
      duration: 1000
    }).showToast();
  });
}