

// LLENAR TABLA PRODUCTOS
let products = [
  { id: 1, name: "Laptop Gamer", price: 2500, category: "Electrónica", quantity: 10, date: "2024-01-15" },
  { id: 2, name: "Smartphone", price: 800, category: "Electrónica", quantity: 25, date: "2024-01-20" }, 
  { id: 3, name: "Cámara DSLR", price: 1200, category: "Fotografía", quantity: 5, date: "2024-02-10" },
  { id: 4, name: "Auriculares Bluetooth", price: 150, category: "Accesorios", quantity: 30, date: "2024-03-05" },
  { id: 5, name: "Monitor 4K", price: 400, category: "Electrónica", quantity: 8, date: "2024-04-12" }
];

console.log(products);

// Capturar variables
const productsBody = document.getElementById("productsBody");
const btnAddProduct = document.getElementById("btn-add-product");
const productModalElement = document.getElementById('productModal');


// Función para llenar la tabla
function fillProductsTable() {
  productsBody.innerHTML = products.map( p => `
    <tr>
        <td>${p.id}</td>
        <td>${p.name}</td>
        <td>$${p.price}</td>
        <td>${p.category}</td>
        <td>${p.quantity}</td>
        <td>${p.date}</td>
        <td>
          <button class="btn btn-sm btn-outline-primary" onclick="editProduct(${p.id})">Editar</button>
          <button class="btn btn-sm btn-outline-danger" onclick="deleteProduct(${p.id})">Eliminar</button>
        </td>
      </tr>`
    ).join("");    
}

document.addEventListener("DOMContentLoaded", () => {
  fillProductsTable();
});

// Mostrar la modal de agregar producto
// Para agregar el id, voy a buscar el id más alto y sumarle 1
const productModal = new bootstrap.Modal(productModalElement);

btnAddProduct.addEventListener("click", () => {
  productModal.show();
});

// guardar el producto
const form = document.getElementById("product-form");
const btnSaveProduct = document.getElementById("btn-save-product");
btnSaveProduct.addEventListener("click", () => {
  // Capturar los valores del formulario
  const name = document.getElementById("product-name").value;
  const price = parseFloat(document.getElementById("product-price").value);
  const category = document.getElementById("product-category").value;
  const quantity = parseInt(document.getElementById("product-quantity").value);
  const date = document.getElementById("product-date").value;

  // Validar que los campos no estén vacíos
  if (!name || isNaN(price) || !category || isNaN(quantity) || !date) {
    alert("Por favor, complete todos los campos correctamente.");
    return;
  }

  // Generar nuevo ID
  const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;

  // Crear nuevo producto
  const newProduct = {
    id: newId,
    name: name,
    price: price,
    category: category,
    quantity: quantity,
    date: date
  };

  // Agregar el nuevo producto al array de productos
  products.push(newProduct);

  // Actualizar la tabla
  fillProductsTable();

  // Cerrar la modal
  form.reset(); // Limpiar el formulario

  productModal.hide();
});

// Editar producto

// Eliminar producto