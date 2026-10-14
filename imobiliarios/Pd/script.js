document.addEventListener("DOMContentLoaded", function () {
  const pesquisa = document.getElementById("pesquisaProdutos");
  const filtros = document.querySelectorAll(".imob-filtro");
  const produtos = document.querySelectorAll(".imob-produto");
  const contador = document.getElementById("contadorProdutos");
  const semResultados = document.getElementById("semResultados");
  const verTodos = document.getElementById("verTodos");

  let categoriaSelecionada = "todos";

  function filtrarProdutos() {
    const textoPesquisa = pesquisa.value.trim().toLowerCase();
    let quantidadeVisivel = 0;

    produtos.forEach(function (produto) {
      const textoProduto = produto.textContent.toLowerCase();
      const categoriaProduto = produto.dataset.categoria;

      const correspondePesquisa = textoProduto.includes(textoPesquisa);
      const correspondeCategoria =
        categoriaSelecionada === "todos" ||
        categoriaProduto === categoriaSelecionada;

      if (correspondePesquisa && correspondeCategoria) {
        produto.hidden = false;
        quantidadeVisivel++;
      } else {
        produto.hidden = true;
      }
    });

    if (contador) {
      contador.textContent = quantidadeVisivel;
    }

    if (semResultados) {
      semResultados.hidden = quantidadeVisivel !== 0;
    }
  }

  pesquisa.addEventListener("input", filtrarProdutos);

  filtros.forEach(function (filtro) {
    filtro.addEventListener("click", function () {
      filtros.forEach(function (botao) {
        botao.classList.remove("ativo");
      });

      filtro.classList.add("ativo");
      categoriaSelecionada = filtro.dataset.categoria;
      filtrarProdutos();
    });
  });

  if (verTodos) {
    verTodos.addEventListener("click", function () {
      pesquisa.value = "";
      categoriaSelecionada = "todos";

      filtros.forEach(function (filtro) {
        filtro.classList.remove("ativo");

        if (filtro.dataset.categoria === "todos") {
          filtro.classList.add("ativo");
        }
      });

      filtrarProdutos();
    });
  }

    produtos.forEach(function (produto) {
    produto.addEventListener("click", function (evento) {
      if (evento.target.closest("a, button")) {
        evento.preventDefault();
      }

      alert(
        "Loja fictícia! Este projecto foi criado para apresentar as minhas habilidades como programador Web Front-End."
      );
    });
  });

  filtrarProdutos();
});