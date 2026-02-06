let strJson = `{
  "name": "John Doe",
  "age": 30,
  "isStudent": false,
  "courses": ["Math", "Science", "History"]
}`;

// PARSEAR A JSON
let json = JSON.parse(strJson);
// let json = JSON.stringify(strJson);

console.log("Data: " + strJson + "\n tipo: " + typeof(strJson));

console.log("Data: " + `
  ${json.name}, ${json.age}, ${json.isStudent}, ${json.courses}
  ` + "\ tipo: " + typeof(json));

// STRINGIFY A JSON
let strJson2 = JSON.stringify(json);
console.log("Data: " + strJson2 + "\n tipo: " + typeof(strJson2));
