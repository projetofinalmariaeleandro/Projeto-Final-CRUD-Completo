<?php
include "includes/auth.php";
include "includes/head.php";
include "includes/header.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $livros = json_decode(file_get_contents("data/livros.json"), true);
    $novo = [
        "id" => uniqid(),
        "titulo" => $_POST['titulo'],
        "autor" => $_POST['autor'],
        "ano" => $_POST['ano'],
        "status" => "disponivel"
    ];
    $livros[] = $novo;
    file_put_contents("data/livros.json", json_encode($livros, JSON_PRETTY_PRINT));
    header("Location: dashboard.php");
    exit;
}
?>
<main>
  <h1> Adicionar Livro</h1>
  <form method="post">
    <input type="text" name="titulo" placeholder="Título" required>
    <input type="text" name="autor" placeholder="Autor" required>
    <input type="number" name="ano" placeholder="Ano" required>
    <button type="submit">Salvar</button>
  </form>
</main>
<?php include "includes/footer.php"; ?>