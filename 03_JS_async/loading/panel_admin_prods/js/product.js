// productos.js

// “lista” es la fuente de verdad del módulo.
// Acá vive el estado: lo que se muestra en la tabla sale de este arreglo.
// No hay base de datos: si recargas, vuelve a estos valores.
let lista = [
  { id: 1, nombre: "Laptop Gamer", precio: 2500, categoria: "Electrónica", cantidad: 10, fecha: "2024-01-15" },
  { id: 2, nombre: "Smartphone", precio: 800, categoria: "Electrónica", cantidad: 25, fecha: "2024-01-20" },
  { id: 3, nombre: "Cámara DSLR", precio: 1200, categoria: "Fotografía", cantidad: 5, fecha: "2024-02-10" },
  { id: 4, nombre: "Auriculares Bluetooth", precio: 150, categoria: "Accesorios", cantidad: 30, fecha: "2024-03-05" },
  { id: 5, nombre: "Monitor 4K", precio: 400, categoria: "Electrónica", cantidad: 8, fecha: "2024-04-12" },
];

// idEdit define “qué estamos haciendo” con el formulario.
// - null: el form está en modo agregar
// - número: el form está en modo editar y ese número es el id del producto a reemplazar
let idEdit = null;

// “modal” guarda la instancia real del Modal de Bootstrap.
// Sin esto, no existe modal.show() / modal.hide().
let modal = null;

// capDom centraliza todos los getElementById.
// Intención: tener los ids del HTML en un solo lugar.
// Si algún id cambia en el HTML, se ajusta aquí y no por todo el archivo.
function capDom() {
  return {
    // Tabla
    tbody: document.getElementById("productsBody"),
    btnNuevo: document.getElementById("btn-add-product"),

    // Modal
    modalEl: document.getElementById("productModal"),
    modalTitulo: document.getElementById("productModalLabel"),

    // Form
    form: document.getElementById("product-form"),
    inpNombre: document.getElementById("product-name"),
    inpPrecio: document.getElementById("product-price"),
    inpCategoria: document.getElementById("product-category"),
    inpCantidad: document.getElementById("product-quantity"),
    inpFecha: document.getElementById("product-date"),

    // Overlay “cargando…”
    overlay: document.getElementById("loadingOverlay"),
    overlayMsg: document.getElementById("loadingMessage"),
  };
}

// dinero solo formatea el precio para mostrarlo.
// No cambia datos, no valida, no “calcula negocio”: es presentación.
function dinero(n) {
  return `$${Number(n).toFixed(2)}`;
}

// nuevoId fabrica un id que no choque con los existentes.
// Intención: simular el autoincrement de una BD.
function nuevoId() {
  return lista.length ? Math.max(...lista.map(p => p.id)) + 1 : 1;
}

// esperar simula latencia (como si fuera un servidor).
// Se usa para que el overlay tenga sentido: se “ve” el proceso.
async function esperar(msMax) {
  const msMin = 250;
  const ms = Math.floor(Math.random() * (msMax - msMin + 1)) + msMin;
  await new Promise((ok) => setTimeout(ok, ms));
}

// cargaOn enciende el overlay y muestra un mensaje.
// Intención: bloquear UI y comunicar “estoy trabajando”.
function cargaOn(dom, msg) {
  if (!dom.overlay) return;
  if (dom.overlayMsg) dom.overlayMsg.textContent = msg || "Cargando...";
  dom.overlay.classList.remove("d-none");
  dom.overlay.style.opacity = "1";
}

// cargaOff apaga overlay respetando transición.
// Intención: que no “desaparezca de golpe” y se vea fluido.
function cargaOff(dom) {
  if (!dom.overlay) return;
  dom.overlay.style.opacity = "0";
  setTimeout(() => dom.overlay.classList.add("d-none"), 300);
}

