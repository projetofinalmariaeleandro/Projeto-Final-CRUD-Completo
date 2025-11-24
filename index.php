<?php
session_start();
$usuariosFile = "data/usuarios.json";
if (!file_exists($usuariosFile)) {
    file_put_contents($usuariosFile, json_encode([], JSON_PRETTY_PRINT));
}
$usuarios = json_decode(file_get_contents($usuariosFile), true);

if (isset($_POST['login'])) {
    $user = $_POST['user'];
    $pass = $_POST['pass'];
    foreach ($usuarios as $u) {
        if ($u['user'] === $user && $u['pass'] === $pass) {
            $_SESSION['logado'] = true;
            $_SESSION['usuario'] = $user;
            header("Location: dashboard.php");
            exit;
        }
    }
    $erro = "Usuário ou senha inválidos!";
}

if (isset($_POST['cadastro'])) {
    $novo = ["user" => $_POST['new_user'], "pass" => $_POST['new_pass']];
    $usuarios[] = $novo;
    file_put_contents($usuariosFile, json_encode($usuarios, JSON_PRETTY_PRINT));
    $sucesso = "Cadastro realizado com sucesso!";
}
include "includes/head.php";
?>
<div class="container">
  <div class="info-box">
    <img src="img/Biblioteca.png" alt="Logo">
    <h2>Bem-vindo à Biblioteca Horizon</h2>
    <p>A <strong>Biblioteca Horizon</strong> é o seu espaço digital para explorar, alugar livros e compartilhar seus livros com outras pessoas.</p>
    <div class="promo"><span id="promo-text"></span></div>
  </div>
  <div class="form-box">
    <?php if(isset($erro)) echo "<p class='erro'>$erro</p>"; ?>
    <?php if(isset($sucesso)) echo "<p class='sucesso'>$sucesso</p>"; ?>

    <h3>Login</h3>
    <form method="post">
      <input type="text" name="user" placeholder="Usuário" required>
      <input type="password" name="pass" placeholder="Senha" required>
      <button type="submit" name="login">Entrar</button>
    </form>

    <hr>

    <h3>Cadastro</h3>
    <form method="post">
      <input type="text" name="new_user" placeholder="Novo usuário" required>
      <input type="password" name="new_pass" placeholder="Nova senha" required>
      <button type="submit" name="cadastro">Cadastrar</button>
    </form>
  </div>
</div>
<script>
  const frases = [
    "- Cadastre-se e tenha 30 dias grátis!",
    "- Explore milhares de livros sem sair de casa!",
    "- Alugue seus favoritos com um clique!",
    "- Biblioteca virtual moderna e prática para você!"
  ];
  let i = 0;
  const promoText = document.getElementById("promo-text");
  function trocarFrase() {
    promoText.textContent = frases[i];
    i = (i + 1) % frases.length;
  }
  trocarFrase();
  setInterval(trocarFrase, 4000);
</script>
<?php include "includes/footer.php"; ?>