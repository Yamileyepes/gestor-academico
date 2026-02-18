document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('tbody');
    const subjectForm = document.getElementById('subject-form');
    const modalElement = document.getElementById('subjectModal');
    const modal = new bootstrap.Modal(modalElement);
    
    let editMode = false;
    let rowToEdit = null;

    // --- FUNCIÓN: GUARDAR / EDITAR ---
    subjectForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const data = {
            name: document.getElementById('subject-name').value,
            credits: document.getElementById('subject-credits').value,
            teacher: document.getElementById('subject-teacher').value,
            status: document.getElementById('program-subject').value
        };

        if (editMode) {
            // Actualizar fila existente
            rowToEdit.cells[2].innerText = data.name;
            rowToEdit.cells[3].innerText = data.credits;
            rowToEdit.cells[4].innerText = data.teacher;
            rowToEdit.cells[5].innerHTML = `<span class="badge ${data.status === 'activo' ? 'bg-success' : 'bg-danger'}">${data.status}</span>`;
            
            editMode = false;
            rowToEdit = null;
        } else {
            // Crear nueva fila
            const nextId = tableBody.rows.length + 1;
            const newRow = tableBody.insertRow();
            newRow.innerHTML = `
                <td>${nextId}</td>
                <td>${1010 + nextId}</td>
                <td>${data.name}</td>
                <td>${data.credits}</td>
                <td>${data.teacher}</td>
                <td><span class="badge ${data.status === 'activo' ? 'bg-success' : 'bg-danger'}">${data.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary btn-edit me-1"><i class="bi bi-pencil-square"></i> Editar</button>
                    <button class="btn btn-sm btn-outline-danger btn-delete"><i class="bi bi-trash"></i> Eliminar</button>
                </td>
            `;
        }

        subjectForm.reset();
        modal.hide();
    });

    // --- DELEGACIÓN DE EVENTOS: EDITAR Y ELIMINAR ---
    tableBody.addEventListener('click', (e) => {
        const btnDelete = e.target.closest('.btn-delete');
        const btnEdit = e.target.closest('.btn-edit');

        // Lógica Eliminar
        if (btnDelete) {
            if (confirm('¿Estás seguro de eliminar esta asignatura?')) {
                btnDelete.closest('tr').remove();
            }
        }

        // Lógica Editar
        if (btnEdit) {
            editMode = true;
            rowToEdit = btnEdit.closest('tr');

            // Cargar datos actuales en el modal
            document.getElementById('subject-name').value = rowToEdit.cells[2].innerText;
            document.getElementById('subject-credits').value = rowToEdit.cells[3].innerText;
            document.getElementById('subject-teacher').value = rowToEdit.cells[4].innerText;
            document.getElementById('program-subject').value = rowToEdit.cells[5].innerText.toLowerCase();

            document.getElementById('subjectModalLabel').innerText = "Editar Asignatura";
            modal.show();
        }
    });

    // Resetear el título del modal al cerrarlo
    modalElement.addEventListener('hidden.bs.modal', () => {
        document.getElementById('subjectModalLabel').innerText = "Agregar Nueva Asignatura";
        subjectForm.reset();
        editMode = false;
    });
});