// pintar es el render del módulo.
// Intención: “lo que hay en lista” -> “lo que se ve en la tabla”.
// Regla: cada vez que se agrega/edita/elimina, se vuelve a pintar.
function pintar(dom) {
  dom.tbody.innerHTML = lista.map(p => `
    <tr>
      <td>${p.id}</td>
      <td>${p.nombre}</td>
      <td>${dinero(p.precio)}</td>
      <td>${p.categoria}</td>
      <td>${p.cantidad}</td>
      <td>${p.fecha}</td>
      <td>
        <button class="btn btn-sm btn-outline-primary btn-editar" data-id="${p.id}">
          <i class="bi bi-pencil-square"></i> Editar
        </button>
        <button class="btn btn-sm btn-outline-danger btn-eliminar" data-id="${p.id}">
          <i class="bi bi-trash"></i> Eliminar
        </button>
      </td>
    </tr>
  `).join("");
}

// formLeer toma lo que escribió el usuario y lo vuelve objeto.
// Intención: desacoplar DOM de lógica; la lógica recibe “datos”, no inputs.
function formLeer(dom) {
  return {
    nombre: dom.inpNombre.value.trim(),
    precio: parseFloat(dom.inpPrecio.value),
    categoria: dom.inpCategoria.value.trim(),
    cantidad: parseInt(dom.inpCantidad.value, 10),
    fecha: dom.inpFecha.value,
  };
}

// formValidar impone reglas mínimas antes de tocar el estado.
// Intención: no contaminar lista con basura y evitar renders inconsistentes.
function formValidar(d) {
  if (!d.nombre) return "Nombre requerido.";
  if (Number.isNaN(d.precio)) return "Precio inválido.";
  if (!d.categoria) return "Categoría requerida.";
  if (Number.isNaN(d.cantidad) || d.cantidad < 1) return "Cantidad inválida.";
  if (!d.fecha) return "Fecha requerida.";
  return "";
}

// formLimpiar deja el formulario “listo para el siguiente uso”.
// Intención: no arrastrar valores viejos al agregar un nuevo producto.
// También fija fecha por defecto para evitar que el usuario la busque siempre.
function formLimpiar(dom) {
  dom.form.reset();
  dom.inpFecha.valueAsDate = new Date();
}

// formCargar es lo contrario de leer: mete datos al form.
// Intención: cuando editas, el usuario debe ver y modificar valores actuales.
function formCargar(dom, p) {
  dom.inpNombre.value = p.nombre;
  dom.inpPrecio.value = p.precio;
  dom.inpCategoria.value = p.categoria;
  dom.inpCantidad.value = p.cantidad;
  dom.inpFecha.value = p.fecha;
}

// agregar modifica el estado agregando un elemento nuevo.
// Intención: simular INSERT.
function agregar(d) {
  lista.push({ id: nuevoId(), ...d });
}

// actualizar reemplaza el registro del id en el arreglo.
// Intención: simular UPDATE.
// Devuelve false si el id no existe (evita actualizar “fantasmas”).
function actualizar(id, d) {
  const i = lista.findIndex(p => p.id === id);
  if (i === -1) return false;
  lista[i] = { id, ...d };
  return true;
}

// eliminar quita el registro y devuelve el eliminado.
// Intención: simular DELETE + poder mostrar mensaje con el nombre.
function eliminar(id) {
  const p = lista.find(x => x.id === id);
  if (!p) return null;
  lista = lista.filter(x => x.id !== id);
  return p;
}

// modalNuevo prepara el modal para “agregar”.
// Intención: abrir form limpio, título correcto y sensación de carga (overlay).
async function modalNuevo(dom) {
  idEdit = null;
  dom.modalTitulo.textContent = "Agregar Nuevo Producto";

  cargaOn(dom, "Cargando formulario...");
  await esperar(1200);

  formLimpiar(dom);
  cargaOff(dom);
  modal.show();
}

// modalEditar prepara el modal para “editar”.
// Intención: seleccionar producto, cargarlo al form, activar modo edición (idEdit) y abrir.
async function modalEditar(dom, id) {
  const p = lista.find(x => x.id === id);
  if (!p) return alert("Producto no encontrado.");

  idEdit = id;
  dom.modalTitulo.textContent = "Editar Producto";

  cargaOn(dom, "Cargando producto...");
  await esperar(1200);

  formCargar(dom, p);
  cargaOff(dom);
  modal.show();
}

