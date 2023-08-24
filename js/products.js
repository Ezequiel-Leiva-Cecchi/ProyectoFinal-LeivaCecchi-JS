

let products = [];
fetch("js/productos.json")
.then(response => response.json())
.then(data => {
    products = data;
    cargaDeProductos(products);
})
const contenedor = document.getElementById("contentProducts"); //El contendor de los productos
function cargaDeProductos(products){
  products.forEach(contenedor => {
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
  });
}

// let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
// const cartItem = document.getElementById("cartItems");
// localStorage.clear


// loadJSON().then(products => {
//   const contenedor = document.getElementById("contentProducts");
  
//   for (let i = 0; i < products.length; i++) {
//     contenedor.innerHTML += `
//       <div class="product">
//         <img src="${products[i].image}">
//         <div class="product-info">
//           <h4 class="product-title">${products[i].titulo}</h4>
//           <p class="product-price">$${products[i].precio}</p>
//           <button class="product-btn" onclick="agregarAlCarrito(${i})">Agregar al carrito</button>
//         </div>
//       </div>
//     `;
//   }
// });

// function agregarAlCarrito(i) {
//     console.log(i)
// loadJSON().then(data=>{carrito.push(data[i]);localStorage.setItem('carrito', JSON.stringify(carrito));}) 
  
// }

// async function loadJSON() {
//   const res = await fetch('../productos.JSON');
//   return await res.json();
// }


