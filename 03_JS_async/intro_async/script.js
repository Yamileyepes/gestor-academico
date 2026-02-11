const charName = document.getElementById("charNameText");
const charImg = document.getElementById("charImg");
const charInput = document.getElementById("charName");
const charBtn = document.getElementById("btnBuscar");

async function mostrarPersonajes() {
  try {
    const res = await fetch("https://dragonball-api.com/api/characters");
    if (!res.ok) throw new Error("Error HTTP: " + res.status);
    return await res.json();
  } catch (error) {
    console.error("Error en fetch:", error);
    return null;
  }
}

// En vez de devolver id, devuelve el OBJETO personaje (más útil)
async function buscarPersonajePorNombre(nombre) {
  const data = await mostrarPersonajes();
  if (!data || !data.items) return null;

  const name = nombre.trim().toLowerCase();
  if (!name) return null;

  // Búsqueda exacta (case-insensitive)
  const personaje = data.items.find(item => item.name.toLowerCase() === name);

  // Si quieres permitir coincidencia parcial, usa esto en lugar de lo anterior:
  // const personaje = data.items.find(item => item.name.toLowerCase().includes(name));

  return personaje ?? null;
}

charBtn.addEventListener("click", async () => {
  const personaje = await buscarPersonajePorNombre(charInput.value);

  if (!personaje) {
    charName.textContent = "Personaje no encontrado";
    charImg.removeAttribute("src");
    return;
  }

  charName.textContent = personaje.name;
  charImg.src = personaje.image;
  charImg.alt = personaje.name;
});
