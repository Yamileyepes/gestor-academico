// LLENAR TABLA PRODUCTOS
let products = [
  { id: 1, name: "Laptop Gamer", price: 2500, category: "Electrónica", quantity: 10, date: "2024-01-15" },
  { id: 2, name: "Smartphone", price: 800, category: "Electrónica", quantity: 25, date: "2024-01-20" }, 
  { id: 3, name: "Cámara DSLR", price: 1200, category: "Fotografía", quantity: 5, date: "2024-02-10" },
  { id: 4, name: "Auriculares Bluetooth", price: 150, category: "Accesorios", quantity: 30, date: "2024-03-05" },
  { id: 5, name: "Monitor 4K", price: 400, category: "Electrónica", quantity: 8, date: "2024-04-12" }
];

console.log('Productos iniciales:', products);

// Capturar variables
const productsBody = document.getElementById("productsBody");
const btnAddProduct = document.getElementById("btn-add-product");
const productModalElement = document.getElementById('productModal');
const productForm = document.getElementById("product-form");
const modalTitle = document.getElementById("productModalLabel");

// Variable para la instancia de la modal
let productModal;

// Variable para trackear si estamos en modo edición
let editingProductId = null;

// Función para llenar la tabla
function fillProductsTable() {
  productsBody.innerHTML = products.map(p => `
    <tr data-id="${p.id}">
      <td>${p.id}</td>
      <td>${p.name}</td>
      <td>$${p.price.toFixed(2)}</td>
      <td>${p.category}</td>
      <td>${p.quantity}</td>
      <td>${p.date}</td>
      <td>
        <button class="btn btn-sm btn-outline-primary edit-btn" data-id="${p.id}">
          <i class="bi bi-pencil-square"></i> Editar
        </button>
        <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${p.id}">
          <i class="bi bi-trash"></i> Eliminar
        </button>
      </td>
    </tr>`
  ).join("");    
}

