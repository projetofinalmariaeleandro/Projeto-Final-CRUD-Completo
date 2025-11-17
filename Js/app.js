// Utilitários
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
const uid = (prefix='id') => `${prefix}_${Math.random().toString(36).slice(2,9)}`;
const storage = {
  get(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback; }
  },
  set(key, val) { localStorage.setItem(key, JSON.stringify(val)); }
};

// Estado
let clientes = storage.get('clientes', []);
let livros = storage.get('livros', []);

// ---------- Funções Gerais ----------
function downloadJSON(obj, filename) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function importJSON(evt, onLoad){
  const file = evt.target.files?.[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try { const data = JSON.parse(reader.result); onLoad(data); }
    catch { alert('Falha ao ler JSON.'); }
  };
  reader.readAsText(file);
}

// ---------- Clientes ----------
function renderClientes() {
  const tbody = $('#tabelaClientes tbody');
  if(!tbody) return;
  tbody.innerHTML = '';
  if(clientes.length === 0) { $('#semClientes').hidden = false; return; }
  $('#semClientes').hidden = true;
  
  for(const c of clientes) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${c.nome}</td>
      <td>${c.email}</td>
      <td>${c.endereco}</td>
      <td>${c.nascimento || '-'}</td>
      <td class="right">
        <button class="btn ghost" data-edit="${c.id}">Editar</button>
        <button class="btn danger" data-del="${c.id}">Excluir</button>
      </td>`;
    tbody.appendChild(tr);
  }
}

function onSubmitCliente(e){
  e.preventDefault();
  const nome = $('#nome')?.value.trim();
  const email = $('#email')?.value.trim();
  const endereco = $('#endereco')?.value.trim();
  const nascimento = $('#nascimento')?.value;

  if(!nome || !email || !endereco){
    alert('Preencha todos os campos obrigatórios (*)');
    return;
  }

  const id = $('#idCliente')?.value || uid('cliente');
  const cliente = {id, nome, email, endereco, nascimento};
  const idx = clientes.findIndex(c=>c.id===id);
  if(idx>=0) clientes[idx]=cliente; else clientes.push(cliente);
  storage.set('clientes', clientes);
  e.target.reset();
  $('#idCliente').value='';
  renderClientes();
}

function bindClientesActions() {
  const tabela = $('#tabelaClientes');
  if(!tabela) return;
  tabela.addEventListener('click', e=>{
    const idEdit = e.target.getAttribute('data-edit');
    const idDel = e.target.getAttribute('data-del');
    if(idEdit){
      const c = clientes.find(x=>x.id===idEdit);
      if(!c) return;
      $('#idCliente').value=c.id;
      $('#nome').value=c.nome;
      $('#email').value=c.email;
      $('#endereco').value=c.endereco;
      $('#nascimento').value=c.nascimento||'';
    }
    if(idDel){
      if(confirm('Excluir este cliente?')){
        clientes = clientes.filter(c=>c.id!==idDel);
        storage.set('clientes', clientes);
        renderClientes();
      }
    }
  });

  $('#resetFormCliente')?.addEventListener('click', ()=>{
    $('#formCliente')?.reset();
    $('#idCliente').value='';
  });

  $('#exportClientes')?.addEventListener('click', ()=>downloadJSON(clientes,'clientes.json'));
  $('#importClientesInput')?.addEventListener('change', (e)=>importJSON(e,data=>{
    if(Array.isArray(data)) { clientes=data; storage.set('clientes',clientes); renderClientes(); }
    else alert('Arquivo inválido.');
  }));
}

// ---------- Livros ----------
function renderLivros() {
  const tbody = $('#tabelaLivros tbody');
  if(!tbody) return;
  tbody.innerHTML = '';
  if(livros.length === 0) { $('#semLivros').hidden = false; return; }
  $('#semLivros').hidden = true;

  for(const l of livros){
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${l.titulo}</td>
      <td>${l.autor}</td>
      <td class="center">${l.ano||'-'}</td>
      <td class="center">${l.exemplares}</td>
      <td class="right">
        <button class="btn ghost" data-edit-livro="${l.id}">Editar</button>
        <button class="btn danger" data-del-livro="${l.id}">Excluir</button>
      </td>`;
    tbody.appendChild(tr);
  }
}

function onSubmitLivro(e){
  e.preventDefault();
  const titulo = $('#titulo')?.value.trim();
  const autor = $('#autor')?.value.trim();
  const exemplares = parseInt($('#exemplares')?.value) || 0;
  const ano = parseInt($('#ano')?.value)||'';

  if(!titulo || !autor || exemplares<=0){
    alert('Preencha todos os campos obrigatórios (*)');
    return;
  }

  const id = $('#idLivro')?.value || uid('livro');
  const livro = {id, titulo, autor, exemplares, ano};
  const idx = livros.findIndex(l=>l.id===id);
  if(idx>=0) livros[idx]=livro; else livros.push(livro);
  storage.set('livros', livros);
  e.target.reset();
  $('#idLivro').value='';
  renderLivros();
}

function bindLivrosActions(){
  const tabela = $('#tabelaLivros');
  if(!tabela) return;
  tabela.addEventListener('click', e=>{
    const idEdit = e.target.getAttribute('data-edit-livro');
    const idDel = e.target.getAttribute('data-del-livro');
    if(idEdit){
      const l = livros.find(x=>x.id===idEdit);
      if(!l) return;
      $('#idLivro').value=l.id;
      $('#titulo').value=l.titulo;
      $('#autor').value=l.autor;
      $('#exemplares').value=l.exemplares;
      $('#ano').value=l.ano||'';
    }
    if(idDel){
      if(confirm('Excluir este livro?')){
        livros = livros.filter(l=>l.id!==idDel);
        storage.set('livros', livros);
        renderLivros();
      }
    }
  });

  $('#resetLivroBtn')?.addEventListener('click', ()=>{
    $('#formLivro')?.reset();
    $('#idLivro').value='';
  });

  $('#exportLivros')?.addEventListener('click', ()=>downloadJSON(livros,'livros.json'));
  $('#importLivrosInput')?.addEventListener('change', (e)=>importJSON(e,data=>{
    if(Array.isArray(data)) { livros=data; storage.set('livros',livros); renderLivros(); }
    else alert('Arquivo inválido.');
  }));
}

// ---------- Boot ----------
function boot(){
  $('#anoAtual')?.textContent = new Date().getFullYear();

  if($('#formCliente')){
    $('#formCliente').addEventListener('submit', onSubmitCliente);
    bindClientesActions();
    renderClientes();
  }

  if($('#formLivro')){
    $('#formLivro').addEventListener('submit', onSubmitLivro);
    bindLivrosActions();
    renderLivros();
  }
}

document.addEventListener('DOMContentLoaded', boot);
