
import "./style.css";

const pegarPersonagens = async () => {
    const res = await fetch ("https://rickandmortyapi.com/api/character/1,2,3");
    const json = await res.json();
    return json
};



async function main() {
    const res = await pegarPersonagens();

    const PegarDoLocalStorage = () => {

        const produtos = localStorage.getItem("produtos");
        return produtos ? JSON.parse(produtos) : [];
    };

    const produtosDoLocalStorage = PegarDoLocalStorage();
    


    let produtos = res.map(item => {
        return {
            id: item.id,
            description: item.name,
            image: item.image,
            quantity: produtosDoLocalStorage.find((p) => p.id === item.id)?.quantity || 0,
        }
    });    


    
    const $products = document.querySelector("#products");
    const $cartProducts = document.querySelector("#cart_products");
    const $cartTotal = document.querySelector("#cart_total");
    const $cartCheckout = document.querySelector("#cart_checkout");

    const salvarNoLocalStorage = () => {
        localStorage.setItem("produtos", JSON.stringify(produtos));
    };


    const atualizarTela = () =>{ 

        salvarNoLocalStorage();

        let total = 0;
        produtos.forEach((produto) => {
            total += produto.quantity;
        });
    
        $cartTotal.textContent = total;

        $cartCheckout.disabled = total <=0;



        const html = produtos.map((produto) => {
            return `
            <div class="item" data-id="${produto.id}">
              <div class="item__group">
                <img src="${produto.image}" alt="" class="sticker" />
                <h3>${produto.description}</h3>
              </div>
              <div class="item__group">
                <div class="quantity-control">
                  <button type="button" class="quantity-btn decrease">-</button>
                  <span class="quantity-value">${produto.quantity}</span>
                  <button type="button" class="quantity-btn increase">+</button>
                </div>
                <button type="button" class="delete-btn" id="add-to-cart">
                  &times;
                </button>
              </div>
            </div> 
        `;
        
         });

            $products.innerHTML = html.join(''); 


            const html2 = produtos.map((produto) => {
            if(produto.quantity <= 0) {
                return "";
            }     
            
             return `
                <div class="item">
                 <div class="item__group">
                    <img src="${produto.image}" alt="" class="image" />
                    <h3>${produto.description}</h3>
                    </div>
                    <div class="item__group">
                    <output class="quantity-value">${produto.quantity}</output>
                    </div>
                    </div>  
                    `;
             });

        $cartProducts.innerHTML = html2.join('');    
    };
    



    
    $products.addEventListener('click', event => {
        
        const $item = event.target.closest(".item");

        const id = Number($item.dataset.id);       

        if (event.target.classList.contains("increase")){
            console.log("adicionar");

           produtos.forEach((produto) => {
            if (produto.id === id) {
                produto.quantity = produto.quantity + 1;
            }
           });
           atualizarTela();

        };
        if (event.target.classList.contains("decrease")){
            console.log("subtrair")           
            produtos.forEach((produto) => {
            if (produto.id === id) {
                const qtd = produto.quantity - 1;
                if (qtd >= 0) {
                produto.quantity = produto.quantity - 1;
                };
            }
           });
           atualizarTela();
        };
     
        
        if (event.target.classList.contains("delete-btn")){
            console.log("excluir")
            produtos.forEach((produto) => {
            if (produto.id === id) {
                produto.quantity = 0;
            }
           });
           atualizarTela();     
            
        };

    });

    $cartCheckout.addEventListener('click', () => {
        produtos.forEach(produto => {
            produto.quantity = 0;

        });

        atualizarTela();
    });
        
    atualizarTela();

};

main();