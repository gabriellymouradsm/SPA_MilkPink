/**
 * Milk Pink - SPA App Script
 * Vanilla JavaScript implementation for milkshake menu digital SPA
 */

// Global App State
const CONFIG = {
  WHATSAPP_NUMBER: "5511998838154",
  CART_STORAGE_KEY: "milkpink_cart_v1"
};

let appData = {
  loja: {},
  tamanhos: [],
  adicionais: [],
  categorias: []
};

let activeCategory = "todos";
let searchQuery = "";
let cart = []; // Array of cart items

// Selected item state for customizer modal
let currentCustomizingProduct = null;
let currentCustomSize = null;
let currentCustomToppings = [];
let currentCustomQty = 1;

// Checkout State
let checkoutCustomerInfo = null;
let checkoutPaymentMethod = "PIX";
let currentOrder = null;

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
  loadCartFromStorage();
  initEventListeners();
  fetchCatalogData();
});

// Load cart state from localStorage
function loadCartFromStorage() {
  try {
    const stored = localStorage.getItem(CONFIG.CART_STORAGE_KEY);
    if (stored) {
      cart = JSON.parse(stored);
    }
  } catch (e) {
    console.error("Erro ao carregar carrinho do localStorage:", e);
    cart = [];
  }
}

// Save cart state to localStorage
function saveCartToStorage() {
  try {
    localStorage.setItem(CONFIG.CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (e) {
    console.error("Erro ao salvar carrinho no localStorage:", e);
  }
}

// Fetch Catalog JSON Data
async function fetchCatalogData() {
  const errorBanner = document.getElementById("error-banner");
  const errorBannerMsg = document.getElementById("error-banner-msg");

  try {
    const response = await fetch("dados.json");
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }
    appData = await response.json();
    errorBanner.classList.add("hidden");

    renderCategoryTabs();
    renderCatalog();
    updateCartUI();
  } catch (err) {
    console.error("Falha ao carregar dados.json:", err);
    if (errorBanner) {
      errorBanner.classList.remove("hidden");
      if (errorBannerMsg) {
        errorBannerMsg.textContent = `Não foi possível carregar os dados do cardápio (${err.message}).`;
      }
    }
    const productList = document.getElementById("product-list");
    if (productList) {
      productList.innerHTML = `
        <div class="p-6 text-center text-error bg-error-container/30 rounded-2xl border border-error/20">
          <span class="material-symbols-outlined text-4xl mb-2">cloud_off</span>
          <p class="font-heading font-bold text-sm">Falha ao carregar o cardápio</p>
          <p class="text-xs text-on-surface-variant mt-1">Verifique sua conexão ou tente recarregar.</p>
        </div>
      `;
    }
  }
}

// Render Category Tabs
function renderCategoryTabs() {
  const container = document.getElementById("category-tabs");
  if (!container) return;

  let html = `
    <button onclick="selectCategory('todos')" class="flex items-center gap-1.5 px-4 py-2 rounded-full font-heading text-xs font-semibold shrink-0 transition-all active:scale-95 ${
      activeCategory === 'todos'
        ? 'bg-primary-container text-on-primary shadow-sm'
        : 'bg-surface-container-lowest text-neutral-dark border border-outline-variant hover:border-primary'
    }">
      <span class="material-symbols-outlined text-base">storefront</span>
      <span>Todos</span>
    </button>
  `;

  if (appData.categorias && Array.isArray(appData.categorias)) {
    appData.categorias.forEach(cat => {
      const isSelected = activeCategory === cat.id;
      const catIcon = cat.icon || 'local_drink';
      html += `
        <button onclick="selectCategory('${cat.id}')" class="flex items-center gap-1.5 px-4 py-2 rounded-full font-heading text-xs font-semibold shrink-0 transition-all active:scale-95 ${
          isSelected
            ? 'bg-primary-container text-on-primary shadow-sm'
            : 'bg-surface-container-lowest text-neutral-dark border border-outline-variant hover:border-primary'
        }">
          <span class="material-symbols-outlined text-base ${isSelected ? 'text-on-primary' : 'text-primary'}">${catIcon}</span>
          <span>${cat.nome}</span>
        </button>
      `;
    });
  }

  container.innerHTML = html;
}

// Filter category handler
function selectCategory(catId) {
  activeCategory = catId;
  renderCategoryTabs();
  renderCatalog();
}

// Filter and render products catalog
function renderCatalog() {
  const container = document.getElementById("product-list");
  const countSpan = document.getElementById("catalog-count");
  const titleHeader = document.getElementById("catalog-title");
  if (!container) return;

  let allProducts = [];
  if (appData.categorias) {
    appData.categorias.forEach(cat => {
      if (activeCategory === "todos" || activeCategory === cat.id) {
        cat.produtos.forEach(p => {
          allProducts.push({ ...p, categoryId: cat.id, categoryName: cat.nome });
        });
      }
    });
  }

  // Filter by search query if any
  if (searchQuery.trim() !== "") {
    const q = searchQuery.toLowerCase().trim();
    allProducts = allProducts.filter(p =>
      p.nome.toLowerCase().includes(q) ||
      p.descricao.toLowerCase().includes(q)
    );
  }

  // Update title & counter badge
  if (titleHeader) {
    if (activeCategory === "todos") {
      titleHeader.textContent = searchQuery ? "Resultado da busca" : "Todos os Shakes";
    } else {
      const currentCat = appData.categorias.find(c => c.id === activeCategory);
      titleHeader.textContent = currentCat ? currentCat.nome : "Cardápio";
    }
  }
  if (countSpan) {
    countSpan.textContent = `${allProducts.length} ${allProducts.length === 1 ? 'opção' : 'opções'}`;
  }

  if (allProducts.length === 0) {
    container.innerHTML = `
      <div class="p-8 text-center text-neutral-muted bg-surface-container-low rounded-2xl border border-outline-variant/40">
        <span class="material-symbols-outlined text-4xl mb-1 text-primary/50">search_off</span>
        <p class="font-heading font-bold text-sm text-neutral-dark">Nenhum produto encontrado</p>
        <p class="text-xs mt-1">Tente pesquisar por outro termo ou selecione outra categoria.</p>
      </div>
    `;
    return;
  }

  let html = "";
  allProducts.forEach(p => {
    const hasPromo = p.promocao && p.promocao.precoPromocional;
    const currentPrice = hasPromo ? p.promocao.precoPromocional : p.preco;
    const productIcon = p.icon || 'local_drink';

    if (!p.disponivel) {
      // Unavailable Product Card
      html += `
        <div class="card-shadow bg-surface-container-low/70 rounded-2xl p-3.5 border border-outline-variant/40 flex items-center justify-between gap-3 relative opacity-70">
          <div class="relative w-20 h-20 rounded-xl bg-surface-container-high shrink-0 flex items-center justify-center text-neutral-muted">
            <span class="material-symbols-outlined text-4xl">${productIcon}</span>
            <div class="absolute inset-0 bg-neutral-dark/30 rounded-xl flex items-center justify-center">
              <span class="bg-error text-on-error font-heading font-bold text-[10px] px-2 py-0.5 rounded-full shadow-sm">
                Esgotado
              </span>
            </div>
          </div>
          <div class="flex flex-col flex-grow min-w-0">
            <h4 class="font-heading font-bold text-sm text-neutral-dark truncate">${p.nome}</h4>
            <p class="text-xs text-neutral-muted line-clamp-1 mb-1">${p.descricao}</p>
            <div class="flex items-baseline gap-1.5">
              <span class="font-heading font-bold text-sm text-neutral-muted">R$ ${p.preco.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>
          <button disabled class="w-10 h-10 rounded-full bg-surface-variant text-neutral-muted flex items-center justify-center shrink-0 cursor-not-allowed">
            <span class="material-symbols-outlined text-lg">block</span>
          </button>
        </div>
      `;
    } else {
      // Available Product Card
      html += `
        <div class="card-shadow bg-surface-container-lowest rounded-2xl p-3.5 border border-outline-variant/60 flex items-center justify-between gap-3 relative transition-all">
          <div class="relative w-20 h-20 rounded-xl bg-secondary-pink/60 shrink-0 flex items-center justify-center text-primary">
            <span class="material-symbols-outlined text-4xl">${productIcon}</span>
            ${hasPromo ? `
              <span class="absolute top-1 left-1 bg-accent-yellow text-neutral-dark font-heading font-bold text-[9px] px-1.5 py-0.5 rounded-full shadow-sm leading-none">
                ${p.promocao.motivo || 'Oferta'}
              </span>
            ` : ''}
          </div>
          <div class="flex flex-col flex-grow min-w-0">
            <h4 class="font-heading font-bold text-sm text-neutral-dark truncate">${p.nome}</h4>
            <p class="text-xs text-neutral-muted line-clamp-2 mb-1">${p.descricao}</p>
            <div class="flex items-baseline gap-1.5">
              <span class="font-heading font-bold text-sm text-primary">R$ ${currentPrice.toFixed(2).replace('.', ',')}</span>
              ${hasPromo ? `<span class="text-xs text-outline line-through font-body">R$ ${p.preco.toFixed(2).replace('.', ',')}</span>` : ''}
            </div>
          </div>
          <button onclick="openProductCustomizer('${p.id}')" aria-label="Personalizar ${p.nome}" class="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center shrink-0 shadow-md hover:bg-primary active:scale-90 transition-all">
            <span class="material-symbols-outlined text-xl">add</span>
          </button>
        </div>
      `;
    }
  });

  container.innerHTML = html;
}

// Find product by ID across all categories
function findProductById(productId) {
  if (!appData.categorias) return null;
  for (const cat of appData.categorias) {
    const p = cat.produtos.find(item => item.id === productId);
    if (p) return p;
  }
  return null;
}

// Product Customizer Modal Logic
function openProductCustomizer(productId) {
  const p = findProductById(productId);
  if (!p) return;

  currentCustomizingProduct = p;
  currentCustomQty = 1;
  currentCustomToppings = [];

  // Default size (500ml or first)
  const defaultSize = appData.tamanhos.find(s => s.padrao) || appData.tamanhos[0] || { id: "500ml", nome: "500 ml", adicional: 0 };
  currentCustomSize = defaultSize;

  // Populate Modal Header
  document.getElementById("modal-product-icon").textContent = p.icon || "local_drink";
  document.getElementById("modal-product-title").textContent = p.nome;
  document.getElementById("modal-product-desc").textContent = p.descricao;
  document.getElementById("modal-notes").value = "";
  document.getElementById("modal-qty-val").textContent = "1";

  // Render Sizes
  renderModalSizes();

  // Render Toppings
  renderModalToppings();

  // Update Total Price in Modal
  updateModalTotalPrice();

  // Show Modal
  const modal = document.getElementById("modal-product");
  modal.classList.remove("hidden");
}

function renderModalSizes() {
  const container = document.getElementById("modal-size-options");
  if (!container || !appData.tamanhos) return;

  let html = "";
  appData.tamanhos.forEach(s => {
    const isSelected = currentCustomSize && currentCustomSize.id === s.id;
    const addPriceText = s.adicional > 0 ? ` (+R$ ${s.adicional.toFixed(2).replace('.', ',')})` : '';

    html += `
      <button type="button" onclick="selectModalSize('${s.id}')" class="p-2.5 rounded-2xl border-2 text-center transition-all ${
        isSelected
          ? 'border-primary bg-secondary-pink text-primary font-bold shadow-sm'
          : 'border-outline-variant bg-surface-container-lowest text-neutral-dark hover:border-primary/50'
      }">
        <div class="font-heading text-xs font-bold">${s.nome}</div>
        <div class="text-[10px] text-neutral-muted">${s.adicional === 0 ? 'Padrão' : '+R$ ' + s.adicional.toFixed(2).replace('.', ',')}</div>
      </button>
    `;
  });

  container.innerHTML = html;
}

function selectModalSize(sizeId) {
  const s = appData.tamanhos.find(item => item.id === sizeId);
  if (s) {
    currentCustomSize = s;
    renderModalSizes();
    updateModalTotalPrice();
  }
}

function renderModalToppings() {
  const container = document.getElementById("modal-topping-options");
  if (!container || !appData.adicionais) return;

  let html = "";
  appData.adicionais.forEach(t => {
    const isChecked = currentCustomToppings.some(item => item.id === t.id);
    const tIcon = t.icon || "cookie";

    html += `
      <label class="flex items-center justify-between p-2.5 rounded-2xl border border-outline-variant/60 cursor-pointer hover:border-primary transition-all ${
        isChecked ? 'bg-secondary-pink/50 border-primary' : 'bg-surface-container-lowest'
      }">
        <div class="flex items-center gap-2.5">
          <input type="checkbox" onchange="toggleModalTopping('${t.id}')" ${isChecked ? 'checked' : ''} class="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4"/>
          <span class="material-symbols-outlined text-primary text-base">${tIcon}</span>
          <span class="font-heading text-xs font-medium text-neutral-dark">${t.nome}</span>
        </div>
        <span class="font-heading text-xs font-semibold text-primary">+R$ ${t.preco.toFixed(2).replace('.', ',')}</span>
      </label>
    `;
  });

  container.innerHTML = html;
}

function toggleModalTopping(toppingId) {
  const t = appData.adicionais.find(item => item.id === toppingId);
  if (!t) return;

  const idx = currentCustomToppings.findIndex(item => item.id === toppingId);
  if (idx >= 0) {
    currentCustomToppings.splice(idx, 1);
  } else {
    currentCustomToppings.push(t);
  }

  renderModalToppings();
  updateModalTotalPrice();
}

function updateModalTotalPrice() {
  if (!currentCustomizingProduct) return;

  const basePrice = (currentCustomizingProduct.promocao && currentCustomizingProduct.promocao.precoPromocional)
    ? currentCustomizingProduct.promocao.precoPromocional
    : currentCustomizingProduct.preco;

  const sizeAdicional = currentCustomSize ? currentCustomSize.adicional : 0;
  const toppingsAdicional = currentCustomToppings.reduce((sum, item) => sum + item.preco, 0);

  const unitTotal = basePrice + sizeAdicional + toppingsAdicional;
  const grandTotal = unitTotal * currentCustomQty;

  const totalEl = document.getElementById("modal-total-price");
  if (totalEl) {
    totalEl.textContent = `R$ ${grandTotal.toFixed(2).replace('.', ',')}`;
  }
}

// Modal Quantity Controls
function adjustCustomQty(delta) {
  currentCustomQty += delta;
  if (currentCustomQty < 1) currentCustomQty = 1;
  document.getElementById("modal-qty-val").textContent = currentCustomQty;
  updateModalTotalPrice();
}

// Add item from Customizer Modal to Cart
function addCustomizedItemToCart() {
  if (!currentCustomizingProduct) return;

  const basePrice = (currentCustomizingProduct.promocao && currentCustomizingProduct.promocao.precoPromocional)
    ? currentCustomizingProduct.promocao.precoPromocional
    : currentCustomizingProduct.preco;

  const sizeAdicional = currentCustomSize ? currentCustomSize.adicional : 0;
  const toppingsAdicional = currentCustomToppings.reduce((sum, item) => sum + item.preco, 0);
  const unitPrice = basePrice + sizeAdicional + toppingsAdicional;
  const notes = document.getElementById("modal-notes").value.trim();

  const cartItem = {
    cartItemId: "item_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
    productId: currentCustomizingProduct.id,
    nome: currentCustomizingProduct.nome,
    icon: currentCustomizingProduct.icon || "local_drink",
    size: currentCustomSize,
    toppings: [...currentCustomToppings],
    notes: notes,
    unitPrice: unitPrice,
    quantidade: currentCustomQty
  };

  cart.push(cartItem);
  saveCartToStorage();
  updateCartUI();

  // Close Modal
  document.getElementById("modal-product").classList.add("hidden");
}

// Update Cart Badge, Sticky Cart Bar, and Modal Cart view
function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantidade, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.unitPrice * item.quantidade), 0);

  // Update Header Cart Badge
  const badge = document.getElementById("cart-badge");
  if (badge) {
    if (totalItems > 0) {
      badge.textContent = totalItems;
      badge.classList.remove("hidden");
    } else {
      badge.classList.add("hidden");
    }
  }

  // Update Sticky Bottom Cart Bar
  const stickyBar = document.getElementById("sticky-cart-bar");
  const stickyCount = document.getElementById("sticky-cart-count");
  const stickyTotal = document.getElementById("sticky-cart-total");

  if (stickyBar) {
    if (totalItems > 0) {
      stickyCount.textContent = `${totalItems} ${totalItems === 1 ? 'item selecionado' : 'itens selecionados'}`;
      stickyTotal.textContent = `R$ ${totalPrice.toFixed(2).replace('.', ',')}`;
      stickyBar.classList.remove("translate-y-24", "opacity-0");
    } else {
      stickyBar.classList.add("translate-y-24", "opacity-0");
    }
  }

  // Render Cart Modal Body
  renderCartModalContent(totalPrice);
}

