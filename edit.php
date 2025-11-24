<?php
include "includes/auth.php";
include "includes/head.php";
include "includes/header.php";

ini_set('display_errors', 1);
error_reporting(E_ALL);

$livros = json_decode(file_get_contents("data/livros.json"), true) ?? [];
$id = $_GET['id'] ?? null;
$encontrado = false;

foreach ($livros as &$livro) {
    if ($livro['id'] === $id) {
        $encontrado = true;
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $livro['titulo'] = $_POST['titulo'];
            $livro['autor'] = $_POST['autor'];
            $livro['ano'] = $_POST['ano'];
            file_put_contents("data/livros.json", json_encode($livros, JSON_PRETTY_PRINT));
            header("Location: dashboard.php");
            exit;
        }
        ?>
        <main>
          <h1> Editar Livro </h1>
          <form method="post" action="edit.php?id=<?= $livro['id'] ?>">
            <input type="text" name="titulo" value="<?= htmlspecialchars($livro['titulo']) ?>" required>
            <input type="text" name="autor" value="<?= htmlspecialchars($livro['autor']) ?>" required>
            <input type="number" name="ano" value="<?= htmlspecialchars($livro['ano']) ?>" required>
            <button type="submit">Salvar</button>
          </form>
        </main>
        <?php
    }
}

if (!$encontrado) {
    echo "<main><p class='erro'>Livro não encontrado.</p></main>";
}

include "includes/footer.php";
?>