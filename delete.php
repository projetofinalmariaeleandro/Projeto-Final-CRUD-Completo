<?php
include "includes/auth.php";
ini_set('display_errors', 1);
error_reporting(E_ALL);

$id = $_GET['id'] ?? null;
if ($id === null) {
    die("ID não informado.");
}

$livros = json_decode(file_get_contents("data/livros.json"), true) ?? [];
$livros = array_filter($livros, fn($livro) => $livro['id'] !== $id);

file_put_contents("data/livros.json", json_encode(array_values($livros), JSON_PRETTY_PRINT));

// Mensagem de debug (remova em produção)
echo "Livro com ID $id excluído com sucesso.";
header("Refresh:2; url=dashboard.php");
exit;
?>