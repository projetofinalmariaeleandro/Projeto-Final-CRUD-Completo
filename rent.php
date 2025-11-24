<?php
include "includes/auth.php";
ini_set('display_errors', 1);
error_reporting(E_ALL);

$id = $_GET['id'] ?? null;
if ($id === null) {
    die("ID não informado.");
}

$livros = json_decode(file_get_contents("data/livros.json"), true) ?? [];
$alterado = false;

foreach ($livros as &$livro) {
    if ($livro['id'] === $id && $livro['status'] === "disponivel") {
        $livro['status'] = "alugado";
        $livro['usuario'] = $_SESSION['usuario'];
        $alterado = true;
    }
}

if ($alterado) {
    file_put_contents("data/livros.json", json_encode($livros, JSON_PRETTY_PRINT));
    header("Location: dashboard.php");
    exit;
} else {
    echo "<main><p class='erro'>Não foi possível alugar este livro.</p></main>";
}
?>