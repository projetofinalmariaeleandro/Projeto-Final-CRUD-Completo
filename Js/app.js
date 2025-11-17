// ---------------- CLIENTES ----------------
let clientes = JSON.parse(localStorage.getItem("clientes") || "[]");

const formCliente = document.getElementById("formCliente");
if(formCliente){
  formCliente.addEventListener("submit", e=>{
    e.preventDefault();
    const obj = {
      id: document.getElementById("idCliente").value || Date.now(),
      nome: document.getElementById("nomeCliente").value,
      email: document.getElementById("emailCliente").value,
      tel: document.getElementById("telCliente").value,
    };
    clientes = clientes.filter(x=>x.id!=obj.id);
    clientes.push(obj);
    localStorage.setItem("clientes", JSON.stringify(clientes));
    carregarClientes();
    formCliente.reset();
  });
}

function carregarClientes(){
  const tbody = document.querySelector("#tabelaClientes tbody");
  if(!tbody) return;
  tbody.innerHTML = "";
  clientes.forEach(c=>{
    tbody.innerHTML += `
      <tr>
        <td>${c.nome}</td>
        <td>${c.email}</td>
        <td>${c.tel}</td>
        <td><button onclick="delCliente(${c.id})" class="btn danger">X</button></td>
      </tr>`;
  });
}
carregarClientes();

function delCliente(id){
  clientes = clientes.filter(c=>c.id!=id);
  localStorage.setItem("clientes", JSON.stringify(clientes));
  carregarClientes();
}

// ---------------- LIVROS ----------------
let livros = JSON.parse(localStorage.getItem("livros") || "[]");
let paginaAtual = 1;
const porPagina = 6;
let categoriaAtiva = "Todos";

const formLivro = document.getElementById("formLivro");
if(formLivro){
  formLivro.addEventListener("submit", e=>{
    e.preventDefault();
    const obj = {
      id: document.getElementById("idLivro").value || Date.now(),
      titulo: titulo.value,
      autor: autor.value,
      ano: ano.value,
      genero: genero.value,
      capa: capa.value || "https://placehold.co/300x400"
    };
    livros = livros.filter(l=>l.id!=obj.id);
    livros.push(obj);
    localStorage.setItem("livros", JSON.stringify(livros));
    formLivro.reset();
    atualizar();
  });
}

function atualizar(){
  montarCategorias();
  montarCards();
  montarPaginacao();
}

function montarCategorias(){
  const div = document.getElementById("categorias");
  const generos = ["Todos", ...new Set(livros.map(l=>l.genero))];
  div.innerHTML = "";
  generos.forEach(g=>{
    div.innerHTML += `<button class="${g==categoriaAtiva?"active":""}" onclick="filtrar('${g}')">${g}</button>`;
  });
}

function filtrar(g){
  categoriaAtiva = g;
  paginaAtual = 1;
  atualizar();
}

function montarCards(){
  const cards = document.getElementById("cards");
  let lista = livros;

  if(categoriaAtiva!="Todos")
    lista = lista.filter(l=>l.genero == categoriaAtiva);

  const inicio = (paginaAtual-1)*porPagina;
  const paginados = lista.slice(inicio, inicio+porPagina);

  cards.innerHTML = "";
  paginados.forEach(l=>{
    cards.innerHTML += `
      <div class="card">
        <img src="${l.capa}">
        <h3>${l.titulo}</h3>
        <small>${l.autor} — ${l.genero}</small>
        <p style="margin-top:10px;">Ano: ${l.ano}</p>
      </div>`;
  });
}

function montarPaginacao(){
  const div = document.getElementById("pagination");

  let lista = livros;
  if(categoriaAtiva!="Todos")
    lista = lista.filter(l=>l.genero == categoriaAtiva);

  const total = Math.ceil(lista.length / porPagina);

  div.innerHTML = "";
  for(let i=1;i<=total;i++){
    div.innerHTML += `<button onclick="mudarPag(${i})" class="${i==paginaAtual?"active":""}">${i}</button>`;
  }
}

function mudarPag(i){
  paginaAtual = i;
  atualizar();
}

// EXPORTAR
const exportBtn = document.getElementById("exportLivros");
if(exportBtn){
  exportBtn.onclick = ()=> {
    const blob = new Blob([JSON.stringify(livros)], {type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "acervo.json";
    a.click();
  };
}

// IMPORTAR
const inputImport = document.getElementById("inputImport");
if(inputImport){
  inputImport.addEventListener("change", ()=>{
    const file = inputImport.files[0];
    const reader = new FileReader();
    reader.onload = ()=> {
      livros = JSON.parse(reader.result);
      localStorage.setItem("livros", JSON.stringify(livros));
      atualizar();
    };
    reader.readAsText(file);
  });
}

// Inicializar
atualizar();
