const charImage = document.getElementById("charImage");
const charName = document.getElementById("charName");
const charSpecies = document.getElementById("species");
const inputName = document.getElementById("inputName");

const btnBuscar = document.getElementById("btnBuscar");
const URL_BASE = "https://rickandmortyapi.com/api/character/";

// Estado base
function reset() {
  charImage.src = "./assets/humanoEstandar.jpg";
  charName.textContent = "Pepita Perez";
  charSpecies.textContent = "Humano";
}

// reset();

// Sync Vs Async
// Sync: El código se ejecuta de manera secuencial, bloqueando el hilo principal hasta que se complete una tarea.
// Async: El código puede ejecutarse de manera no secuencial, permitiendo que otras tareas se ejecuten mientras se espera la respuesta de una operación.

async function buscarDataAsync() {
  // fetch: es una función que me va a permitir consumir apis
  const response = await fetch(URL_BASE);
if (!response.ok) {
    console.error("Error en la consulta:", response.status);
    return undefined;
}

  const data = await response.json();
  console.log(data);
  return data.results;
}

const mock = buscarDataAsync();
console.log(mock);

// plantear una función similar, pero con promises

// función para asignar directamente los valores de la respuesta
function asignarValores(data) {
  // img, nombre, desc
  console.log(data);
  
  // buscar id por nombre

  const id = 0;
  charImage.src = data[id].image;
  charName.textContent = data[id].name;
  charSpecies.textContent = data[id].species;

}

async function cargarBase() {
  const data = await buscarDataAsync();
  if (data !== undefined) {
    asignarValores(data);
  } else {
    console.log("No se pudo cargar la información");
    reset();
  }
}

cargarBase();

btnBuscar.addEventListener("click", async () => {
  console.log("Botón clickeado");

  const data = await buscarPersonajePorNombre(inputName.value);

  console.log(data);
  

  console.log("Evento click" + data);
  if (!data) {
    console.log("Personaje no encontrado");
    reset();
    return;
  }
  charImage.src = data.image;
  charName.textContent = data.name;
  charSpecies.textContent = data.species;
});

async function buscarPersonajePorNombre(inputName) {
    const data = await buscarDataAsync();

    const charName = inputName.trim().toLowerCase();
    console.log(charName);
    
    if (!charName) return null;

    const personaje = data.find(item => item.name.toLowerCase() === charName);
    console.log(personaje);
    
    return personaje ?? null;
}