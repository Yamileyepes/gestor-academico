// LLENAR TABLA ESTUDIANTES
let students = [
  { id: 1, name: "Yamile Yepes", Number: 123888222, email: "yami@gmail.com", text: "Historia", text1: '<span class="badge bg-success">Activo</span>' },
  { id: 2, name: "Karen Zapata", Number: 111800990, email: "karen@gmail.com", text: "Filosofía", text1: '<span class="badge bg-success">Activo</span>' },
  { id: 3, name: "Valentina Gallego", Number: 12034260, email: "valen@gmail.com", text: "Física", text1: '<span class="badge bg-danger">Inactivo</span>' },
  { id: 4, name: "Diana Diaz", Number: 1502338047, email: "diana@gmail.com", text: "Química", text1: '<span class="badge bg-success">Activo</span>' },
  { id: 5, name: "Carlos Ramírez", Number: 40082724, email: "carlos@gmail.com", text: "Literatura", text1: '<span class="badge bg-danger">Inactivo</span>' },
  { id: 6, name: "Jhon Montoya", Number: 70286946, email: "jhon@gmail.com", text: "Historia", text1: '<span class="badge bg-danger">Inactivo</span>' },
  { id: 7, name: "Cristian Álvarez", Number: 48965238, email: "cristian@gmail.com", text: "Química", text1: '<span class="badge bg-success">Activo</span>' }
];

console.log('Estudiantes iniciales:', students);

// Capturar variables
const studentsBody = document.getElementById("studentsBody");
const btnAddStudent = document.getElementById("btn-add-student");
const studentModalElement = document.getElementById('studentModal');
const studentForm = document.getElementById("student-form");
const modalTitle = document.getElementById("studentModalLabel");

// Variable para la instancia de la modal
let studentModal;

// Variable para trackear si estamos en modo edición
let editingStudentId = null;

