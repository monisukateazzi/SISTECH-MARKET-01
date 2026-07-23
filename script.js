
const API_URL = 'https://sistech-ecommerce-api.leficullen.xyz/api/products';

const FALLBACK_PRODUCTS = [
  {
    id: "fb-1",
    name: "Sistech NeoBook Pro 14",
    slug: "sistech-neobook-pro-14",
    description: "Premium performance laptop powered by modern processors. Includes a stunning 14-inch QHD display, 16GB RAM, 512GB NVMe SSD, and high-fidelity speakers.",
    price: 12499000,
    stock: 12,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1496181130204-755241524eab?auto=format&fit=crop&w=600&q=80",
    discountPercentage: 10,
    isFeatured: true,
    isNewArrival: true,
    condition: "New",
    category: "Electronics",
    brand: "Sistech",
    store: "Sistech Official Store",
    storeCity: "Jakarta Pusat",
    storeRating: 4.9,
    isOfficialStore: true
  },
  {
    id: "fb-2",
    name: "Wardah Crystal Secret Dark Spot Serum",
    slug: "wardah-crystal-secret-serum",
    description: "Intensive care serum formulated with Edelweiss Extract and Alpha Arbutin to reduce dark spots and even out skin tone. Dermatologically tested.",
    price: 89000,
    stock: 45,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80",
    discountPercentage: 5,
    isFeatured: true,
    isNewArrival: false,
    condition: "New",
    category: "Beauty",
    brand: "Wardah",
    store: "Wardah Official Store",
    storeCity: "Bandung",
    storeRating: 4.8,
    isOfficialStore: true
  },
  {
    id: "fb-3",
    name: "Teh Botol Sosro Original 450ml Pack",
    slug: "sosro-teh-botol-original",
    description: "Iconic sweet jasmine tea, brewed with premium tea leaves. Refreshing beverage loved for generations in Indonesia. Best served cold.",
    price: 24000,
    stock: 150,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80",
    discountPercentage: 0,
    isFeatured: false,
    isNewArrival: false,
    condition: "New",
    category: "Beverages",
    brand: "Sosro",
    store: "Local Mart",
    storeCity: "Surabaya",
    storeRating: 4.5,
    isOfficialStore: false
  },
  {
    id: "fb-4",
    name: "Sistech SoundFlow Wireless ANC Earbuds",
    slug: "sistech-soundflow-anc",
    description: "Experience silence and pristine sound. Active Noise Cancellation blocks external disturbances, while custom dynamic drivers produce crisp highs and warm bass.",
    price: 899000,
    stock: 8,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80",
    discountPercentage: 15,
    isFeatured: true,
    isNewArrival: true,
    condition: "New",
    category: "Electronics",
    brand: "Sistech",
    store: "Sistech Official Store",
    storeCity: "Jakarta Pusat",
    storeRating: 4.9,
    isOfficialStore: true
  },
  {
    id: "fb-5",
    name: "Philips Daily Collection Airfryer",
    slug: "philips-daily-airfryer",
    description: "Healthy frying with Rapid Air technology. Fry, bake, grill, and roast with up to 90% less fat. Easy to clean with a non-stick coating.",
    price: 1349000,
    stock: 4,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?auto=format&fit=crop&w=600&q=80",
    discountPercentage: 12,
    isFeatured: false,
    isNewArrival: true,
    condition: "New",
    category: "Home Appliances",
    brand: "Philips",
    store: "Philips Home Store",
    storeCity: "Tangerang",
    storeRating: 4.7,
    isOfficialStore: true
  }
];

function formatIDR(num) {
  return "Rp " + Number(num).toLocaleString('id-ID');
}

const state = {
  products: [],
  categories: ["All"],
  brands: ["All"],
  loading: true,
  error: null,

  searchQuery: '',
  selectedCategory: 'All',
  selectedBrand: 'All',
  selectedCondition: 'All',
  onlyOfficial: false,
  maxPriceFilter: 25000000,
  sortBy: 'default',

  cart: [],
  wishlist: [],
  isCartOpen: false,
  isWishlistOpen: false,
  selectedProduct: null,
  promoCode: '',
  appliedDiscount: 0,
  checkoutStep: 'cart',
  promoMessage: ''
};

function setState(partial) {
  Object.assign(state, partial);
  renderWithFocusPreserved();
}

function loadFallbackDB() {
  state.products = FALLBACK_PRODUCTS;
  state.categories = ["All", ...new Set(FALLBACK_PRODUCTS.map(p => p.category))];
  state.brands = ["All", ...new Set(FALLBACK_PRODUCTS.map(p => p.brand))];
}

