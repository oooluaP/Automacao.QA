import "./style.css";

// Antes: pegarPersonagens
async function buscarDadosAPI() {
    const resposta = await fetch("https://rickandmortyapi.com/api/character/1,2,3");
    return resposta.json();
}

async function iniciarApp() {
    // Antes: res
    let dadosAPI = await buscarDadosAPI();

    // Antes: pegarDoLocalStorage
    function carregarLocalStorage() {
        let itens = localStorage.getItem("itensCarrinho");
        return itens ? JSON.parse(itens) : [];
    }

    // Antes: produtosDoLocalStorage
    let itensSalvos = carregarLocalStorage();

    // Antes: produtos
    let listaItens = dadosAPI.map(item => ({
        id: item.id,
        titulo: item.name,
        foto: item.image,
        quantidade: itensSalvos.find((p) => p.id === item.id)?.quantidade || 0,
    }));

    // Antes: $products, $cartProducts, $cartTotal, $cartCheckout
    let $listaProdutos = document.querySelector("#products");
    let $itensCarrinho = document.querySelector("#cart_products");
    let $totalCarrinho = document.querySelector("#cart_total");
    let $finalizarCompra = document.querySelector("#cart_checkout");

    // Antes: salvarNoLocalStorage
    function salvarItens() {
        localStorage.setItem("itensCarrinho", JSON.stringify(listaItens));
    }

    // Antes: atualizarTela
    function renderizarTela() {
        salvarItens();

        let total = listaItens.reduce((soma, p) => soma + p.quantidade, 0);

        $totalCarrinho.textContent = total;
        $finalizarCompra.disabled = total <= 0;

        let html = listaItens.map(produto => `
            <div class="item" data-id="${produto.id}">
              <div class="item__group">
                <img src="${produto.foto}" alt="" class="sticker" />
                <h3>${produto.titulo}</h3>
              </div>
              <div class="item__group">
                <div class="quantity-control">
                  <button type="button" class="quantity-btn decrease">-</button>
                  <span class="quantity-value">${produto.quantidade}</span>
                  <button type="button" class="quantity-btn increase">+</button>
                </div>
                <button type="button" class="delete-btn" id="add-to-cart">
                  &times;
                </button>
              </div>
            </div>`).join("");

        $listaProdutos.innerHTML = html;

        let html2 = listaItens
            .filter(produto => produto.quantidade > 0)
            .map(produto => `
                <div class="item">
                    <div class="item__group">
                        <img src="${produto.foto}" alt="" class="image" />
                        <h3>${produto.titulo}</h3>
                    </div>
                    <div class="item__group">
                        <output class="quantity-value">${produto.quantidade}</output>
                    </div>
                </div>`).join("");

        $itensCarrinho.innerHTML = html2;
    }

    // Antes: $products.addEventListener...
    $listaProdutos.addEventListener("click", function(event) {
        let $item = event.target.closest(".item");
        let id = Number($item.dataset.id);

        let produto = listaItens.find(p => p.id === id);

        if (event.target.classList.contains("increase")) {
            produto.quantidade++;
            renderizarTela();
        }

        if (event.target.classList.contains("decrease")) {
            if (produto.quantidade > 0) produto.quantidade--;
            renderizarTela();
        }

        if (event.target.classList.contains("delete-btn")) {
            produto.quantidade = 0;
            renderizarTela();
        }
    });

    // Antes: $cartCheckout.addEventListener
    $finalizarCompra.addEventListener("click", function() {
        alert("Compra finalizada!");
        listaItens.forEach(p => p.quantidade = 0);
        renderizarTela();
    });

    renderizarTela();
}

iniciarApp();
