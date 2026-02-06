// Variables
const apiUri = 'https://jsonplaceholder.typicode.com/'

// Métodos para post
let recursoPost = '/posts';
const postRespuesta = await fetch(apiUri + recursoPost);

const postData = await postRespuesta.json();

console.log(postRespuesta);
console.log(postData);
// Leer todos los datos del recurso todos
let recursoTodos = '/todos';
const todoRespuesta = await fetch(apiUri + recursoTodos);

const todoData = await todoRespuesta.json();

console.log(todoRespuesta);
console.log(todoData);

// Métodos ...