// guardar es el único punto de guardado.
// Intención: evitar duplicidad click/submit; el botón del modal es type="submit".
// Decisión: si idEdit tiene valor -> UPDATE, si no -> INSERT.
// Luego: repintar, cerrar modal, limpiar modo.
async function guardar(dom, e) {
  e.preventDefault();

  const d = formLeer(dom);
  const err = formValidar(d);
  if (err) return alert(err);

  cargaOn(dom, "Guardando producto...");
  await esperar(1500);

  if (idEdit !== null) {
    const ok = actualizar(idEdit, d);
    if (!ok) {
      cargaOff(dom);
      return alert("No se pudo actualizar (producto no existe).");
    }
  } else {
    agregar(d);
  }

  pintar(dom);
  cargaOff(dom);
  modal.hide();
  idEdit = null;
}

// borrar aplica confirmación + overlay + delete.
// Intención: no borrar por accidente y simular proceso.
// Luego: repintar tabla para reflejar el estado real.
async function borrar(dom, id) {
  const p = lista.find(x => x.id === id);
  if (!p) return alert("Producto no encontrado.");

  if (!confirm(`¿Eliminar "${p.nombre}"?`)) return;

  cargaOn(dom, "Eliminando producto...");
  await esperar(1300);

  const borrado = eliminar(id);
  pintar(dom);

  cargaOff(dom);
  if (borrado) alert(`Producto "${borrado.nombre}" eliminado correctamente.`);
}

// enlazar es donde “cobra vida” el módulo.
// Intención: conectar UI (click/submit) con funciones de negocio.
// Se usa delegación de eventos en la tabla para no pegar listeners fila por fila.
function enlazar(dom) {
  // Botón verde: abre modal modo agregar
  dom.btnNuevo.addEventListener("click", () => modalNuevo(dom));

  // Guardado único: submit del form (depende de botón type="submit" en el modal)
  dom.form.addEventListener("submit", (e) => guardar(dom, e));

  // Delegación en tbody: detecta si se presionó editar o eliminar
  // Intención: que nuevas filas también respondan sin crear listeners extra.
  dom.tbody.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const id = parseInt(btn.dataset.id, 10);
    if (Number.isNaN(id)) return;

    if (btn.classList.contains("btn-editar")) modalEditar(dom, id);
    if (btn.classList.contains("btn-eliminar")) borrar(dom, id);
  });

  // UX: cuando el modal abre, el cursor queda en “nombre”
  dom.modalEl.addEventListener("shown.bs.modal", () => dom.inpNombre.focus());

  // UX: cuando cierra, deja el form listo y resetea título/modo
  dom.modalEl.addEventListener("hidden.bs.modal", () => {
    formLimpiar(dom);
    idEdit = null;
    dom.modalTitulo.textContent = "Agregar Nuevo Producto";
  });
}

// Arranque del módulo: valida que el HTML tenga todo lo que necesitamos,
// valida que Bootstrap exista y recién ahí “enciende” el sistema.
document.addEventListener("DOMContentLoaded", () => {
  const dom = capDom();

  // Si faltan ids, no hay eventos. Mejor avisar en consola y parar.
  if (!dom.btnNuevo || !dom.form || !dom.tbody || !dom.modalEl) {
    console.error("IDs faltantes. Revisa: btn-add-product, product-form, productsBody, productModal");
    return;
  }

  // Si Bootstrap no cargó, no hay modal.
  if (typeof bootstrap === "undefined") {
    console.error("Bootstrap no está disponible.");
    alert("Bootstrap no se cargó. Revisa el bundle de Bootstrap.");
    return;
  }

  // “enciende” el modal de Bootstrap
  modal = new bootstrap.Modal(dom.modalEl);

  // primer render + listeners
  pintar(dom);
  enlazar(dom);
});
