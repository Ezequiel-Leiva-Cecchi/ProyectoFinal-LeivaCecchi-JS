(() => {
  'use strict';

  const STORAGE = {
    cart: 'falconLab.cart.v2',
    favorites: 'falconLab.favorites.v2',
  };

  const PROFILE_COPY = {
    Gaming: 'Pensada para quienes priorizan potencia, gráficos y sesiones exigentes.',
    Trabajo: 'Una línea enfocada en productividad, confiabilidad y jornadas intensivas.',
    Creatividad: 'Formatos versátiles y líneas premium para crear, editar y moverse.',
    'Uso diario': 'Una opción equilibrada para estudiar, navegar, videollamadas y uso cotidiano.',
  };

  const state = {
    products: [],
    search: '',
    brand: 'all',
    profile: 'all',
    sort: 'featured',
    favoritesOnly: false,
    cart: readStorage(STORAGE.cart, []),
    favorites: new Set(readStorage(STORAGE.favorites, [])),
    compare: new Set(),
  };

  const els = {
    productGrid: document.querySelector('#productGrid'),
    resultsLabel: document.querySelector('#resultsLabel'),
    emptyState: document.querySelector('#emptyState'),
    searchInput: document.querySelector('#searchInput'),
    brandFilter: document.querySelector('#brandFilter'),
    profileFilter: document.querySelector('#profileFilter'),
    sortFilter: document.querySelector('#sortFilter'),
    resetFilters: document.querySelector('#resetFilters'),
    emptyReset: document.querySelector('#emptyReset'),
    activeFilter: document.querySelector('#activeFilter'),
    heroProduct: document.querySelector('#heroProduct'),
    openFeatured: document.querySelector('#openFeatured'),
    favoriteCount: document.querySelector('#favoriteCount'),
    favoritesButton: document.querySelector('#favoritesButton'),
    cartCount: document.querySelector('#cartCount'),
    cartDrawer: document.querySelector('#cartDrawer'),
    drawerBackdrop: document.querySelector('#drawerBackdrop'),
    openCart: document.querySelector('#openCart'),
    closeCart: document.querySelector('#closeCart'),
    cartItems: document.querySelector('#cartItems'),
    cartTotal: document.querySelector('#cartTotal'),
    clearCart: document.querySelector('#clearCart'),
    checkoutButton: document.querySelector('#checkoutButton'),
    compareDock: document.querySelector('#compareDock'),
    compareCount: document.querySelector('#compareCount'),
    compareCountCta: document.querySelector('#compareCountCta'),
    openCompare: document.querySelector('#openCompare'),
    openCompareCta: document.querySelector('#openCompareCta'),
    clearCompare: document.querySelector('#clearCompare'),
    productDialog: document.querySelector('#productDialog'),
    productDialogContent: document.querySelector('#productDialogContent'),
    compareDialog: document.querySelector('#compareDialog'),
    compareDialogContent: document.querySelector('#compareDialogContent'),
    toastRegion: document.querySelector('#toastRegion'),
    menuButton: document.querySelector('#menuButton'),
    mainNav: document.querySelector('#mainNav'),
  };

  function readStorage(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value ?? fallback;
    } catch {
      return fallback;
    }
  }

  function writeStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      showToast('No pudimos guardar el cambio en este navegador.');
    }
  }

  function money(value) {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(value);
  }

  function getBrand(product) {
    const raw = String(product?.categoria?.id || product?.categoria?.nombre || '').toLowerCase();
    if (raw.includes('lenovo')) return 'Lenovo';
    if (raw.includes('asus')) return 'Asus';
    return 'HP';
  }

  function getProfile(product) {
    const title = product.titulo.toLowerCase();
    if (/gaming|legion|rog|tuf/.test(title)) return 'Gaming';
    if (/thinkpad|probook/.test(title)) return 'Trabajo';
    if (/yoga|zenbook|duo|convertible|fold|vivobook pro/.test(title)) return 'Creatividad';
    return 'Uso diario';
  }

  function getLine(product) {
    const title = product.titulo.toLowerCase();
    if (/legion|gaming|rog|tuf/.test(title)) return 'Performance';
    if (/thinkpad|probook/.test(title)) return 'Business';
    if (/yoga|zenbook|fold|convertible/.test(title)) return 'Premium';
    return 'Everyday';
  }

  function decorateProduct(product, index) {
    return {
      ...product,
      index,
      brand: getBrand(product),
      profile: getProfile(product),
      line: getLine(product),
      description: PROFILE_COPY[getProfile(product)],
      image: product.image.replace(/^\.\//, ''),
    };
  }

  async function loadProducts() {
    try {
      const response = await fetch('productos.json');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const products = await response.json();
      state.products = products.map(decorateProduct);
      sanitizePersistentState();
      renderAll();
    } catch (error) {
      console.error('No se pudo cargar el catálogo:', error);
      els.resultsLabel.textContent = 'Catálogo no disponible';
      els.productGrid.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1">
          <span>!</span><h3>No pudimos cargar el catálogo</h3>
          <p>Si abriste el HTML directamente, probalo con Live Server o desde GitHub Pages.</p>
        </div>`;
    }
  }

  function sanitizePersistentState() {
    const ids = new Set(state.products.map((product) => product.id));
    state.cart = state.cart
      .filter((item) => ids.has(item.id) && Number(item.quantity) > 0)
      .map((item) => ({ id: item.id, quantity: Math.max(1, Number(item.quantity) || 1) }));
    state.favorites = new Set([...state.favorites].filter((id) => ids.has(id)));
    persistCart();
    persistFavorites();
  }

  function getVisibleProducts() {
    const search = state.search.trim().toLowerCase();
    let items = state.products.filter((product) => {
      const matchesSearch = !search || `${product.titulo} ${product.brand} ${product.profile}`.toLowerCase().includes(search);
      const matchesBrand = state.brand === 'all' || product.brand === state.brand;
      const matchesProfile = state.profile === 'all' || product.profile === state.profile;
      const matchesFavorites = !state.favoritesOnly || state.favorites.has(product.id);
      return matchesSearch && matchesBrand && matchesProfile && matchesFavorites;
    });

    items = [...items].sort((a, b) => {
      if (state.sort === 'price-asc') return a.precio - b.precio;
      if (state.sort === 'price-desc') return b.precio - a.precio;
      if (state.sort === 'name') return a.titulo.localeCompare(b.titulo, 'es');
      const priority = { Gaming: 1, Creatividad: 2, Trabajo: 3, 'Uso diario': 4 };
      return priority[a.profile] - priority[b.profile] || a.index - b.index;
    });

    return items;
  }

  function renderAll() {
    renderHero();
    renderProducts();
    renderCart();
    renderFavorites();
    renderCompareDock();
  }

  function renderHero() {
    const featured = state.products.find((product) => product.id.toLowerCase() === 'lenovo-01') || state.products[0];
    if (!featured) return;
    els.heroProduct.innerHTML = `
      <article class="featured-card">
        <img src="${featured.image}" alt="${featured.titulo}" loading="eager">
        <div class="featured-copy">
          <div><span class="eyebrow">Destacada · ${featured.profile}</span><h2>${featured.titulo}</h2><p>${featured.brand} · ${featured.line}</p></div>
          <span class="price">${money(featured.precio)}</span>
        </div>
      </article>`;
    els.heroProduct.querySelector('.featured-card').addEventListener('click', () => openProduct(featured.id));
    els.heroProduct.querySelector('.featured-card').style.cursor = 'pointer';
    els.openFeatured.onclick = () => openProduct(featured.id);
  }

  function renderProducts() {
    const products = getVisibleProducts();
    els.resultsLabel.textContent = `${products.length} ${products.length === 1 ? 'modelo' : 'modelos'} disponibles en esta vista`;
    els.emptyState.hidden = products.length !== 0;
    els.productGrid.hidden = products.length === 0;

    els.productGrid.innerHTML = products.map((product) => {
      const favorite = state.favorites.has(product.id);
      const compared = state.compare.has(product.id);
      return `
        <article class="product-card" data-id="${product.id}">
          <div class="product-media">
            <span class="product-badge">${product.profile}</span>
            <button class="favorite-button ${favorite ? 'is-favorite' : ''}" data-action="favorite" type="button" aria-label="${favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}">${favorite ? '♥' : '♡'}</button>
            <img src="${product.image}" alt="${product.titulo}" loading="lazy">
          </div>
          <div class="product-info">
            <span class="product-meta">${product.brand} · ${product.line}</span>
            <h3>${product.titulo}</h3>
            <p class="product-profile">${product.description}</p>
            <div class="product-bottom">
              <span class="price">${money(product.precio)}</span>
              <div class="product-actions">
                <button class="mini-button" data-action="quick" type="button" aria-label="Ver detalle">↗</button>
                <button class="mini-button primary" data-action="add" type="button">Agregar</button>
              </div>
            </div>
            <label class="compare-check"><input type="checkbox" data-action="compare" ${compared ? 'checked' : ''}> Comparar este modelo</label>
          </div>
        </article>`;
    }).join('');

    updateActiveFilter();
  }

  function updateActiveFilter() {
    const labels = [];
    if (state.brand !== 'all') labels.push(state.brand);
    if (state.profile !== 'all') labels.push(state.profile);
    if (state.search) labels.push(`“${state.search}”`);
    if (state.favoritesOnly) labels.push('Sólo favoritos');
    els.activeFilter.hidden = labels.length === 0;
    els.activeFilter.textContent = labels.length ? `Filtrando por: ${labels.join(' · ')}` : '';
  }

  function resetFilters() {
    state.search = '';
    state.brand = 'all';
    state.profile = 'all';
    state.sort = 'featured';
    state.favoritesOnly = false;
    els.searchInput.value = '';
    els.brandFilter.value = 'all';
    els.profileFilter.value = 'all';
    els.sortFilter.value = 'featured';
    els.favoritesButton.setAttribute('aria-pressed', 'false');
    renderProducts();
    document.querySelector('#catalogo').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function renderFavorites() {
    els.favoriteCount.textContent = state.favorites.size;
    els.favoritesButton.classList.toggle('is-active', state.favoritesOnly);
    els.favoritesButton.querySelector('span').textContent = state.favoritesOnly ? '♥' : '♡';
  }

  function persistFavorites() {
    writeStorage(STORAGE.favorites, [...state.favorites]);
  }

  function toggleFavorite(id) {
    if (state.favorites.has(id)) {
      state.favorites.delete(id);
      showToast('Quitada de favoritos');
    } else {
      state.favorites.add(id);
      showToast('Guardada en favoritos');
    }
    persistFavorites();
    renderFavorites();
    renderProducts();
  }

  function persistCart() {
    writeStorage(STORAGE.cart, state.cart);
  }

  function getCartQuantity() {
    return state.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  function addToCart(id, quantity = 1) {
    const item = state.cart.find((cartItem) => cartItem.id === id);
    if (item) item.quantity += quantity;
    else state.cart.push({ id, quantity });
    persistCart();
    renderCart();
    showToast('Agregada al carrito');
  }

  function changeCartQuantity(id, delta) {
    const item = state.cart.find((cartItem) => cartItem.id === id);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) state.cart = state.cart.filter((cartItem) => cartItem.id !== id);
    persistCart();
    renderCart();
  }

  function removeFromCart(id) {
    state.cart = state.cart.filter((item) => item.id !== id);
    persistCart();
    renderCart();
    showToast('Producto eliminado');
  }

  function getCartTotal() {
    return state.cart.reduce((total, item) => {
      const product = state.products.find((candidate) => candidate.id === item.id);
      return total + (product ? product.precio * item.quantity : 0);
    }, 0);
  }

  function renderCart() {
    els.cartCount.textContent = getCartQuantity();
    els.cartTotal.textContent = money(getCartTotal());
    els.clearCart.disabled = state.cart.length === 0;
    els.checkoutButton.disabled = state.cart.length === 0;

    if (!state.cart.length) {
      els.cartItems.innerHTML = `<div class="cart-empty"><p>Tu carrito está vacío.</p><span>Explorá el catálogo y armá tu selección.</span></div>`;
      return;
    }

    els.cartItems.innerHTML = state.cart.map((item) => {
      const product = state.products.find((candidate) => candidate.id === item.id);
      if (!product) return '';
      return `
        <article class="cart-item" data-id="${product.id}">
          <img src="${product.image}" alt="${product.titulo}">
          <div><h4>${product.titulo}</h4><p>${money(product.precio)} c/u</p><div class="quantity"><button data-cart-action="decrease" type="button">−</button><b>${item.quantity}</b><button data-cart-action="increase" type="button">+</button></div></div>
          <button class="remove-item" data-cart-action="remove" type="button" aria-label="Eliminar ${product.titulo}">×</button>
        </article>`;
    }).join('');
  }

  function openCart() {
    els.drawerBackdrop.hidden = false;
    els.cartDrawer.classList.add('is-open');
    els.cartDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    els.drawerBackdrop.hidden = true;
    els.cartDrawer.classList.remove('is-open');
    els.cartDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function toggleCompare(id, checked) {
    if (checked) {
      if (state.compare.size >= 3) {
        showToast('Podés comparar hasta 3 modelos');
        renderProducts();
        return;
      }
      state.compare.add(id);
    } else {
      state.compare.delete(id);
    }
    renderCompareDock();
  }

  function renderCompareDock() {
    const count = state.compare.size;
    els.compareDock.hidden = count === 0;
    els.compareCount.textContent = count;
    els.compareCountCta.textContent = count;
    els.openCompare.disabled = count < 2;
  }

  function openCompareDialog() {
    const products = [...state.compare]
      .map((id) => state.products.find((product) => product.id === id))
      .filter(Boolean);

    if (products.length < 2) {
      showToast('Elegí al menos 2 modelos para comparar');
      document.querySelector('#catalogo').scrollIntoView({ behavior: 'smooth' });
      return;
    }

    els.compareDialogContent.innerHTML = `
      <div class="compare-table-wrap">
        <table class="compare-table">
          <thead><tr><th></th>${products.map((product) => `<th><img src="${product.image}" alt="${product.titulo}"><b>${product.titulo}</b></th>`).join('')}</tr></thead>
          <tbody>
            <tr><td>Marca</td>${products.map((product) => `<td>${product.brand}</td>`).join('')}</tr>
            <tr><td>Perfil</td>${products.map((product) => `<td>${product.profile}</td>`).join('')}</tr>
            <tr><td>Línea</td>${products.map((product) => `<td>${product.line}</td>`).join('')}</tr>
            <tr><td>Precio demo</td>${products.map((product) => `<td><b>${money(product.precio)}</b></td>`).join('')}</tr>
            <tr><td></td>${products.map((product) => `<td><button class="button button-small" data-compare-add="${product.id}" type="button">Agregar al carrito</button></td>`).join('')}</tr>
          </tbody>
        </table>
      </div>`;
    els.compareDialog.showModal();
  }

  function openProduct(id) {
    const product = state.products.find((candidate) => candidate.id === id);
    if (!product) return;
    const favorite = state.favorites.has(id);
    els.productDialogContent.innerHTML = `
      <div class="dialog-product" data-id="${product.id}">
        <div class="dialog-product-media"><img src="${product.image}" alt="${product.titulo}"></div>
        <div class="dialog-product-copy">
          <span class="eyebrow">${product.brand} · ${product.profile}</span>
          <h2>${product.titulo}</h2>
          <p>${product.description}</p>
          <div class="detail-list">
            <div><span>Marca</span><b>${product.brand}</b></div>
            <div><span>Perfil sugerido</span><b>${product.profile}</b></div>
            <div><span>Línea</span><b>${product.line}</b></div>
            <div><span>Precio ilustrativo</span><b>${money(product.precio)}</b></div>
          </div>
          <p class="price">${money(product.precio)}</p>
          <div class="dialog-actions">
            <button class="button" data-dialog-action="add" type="button">Agregar al carrito</button>
            <button class="button button-secondary" data-dialog-action="favorite" type="button">${favorite ? '♥ Guardada' : '♡ Guardar'}</button>
          </div>
        </div>
      </div>`;
    els.productDialog.showModal();
  }

  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    els.toastRegion.appendChild(toast);
    window.setTimeout(() => toast.remove(), 2200);
  }

  function wireEvents() {
    els.productGrid.addEventListener('click', (event) => {
      const card = event.target.closest('.product-card');
      const action = event.target.closest('[data-action]')?.dataset.action;
      if (!card || !action || action === 'compare') return;
      const id = card.dataset.id;
      if (action === 'favorite') toggleFavorite(id);
      if (action === 'quick') openProduct(id);
      if (action === 'add') addToCart(id);
    });

    els.productGrid.addEventListener('change', (event) => {
      if (event.target.dataset.action !== 'compare') return;
      const card = event.target.closest('.product-card');
      toggleCompare(card.dataset.id, event.target.checked);
    });

    els.searchInput.addEventListener('input', (event) => {
      state.search = event.target.value;
      renderProducts();
    });
    els.brandFilter.addEventListener('change', (event) => { state.brand = event.target.value; renderProducts(); });
    els.profileFilter.addEventListener('change', (event) => { state.profile = event.target.value; renderProducts(); });
    els.sortFilter.addEventListener('change', (event) => { state.sort = event.target.value; renderProducts(); });
    els.resetFilters.addEventListener('click', resetFilters);
    els.emptyReset.addEventListener('click', resetFilters);

    document.querySelectorAll('[data-profile]').forEach((button) => {
      button.addEventListener('click', () => {
        state.profile = button.dataset.profile;
        state.favoritesOnly = false;
        els.profileFilter.value = state.profile;
        renderFavorites();
        renderProducts();
        document.querySelector('#catalogo').scrollIntoView({ behavior: 'smooth' });
      });
    });

    els.favoritesButton.addEventListener('click', () => {
      state.favoritesOnly = !state.favoritesOnly;
      els.favoritesButton.setAttribute('aria-pressed', String(state.favoritesOnly));
      renderFavorites();
      renderProducts();
      document.querySelector('#catalogo').scrollIntoView({ behavior: 'smooth' });
    });

    els.openCart.addEventListener('click', openCart);
    els.closeCart.addEventListener('click', closeCart);
    els.drawerBackdrop.addEventListener('click', closeCart);

    els.cartItems.addEventListener('click', (event) => {
      const action = event.target.closest('[data-cart-action]')?.dataset.cartAction;
      const item = event.target.closest('.cart-item');
      if (!action || !item) return;
      if (action === 'increase') changeCartQuantity(item.dataset.id, 1);
      if (action === 'decrease') changeCartQuantity(item.dataset.id, -1);
      if (action === 'remove') removeFromCart(item.dataset.id);
    });

    els.clearCart.addEventListener('click', () => {
      if (!state.cart.length) return;
      state.cart = [];
      persistCart();
      renderCart();
      showToast('Carrito vaciado');
    });

    els.checkoutButton.addEventListener('click', () => {
      if (!state.cart.length) return;
      state.cart = [];
      persistCart();
      renderCart();
      closeCart();
      showToast('Demo finalizada · no se realizó ningún cobro');
    });

    els.clearCompare.addEventListener('click', () => {
      state.compare.clear();
      renderCompareDock();
      renderProducts();
    });
    els.openCompare.addEventListener('click', openCompareDialog);
    els.openCompareCta.addEventListener('click', openCompareDialog);

    els.compareDialogContent.addEventListener('click', (event) => {
      const id = event.target.closest('[data-compare-add]')?.dataset.compareAdd;
      if (id) addToCart(id);
    });

    els.productDialogContent.addEventListener('click', (event) => {
      const container = event.target.closest('.dialog-product');
      const action = event.target.closest('[data-dialog-action]')?.dataset.dialogAction;
      if (!container || !action) return;
      if (action === 'add') addToCart(container.dataset.id);
      if (action === 'favorite') {
        toggleFavorite(container.dataset.id);
        openProduct(container.dataset.id);
      }
    });

    document.querySelectorAll('[data-close-dialog]').forEach((button) => {
      button.addEventListener('click', () => document.getElementById(button.dataset.closeDialog)?.close());
    });

    [els.productDialog, els.compareDialog].forEach((dialog) => {
      dialog.addEventListener('click', (event) => {
        const rect = dialog.getBoundingClientRect();
        const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
        if (outside) dialog.close();
      });
    });

    els.menuButton.addEventListener('click', () => {
      const open = els.mainNav.classList.toggle('is-open');
      els.menuButton.setAttribute('aria-expanded', String(open));
    });
    els.mainNav.addEventListener('click', () => {
      els.mainNav.classList.remove('is-open');
      els.menuButton.setAttribute('aria-expanded', 'false');
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && els.cartDrawer.classList.contains('is-open')) closeCart();
    });
  }

  document.querySelector('#currentYear').textContent = new Date().getFullYear();
  wireEvents();
  renderFavorites();
  renderCart();
  renderCompareDock();
  loadProducts();
})();