async function fetchApiProducts() {
  state.loading = true;
  state.error = null;

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`);
    }

    const resJson = await response.json();
    const apiData = resJson.data || resJson;

    if (Array.isArray(apiData) && apiData.length > 0) {
      const normalized = apiData.map((item, idx) => {
        const hasStoreObj = item.store && typeof item.store === 'object';
        const hasCatObj = item.category && typeof item.category === 'object';
        const hasBrandObj = item.brand && typeof item.brand === 'object';
        const productName = item.name || "Sistech Quality Item";

        return {
          id: item.id || `api-${idx}`,
          name: productName,
          slug: item.slug || "sistech-quality-item",
          description: item.description || "Excellent product configured beautifully with official branding and pristine engineering specifications.",
          price: Number(item.price) || 0,
          stock: Number(item.stock) || 0,
          rating: Number(item.rating) || 4.5,
          image: item.imageUrl || item.image || `https://placehold.co/600x600/8EB8E8/FFFFFF?text=${encodeURIComponent(productName)}`,
          discountPercentage: Number(item.discountPercentage) || 0,
          isFeatured: !!item.isFeatured,
          isNewArrival: !!item.isNewArrival,
          condition: item.condition || "New",
          category: hasCatObj ? item.category.name : (item.category || "General"),
          brand: hasBrandObj ? item.brand.name : (item.brand || "Generics"),
          store: hasStoreObj ? item.store.name : (item.store || "Local Mart"),
          storeCity: hasStoreObj ? item.store.city : "Jakarta",
          storeRating: hasStoreObj ? item.store.rating : 4.4,
          isOfficialStore: hasStoreObj ? !!item.store.isOfficial : true
        };
      });

      state.products = normalized;
      state.categories = ["All", ...new Set(normalized.map(p => p.category))];
      state.brands = ["All", ...new Set(normalized.map(p => p.brand))];
    } else {
      loadFallbackDB();
    }
  } catch (err) {
    loadFallbackDB();
  } finally {
    state.loading = false;
    renderWithFocusPreserved();
  }
}

function getProcessedProducts() {
  return state.products.filter(product => {
    const q = state.searchQuery.toLowerCase();
    const matchesSearch = product.name.toLowerCase().includes(q) ||
                          product.description.toLowerCase().includes(q) ||
                          product.brand.toLowerCase().includes(q);
    const matchesCategory = state.selectedCategory === 'All' || product.category === state.selectedCategory;
    const matchesBrand = state.selectedBrand === 'All' || product.brand === state.selectedBrand;
    const matchesCondition = state.selectedCondition === 'All' || product.condition.toLowerCase() === state.selectedCondition.toLowerCase();
    const matchesOfficial = !state.onlyOfficial || product.isOfficialStore;
    const matchesPrice = product.price <= state.maxPriceFilter;

    return matchesSearch && matchesCategory && matchesBrand && matchesCondition && matchesOfficial && matchesPrice;
  }).sort((a, b) => {
    if (state.sortBy === 'price-asc') return a.price - b.price;
    if (state.sortBy === 'price-desc') return b.price - a.price;
    if (state.sortBy === 'rating') return b.rating - a.rating;
    if (state.sortBy === 'discount') return b.discountPercentage - a.discountPercentage;
    return 0;
  });
}

function getCartTotals() {
  const cartSubtotal = state.cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discountAmount = Math.round(cartSubtotal * (state.appliedDiscount / 100));
  const taxAmount = Math.round((cartSubtotal - discountAmount) * 0.11);
  const cartTotal = cartSubtotal - discountAmount + taxAmount;
  return { cartSubtotal, discountAmount, taxAmount, cartTotal };
}

function findProductById(id) {
  return state.products.find(p => String(p.id) === String(id));
}

function handleAddToCart(product, quantity = 1) {
  const existingItem = state.cart.find(item => item.id === product.id);
  if (existingItem) {
    state.cart = state.cart.map(item =>
      item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
    );
  } else {
    state.cart = [...state.cart, { ...product, quantity }];
  }
}

function handleUpdateCartQuantity(productId, change) {
  state.cart = state.cart.map(item => {
    if (item.id === productId) {
      const newQty = item.quantity + change;
      return newQty > 0 ? { ...item, quantity: newQty } : item;
    }
    return item;
  }).filter(item => item.quantity > 0);
}

function handleToggleWishlist(product) {
  const exists = state.wishlist.find(item => item.id === product.id);
  if (exists) {
    state.wishlist = state.wishlist.filter(item => item.id !== product.id);
  } else {
    state.wishlist = [...state.wishlist, product];
  }
}

function applyPromo() {
  if (state.promoCode.toUpperCase() === 'SISTECH10') {
    state.appliedDiscount = 10;
    state.promoMessage = 'Promo code applied! 10% discount on entire purchase.';
  } else {
    state.promoMessage = 'Invalid promo code. Try "SISTECH10"';
  }
}

function clearAllFilters() {
  state.selectedCategory = 'All';
  state.selectedBrand = 'All';
  state.selectedCondition = 'All';
  state.onlyOfficial = false;
  state.maxPriceFilter = 25000000;
  state.sortBy = 'default';
}

function resetFilters() {
  state.selectedCategory = 'All';
  state.selectedBrand = 'All';
  state.selectedCondition = 'All';
  state.onlyOfficial = false;
  state.maxPriceFilter = 25000000;
  state.searchQuery = '';
}

