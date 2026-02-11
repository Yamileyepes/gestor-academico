// JS sync
console.log("Paso 1");
console.log("Paso 2");
simularTareaAsincrona(15000);
console.log("Paso 3");
tareaSincrona();

function tareaSincrona() {
  console.log("Tarea sincrona");
}

// Simulación Async

function simularTareaAsincrona( tiempo ) {
  // agregarselo a la fecha actual + tiempo
  const futura = Date.now() + tiempo;

  while( Date.now() < futura ) {
    // va a bloquear el hilo principal hasta que la fecha sea igual o mayor a futura
  }
  console.log("Tarea asincrona simulada");
}

// CALLBACK
function existeEnBd( usuario, contrasena ) {
  console.log(`Hola ${usuario} y ${contrasena} existen, bienvenido a la base de datos`);
}

// Un Callback es una función que se pasa como argumento a otra función, y se ejecuta después de que la función principal ha terminado su tarea. Es una forma de manejar la asincronía en Js

function funcionConCallback( usuario, contrasena, callback ) {
  console.log("Esta es una función callback para validar usuario");
  if( usuario === "" || contrasena === "" ) {
    console.log("Por favor diligencie todos los campos");
    return;
  }
  callback(usuario, contrasena);  
}

funcionConCallback("juan", "123456", existeEnBd);
