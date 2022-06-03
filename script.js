let cart = []; // carrinho
let modalQt = 1;
let modalKey = 0; // pra dizer qual é a pizza

// criando uma função em que eu mando o elemento el, que faz o comando document.querySelector e retorna pra mim
const c = (el) => document.querySelector(el); // ele retorna simplesmente o item // função anonima
const cs = (el) => document.querySelectorAll(el); // ele vai retornar um array com os itens que ele achou

// Listagem das pizzas:

// Primeiro parametro, o próprio item. Segundo: index, o número do array daquele item especifico
pizzaJson.map((item, index) => {
  // clonar a estrutura "pizza-item" do html, preencher e jogar na tela // .cloneNode: para clonar um item
  let pizzaItem = c(".models .pizza-item").cloneNode(true);

  // id das pizzas
  pizzaItem.setAttribute('data-key', index);
  // informações da pizza:
  pizzaItem.querySelector(".pizza-item--img img").src = item.img;
  pizzaItem.querySelector(".pizza-item--price").innerHTML = `R$ ${item.price.toFixed(2)}`;
  pizzaItem.querySelector(".pizza-item--name").innerHTML = item.name;
  pizzaItem.querySelector(".pizza-item--desc").innerHTML = item.description;
  pizzaItem.querySelector('a').addEventListener('click', (e)=>{
      // bloquear a ação natural do click no item na tag a
      e.preventDefault(); 
      //MODAL:
      // pra saber qual pizza to clicando, para preencher no meu modal
      let key = e.target.closest(".pizza-item").getAttribute('data-key');
      modalQt = 1; // ele vai zerar com a quantidade 1 sempre que ele abrir o modal --
      modalKey = key;

      // modal-info-pizzas
      c('.pizzaBig img').src = pizzaJson[key].img;
      c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
      c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
      c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
      // para não ter nenhum tamanho selecionado:
      c('.pizzaInfo--size.selected').classList.remove('selected');
      cs('.pizzaInfo--size').forEach((size, sizeindex)=>{ 
        if(sizeindex == 2) { // vai fazer isso somente no botão de pizza grande(deixa pré-selecionado)
            size.classList.add('selected');
        }
          //informações de tamanho
          size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeindex];
      });

      //Quantidade padrão do modal/pizza quando abre o modal --
      c('.pizzaInfo--qt').innerHTML = modalQt;

      // Modal, parte quando clica na pizza
      c('.pizzaWindowArea').style.opacity = 0;
      c('.pizzaWindowArea').style.display = 'flex';
      setTimeout(()=>{ // timeout pra abrir com um pequeno efeito
          c('.pizzaWindowArea').style.opacity = 1;
      }, 200);
  })

  c(".pizza-area").append(pizzaItem);
});


// Eventos do modal:

// function efeito para fechar o modal
function closeModal() {
  c('.pizzaWindowArea').style.opacity = 0;
  setTimeout(()=>{
     c('.pizzaWindowArea').style.display = 'none';
  }, 500)
}
// função pra fechar o modal com o button cancelar ou voltar
cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
});
// Botão de + e -
c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
  if(modalQt > 1) { // caso for maior que 1, executa a function
    modalQt--;// quando clicar diminuir 
    c('.pizzaInfo--qt').innerHTML = modalQt;
  }
  
});
c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;// quando clicar aumentar mais um
    c('.pizzaInfo--qt').innerHTML = modalQt;
});
// seleção de tamanhos
cs('.pizzaInfo--size').forEach((size, sizeindex)=>{ 
    size.addEventListener('click', (e)=>{ // clica em um desmarca os outros
      c('.pizzaInfo--size.selected').classList.remove('selected');
      size.classList.add('selected');
    });
});
// adicionar ao carrinho 
c('.pizzaInfo--addButton').addEventListener('click', ()=>{
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));
    
    // identificador de itens no carrinho
    let identifier = pizzaJson[modalKey].id+'@'+size;

    // verificador do identifier  // == : é uma verificação e não substituição
    let key = cart.findIndex((item)=>item.identifier == identifier); // se ele achou o item no carrinho
    // ele muda a quantidade
    if(key > -1){ 
        cart[key].qt += modalQt;
    } else { // se não achou ele dá o push e coloca o item no carrinho completamente
        cart.push({
            identifier,
            id:pizzaJson[modalKey].id, // id da pizza
            size, // tamanho da pizza
            qt:modalQt // quantidade da pizza
        });
    }
    
    // atualizar o modal
    updateCart();
    // fechar o modal
    closeModal();
});

// aparecer o carrinho no Mobile
c('.menu-openner').addEventListener('click', ()=> {
  //abrir o carrinho apenas se tiver algum item
    if(cart.length > 0) {
      c('aside').style.left = '0';
    }
});
// fecher o carrinho no Mobile
c('.menu-closer').addEventListener('click', ()=> {
  c('aside').style.left = '100vw';
})

// function para atualizar o carrinho 
function updateCart() {
    c('.menu-openner span').innerHTML = cart.length;

    // "caso eu tenha itens no meu carrinho"
    if(cart.length > 0) {
        c('aside').classList.add('show'); // "mostrar"
        // primeiro ZERA depois mostra
        c('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart) {

          //procuro o id do meu item dentro do pizzaJson e retorno pra mim o item inteiro
          let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);
          subtotal += pizzaItem.price * cart[i].qt;
          // clone do cartItem
          let cartItem = c('.models .cart--item').cloneNode(true);

          let pizzaSizeName;

          switch(cart[i].size) {
              case 0:
                pizzaSizeName = 'P';
                break;
              case 1:
                pizzaSizeName = 'M';
                break;
              case 2:
                pizzaSizeName = 'G';
                break;
          }
          // pizza+tamanho da pizza
          let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

          //cart-config
          cartItem.querySelector('img').src =pizzaItem.img;
          cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
          cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
          // evento pra aumentar ou diminuir itens no próprio carrinho
          cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
              // só vai deminuir se a quantidade de itens for maior que 1
            if(cart[i].qt > 1) {
                cart[i].qt--;
                updateCart();
              } else { // caso seja 1 e eu diminua, ele tem que tirar os item do carrinho
                  cart.splice(i, 1);
              }
              updateCart();
          });
          cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
              cart[i].qt++;
              // atualizar o carrinho por completo!!
              updateCart();
          });



          c('.cart').append(cartItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    } else { // "caso eu não tenha itens no meu carrinho"
        c('aside').classList.remove('show'); // "desaparecer"
        c('aside').style.left = '100vw';
    }
}