function completeOrder() {
  state.cart = [];
  state.checkoutStep = 'cart';
  state.isCartOpen = false;
  state.appliedDiscount = 0;
}

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderTopBanner() {
  return `
    <div class="top-banner">
      <div class="top-banner__promo">
        <span class="top-banner__badge">PROMO</span>
        <span>Get 10% off your purchase with promo code: <strong>SISTECH10</strong></span>
      </div>
      <div class="top-banner__info">
        <span>Official Store Guarantee</span>
        <span>Free Shipping Jabodetabek</span>
      </div>
    </div>
  `;
}

function renderNavbar() {
  const cartCount = state.cart.reduce((s, i) => s + i.quantity, 0);

  return `
    <header class="navbar">
      <div class="navbar__inner">

        <div class="navbar__logo">
          <div class="navbar__logo-icon">S</div>
          <div>
            <span class="navbar__logo-title">SISTECH MART</span>
            <span class="navbar__logo-subtitle">Indonesian Marketplace</span>
          </div>
        </div>

        <div class="navbar__search">
          <input
            id="search-desktop"
            type="text"
            placeholder="Search premium electronics, beauty, groceries, or local delights..."
            value="${escapeHtml(state.searchQuery)}"
            data-action="input-search"
            class="navbar__search-input"
          />
          <i data-lucide="search" class="icon navbar__search-icon"></i>
          ${state.searchQuery ? `
            <button data-action="clear-search" class="navbar__search-clear">
              <i data-lucide="x" class="icon" style="width:16px;height:16px;"></i>
            </button>
          ` : ''}
        </div>

        <div class="navbar__actions">
          <button data-action="open-wishlist" class="navbar__icon-btn">
            <i data-lucide="heart" class="icon" style="width:22px;height:22px;"></i>
            ${state.wishlist.length > 0 ? `<span class="navbar__badge">${state.wishlist.length}</span>` : ''}
          </button>

          <button data-action="open-cart" class="navbar__cart-btn">
            <i data-lucide="shopping-cart" class="icon" style="width:22px;height:22px;"></i>
            <span class="navbar__cart-label">Cart</span>
            ${state.cart.length > 0 ? `<span class="navbar__cart-badge">${cartCount}</span>` : ''}
          </button>
        </div>
      </div>

      <div class="navbar__mobile-search">
        <div class="navbar__mobile-search-wrap">
          <input
            id="search-mobile"
            type="text"
            placeholder="Search products..."
            value="${escapeHtml(state.searchQuery)}"
            data-action="input-search"
            class="navbar__mobile-search-input"
          />
          <i data-lucide="search" class="icon navbar__mobile-search-icon"></i>
        </div>
      </div>
    </header>
  `;
}