// Función para agregar un producto
function addProduct() {
  // Capturar los valores del formulario
  const name = document.getElementById("product-name").value;
  const price = parseFloat(document.getElementById("product-price").value);
  const category = document.getElementById("product-category").value;
  const quantity = parseInt(document.getElementById("product-quantity").value);
  const date = document.getElementById("product-date").value;

  // Validar que los campos no estén vacíos
  if (!name || isNaN(price) || !category || isNaN(quantity) || !date) {
    alert("Por favor, complete todos los campos correctamente.");
    return false;
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
  console.log('Producto agregado:', newProduct);
  
  return true;
}

// Función para editar un producto
function editProduct(id) {
  console.log('Editando producto con ID:', id);
  
  // Buscar el producto en el array
  const product = products.find(p => p.id === id);
  
  if (!product) {
    alert('Producto no encontrado');
    return;
  }
  
  // Cambiar el título de la modal
  modalTitle.textContent = 'Editar Producto';
  
  // Llenar el formulario con los datos del producto
  document.getElementById("product-name").value = product.name;
  document.getElementById("product-price").value = product.price;
  document.getElementById("product-category").value = product.category;
  document.getElementById("product-quantity").value = product.quantity;
  document.getElementById("product-date").value = product.date;
  
  // Guardar el ID del producto que estamos editando
  editingProductId = id;
  
  // Mostrar la modal
  productModal.show();
}

// Función para actualizar un producto (después de editar)
function updateProduct() {
  if (editingProductId === null) {
    return false;
  }
  
  // Capturar los valores del formulario
  const name = document.getElementById("product-name").value;
  const price = parseFloat(document.getElementById("product-price").value);
  const category = document.getElementById("product-category").value;
  const quantity = parseInt(document.getElementById("product-quantity").value);
  const date = document.getElementById("product-date").value;

  // Validar que los campos no estén vacíos
  if (!name || isNaN(price) || !category || isNaN(quantity) || !date) {
    alert("Por favor, complete todos los campos correctamente.");
    return false;
  }

  // Buscar el producto en el array
  const productIndex = products.findIndex(p => p.id === editingProductId);
  
  if (productIndex === -1) {
    alert('Producto no encontrado');
    return false;
  }
  
  // Actualizar el producto
  const updatedProduct = {
    id: editingProductId,
    name: name,
    price: price,
    category: category,
    quantity: quantity,
    date: date
  };
  
  products[productIndex] = updatedProduct;
  console.log('Producto actualizado:', updatedProduct);
  
  return true;
}

// Función para eliminar un producto
function deleteProduct(id) {
  console.log('Eliminando producto con ID:', id);
  
  // Buscar el producto en el array
  const product = products.find(p => p.id === id);
  
  if (!product) {
    alert('Producto no encontrado');
    return;
  }
  
  // Confirmar eliminación
  const confirmDelete = confirm(`¿Estás seguro de eliminar "${product.name}"?`);
  
  if (confirmDelete) {
    // Eliminar del array
    products = products.filter(p => p.id !== id);
    console.log('Producto eliminado:', product);
    
    // Actualizar la tabla
    fillProductsTable();
    
    // Mostrar mensaje de éxito
    alert(`Producto "${product.name}" eliminado correctamente`);
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  console.log('DOM cargado');
  
  // Verificar que Bootstrap esté disponible
  if (typeof bootstrap === 'undefined') {
    console.error('❌ Bootstrap no está cargado correctamente');
    alert('Error: Bootstrap no se cargó correctamente. Por favor, recarga la página.');
    return;
  }
  
  console.log('✅ Bootstrap está disponible');
  
  // Crear instancia de la modal
  productModal = new bootstrap.Modal(productModalElement);
  
  console.log('✅ Modal inicializada');
  
  // Llenar la tabla
  fillProductsTable();
  
  // Evento para abrir la modal (Agregar)
  btnAddProduct.addEventListener("click", () => {
    console.log('Botón "Agregar Producto" clickeado');
    
    // Cambiar el título de la modal
    modalTitle.textContent = 'Agregar Nuevo Producto';
    
    // Limpiar el formulario
    productForm.reset();
    
    // Establecer fecha actual por defecto
    document.getElementById('product-date').valueAsDate = new Date();
    
    // Resetear el modo edición
    editingProductId = null;
    
    // Mostrar la modal
    productModal.show();
  });
  
  // Evento para el formulario (Guardar)
  productForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    console.log('Formulario enviado');
    
    let success = false;
    
    // Verificar si estamos en modo edición o agregando
    if (editingProductId !== null) {
      // Modo edición
      success = updateProduct();
    } else {
      // Modo agregar
      success = addProduct();
    }
    
    if (success) {
      // Actualizar la tabla
      fillProductsTable();
      
      // Limpiar formulario
      productForm.reset();
      
      // Cerrar modal
      productModal.hide();
      
      // Mostrar mensaje de éxito
      const message = editingProductId !== null ? 'Producto actualizado exitosamente!' : 'Producto agregado exitosamente!';
      alert(message);
      
      // Resetear el modo edición
      editingProductId = null;
    }
  });
  
  // Eventos delegados para botones de editar y eliminar
  productsBody.addEventListener('click', (e) => {
    const target = e.target.closest('button');
    
    if (!target) return;
    
    const productId = parseInt(target.getAttribute('data-id'));
    
    if (target.classList.contains('edit-btn')) {
      editProduct(productId);
    } else if (target.classList.contains('delete-btn')) {
      deleteProduct(productId);
    }
  });
  
  // Eventos de la modal
  productModalElement.addEventListener('shown.bs.modal', function () {
    console.log('Modal completamente visible');
    // Enfocar el primer campo al abrir
    document.getElementById('product-name').focus();
  });
  
  productModalElement.addEventListener('hidden.bs.modal', function () {
    console.log('Modal completamente cerrada');
    // Limpiar formulario al cerrar
    productForm.reset();
    // Resetear el modo edición
    editingProductId = null;
    // Restaurar el título
    modalTitle.textContent = 'Agregar Nuevo Producto';
  });
  
  console.log('✅ Inicialización completa');
});