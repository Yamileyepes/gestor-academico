let lista = [
  { id: 1, nombre: "Electrónica", desc: "Dispositivos electrónicos y gadgets", fecha: "2026-01-10", estado: "Activo" },
  { id: 2, nombre: "Accesorios", desc: "Accesorios para computadoras y dispositivos", fecha: "2026-01-12", estado: "Activo" },
  { id: 3, nombre: "Audio", desc: "Auriculares, parlantes y equipos de sonido", fecha: "2026-01-15", estado: "Activo" },
  { id: 4, nombre: "Ropa", desc: "Prendas de vestir y accesorios de moda", fecha: "2026-01-18", estado: "Inactivo" },
  { id: 5, nombre: "Hogar", desc: "Artículos para el hogar y decoración", fecha: "2026-01-20", estado: "Activo" },
  { id: 6, nombre: "Deportes", desc: "Equipamiento y artículos deportivos", fecha: "2026-01-22", estado: "Activo" },
  { id: 7, nombre: "Libros", desc: "Libros y material de lectura", fecha: "2026-01-25", estado: "Activo" },
];

// idEdit define el “modo” del formulario:
// - null  => se va a crear una categoría nueva
// - número => se va a editar la categoría con ese id
let idEdit = null;

// instancia del modal de Bootstrap (para modal.show() / modal.hide())
let modal = null;

// Centraliza los ids del HTML.
// Si el HTML cambia, lo normal es ajustar acá y no “perseguir ids” por todo el archivo.
function capDom() {
  return {
    // Tabla
    tbody: document.getElementById("categoriesBody"),
    btnNuevo: document.getElementById("btn-add-category"),

    // Modal
    modalEl: document.getElementById("categoryModal"),
    modalTitulo: document.getElementById("categoryModalLabel"),

    // Form
    form: document.getElementById("category-form"),
    inpNombre: document.getElementById("cat-name"),
    inpDesc: document.getElementById("cat-desc"),
    inpFecha: document.getElementById("cat-date"),
    selEstado: document.getElementById("cat-state"),

    // Overlay “cargando…”
    overlay: document.getElementById("loadingOverlay"),
    overlayMsg: document.getElementById("loadingMessage"),
  };
}

// genera el siguiente id disponible (simula autoincrement)
function nuevoId() {
  return lista.length ? Math.max(...lista.map(c => c.id)) + 1 : 1;
}

// latencia simulada para que el overlay “se sienta” real
async function esperar(msMax) {
  const msMin = 250;
  const ms = Math.floor(Math.random() * (msMax - msMin + 1)) + msMin;
  await new Promise((ok) => setTimeout(ok, ms));
}

// prende overlay + mensaje (bloquea UI y comunica estado)
function cargaOn(dom, msg) {
  if (!dom.overlay) return;
  if (dom.overlayMsg) dom.overlayMsg.textContent = msg || "Cargando...";
  dom.overlay.classList.remove("d-none");
  dom.overlay.style.opacity = "1";
}

// apaga overlay con transición suave
function cargaOff(dom) {
  if (!dom.overlay) return;
  dom.overlay.style.opacity = "0";
  setTimeout(() => dom.overlay.classList.add("d-none"), 300);
}

// pinta el “estado” en pantalla: badge verde si Activo, rojo si Inactivo
// intención: que el estado sea visible sin leer texto plano.
function badgeEstado(estado) {
  const esActivo = String(estado).toLowerCase() === "activo";
  return `<span class="badge ${esActivo ? "bg-success" : "bg-danger"}">${estado}</span>`;
}

// render de tabla: lista -> filas HTML
// regla: si cambia lista (agregar/editar/eliminar), se llama pintar().
function pintar(dom) {
  dom.tbody.innerHTML = lista.map(c => `
    <tr>
      <td>${c.id}</td>
      <td>${c.nombre}</td>
      <td>${c.desc}</td>
      <td>${c.fecha}</td>
      <td>${badgeEstado(c.estado)}</td>
      <td>
        <button class="btn btn-sm btn-outline-primary me-1 btn-editar" data-id="${c.id}" type="button">
          <i class="bi bi-pencil-square"></i> Editar
        </button>
        <button class="btn btn-sm btn-outline-danger btn-eliminar" data-id="${c.id}" type="button">
          <i class="bi bi-trash"></i> Eliminar
        </button>
      </td>
    </tr>
  `).join("");
}

// extrae lo escrito por el usuario en el form -> objeto “categoría”
function formLeer(dom) {
  return {
    nombre: dom.inpNombre.value.trim(),
    desc: dom.inpDesc.value.trim(),
    fecha: dom.inpFecha.value,
    estado: dom.selEstado.value,
  };
}

// valida antes de tocar el estado (evita registros incompletos o incoherentes)
function formValidar(d) {
  if (!d.nombre) return "Nombre requerido.";
  if (!d.desc) return "Descripción requerida.";
  if (!d.fecha) return "Fecha requerida.";
  if (!d.estado) return "Estado requerido.";
  return "";
}

