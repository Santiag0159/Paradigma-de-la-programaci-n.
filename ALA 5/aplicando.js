const logic = require("logicjs");

// Desestructuramos las funciones necesarias
const lvar = logic.lvar,
  eq = logic.eq,
  and = logic.and,
  or = logic.or,
  run = logic.run;

console.log("Trabajando con superhéroes");
console.log();
// Relación de aliados usando or, and, eq
function esAliado(x, y) {
  return or(
    and(eq(x, "Batman"), eq(y, "Robin")),
    and(eq(x, "Robin"), eq(y, "Batman")),
    and(eq(x, "Iron man"), eq(y, "Spider-man")),
    and(eq(x, "Spider-man"), eq(y, "Iron man")),
    and(eq(x, "Wonder woman"), eq(y, "Superman")),
    and(eq(x, "Superman"), eq(y, "Wonder woman"))
  );
}
//enemigos
function esEnemigo(x, y) {
  return or(
    and(eq(x, "Batman"), eq(y, "Joker")),
    and(eq(x, "Spider-man"), eq(y, "Green goblin")),
    and(eq(x, "Superman"), eq(y, "Lex luthor"))
  );
}
//mentores
function esMentor(x, y) {
  return or(
    and(eq(x, "Batman"), eq(y, "Robin")),
    and(eq(x, "Iron man"), eq(y, "Spider-man"))
  );
}

console.log("Consultas...");
console.log();

//aliados de Batman
console.log("Consulta 1: Aliados de batman");
console.log("Query: esAliado(\"Batman\", X)");

const x = lvar();
const aliadosBatman = run(esAliado("Batman", x), x);

console.log("Resultado:");
aliadosBatman.forEach((aliado, index) => {
  console.log("  " + (index + 1) + ". " + aliado);
});
console.log("\nTotal encontrados: " + aliadosBatman.length);
console.log();

//enemigos de Superman
console.log("Consulta 2: Enemigos de superman");
console.log("Query: esEnemigo(\"Superman\", X)");

const enemigosSuperman = run(esEnemigo("Superman", x), x);

console.log("Resultado:");
enemigosSuperman.forEach((enemigo, index) => {
  console.log("  " + (index + 1) + ". " + enemigo);
});
console.log("\nTotal encontrados: " + enemigosSuperman.length);
console.log();

//mentor de Spider-man
console.log("Consulta 3: Mentor de spider-man");
console.log("Query: esMentor(X, \"Spider-man\")");

const mentorSpiderman = run(esMentor(x, "Spider-man"), x);

console.log("Resultado:");
mentorSpiderman.forEach((mentor, index) => {
  console.log("  " + (index + 1) + ". " + mentor);
});
console.log("\nTotal encontrados: " + mentorSpiderman.length);
console.log();
//pares héroe-aliado

console.log("Consulta 4: Todos los pares héroe-aliado");
console.log("Query: esAliado(X, Y)");

const y = lvar();
const paresAliados = run(esAliado(x, y), [x, y]);

const paresUnicos = [];
paresAliados.forEach((par) => {
  if (Array.isArray(par) && par.length === 2) {
    const [heroe, aliado] = par;
    const yaExiste = paresUnicos.some(
      p => (p[0] === aliado && p[1] === heroe)
    );
    if (!yaExiste) {
      paresUnicos.push([heroe, aliado]);
    }
  }
});
console.log("Resultado:");
paresUnicos.forEach((par, index) => {
  console.log("  " + (index + 1) + ". " + par[0] + " <-> " + par[1]);
});
console.log("\nTotal de pares encontrados: " + paresUnicos.length);

console.log("Resumen  ");
console.log("Relaciones de alianza:");
console.log("  Batman <-> Robin");
console.log("  Iron man <-> Spider-man");
console.log("  Wonder woman <-> Superman");

console.log("Enemistad:");
console.log("  Batman -> Joker");
console.log("  Spider-man -> Green goblin");
console.log("  Superman -> Lex luthor");
console.log();

console.log("Mentoría:");
console.log("  Batman -> Robin");
console.log("  Iron man -> Spider-man");
console.log();
