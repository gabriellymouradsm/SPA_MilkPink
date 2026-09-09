


# SPA de Cardapio Milkshake


## Contexto

SPA em **HTML + CSS + JS puro**, sem pacotes ou dependências, hospedada no **GitHub Pages**. Cardápio estilo sorveteria, apenas milkshakes.

## Recursos do APP

1.  **Cardápio:** carrega `dados.json` na abertura, organizado por categoria. Produtos em promoção exibem destaque visual (preço promocional + selo). Se o JSON falhar ou estiver inválido, exibir mensagem de erro amigável.
    
2.  **Primeira tela:** lista de produtos, sem cadastro. Ícone de carrinho com badge de quantidade.
    
3.  **Carrinho:** adicionar/remover/itens, persistido em `localStorage`. Carrinho vazio exibe CTA "Ver cardápio".
    
4.  **Checkout — cadastro:** ao finalizar a compra, o usuário informa **nome, WhatsApp, email e endereço**, com validação e máscara no telefone.
    
    -   **Geolocalização é OPCIONAL:** se permitida, pré-preenche o endereço; se negada, o usuário digita manualmente. **Nunca bloqueia o checkout.**
        
5.  **Confirmação do pedido:** após o cadastro, o usuário define um **PIN de 4 dígitos** e o confirma. É uma etapa de fricção/conscientização ("revise seu pedido"), não segurança.
    
6.  **Gateway simulado:** tela genérica com escolha de forma de pagamento (PIX/cartão/dinheiro) e estados visuais: `processando → aprovado` (com delay de ~2s).
    
7.  **Finalização:** gerar número do pedido (`#MS-<timestamp>`) e exibir tela de confirmação com botão: `https://wa.me/5511998838154?text=<pedido>` (com `encodeURIComponent`)
    
    -   **Mensagem contém:** número do pedido, itens (qtd × preço), total, forma de pagamento, nome e endereço.
        
    -   Número do WhatsApp é uma constante de config no topo do `app.js`.
        
    -   Após gerar o pedido: **limpar o carrinho** do `localStorage`.
        

## Regras de dados e privacidade

-   Dados do cadastro **não são persistidos** — usados apenas para compor a mensagem do WhatsApp.
    
-   Somente o carrinho fica em `localStorage`.
    

## O que o app NÃO deve fazer

1.  Processar pagamento real (apenas simulação)
    
2.  Cadastrar/editar produtos (JSON fixo gerado por IA)
    
3.  Controlar delivery (saiu do escopo do app)
    
4.  Exigir cadastro ou geolocalização para comprar
    
5.  Bloquear o pedido por falha no PIN, pagamento simulado ou credenciais do dispositivo

## Json

    {
      "loja": {
        "nome": "MilkShake House",
        "whatsapp": "5511998838154",
        "mensagemPadrao": "Olá! Vim pelo cardápio online. "
      },
      "categorias": [
        {
          "id": "classicos",
          "nome": "Clássicos",
          "produtos": [
            {
              "id": "ms-001",
              "nome": "Chocolate Belga",
              "descricao": "Chocolate belga, sorvete de creme e chantilly",
              "preco": 18.90,
              "imagem": "🍫",
              "disponivel": true,
              "promocao": {
                "precoPromocional": 15.90,
                "motivo": "Semana do Chocolate"
              }
            },
            {
              "id": "ms-002",
              "nome": "Morango Silvestre",
              "descricao": "Morango, sorvete de morango e calda artesanal",
              "preco": 17.90,
              "imagem": "🍓",
              "disponivel": true
            },
            {
              "id": "ms-003",
              "nome": "Baunilha Premium",
              "descricao": "Fava de baunilha, leite fresco e crocante de amendoim",
              "preco": 16.90,
              "imagem": "🍦",
              "disponivel": true
            }
          ]
        },
        {
          "id": "especiais",
          "nome": "Especiais da Casa",
          "produtos": [
            {
              "id": "ms-004",
              "nome": "Oreo Trufado",
              "descricao": "Biscoito Oreo, ganache de chocolate e chantilly",
              "preco": 22.90,
              "imagem": "🍪",
              "disponivel": true
            },
            {
              "id": "ms-005",
              "nome": "Pistache com Nutella",
              "descricao": "Creme de pistache, Nutella e pedaços de brownie",
              "preco": 26.90,
              "imagem": "🌰",
              "disponivel": true,
              "promocao": {
                "precoPromocional": 23.90,
                "motivo": "Lançamento"
              }
            }
          ]
        },
        {
          "id": "veganos",
          "nome": "Veganos",
          "produtos": [
            {
              "id": "ms-006",
              "nome": "Açaí com Granola",
              "descricao": "Açaí, leite de coco, granola e banana",
              "preco": 21.90,
              "imagem": "🫐",
              "disponivel": true
            },
            {
              "id": "ms-007",
              "nome": "Cacau 70%",
              "descricao": "Chocolate 70%, leite de aveia e pasta de amendoim",
              "preco": 20.90,
              "imagem": "🥜",
              "disponivel": false
            }
          ]
        }
      ]
    }

## UI/UX
1. utilize a paleta de cores:  #B70077, #FFEBE8, #E2E600, #D7F7E1, 
#00C0CF.
2. utilize google fonts: poptins  para titulos e Open Sans para textos corrigidos. e aplique versões condensadas das fontes quando convenientes.
3. Não use emojis. Utilize google icons.
4. interface minimalista, fundo branco.
5. adicione pequenas animações em botões e transição de telas. 
