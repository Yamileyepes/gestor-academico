
document.addEventListener('DOMContentLoaded', () => {
    const noteForm = document.getElementById('note-form');
    const tableBody = document.querySelector('table tbody');
    const modalTitle = document.getElementById('modalLabel');
    const modalElement = document.getElementById('modal');
    const modalBootstrap = new bootstrap.Modal(modalElement);
    
    let editMode = false;
    let rowToEdit = null;

    // --- FUNCIÓN: ABRIR MODAL PARA EDITAR ---
    tableBody.addEventListener('click', (e) => {
      // Detectar clic en Editar
    if (e.target.closest('.btn-outline-primary')) {
        editMode = true;
        rowToEdit = e.target.closest('tr');
        const cells = rowToEdit.cells;

        // Cambiar título del modal
        modalTitle.innerText = "Editar Nota";

        // Cargar datos actuales en los inputs (ajusta los IDs según tu HTML)
        // Buscamos el valor del estudiante por su texto
        const studentName = cells[1].innerText;
        const select = document.getElementById('studentOptions');
        for (let i = 0; i < select.options.length; i++) {
            if (select.options[i].text === studentName) {
                select.selectedIndex = i;
                break;
            }
        }
        
        document.getElementById('subject').value = cells[2].innerText;
        document.getElementById('grade').value = cells[3].innerText;

        modalBootstrap.show();
    }

      // --- FUNCIÓN: ELIMINAR ---
    if (e.target.closest('.btn-outline-danger')) {
        if (confirm('¿Deseas eliminar este registro?')) {
        e.target.closest('tr').remove();
        }
    }
    });

    // --- EVENTO: AL CERRAR EL MODAL (Resetear estado) ---
    modalElement.addEventListener('hidden.bs.modal', () => {
    editMode = false;
    rowToEdit = null;
    modalTitle.innerText = "Agregar notas";
    noteForm.reset();
    });

    // --- EVENTO: GUARDAR (CREAR O EDITAR) ---
    noteForm.addEventListener('submit', (e) => {
    e.preventDefault();

        const studentSelect = document.getElementById('studentOptions');
        const studentName = studentSelect.options[studentSelect.selectedIndex].text;
        const subject = document.getElementById('subject').value;
        const grade = parseFloat(document.getElementById('grade').value).toFixed(1);
        const statusBadge = grade >= 3.0 
        ? '<span class="badge bg-success">Aprobado</span>' 
        : '<span class="badge bg-danger">Reprobado</span>';

    if (editMode && rowToEdit) {
        // Actualizar fila existente
        rowToEdit.cells[1].innerText = studentName;
        rowToEdit.cells[2].innerText = subject;
        rowToEdit.cells[3].innerText = grade;
        rowToEdit.cells[5].innerHTML = statusBadge;
    } else {
        // Crear nueva fila
        const newId = tableBody.rows.length + 1;
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
        <td>${newId}</td>
        <td>${studentName}</td>
        <td>${subject}</td>
        <td>${grade}</td>
        <td>${new Date().toISOString().split('T')[0]}</td>
        <td>${statusBadge}</td>
        <td>
            <button class="btn btn-sm btn-outline-primary me-1"><i class="bi bi-pencil-square"></i> Editar</button>
            <button class="btn btn-sm btn-outline-danger"><i class="bi bi-trash"></i> Eliminar</button>
        </td>`;
        tableBody.appendChild(newRow);
    }

    modalBootstrap.hide();
    });
});