function renderHero() {
  return `
    <div class="hero">
      <div class="hero__glow"></div>
      <div class="hero__content">
        <div class="hero__tag">
          <i data-lucide="sparkles" class="icon" style="width:14px;height:14px;"></i>
          <span>Sistech Curated Selections</span>
        </div>
        <h1 class="hero__title">Premium Indonesian High-Fidelity Products</h1>
        <p class="hero__desc">
          Explore officially certified brands, locally-sourced tea masterpieces, pristine skincare formulations, and top-class consumer tech from the heart of Southeast Asia.
        </p>
        <div class="hero__actions">
          <button data-action="select-category" data-category="Electronics" class="btn btn-primary">
            Shop Electronics
          </button>
          <button data-action="select-category" data-category="Beauty" class="btn btn-ghost-light">
            Explore Beauty
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderCategories() {
  return `
    <div class="category-bar">
      ${state.categories.map(cat => `
        <button
          data-action="select-category"
          data-category="${escapeHtml(cat)}"
          class="category-pill ${state.selectedCategory === cat ? 'category-pill--active' : ''}"
        >
          ${escapeHtml(cat)}
        </button>
      `).join('')}
    </div>
  `;
}

function renderSidebar() {
  return `
    <div class="sidebar">
      <div class="filter-card">

        <div class="filter-card__header">
          <span class="filter-card__title">
            <i data-lucide="sliders-horizontal" class="icon" style="width:16px;height:16px;"></i>
            <span>Filters</span>
          </span>
          <button data-action="clear-filters" class="filter-clear-btn">Clear All</button>
        </div>

        <div class="filter-group">
          <label class="filter-label">Sort By</label>
          <select id="sort-select" data-action="set-sort" class="sort-select">
            <option value="default" ${state.sortBy === 'default' ? 'selected' : ''}>Recommendation</option>
            <option value="price-asc" ${state.sortBy === 'price-asc' ? 'selected' : ''}>Price: Low to High</option>
            <option value="price-desc" ${state.sortBy === 'price-desc' ? 'selected' : ''}>Price: High to Low</option>
            <option value="rating" ${state.sortBy === 'rating' ? 'selected' : ''}>Rating: Highest First</option>
            <option value="discount" ${state.sortBy === 'discount' ? 'selected' : ''}>Biggest Discount</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">Brands</label>
          <div class="brand-list">
            ${state.brands.map(br => `
              <button
                data-action="select-brand"
                data-brand="${escapeHtml(br)}"
                class="brand-item ${state.selectedBrand === br ? 'brand-item--active' : ''}"
              >
                <span>${escapeHtml(br)}</span>
                ${state.selectedBrand === br ? '<i data-lucide="check" class="icon" style="width:14px;height:14px;"></i>' : ''}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="official-toggle">
          <label>
            <input
              id="official-checkbox"
              type="checkbox"
              data-action="toggle-official"
              ${state.onlyOfficial ? 'checked' : ''}
            />
            <span class="official-toggle__label">
              <i data-lucide="shield-check" class="icon" style="width:16px;height:16px;color:var(--color-primary-text);"></i>
              <span>Official Store Only</span>
            </span>
          </label>
        </div>

        <div class="filter-group filter-group--bordered">
          <label class="filter-label">Condition</label>
          <div class="condition-grid">
            ${['All', 'New', 'Used'].map(cond => `
              <button
                data-action="select-condition"
                data-condition="${cond}"
                class="condition-btn ${state.selectedCondition === cond ? 'condition-btn--active' : ''}"
              >
                ${cond}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="filter-group filter-group--bordered price-range">
          <label class="filter-label">Max Price</label>
          <input
            id="max-price-range"
            type="range"
            min="10000"
            max="25000000"
            step="50000"
            value="${state.maxPriceFilter}"
            data-action="input-max-price"
          />
          <div class="price-range__row">
            <span>Rp 10rb</span>
            <span class="price-range__value">${formatIDR(state.maxPriceFilter)}</span>
          </div>
        </div>

      </div>
    </div>
  `;
}

function renderProductCard(product) {
  const finalPrice = product.price * (1 - (product.discountPercentage / 100));
  const isWishlisted = state.wishlist.some(item => item.id === product.id);

  return `
    <div class="product-card">
      <div class="product-card__image-wrap">
        <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" class="product-card__image" />

        <div class="product-card__tags">
          ${product.isOfficialStore ? `
            <span class="tag-official">
              <i data-lucide="shield-check" class="icon" style="width:12px;height:12px;"></i>
              <span>OFFICIAL</span>
            </span>
          ` : ''}
          ${product.discountPercentage > 0 ? `
            <span class="tag-discount">
              <i data-lucide="percent" class="icon" style="width:10px;height:10px;"></i>
              <span>${product.discountPercentage}% OFF</span>
            </span>
          ` : ''}
        </div>

        <button
          data-action="toggle-wishlist"
          data-id="${product.id}"
          class="wishlist-btn ${isWishlisted ? 'wishlist-btn--active' : ''}"
        >
          <i data-lucide="heart" class="icon" style="width:16px;height:16px;"></i>
        </button>
      </div>

      <div class="product-card__body">

        <div class="product-card__meta">
          <span class="product-card__store">
            <i data-lucide="store" class="icon" style="width:14px;height:14px;"></i>
            <span>${escapeHtml(product.store)}</span>
          </span>
          <span class="product-card__city">
            <i data-lucide="map-pin" class="icon" style="width:14px;height:14px;"></i>
            <span>${escapeHtml(product.storeCity)}</span>
          </span>
        </div>

        <h4 class="product-card__title">
          <button data-action="quick-view" data-id="${product.id}">${escapeHtml(product.name)}</button>
        </h4>

        <div class="product-card__rating">
          <i data-lucide="star" class="icon product-card__rating-icon" style="width:14px;height:14px;"></i>
          <span class="product-card__rating-value">${product.rating}</span>
          <span class="product-card__divider">|</span>
          <span class="product-card__category">${escapeHtml(product.category)}</span>
        </div>

        <div class="product-card__price-block">
          <div class="product-card__price-row">
            <span class="product-card__price">${formatIDR(finalPrice)}</span>
            ${product.discountPercentage > 0 ? `<span class="product-card__price-old">${formatIDR(product.price)}</span>` : ''}
          </div>
          <span class="product-card__stock">Stock: ${product.stock} units left</span>
        </div>

      </div>

      <div class="product-card__actions">
        <button data-action="quick-view" data-id="${product.id}" title="Quick View" class="quick-view-btn">
          <i data-lucide="eye" class="icon" style="width:16px;height:16px;"></i>
        </button>
        <button data-action="add-to-cart" data-id="${product.id}" class="add-cart-btn">
          <i data-lucide="shopping-cart" class="icon" style="width:14px;height:14px;"></i>
          <span>Add to Cart</span>
        </button>
      </div>

    </div>
  `;
}

function renderProductGrid() {
  const processedProducts = getProcessedProducts();

  let bodyHtml = '';

  if (state.loading) {
    bodyHtml = `
      <div class="skeleton-grid">
        ${[1, 2, 3, 4, 5, 6].map(() => `
          <div class="skeleton-card">
            <div class="skeleton-block" style="width:100%;height:192px;"></div>
            <div class="skeleton-block" style="height:16px;width:66%;"></div>
            <div class="skeleton-block" style="height:16px;width:50%;"></div>
            <div class="skeleton-block" style="height:40px;width:100%;"></div>
          </div>
        `).join('')}
      </div>
    `;
  } else if (processedProducts.length === 0) {
    bodyHtml = `
      <div class="empty-state">
        <div class="empty-state__icon">
          <i data-lucide="search" class="icon" style="width:32px;height:32px;"></i>
        </div>
        <h3 class="empty-state__title">No products found</h3>
        <p class="empty-state__desc">
          We couldn't find any products matching your specific filters or search keywords. Try adjusting your query or resetting your sidebar options.
        </p>
        <button data-action="reset-filters" class="btn-dark">Reset All Filters</button>
      </div>
    `;
  } else {
    bodyHtml = `
      <div class="product-grid">
        ${processedProducts.map(renderProductCard).join('')}
      </div>
    `;
  }

  return `
    <div class="product-section">

      <div class="product-header">
        <span class="product-header__count">
          Showing <strong>${processedProducts.length}</strong> premium items
        </span>
        <div class="product-header__category">
          <span class="product-header__category-label">Category:</span>
          <span class="category-badge">${escapeHtml(state.selectedCategory)}</span>
        </div>
      </div>

      ${bodyHtml}

    </div>
  `;
}

function renderCartDrawer() {
  if (!state.isCartOpen) return '';

  const { cartSubtotal, discountAmount, taxAmount, cartTotal } = getCartTotals();

  let bodyHtml = '';

  if (state.cart.length === 0) {
    bodyHtml = `
      <div class="empty-panel">
        <div class="empty-panel__icon empty-panel__icon--blue">
          <i data-lucide="shopping-bag" class="icon" style="width:32px;height:32px;"></i>
        </div>
        <div>
          <h4 class="empty-panel__title">Your cart is empty</h4>
          <p class="empty-panel__desc">
            You haven't added any products to your shipping container yet. Explore the marketplace to find high-quality products.
          </p>
        </div>
        <button data-action="close-cart" class="btn btn-primary">Start Shopping</button>
      </div>
    `;
  } else if (state.checkoutStep === 'cart') {
    bodyHtml = state.cart.map(item => {
      const discounted = item.price * (1 - (item.discountPercentage / 100));
      return `
        <div class="cart-item">
          <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" class="cart-item__image" />
          <div class="cart-item__info">
            <h4 class="cart-item__name">${escapeHtml(item.name)}</h4>
            <span class="cart-item__store">${escapeHtml(item.store)}</span>
            <div class="cart-item__price-row">
              <span class="cart-item__price">${formatIDR(discounted)}</span>
              ${item.discountPercentage > 0 ? `<span class="cart-item__price-old">${formatIDR(item.price)}</span>` : ''}
            </div>
          </div>
          <div class="cart-item__controls">
            <button data-action="remove-item" data-id="${item.id}" class="cart-item__remove">
              <i data-lucide="x" class="icon" style="width:14px;height:14px;"></i>
            </button>
            <div class="qty-control">
              <button data-action="update-qty" data-id="${item.id}" data-change="-1">
                <i data-lucide="minus" class="icon" style="width:12px;height:12px;"></i>
              </button>
              <span>${item.quantity}</span>
              <button data-action="update-qty" data-id="${item.id}" data-change="1">
                <i data-lucide="plus" class="icon" style="width:12px;height:12px;"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  } else if (state.checkoutStep === 'checkout') {
    bodyHtml = `
      <div class="checkout-form">
        <h4 class="checkout-form__title">Shipping Destination</h4>
        <div class="form-group">
          <label>Full Name</label>
          <input type="text" placeholder="John Doe" required />
        </div>
        <div class="form-group">
          <label>Phone Number</label>
          <input type="tel" placeholder="+62 812-3456-7890" required />
        </div>
        <div class="form-group">
          <label>Full Delivery Address</label>
          <textarea rows="3" placeholder="Sudirman Boulevard No 41, Kuningan, Jakarta Selatan" required></textarea>
        </div>
      </div>
    `;
  } else {
    bodyHtml = `
      <div class="success-panel">
        <div class="success-panel__icon">
          <i data-lucide="check-circle" class="icon" style="width:40px;height:40px;"></i>
        </div>
        <div>
          <h4 class="success-panel__title">Purchase Simulating Success</h4>
          <p class="success-panel__desc">
            Thank you for purchasing premium products on the Sistech Marketplace. A live shipment coordinate has been assigned to Jabodetabek hubs.
          </p>
        </div>
        <div class="order-info">
          <div class="order-info__row">
            <span class="order-info__label">Order ID:</span>
            <span class="order-info__value">SST-${Math.floor(100000 + Math.random() * 900000)}</span>
          </div>
          <div class="order-info__row">
            <span class="order-info__label">Status:</span>
            <span class="order-info__status">On Process</span>
          </div>
        </div>
        <button data-action="complete-order" class="btn-dark btn-block">Return to Marketplace</button>
      </div>
    `;
  }

  const showFooter = state.cart.length > 0 && state.checkoutStep !== 'success';

  const footerHtml = showFooter ? `
    <div class="drawer__footer">

      ${state.checkoutStep === 'cart' ? `
        <div class="promo-row">
          <div class="promo-row__inputs">
            <input
              id="promo-code-input"
              type="text"
              placeholder="Promo Code (SISTECH10)"
              value="${escapeHtml(state.promoCode)}"
              data-action="input-promo"
              class="promo-input"
            />
            <button data-action="apply-promo" class="promo-btn">Apply</button>
          </div>
          ${state.promoMessage ? `
            <p class="promo-message ${state.appliedDiscount > 0 ? 'promo-message--ok' : 'promo-message--error'}">
              ${escapeHtml(state.promoMessage)}
            </p>
          ` : ''}
        </div>
      ` : ''}

      <div class="summary">
        <div class="summary-row">
          <span>Subtotal</span>
          <strong>${formatIDR(cartSubtotal)}</strong>
        </div>
        ${state.appliedDiscount > 0 ? `
          <div class="summary-row summary-row--discount">
            <span>Discount (${state.appliedDiscount}%)</span>
            <span>-${formatIDR(discountAmount)}</span>
          </div>
        ` : ''}
        <div class="summary-row">
          <span>PPN (11%)</span>
          <strong>${formatIDR(taxAmount)}</strong>
        </div>
        <div class="summary-total">
          <span>Total Amount</span>
          <span class="summary-total__value">${formatIDR(cartTotal)}</span>
        </div>
      </div>

      <div class="action-row">
        ${state.checkoutStep === 'cart' ? `
          <button data-action="checkout-step" data-step="checkout" class="btn-primary-full">
            <span>Proceed to Shipping</span>
            <i data-lucide="chevron-right" class="icon" style="width:16px;height:16px;"></i>
          </button>
        ` : `
          <div class="action-row-split">
            <button data-action="checkout-step" data-step="cart" class="btn-outline">Back to Items</button>
            <button data-action="checkout-step" data-step="success" class="btn-primary-flex">Place Order Simulation</button>
          </div>
        `}
      </div>

    </div>
  ` : '';

  const stepperHtml = state.cart.length > 0 ? `
    <div class="drawer__stepper">
      <span class="${state.checkoutStep === 'cart' ? 'drawer__step--active' : ''}">1. Review Items</span>
      <i data-lucide="chevron-right" class="icon" style="width:14px;height:14px;color:var(--gray-300);"></i>
      <span class="${state.checkoutStep === 'checkout' ? 'drawer__step--active' : ''}">2. Checkout Details</span>
      <i data-lucide="chevron-right" class="icon" style="width:14px;height:14px;color:var(--gray-300);"></i>
      <span class="${state.checkoutStep === 'success' ? 'drawer__step--active' : ''}">3. Order Complete</span>
    </div>
  ` : '';

  return `
    <div class="drawer-overlay">
      <div class="drawer-backdrop" data-action="close-cart"></div>
      <div class="drawer">

        <div class="drawer__header">
          <div class="drawer__header-title">
            <i data-lucide="shopping-cart" class="icon" style="width:24px;height:24px;color:var(--color-primary-text);"></i>
            <h3 class="drawer__title">Your Cart</h3>
          </div>
          <button data-action="close-cart" class="drawer__close">
            <i data-lucide="x" class="icon" style="width:20px;height:20px;"></i>
          </button>
        </div>

        ${stepperHtml}

        <div class="drawer__body">
          ${bodyHtml}
        </div>

        ${footerHtml}

      </div>
    </div>
  `;
}

function renderWishlistDrawer() {
  if (!state.isWishlistOpen) return '';

  const bodyHtml = state.wishlist.length === 0 ? `
    <div class="empty-panel">
      <div class="empty-panel__icon empty-panel__icon--pink">
        <i data-lucide="heart" class="icon" style="width:32px;height:32px;"></i>
      </div>
      <div>
        <h4 class="empty-panel__title">Your wishlist is empty</h4>
        <p class="empty-panel__desc">Save premium products to your personal favorites container.</p>
      </div>
    </div>
  ` : state.wishlist.map(item => `
    <div class="wishlist-item">
      <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" class="wishlist-item__image" />
      <div class="wishlist-item__info">
        <h4 class="wishlist-item__name">${escapeHtml(item.name)}</h4>
        <span class="wishlist-item__store">${escapeHtml(item.store)}</span>
        <span class="wishlist-item__price">${formatIDR(item.price)}</span>
      </div>
      <div class="wishlist-item__actions">
        <button data-action="wishlist-to-cart" data-id="${item.id}" class="wishlist-item__to-cart">To Cart</button>
        <button data-action="toggle-wishlist" data-id="${item.id}" class="wishlist-item__remove">Remove</button>
      </div>
    </div>
  `).join('');

  return `
    <div class="drawer-overlay">
      <div class="drawer-backdrop" data-action="close-wishlist"></div>
      <div class="drawer">

        <div class="drawer__header">
          <div class="drawer__header-title drawer__header-title--pink">
            <i data-lucide="heart" class="icon" style="width:24px;height:24px;"></i>
            <h3 class="drawer__title">Your Wishlist</h3>
          </div>
          <button data-action="close-wishlist" class="drawer__close">
            <i data-lucide="x" class="icon" style="width:20px;height:20px;"></i>
          </button>
        </div>

        <div class="drawer__body">
          ${bodyHtml}
        </div>

      </div>
    </div>
  `;
}

function renderProductModal() {
  if (!state.selectedProduct) return '';
  const product = state.selectedProduct;

  return `
    <div class="modal-overlay">
      <div class="drawer-backdrop" data-action="close-modal"></div>
      <div class="modal-center">
        <div class="modal">

          <button data-action="close-modal" class="modal__close">
            <i data-lucide="x" class="icon" style="width:16px;height:16px;"></i>
          </button>

          <div class="modal__image-wrap">
            <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" class="modal__image" />
          </div>

          <div class="modal__info">

            <div class="modal__top">

              <div class="modal__badges">
                <span class="badge-category">${escapeHtml(product.category)}</span>
                ${product.isOfficialStore ? `
                  <span class="badge-official">
                    <i data-lucide="shield-check" class="icon" style="width:12px;height:12px;"></i>
                    <span>Official Store</span>
                  </span>
                ` : ''}
              </div>

              <h3 class="modal__title">${escapeHtml(product.name)}</h3>

              <div class="modal__rating">
                <div class="modal__rating-stars">
                  <i data-lucide="star" class="icon" style="width:16px;height:16px;"></i>
                  <span class="modal__rating-value">${product.rating}</span>
                </div>
                <span class="modal__divider">|</span>
                <span class="modal__condition">${escapeHtml(product.condition)} Condition</span>
              </div>

              <div class="modal__price-row">
                <span class="modal__price">${formatIDR(product.price * (1 - (product.discountPercentage / 100)))}</span>
                ${product.discountPercentage > 0 ? `<span class="modal__price-old">${formatIDR(product.price)}</span>` : ''}
              </div>

              <p class="modal__desc">${escapeHtml(product.description)}</p>

            </div>

            <div class="store-card">
              <div class="store-card__info">
                <span class="store-card__name">
                  <i data-lucide="store" class="icon" style="width:14px;height:14px;color:var(--color-primary-text);"></i>
                  <span>${escapeHtml(product.store)}</span>
                </span>
                <span class="store-card__city">
                  <i data-lucide="map-pin" class="icon" style="width:12px;height:12px;color:var(--color-pink-text);"></i>
                  <span>Located in ${escapeHtml(product.storeCity)}</span>
                </span>
              </div>
              <span class="store-card__rating">
                <i data-lucide="star" class="icon" style="width:12px;height:12px;"></i>
                <span>${product.storeRating}</span>
              </span>
            </div>

            <div class="modal__actions">
              <button data-action="buy-now" data-id="${product.id}" class="btn-dark-flex">Buy Now</button>
              <button data-action="modal-add-to-cart" data-id="${product.id}" class="btn-primary-flex">Add to Cart</button>
            </div>

          </div>

        </div>
      </div>
    </div>
  `;
}

function renderFooter() {
  return `
    <footer class="footer">
      <div class="footer__grid">
        <div class="footer__brand">
          <div class="footer__logo">
            <span class="footer__logo-icon">S</span>
            <span class="footer__logo-text">SISTECH EXPORTS</span>
          </div>
          <p class="footer__desc">
            A luxury high-fidelity responsive mockup storefront. Designed gracefully to match premium Indonesian electronics, beauty, and beverages marketplace benchmarks.
          </p>
        </div>

        <div>
          <h5 class="footer__col-title">Store Departments</h5>
          <div class="footer__links">
            <button data-action="select-category" data-category="Electronics">Xiaomi &amp; Samsung Gadgets</button>
            <button data-action="select-category" data-category="Beauty">Wardah Skincare Serum</button>
            <button data-action="select-category" data-category="Beverages">Sosro Fresh Jasmine Teas</button>
            <button data-action="select-category" data-category="Home Appliances">Philips Home Appliances</button>
          </div>
        </div>

        <div>
          <h5 class="footer__col-title">Customer Care</h5>
          <div class="footer__links">
            <a href="#">FAQ &amp; Help Center</a>
            <a href="#">Shipping &amp; Delivery Information</a>
            <a href="#">Returns &amp; Exchanges Policy</a>
            <a href="#">Track Your Order Status</a>
          </div>
        </div>

        <div>
          <h5 class="footer__col-title">System Context</h5>
          <p class="footer__context">
            Indonesian Rupiah localization enabled. Live dataset mapped from API payload dynamically with robust fallback catalog setups.
          </p>
        </div>
      </div>

      <div class="footer__bottom">
        © 2026 Sistech Ecommerce Platform. Built with Responsiveness &amp; Pride.
      </div>
    </footer>
  `;
}

function render() {
  const app = document.getElementById('app');
  app.innerHTML = `
    ${renderTopBanner()}
    ${renderNavbar()}
    <main style="max-width:1280px;margin:0 auto;padding:32px 24px;">
      ${renderHero()}
      ${renderCategories()}
      <div class="content-grid">
        ${renderSidebar()}
        ${renderProductGrid()}
      </div>
    </main>
    ${renderCartDrawer()}
    ${renderProductModal()}
    ${renderWishlistDrawer()}
    ${renderFooter()}
  `;

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function renderWithFocusPreserved() {
  const active = document.activeElement;
  const activeId = active && active.id ? active.id : null;
  const selStart = active && typeof active.selectionStart === 'number' ? active.selectionStart : null;
  const selEnd = active && typeof active.selectionEnd === 'number' ? active.selectionEnd : null;

  render();

  if (activeId) {
    const el = document.getElementById(activeId);
    if (el) {
      el.focus();
      if (selStart !== null && el.setSelectionRange) {
        try { el.setSelectionRange(selStart, selEnd); } catch (e) {}
      }
    }
  }
}

function initEventListeners() {
  const app = document.getElementById('app');

  app.addEventListener('click', (e) => {
    const target = e.target.closest('[data-action]');
    if (!target) return;

    const action = target.dataset.action;
    const id = target.dataset.id;

    switch (action) {
      case 'clear-search':
        setState({ searchQuery: '' });
        break;

      case 'select-category':
        setState({ selectedCategory: target.dataset.category });
        break;

      case 'select-brand':
        setState({ selectedBrand: target.dataset.brand });
        break;

      case 'select-condition':
        setState({ selectedCondition: target.dataset.condition });
        break;

      case 'clear-filters':
        clearAllFilters();
        setState({});
        break;

      case 'reset-filters':
        resetFilters();
        setState({});
        break;

      case 'open-wishlist':
        setState({ isWishlistOpen: true });
        break;

      case 'close-wishlist':
        setState({ isWishlistOpen: false });
        break;

      case 'open-cart':
        setState({ isCartOpen: true, checkoutStep: 'cart' });
        break;

      case 'close-cart':
        setState({ isCartOpen: false });
        break;

      case 'toggle-wishlist': {
        const product = findProductById(id) || state.wishlist.find(p => String(p.id) === String(id));
        if (product) handleToggleWishlist(product);
        setState({});
        break;
      }

      case 'add-to-cart': {
        const product = findProductById(id);
        if (product) handleAddToCart(product);
        setState({});
        break;
      }

      case 'quick-view': {
        const product = findProductById(id);
        setState({ selectedProduct: product || null });
        break;
      }

      case 'close-modal':
        setState({ selectedProduct: null });
        break;

      case 'buy-now': {
        const product = findProductById(id);
        if (product) handleAddToCart(product);
        setState({ selectedProduct: null, isCartOpen: true, checkoutStep: 'cart' });
        break;
      }

      case 'modal-add-to-cart': {
        const product = findProductById(id);
        if (product) handleAddToCart(product);
        setState({ selectedProduct: null });
        break;
      }

      case 'remove-item':
        handleUpdateCartQuantity(id, -Infinity);
        setState({});
        break;

      case 'update-qty': {
        const change = Number(target.dataset.change);
        handleUpdateCartQuantity(id, change);
        setState({});
        break;
      }

      case 'apply-promo':
        applyPromo();
        setState({});
        break;

      case 'checkout-step':
        setState({ checkoutStep: target.dataset.step });
        break;

      case 'complete-order':
        completeOrder();
        setState({});
        break;

      case 'wishlist-to-cart': {
        const product = state.wishlist.find(p => String(p.id) === String(id));
        if (product) {
          handleAddToCart(product);
          state.wishlist = state.wishlist.filter(w => String(w.id) !== String(id));
        }
        setState({});
        break;
      }

      default:
        break;
    }
  });

  app.addEventListener('input', (e) => {
    const target = e.target;
    const action = target.dataset.action;

    if (action === 'input-search') {
      state.searchQuery = target.value;
      renderWithFocusPreserved();
    } else if (action === 'input-max-price') {
      state.maxPriceFilter = Number(target.value);
      renderWithFocusPreserved();
    } else if (action === 'input-promo') {
      state.promoCode = target.value;
      renderWithFocusPreserved();
    }
  });

  app.addEventListener('change', (e) => {
    const target = e.target;
    const action = target.dataset.action;

    if (action === 'set-sort') {
      setState({ sortBy: target.value });
    } else if (action === 'toggle-official') {
      setState({ onlyOfficial: target.checked });
    }
  });
}

function init() {
  initEventListeners();
  render();
  fetchApiProducts();
}

document.addEventListener('DOMContentLoaded', init);
