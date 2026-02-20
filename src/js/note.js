document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // 🗃️  ARREGLO EN MEMORIA — fuente de verdad de todas las notas
  // ============================================================
  let lista = [
    { id: 1, estudiante: 'Yamile Yepes',      asignatura: 'Historia Universal',  nota: 3.8, fecha: '2026-01-10', observacion: 'Aprobó' },
    { id: 2, estudiante: 'Karen Zapata',      asignatura: 'Filosofía y Cívica',  nota: 4.0, fecha: '2026-01-12', observacion: 'Aprobó' },
    { id: 3, estudiante: 'Valentina Gallego', asignatura: 'Termodinámica',        nota: 2.0, fecha: '2026-01-15', observacion: 'Reprobó' },
    { id: 4, estudiante: 'Diana Diaz',        asignatura: 'Química Inorgánica',   nota: 4.8, fecha: '2026-01-18', observacion: 'Aprobó' },
    { id: 5, estudiante: 'Carlos Ramírez',    asignatura: 'Literatura Universal', nota: 1.0, fecha: '2026-01-20', observacion: 'Reprobó' },
    { id: 6, estudiante: 'Jhon Montoya',      asignatura: 'Historia Universal',   nota: 2.8, fecha: '2026-01-22', observacion: 'Reprobó' },
    { id: 7, estudiante: 'Cristian Álvarez',  asignatura: 'Química Inorgánica',   nota: 3.5, fecha: '2026-01-25', observacion: 'Aprobó' },
  ];

  let nextId   = lista.length + 1; // contador autoincremental de IDs
  let editMode = false;
  let editId   = null;             // ID del objeto en lista que se está editando

  // ── Referencias al DOM ──────────────────────────────────────
  const noteForm     = document.getElementById('note-form');
  const tableBody    = document.querySelector('table tbody');
  const modalTitle   = document.getElementById('modalLabel');
  const modalElement = document.getElementById('modal');
  const modalBS      = new bootstrap.Modal(modalElement);

  // ============================================================
  // 🖨️  RENDERIZAR — borra la tabla y la reconstruye desde lista
  // ============================================================
  function renderTabla() {
    tableBody.innerHTML = ''; // limpia el DOM

    lista.forEach((item) => {
      const aprobado = item.nota >= 3.0;
      const badge    = aprobado
        ? '<span class="badge bg-success">Aprobó</span>'
        : '<span class="badge bg-danger">Reprobó</span>';

      const fila = document.createElement('tr');
      fila.dataset.id = item.id; // guardamos el ID en la fila para identificarla

      fila.innerHTML = `
        <td>${item.id}</td>
        <td>${item.estudiante}</td>
        <td>${item.asignatura}</td>
        <td>${item.nota.toFixed(1)}</td>
        <td>${item.fecha}</td>
        <td>${badge}</td>
        <td>
          <button class="btn btn-sm btn-outline-primary me-1 btn-editar">
            <i class="bi bi-pencil-square"></i> Editar
          </button>
          <button class="btn btn-sm btn-outline-danger btn-eliminar">
            <i class="bi bi-trash"></i> Eliminar
          </button>
        </td>`;

      tableBody.appendChild(fila);
    });
  }

  // Render inicial al cargar la página
  renderTabla();

  // ============================================================
  // ➕  ABRIR MODAL — modo agregar
  // ============================================================
  // El botón "Registrar Nota" ya tiene data-bs-toggle en el HTML,
  // solo necesitamos asegurarnos de que el título sea correcto.
  document.querySelector('[data-bs-target="#modal"]').addEventListener('click', () => {
    editMode = false;
    editId   = null;
    modalTitle.innerText = '➕ Agregar Nota';
    noteForm.reset();
    noteForm.classList.remove('was-validated');
  });

  // ============================================================
  // ✏️  EDITAR / 🗑️  ELIMINAR — delegación de eventos en tbody
  // ============================================================
  tableBody.addEventListener('click', (e) => {

    // ── EDITAR ──────────────────────────────────────────────
    if (e.target.closest('.btn-editar')) {
      const fila = e.target.closest('tr');
      const id   = parseInt(fila.dataset.id);
      const item = lista.find(n => n.id === id);

      if (!item) return;

      editMode = true;
      editId   = id;
      modalTitle.innerText = '✏️ Editar Nota';
      noteForm.classList.remove('was-validated');

      // Cargar valores en el formulario
      setSelectValue('studentOptions', item.estudiante);
      setSelectValue('subject',        item.asignatura);
      document.getElementById('grade').value        = item.nota;
      document.getElementById('subject-date').value = item.fecha;
      document.getElementById('observacion').value  = item.observacion;

      modalBS.show();
    }

    // ── ELIMINAR ─────────────────────────────────────────────
    if (e.target.closest('.btn-eliminar')) {
      const fila = e.target.closest('tr');
      const id   = parseInt(fila.dataset.id);

      if (confirm('¿Seguro que deseas eliminar este registro?')) {
        lista = lista.filter(n => n.id !== id); // 🗑️ elimina del arreglo
        renderTabla();                           // actualiza el DOM
        console.log('lista actualizada:', lista);
      }
    }
  });

  // ============================================================
  // 💾  GUARDAR — submit del formulario (agregar o editar)
  // ============================================================
  noteForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validación nativa de Bootstrap
    if (!noteForm.checkValidity()) {
      noteForm.classList.add('was-validated');
      return;
    }

    // Leer valores del formulario
    const estudiante  = document.getElementById('studentOptions').value;
    const asignatura  = document.getElementById('subject').value;
    const nota        = parseFloat(document.getElementById('grade').value);
    const fecha       = document.getElementById('subject-date').value;
    const observacion = document.getElementById('observacion').value.trim();

    if (editMode && editId !== null) {
      // ── EDITAR: actualiza el objeto en lista ───────────────
    const index = lista.findIndex(n => n.id === editId);
    if (index !== -1) {
        lista[index] = { id: editId, estudiante, asignatura, nota, fecha, observacion };
    }
    } else {
      // ── AGREGAR: crea un objeto nuevo y lo empuja a lista ──
    const nuevoItem = { id: nextId++, estudiante, asignatura, nota, fecha, observacion };
    lista.push(nuevoItem);
    }

    console.log('lista actualizada:', lista); // 👀 verifica en consola
    renderTabla();  // reconstruye la tabla desde el arreglo
    modalBS.hide(); // cierra el modal
});

  // ============================================================
  // 🔄  RESET al cerrar el modal
  // ============================================================
modalElement.addEventListener('hidden.bs.modal', () => {
    editMode = false;
    editId   = null;
    modalTitle.innerText = '➕ Agregar Nota';
    noteForm.reset();
    noteForm.classList.remove('was-validated');
});

  // ============================================================
  // 🛠️  UTILIDAD — seleccionar opción en un <select> por valor
  // ============================================================
function setSelectValue(selectId, value) {
    const select = document.getElementById(selectId);
    for (let i = 0; i < select.options.length; i++) {
    if (select.options[i].value === value) {
        select.selectedIndex = i;
        return;
    }
    }
}

});