// deja el form listo para un “nuevo” (sin residuos de edición anterior)
function formLimpiar(dom) {
  dom.form.reset();
  dom.inpFecha.valueAsDate = new Date();
  dom.selEstado.value = "Activo";
}

// carga una categoría al form (para editar)
// intención: el usuario no reescribe todo, solo modifica lo necesario.
function formCargar(dom, c) {
  dom.inpNombre.value = c.nombre;
  dom.inpDesc.value = c.desc;
  dom.inpFecha.value = c.fecha;
  dom.selEstado.value = c.estado;
}

// INSERT en memoria
function agregar(d) {
  lista.push({ id: nuevoId(), ...d });
}

// UPDATE en memoria
// devuelve false si el id no existe (control de integridad)
function actualizar(id, d) {
  const i = lista.findIndex(c => c.id === id);
  if (i === -1) return false;
  lista[i] = { id, ...d };
  return true;
}

// DELETE en memoria (devuelve el eliminado para mensajes)
function quitar(id) {
  const c = lista.find(x => x.id === id);
  if (!c) return null;
  lista = lista.filter(x => x.id !== id);
  return c;
}

// abre modal en modo “nuevo”
// intención: form limpio + overlay de carga + título correcto.
async function abrirNuevo(dom) {
  idEdit = null;
  dom.modalTitulo.textContent = "Agregar Nueva Categoría";

  cargaOn(dom, "Cargando formulario...");
  await esperar(1200);

  formLimpiar(dom);
  cargaOff(dom);
  modal.show();
}

// abre modal en modo “editar”
// intención: fijar idEdit, cargar datos, mostrar overlay y abrir.
async function abrirEditar(dom, id) {
  const c = lista.find(x => x.id === id);
  if (!c) return alert("Categoría no encontrada.");

  idEdit = id;
  dom.modalTitulo.textContent = "Editar Categoría";

  cargaOn(dom, "Cargando categoría...");
  await esperar(1200);

  formCargar(dom, c);
  cargaOff(dom);
  modal.show();
}

// guardado único por submit del form
// decisión: idEdit != null => UPDATE, si no => INSERT.
// al final: repinta tabla + cierra modal + limpia modo.
async function guardar(dom, e) {
  e.preventDefault();

  const d = formLeer(dom);
  const err = formValidar(d);
  if (err) return alert(err);

  cargaOn(dom, "Guardando categoría...");
  await esperar(1500);

  if (idEdit !== null) {
    const ok = actualizar(idEdit, d);
    if (!ok) {
      cargaOff(dom);
      return alert("No se pudo actualizar (categoría no existe).");
    }
  } else {
    agregar(d);
  }

  pintar(dom);
  cargaOff(dom);
  modal.hide();
  idEdit = null;
}

// eliminación con confirmación + overlay + repintado
async function eliminarConCarga(dom, id) {
  const c = lista.find(x => x.id === id);
  if (!c) return alert("Categoría no encontrada.");

  const ok = confirm(`¿Eliminar "${c.nombre}"?`);
  if (!ok) return;

  cargaOn(dom, "Eliminando categoría...");
  await esperar(1300);

  const borrado = quitar(id);
  pintar(dom);

  cargaOff(dom);
  if (borrado) alert(`Categoría "${borrado.nombre}" eliminada correctamente.`);
}

// conecta la UI con la lógica.
// sin esto, la tabla se ve, pero “no pasa nada” al hacer click.
function enlazar(dom) {
  // abrir modal nuevo
  dom.btnNuevo.addEventListener("click", () => abrirNuevo(dom));

  // guardado único (depende de botón type="submit" en el modal)
  dom.form.addEventListener("submit", (e) => guardar(dom, e));

  // delegación de eventos en el tbody:
  // intención: las filas se regeneran con pintar(), pero el listener queda.
  dom.tbody.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const id = parseInt(btn.dataset.id, 10);
    if (Number.isNaN(id)) return;

    if (btn.classList.contains("btn-editar")) abrirEditar(dom, id);
    if (btn.classList.contains("btn-eliminar")) eliminarConCarga(dom, id);
  });

  // UX: foco automático al abrir
  dom.modalEl.addEventListener("shown.bs.modal", () => dom.inpNombre.focus());

  // UX: al cerrar modal, deja todo en estado “nuevo”
  dom.modalEl.addEventListener("hidden.bs.modal", () => {
    formLimpiar(dom);
    idEdit = null;
    dom.modalTitulo.textContent = "Agregar Nueva Categoría";
  });
}

// inicio del módulo.
// valida que el HTML tenga ids correctos y que Bootstrap esté cargado.
document.addEventListener("DOMContentLoaded", () => {
  const dom = capDom();

  if (!dom.btnNuevo || !dom.form || !dom.tbody || !dom.modalEl || !dom.overlay) {
    console.error("Faltan IDs en el HTML (btn, tbody, modal, form u overlay).");
    return;
  }

  if (typeof bootstrap === "undefined") {
    alert("Bootstrap no se cargó. Revisa el bundle.");
    return;
  }

  modal = new bootstrap.Modal(dom.modalEl);

  pintar(dom);
  enlazar(dom);
});