function renderCartModalContent(totalPrice) {
  const container = document.getElementById("cart-body");
  const subtotalEl = document.getElementById("cart-subtotal");
  const footerEl = document.getElementById("cart-footer");
  if (!container) return;

  if (subtotalEl) {
    subtotalEl.textContent = `R$ ${totalPrice.toFixed(2).replace('.', ',')}`;
  }

  if (cart.length === 0) {
    if (footerEl) footerEl.classList.add("hidden");
    container.innerHTML = `
      <div class="py-12 px-4 text-center flex flex-col items-center justify-center">
        <div class="w-16 h-16 rounded-full bg-secondary-pink text-primary flex items-center justify-center mb-3">
          <span class="material-symbols-outlined text-3xl">remove_shopping_cart</span>
        </div>
        <h4 class="font-heading font-bold text-base text-neutral-dark mb-1">Seu carrinho está vazio</h4>
        <p class="text-xs text-neutral-muted mb-4 max-w-xs">Adicione deliciosos milkshakes artesanais do nosso cardápio para continuar.</p>
        <button onclick="closeCartModal()" class="bg-primary-container text-on-primary font-heading font-bold text-xs py-2.5 px-5 rounded-full hover:bg-primary active:scale-95 transition-all shadow-md">
          Ver Cardápio
        </button>
      </div>
    `;
    return;
  }

  if (footerEl) footerEl.classList.remove("hidden");

  let html = "";
  cart.forEach(item => {
    const itemTotal = item.unitPrice * item.quantidade;
    const toppingsText = item.toppings && item.toppings.length > 0
      ? item.toppings.map(t => t.nome).join(", ")
      : "Sem adicionais";
    const sizeName = item.size ? item.size.nome : "Padrão";

    html += `
      <div class="p-3.5 bg-surface-container-lowest rounded-2xl border border-outline-variant/60 flex items-start gap-3 relative">
        <div class="w-12 h-12 rounded-xl bg-secondary-pink/60 text-primary flex items-center justify-center shrink-0 mt-0.5">
          <span class="material-symbols-outlined text-2xl">${item.icon || 'local_drink'}</span>
        </div>
        <div class="flex-grow min-w-0">
          <div class="flex justify-between items-start pr-6">
            <h5 class="font-heading font-bold text-xs text-neutral-dark truncate">${item.nome}</h5>
          </div>
          <p class="text-[11px] text-neutral-muted font-medium mt-0.5">Tamanho: <span class="text-neutral-dark">${sizeName}</span></p>
          <p class="text-[10px] text-neutral-muted line-clamp-1">+ ${toppingsText}</p>
          ${item.notes ? `<p class="text-[10px] text-primary italic mt-0.5">Obs: "${item.notes}"</p>` : ''}

          <div class="flex items-center justify-between mt-2.5">
            <span class="font-heading font-bold text-xs text-primary">R$ ${itemTotal.toFixed(2).replace('.', ',')}</span>
            <div class="flex items-center gap-2 bg-surface-container-low px-2 py-1 rounded-full border border-outline-variant/40">
              <button onclick="updateCartItemQty('${item.cartItemId}', -1)" class="w-5 h-5 rounded-full bg-surface-container-lowest text-neutral-dark flex items-center justify-center hover:bg-surface font-bold text-xs active:scale-90">
                <span class="material-symbols-outlined text-xs">remove</span>
              </button>
              <span class="font-heading font-bold text-xs min-w-[1rem] text-center">${item.quantidade}</span>
              <button onclick="updateCartItemQty('${item.cartItemId}', 1)" class="w-5 h-5 rounded-full bg-primary-container text-on-primary flex items-center justify-center hover:bg-primary font-bold text-xs active:scale-90">
                <span class="material-symbols-outlined text-xs">add</span>
              </button>
            </div>
          </div>
        </div>
        <button onclick="removeCartItem('${item.cartItemId}')" class="absolute top-3 right-3 text-neutral-muted hover:text-error p-1 rounded-full transition-colors" aria-label="Remover item">
          <span class="material-symbols-outlined text-base">delete</span>
        </button>
      </div>
    `;
  });

  container.innerHTML = html;
}

