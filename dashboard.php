<?php
include "includes/auth.php";
include "includes/head.php";
include "includes/header.php";

$livros = json_decode(file_get_contents("data/livros.json"), true);
?>
<main>
  <h1>Biblioteca Horizon</h1>
  <p>Bem-vindo, <strong><?= $_SESSION['usuario'] ?></strong>! Explore e alugue seus livros favoritos.</p>

  <div class="cards-container">
    <?php foreach($livros as $livro): ?>
      <div class="card">
        <h2><?= $livro['titulo'] ?></h2>
        <p><strong>Autor:</strong> <?= $livro['autor'] ?></p>
        <p><strong>Ano:</strong> <?= $livro['ano'] ?></p>
        <p>
          <?php if ($livro['status'] === "disponivel"): ?>
            <span class="status disponivel">Disponível</span>
          <?php else: ?>
            <span class="status alugado">Alugado por <?= $livro['usuario'] ?></span>
          <?php endif; ?>
        </p>
        <div class="acoes">
          <a href="edit.php?id=<?= $livro['id'] ?>" class="btn small">ᓚᘏᗢ  Editar</a>
          <a href="delete.php?id=<?= $livro['id'] ?>" class="btn small">ᓚᘏᗢ  Excluir</a>
          <?php if ($livro['status'] === "disponivel"): ?>
            <a href="rent.php?id=<?= $livro['id'] ?>" class="btn small">ᓚᘏᗢ  Alugar</a>
          <?php elseif ($livro['status'] === "alugado" && $livro['usuario'] === $_SESSION['usuario']): ?>
            <a href="return.php?id=<?= $livro['id'] ?>" class="btn small">ᓚᘏᗢ  Devolver</a>
          <?php else: ?>
            <span class="indisponivel">Indisponível</span>
          <?php endif; ?>
        </div>
      </div>
    <?php endforeach; ?>
  </div>
</main>
<?php include "includes/footer.php"; ?>