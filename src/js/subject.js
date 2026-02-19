document.addEventListener('DOMContentLoaded', () => {

    // ─── ARREGLO EN MEMORIA ───────────────────────────────────────────────────
    let lista = [
        { id: 1, codigo: 1010, nombre: "Historia Universal",  creditos: 3, docente: "Aldo Isidro Pérez García",         estado: "activo" },
        { id: 2, codigo: 1011, nombre: "Geografía",           creditos: 2, docente: "Alejandra Velásquez Solis",         estado: "activo" },
        { id: 3, codigo: 1012, nombre: "Filosofía y Cívica",  creditos: 6, docente: "Jairo Enrique Aquite Ramirez",      estado: "activo" },
        { id: 4, codigo: 1013, nombre: "Termodinámica",       creditos: 3, docente: "Lina Marcela Jaramillo Jaramillo",  estado: "activo" },
        { id: 5, codigo: 1014, nombre: "Química Inorgánica",  creditos: 6, docente: "Sorany Andrea Huertas Vargas",      estado: "activo" },
        { id: 6, codigo: 1015, nombre: "Literatura Universal", creditos: 4, docente: "Kaliena Mejia Zambrano",           estado: "activo" },
        { id: 7, codigo: 1016, nombre: "Lengua y Lingüística", creditos: 5, docente: "Diego Martínez",                  estado: "activo" },
    ];

    let nextId = lista.length + 1;
    let editMode = false;
    let editId = null;

    // ─── REFERENCIAS DOM ──────────────────────────────────────────────────────
    const tableBody     = document.querySelector('tbody');
    const subjectForm   = document.getElementById('subject-form');
    const modalElement  = document.getElementById('subjectModal');
    const modalTitle    = document.getElementById('subjectModalLabel');
    const btnSave       = document.getElementById('btn-save-subject');
    const modal         = bootstrap.Modal.getOrCreateInstance(modalElement);

    // ─── RENDERIZAR TABLA DESDE lista ─────────────────────────────────────────
    function renderTabla() {
        tableBody.innerHTML = '';
        lista.forEach(asignatura => {
            const estadoLabel = asignatura.estado === 'activo' ? 'Activa' : 'Inactiva';
            const estadoClass = asignatura.estado === 'activo' ? 'bg-success' : 'bg-danger';

            const fila = document.createElement('tr');
            fila.dataset.id = asignatura.id;
            fila.innerHTML = `
                <td>${asignatura.id}</td>
                <td>${asignatura.codigo}</td>
                <td>${asignatura.nombre}</td>
                <td>${asignatura.creditos}</td>
                <td>${asignatura.docente}</td>
                <td><span class="badge ${estadoClass}">${estadoLabel}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary btn-edit me-1">
                        <i class="bi bi-pencil-square"></i> Editar
                    </button>
                    <button class="btn btn-sm btn-outline-danger btn-delete">
                        <i class="bi bi-trash"></i> Eliminar
                    </button>
                </td>
            `;
            tableBody.appendChild(fila);
        });
    }

    // ─── CARGAR DATOS EN EL FORMULARIO (modo editar) ──────────────────────────
    function cargarFormulario(asignatura) {
        document.getElementById('subject-name').value     = asignatura.nombre;
        document.getElementById('subject-credits').value  = asignatura.creditos;
        document.getElementById('subject-teacher').value  = asignatura.docente;
        document.getElementById('program-subject').value  = asignatura.estado;
    }

    // ─── GUARDAR: AGREGAR O EDITAR ────────────────────────────────────────────
    subjectForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nuevaAsignatura = {
            nombre:   document.getElementById('subject-name').value,
            creditos: parseInt(document.getElementById('subject-credits').value),
            docente:  document.getElementById('subject-teacher').value,
            estado:   document.getElementById('program-subject').value,
        };

        if (editMode) {
            // Actualizar en el arreglo
            const index = lista.findIndex(a => a.id === editId);
            if (index !== -1) {
                lista[index] = { id: editId, codigo: lista[index].codigo, ...nuevaAsignatura };
            }
            editMode = false;
            editId = null;
            btnSave.textContent = 'Agregar Asignatura';
        } else {
            // Generar código automático: último código + 1
            const ultimoCodigo = lista.length > 0 ? Math.max(...lista.map(a => a.codigo)) : 1009;
            nuevaAsignatura.id     = nextId++;
            nuevaAsignatura.codigo = ultimoCodigo + 1;
            lista.push(nuevaAsignatura);
        }

        renderTabla();
        subjectForm.reset();
        modal.hide();
    });

    // ─── DELEGACIÓN DE EVENTOS: EDITAR Y ELIMINAR ────────────────────────────
    tableBody.addEventListener('click', (e) => {
        const btnDelete = e.target.closest('.btn-delete');
        const btnEdit   = e.target.closest('.btn-edit');
        const fila      = e.target.closest('tr');
        const id        = parseInt(fila?.dataset.id);

        // Eliminar
        if (btnDelete) {
            if (confirm('¿Estás seguro de eliminar esta asignatura?')) {
                lista = lista.filter(a => a.id !== id);
                renderTabla();
            }
        }

        // Editar
        if (btnEdit) {
            const asignatura = lista.find(a => a.id === id);
            if (!asignatura) return;

            editMode = true;
            editId   = id;

            cargarFormulario(asignatura);
            modalTitle.textContent  = 'Editar Asignatura';
            btnSave.textContent     = 'Guardar Cambios';
            modal.show();
        }
    });

    // ─── RESETEAR MODAL AL CERRARSE ───────────────────────────────────────────
    modalElement.addEventListener('hidden.bs.modal', () => {
        modalTitle.textContent = 'Agregar Nueva Asignatura';
        btnSave.textContent    = 'Agregar Asignatura';
        subjectForm.reset();
        editMode = false;
        editId   = null;
    });

    // ─── CARGA INICIAL ────────────────────────────────────────────────────────
    renderTabla();
});