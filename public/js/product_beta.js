

// LLENAR TABLA ESTUDIANTES
let students = [
  { id: 1, name: "Yamile Yepes", Number: 123888222, email: "yami@gmail.com", text: "Historia", text1: "activo" },
  { id: 2, name: "Karen Zapata", Number: 111800990, email: "karen@gmail.com", text: "Filosofía", text1: "activo" },
  { id: 3, name: "Valentina Gallego", Number: 12034260, email: "valen@gmail.com", text: "Física", text1: "inactivo" },
  { id: 4, name: "Diana Diaz", Number: 1502338047, email: "diana@gmail.com", text: "Química", text1: "activo" },
  { id: 5, name: "Carlos Ramírez", Number: 40082724, email: "carlos@gmail.com", text: "Literatura", text1: "inactivo" }
];

console.log(students);

// Capturar variables
const studentsBody = document.getElementById("studentsBody");
const btnAddStudent = document.getElementById("btn-add-student");
const studentModalElement = document.getElementById('studentModal');


// Función para llenar la tabla
function fillStudentsTable() {
  studentsBody.innerHTML = students.map( p => `
    <tr>
        <td>${p.id}</td>
        <td>${p.name}</td>
        <td>$${p.Number}</td>
        <td>${p.email}</td>
        <td>${p.text}</td>
        <td>${p.text1}</td>
        <td>
          <button class="btn btn-sm btn-outline-primary" onclick="editStudent(${p.id})">Editar</button>
          <button class="btn btn-sm btn-outline-danger" onclick="deleteStudent(${p.id})">Eliminar</button>
        </td>
      </tr>`
    ).join("");    
}

document.addEventListener("DOMContentLoaded", () => {
  fillPStudentsTable();
});

// Mostrar la modal de agregar estudiante
// Para agregar el id, voy a buscar el id más alto y sumarle 1
const studentModal = new bootstrap.Modal(studentModalElement);

btnAddStudent.addEventListener("click", () => {
  studentModal.show();
});

// guardar el estudiante
const form = document.getElementById("student-form");
const btnSaveStudent = document.getElementById("btn-save-student");
btnSaveStudent.addEventListener("click", () => {
  // Capturar los valores del formulario
  const name = document.getElementById("student-name").value;
  const Number = parseInt(document.getElementById("student-number").value);
  const email = document.getElementById("student-email").value;
  const text = parseInt(document.getElementById("program-student").value);
  const text1 = document.getElementById("student-status").value;

  // Validar que los campos no estén vacíos
  if (!name || isNaN(Number) || !email || isNaN(text) || !text1) {
    alert("Por favor, complete todos los campos correctamente.");
    return;
  }

  // Generar nuevo ID
  const newId = students.length > 0 ? Math.max(...students.map(p => p.id)) + 1 : 1;

  // Crear nuevo estudiante
  const newStudent = {
    id: newId,
    name: name,
    Number: Number,
    email: email,
    text: text,
    text1: text1
  };

  // Agregar el nuevo estudiante al array de estudiantes
  students.push(newStudent);

  // Actualizar la tabla
  fillStudentsTable();

  // Cerrar la modal
  form.reset(); // Limpiar el formulario

  studentModal.hide();
});

// Editar estudiante

// Eliminar estudiante