// Función para llenar la tabla
function fillStudentsTable() {
  studentsBody.innerHTML = students.map(p => `
    <tr data-id="${p.id}">
      <td>${p.id}</td>
      <td>${p.name}</td>
      <td>${p.Number}</td>
      <td>${p.email}</td>
      <td>${p.text}</td>
      <td>${p.text1}</td>
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

// Función para agregar un estudiante
function addStudent() {
  const name = document.getElementById("student-name").value.trim();
  const Number = document.getElementById("student-number").value.trim();
  const email = document.getElementById("student-email").value.trim();
  const text = document.getElementById("program-student").value.trim();   
  const statusValue = document.getElementById("student-status").value.trim();

  // Validar que los campos no estén vacíos
  if (!name || !Number || !email || !text || !statusValue) {
    alert("Por favor, complete todos los campos correctamente.");
    return false;
  }

  // ✅ Construir el badge según el estado seleccionado
  const text1 = statusValue === "Activo"
    ? '<span class="badge bg-success">Activo</span>'
    : '<span class="badge bg-danger">Inactivo</span>';

  // Generar nuevo ID
  const newId = students.length > 0 ? Math.max(...students.map(p => p.id)) + 1 : 1;

  const newStudent = {
    id: newId,
    name: name,
    Number: Number,
    email: email,
    text: text,
    text1: text1
  };

  students.push(newStudent);
  console.log('Estudiante agregado:', newStudent);
  return true;
}

// Función para editar un estudiante
function editStudent(id) {
  console.log('Editando estudiante con ID:', id);
  
  // Buscar el estudiante en el array
  const student = students.find(p => p.id === id);
  
  if (!student) {
    alert('Estudiantes no encontrado');
    return;
  }
  
  // Cambiar el título de la modal
  modalTitle.textContent = 'Editar estudiante';
  
  // Llenar el formulario con los datos del estudiante
  document.getElementById("student-name").value = student.name;
  document.getElementById("student-number").value = student.Number;
  document.getElementById("student-email").value = student.email;
  document.getElementById("program-student").value = student.text;
  
  // ✅ Extraer el texto del badge para asignarlo al select
  const isActivo = student.text1.includes("Activo");
  document.getElementById("student-status").value = isActivo ? "Activo" : "Inactivo";
  
  // Guardar el ID del estudiante que estamos editando
  editingStudentId = id;
  
  // Mostrar la modal
  studentModal.show();
}

// Función para actualizar un estudiante (después de editar)
function updateStudent() {
  if (editingStudentId === null) {
    return false;
  }
  
  // Capturar los valores del formulario
  const name = document.getElementById("student-name").value.trim();
  const Number = document.getElementById("student-number").value.trim();
  const email = document.getElementById("student-email").value.trim();
  const text = document.getElementById("program-student").value;
  const statusValue = document.getElementById("student-status").value;

  // Validar que los campos no estén vacíos
  if (!name || !Number || !email || !text || !statusValue) {
    alert("Por favor, complete todos los campos correctamente.");
    return false;
  }
  // Construir el badge según el estado seleccionado
  const text1 = statusValue === "Activo"
    ? '<span class="badge bg-success">Activo</span>'
    : '<span class="badge bg-danger">Inactivo</span>';

  // Buscar el estudiante en el array
  const studentIndex = students.findIndex(p => p.id === editingStudentId);
  
  if (studentIndex === -1) {
    alert('Estudiante no encontrado');
    return false;
  }
  
  // Actualizar el estudiante
  const updatedStudent = {
    id: editingStudentId,
    name: name,
    Number: Number,
    email: email,
    text: text,
    text1: text1
  };
  
  students[studentIndex] = updatedStudent;
  console.log('Estudiante actualizado:', updatedStudent);
  
  return true;
}

// Función para eliminar un estudiante
function deleteStudent(id) {
  console.log('Eliminando estudiante con ID:', id);
  
  // Buscar el estudiante en el array
  const student = students.find(p => p.id === id);
  
  if (!student) {
    alert('Estudiante no encontrado');
    return;
  }
  
  // Confirmar eliminación
  const confirmDelete = confirm(`¿Estás seguro de eliminar "${student.name}"?`);
  
  if (confirmDelete) {
    // Eliminar del array
    students = students.filter(p => p.id !== id);
    console.log('Estudiante eliminado:', student);
    
    // Actualizar la tabla
    fillStudentsTable();
    
    // Mostrar mensaje de éxito
    alert(`Estudiante "${student.name}" eliminado correctamente`);
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
  studentModal = new bootstrap.Modal(studentModalElement);
  
  console.log('✅ Modal inicializada');
  
  // Llenar la tabla
  fillStudentsTable();
  
  // Evento para abrir la modal (Agregar)
  btnAddStudent.addEventListener("click", () => {
    console.log('Botón "Agregar Estudiante" clickeado');
    
    // Cambiar el título de la modal
    modalTitle.textContent = 'Agregar Nuevo Estudiante';
    
    // Limpiar el formulario
    studentForm.reset();
    
    
    // Resetear el modo edición
    editingStudentId = null;
    
    // Mostrar la modal
    studentModal.show();
  });
  
  // Evento para el formulario (Guardar)
  studentForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    console.log('Formulario enviado');
    
    let success = false;
    
    // Verificar si estamos en modo edición o agregando
    if (editingStudentId !== null) {
      // Modo edición
      success = updateStudent();
    } else {
      // Modo agregar
      success = addStudent();
    }
    
    if (success) {
      // Actualizar la tabla
      fillStudentsTable();
      
      // Limpiar formulario
      studentForm.reset();
      
      // Cerrar modal
      studentModal.hide();
      
      // Mostrar mensaje de éxito
      const message = editingStudentId !== null ? 'Estudiante actualizado exitosamente!' : 'Estudiante agregado exitosamente!';
      alert(message);
      
      // Resetear el modo edición
      editingStudentId = null;
    }
  });
  
  // Eventos delegados para botones de editar y eliminar
  studentsBody.addEventListener('click', (e) => {
    const target = e.target.closest('button');
    
    if (!target) return;
    
    const studentId = parseInt(target.getAttribute('data-id'));
    
    if (target.classList.contains('edit-btn')) {
      editStudent(studentId);
    } else if (target.classList.contains('delete-btn')) {
      deleteStudent(studentId);
    }
  });
  
  // Eventos de la modal
  studentModalElement.addEventListener('shown.bs.modal', function () {
    console.log('Modal completamente visible');
    // Enfocar el primer campo al abrir
    document.getElementById('student-name').focus();
  });
  
  studentModalElement.addEventListener('hidden.bs.modal', function () {
    console.log('Modal completamente cerrada');
    // Limpiar formulario al cerrar
    studentForm.reset();
    // Resetear el modo edición
    editingStudentId = null;
    // Restaurar el título
    modalTitle.textContent = 'Agregar Nuevo Estudiante';
  });
  
  console.log('✅ Inicialización completa');
});