function updateCartItemQty(cartItemId, delta) {
  const item = cart.find(i => i.cartItemId === cartItemId);
  if (!item) return;

  item.quantidade += delta;
  if (item.quantidade <= 0) {
    removeCartItem(cartItemId);
    return;
  }

  saveCartToStorage();
  updateCartUI();
}

function removeCartItem(cartItemId) {
  cart = cart.filter(i => i.cartItemId !== cartItemId);
  saveCartToStorage();
  updateCartUI();
}

function closeCartModal() {
  document.getElementById("modal-cart").classList.add("hidden");
}

function openCartModal() {
  updateCartUI();
  document.getElementById("modal-cart").classList.remove("hidden");
}

// Phone / WhatsApp Mask Helper
function applyPhoneMask(value) {
  const nums = value.replace(/\D/g, "");
  if (nums.length <= 10) {
    return nums.replace(/^(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3").trim();
  }
  return nums.replace(/^(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3").substring(0, 15);
}

// Optional Geolocation fill
function handleGeolocation() {
  const statusEl = document.getElementById("geo-status");
  const addressInput = document.getElementById("input-endereco");

  if (!navigator.geolocation) {
    if (statusEl) {
      statusEl.textContent = "Geolocalização não é suportada pelo seu navegador.";
      statusEl.classList.remove("hidden", "text-neutral-muted");
      statusEl.classList.add("text-error");
    }
    return;
  }

  if (statusEl) {
    statusEl.textContent = "Obtendo sua localização...";
    statusEl.classList.remove("hidden", "text-error");
    statusEl.classList.add("text-neutral-muted");
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude.toFixed(5);
      const lng = pos.coords.longitude.toFixed(5);
      if (addressInput) {
        addressInput.value = `Localização aproximada (GPS: ${lat}, ${lng}) - Digite complemento se necessário`;
      }
      if (statusEl) {
        statusEl.textContent = "✓ Localização capturada com sucesso!";
        statusEl.classList.remove("text-neutral-muted");
        statusEl.classList.add("text-emerald-700");
      }
    },
    (err) => {
      console.warn("Geolocalização negada/indisponível:", err.message);
      if (statusEl) {
        statusEl.textContent = "Não foi possível obter o GPS. Por favor, digite o endereço manualmente.";
        statusEl.classList.remove("text-neutral-muted");
        statusEl.classList.add("text-error");
      }
    },
    { timeout: 8000 }
  );
}

// PIN confirmation setup
function setupPinInputs() {
  const inputs = document.querySelectorAll(".pin-digit");
  inputs.forEach((input, index) => {
    input.value = "";
    input.addEventListener("input", (e) => {
      if (e.target.value.length === 1 && index < inputs.length - 1) {
        inputs[index + 1].focus();
      }
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !e.target.value && index > 0) {
        inputs[index - 1].focus();
      }
    });
  });
}

function getEnteredPin() {
  const inputs = document.querySelectorAll(".pin-digit");
  let pin = "";
  inputs.forEach(i => pin += i.value);
  return pin;
}

// Generate Order ID
function generateOrderId() {
  return `#MS-${Date.now().toString().slice(-6)}`;
}

// Format Order Text for WhatsApp
function formatWhatsAppMessage(order) {
  let text = `*NOVO PEDIDO - ${appData.loja.nome || 'Milk Pink'}*\n`;
  text += `*Pedido:* ${order.orderId}\n`;
  text += `------------------------------\n`;
  text += `*CLIENTE:*\n`;
  text += `Nome: ${order.customer.nome}\n`;
  text += `WhatsApp: ${order.customer.whatsapp}\n`;
  text += `E-mail: ${order.customer.email}\n`;
  text += `Endereço: ${order.customer.endereco}\n`;
  text += `------------------------------\n`;
  text += `*ITENS DO PEDIDO:*\n`;

  order.items.forEach((item, idx) => {
    const sizeName = item.size ? item.size.nome : "Padrão";
    const itemTotal = item.unitPrice * item.quantidade;
    text += `${idx + 1}. *${item.quantidade}x ${item.nome}* (${sizeName}) - R$ ${itemTotal.toFixed(2).replace('.', ',')}\n`;
    if (item.toppings && item.toppings.length > 0) {
      text += `   Adicionais: ${item.toppings.map(t => t.nome).join(', ')}\n`;
    }
    if (item.notes) {
      text += `   Obs: ${item.notes}\n`;
    }
  });

  text += `------------------------------\n`;
  text += `*Forma de Pagamento:* ${order.paymentMethod}\n`;
  text += `*TOTAL:* R$ ${order.totalPrice.toFixed(2).replace('.', ',')}\n\n`;
  text += `${appData.loja.mensagemPadrao || 'Obrigado pelo pedido!'}`;

  return text;
}

// Setup Event Listeners
function initEventListeners() {
  // Search input
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      renderCatalog();
    });
  }

  // Header Cart Button
  const headerCartBtn = document.getElementById("header-cart-btn");
  if (headerCartBtn) headerCartBtn.addEventListener("click", openCartModal);

  // Sticky Open Cart Button
  const openCartBtn = document.getElementById("open-cart-btn");
  if (openCartBtn) openCartBtn.addEventListener("click", openCartModal);

  // Close Cart Modal Button
  const closeCartBtn = document.getElementById("close-cart-modal");
  if (closeCartBtn) closeCartBtn.addEventListener("click", closeCartModal);

  // Close Product Modal Button
  const closeProductBtn = document.getElementById("close-product-modal");
  if (closeProductBtn) {
    closeProductBtn.addEventListener("click", () => {
      document.getElementById("modal-product").classList.add("hidden");
    });
  }

  // Product Quantity Plus/Minus
  const qtyMinus = document.getElementById("modal-qty-minus");
  if (qtyMinus) qtyMinus.addEventListener("click", () => adjustCustomQty(-1));

  const qtyPlus = document.getElementById("modal-qty-plus");
  if (qtyPlus) qtyPlus.addEventListener("click", () => adjustCustomQty(1));

  // Add Customized Item Button
  const addToCartBtn = document.getElementById("modal-add-to-cart-btn");
  if (addToCartBtn) addToCartBtn.addEventListener("click", addCustomizedItemToCart);

  // Checkout Button in Cart
  const cartCheckoutBtn = document.getElementById("cart-checkout-btn");
  if (cartCheckoutBtn) {
    cartCheckoutBtn.addEventListener("click", () => {
      closeCartModal();
      document.getElementById("modal-checkout").classList.remove("hidden");
    });
  }

  // Back to Cart from Checkout
  const backToCartBtn = document.getElementById("back-to-cart-from-checkout");
  if (backToCartBtn) {
    backToCartBtn.addEventListener("click", () => {
      document.getElementById("modal-checkout").classList.add("hidden");
      openCartModal();
    });
  }

  // Close Checkout Modal
  const closeCheckoutBtn = document.getElementById("close-checkout-modal");
  if (closeCheckoutBtn) {
    closeCheckoutBtn.addEventListener("click", () => {
      document.getElementById("modal-checkout").classList.add("hidden");
    });
  }

  // WhatsApp Input Mask
  const whatsappInput = document.getElementById("input-whatsapp");
  if (whatsappInput) {
    whatsappInput.addEventListener("input", (e) => {
      e.target.value = applyPhoneMask(e.target.value);
    });
  }

  // Geolocation Button
  const geoBtn = document.getElementById("btn-geolocation");
  if (geoBtn) geoBtn.addEventListener("click", handleGeolocation);

  // Checkout Form Submission -> Open PIN Modal
  const checkoutForm = document.getElementById("checkout-form");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", (e) => {
      e.preventDefault();

      checkoutCustomerInfo = {
        nome: document.getElementById("input-nome").value.trim(),
        whatsapp: document.getElementById("input-whatsapp").value.trim(),
        email: document.getElementById("input-email").value.trim(),
        endereco: document.getElementById("input-endereco").value.trim()
      };

      document.getElementById("modal-checkout").classList.add("hidden");
      setupPinInputs();
      document.getElementById("pin-error").classList.add("hidden");
      document.getElementById("modal-pin").classList.remove("hidden");
    });
  }

  // Cancel PIN Button
  const cancelPinBtn = document.getElementById("cancel-pin-btn");
  if (cancelPinBtn) {
    cancelPinBtn.addEventListener("click", () => {
      document.getElementById("modal-pin").classList.add("hidden");
      document.getElementById("modal-checkout").classList.remove("hidden");
    });
  }

  // Confirm PIN Button -> Open Payment Gateway Modal
  const confirmPinBtn = document.getElementById("confirm-pin-btn");
  if (confirmPinBtn) {
    confirmPinBtn.addEventListener("click", () => {
      const pin = getEnteredPin();
      if (pin.length !== 4) {
        document.getElementById("pin-error").classList.remove("hidden");
        return;
      }

      document.getElementById("modal-pin").classList.add("hidden");

      // Reset Payment Gateway Modal View
      document.getElementById("payment-selection").classList.remove("hidden");
      document.getElementById("payment-processing").classList.add("hidden");
      document.getElementById("payment-approved").classList.add("hidden");
      document.getElementById("modal-payment").classList.remove("hidden");
    });
  }

  // Process Payment Button -> Simulated Delay ~2s -> Approved State
  const processPaymentBtn = document.getElementById("process-payment-btn");
  if (processPaymentBtn) {
    processPaymentBtn.addEventListener("click", () => {
      const selectedRadio = document.querySelector('input[name="payment-method"]:checked');
      if (selectedRadio) {
        checkoutPaymentMethod = selectedRadio.value;
      }

      document.getElementById("payment-selection").classList.add("hidden");
      document.getElementById("payment-processing").classList.remove("hidden");

      setTimeout(() => {
        document.getElementById("payment-processing").classList.add("hidden");
        document.getElementById("payment-approved").classList.remove("hidden");
      }, 2000);
    });
  }

  // Go to Order Success Screen
  const goToSuccessBtn = document.getElementById("go-to-success-btn");
  if (goToSuccessBtn) {
    goToSuccessBtn.addEventListener("click", () => {
      const totalPrice = cart.reduce((sum, item) => sum + (item.unitPrice * item.quantidade), 0);
      const orderId = generateOrderId();

      currentOrder = {
        orderId: orderId,
        customer: checkoutCustomerInfo,
        items: [...cart],
        paymentMethod: checkoutPaymentMethod,
        totalPrice: totalPrice
      };

      // Clear Cart in state and localStorage
      cart = [];
      saveCartToStorage();
      updateCartUI();

      // Setup Success Modal Content
      document.getElementById("order-id-badge").textContent = currentOrder.orderId;

      const messageText = formatWhatsAppMessage(currentOrder);
      const waNumber = (appData.loja && appData.loja.whatsapp) || CONFIG.WHATSAPP_NUMBER;
      const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(messageText)}`;

      const redirectBtn = document.getElementById("whatsapp-redirect-link");
      if (redirectBtn) {
        redirectBtn.href = waUrl;
      }

      // Populate summary box in modal
      const summaryBox = document.getElementById("order-summary-box");
      if (summaryBox) {
        let itemsHtml = currentOrder.items.map(i => {
          const sizeName = i.size ? i.size.nome : "Padrão";
          return `<li><strong>${i.quantidade}x ${i.nome}</strong> (${sizeName}) - R$ ${(i.unitPrice * i.quantidade).toFixed(2).replace('.', ',')}</li>`;
        }).join('');

        summaryBox.innerHTML = `
          <p class="mb-1"><strong>Cliente:</strong> ${currentOrder.customer.nome}</p>
          <p class="mb-1"><strong>Endereço:</strong> ${currentOrder.customer.endereco}</p>
          <p class="mb-1"><strong>Pagamento:</strong> ${currentOrder.paymentMethod}</p>
          <p class="mb-2"><strong>Total:</strong> R$ ${currentOrder.totalPrice.toFixed(2).replace('.', ',')}</p>
          <p class="font-semibold mb-1">Itens:</p>
          <ul class="list-disc pl-4 space-y-0.5">${itemsHtml}</ul>
        `;
      }

      document.getElementById("modal-payment").classList.add("hidden");
      document.getElementById("modal-success").classList.remove("hidden");
    });
  }

  // Reset App / Return to Menu
  const resetAppBtn = document.getElementById("reset-app-btn");
  if (resetAppBtn) {
    resetAppBtn.addEventListener("click", () => {
      document.getElementById("modal-success").classList.add("hidden");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}
