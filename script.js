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

// Central app state (mirrors the original React useState hooks)
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
  checkoutStep: 'cart', // cart, checkout, success
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
    const response = await fetch('https://sistech-ecommerce-api.leficullen.xyz/api/v1/products');
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
          image: item.imageUrl || item.image || `https://placehold.co/600x600/0B57D0/FFFFFF?text=${encodeURIComponent(productName)}`,
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
    console.warn("API direct link unavailable. Activating secure offline databases:", err.message);
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
    return 0; // default
  });
}

function getCartTotals() {
  const cartSubtotal = state.cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discountAmount = Math.round(cartSubtotal * (state.appliedDiscount / 100));
  const taxAmount = Math.round((cartSubtotal - discountAmount) * 0.11); // 11% PPN Indonesia
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

function renderTopBanner() {
  return `
    <div class="bg-[#0B57D0] text-white text-xs py-2 px-6 flex justify-between items-center font-medium">
      <div class="flex items-center space-x-2">
        <span class="bg-white text-[#0B57D0] font-extrabold px-1.5 py-0.5 rounded text-[10px]">PROMO</span>
        <span>Get 10% off your purchase with promo code: <strong class="underline">SISTECH10</strong></span>
      </div>
      <div class="hidden md:flex items-center space-x-4 text-gray-200">
        <span>Official Store Guarantee</span>
        <span>Free Shipping Jabodetabek</span>
      </div>
    </div>
  `;
}

// ==========================================================================
// RENDER: NAVBAR
// ==========================================================================

function renderNavbar() {
  const cartCount = state.cart.reduce((s, i) => s + i.quantity, 0);

  return `
    <header class="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-[#0B57D0] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md">
            S
          </div>
          <div>
            <span class="font-black text-xl tracking-tight text-gray-900 block">SISTECH EXPORTS</span>
            <span class="text-[10px] uppercase tracking-wider font-semibold text-gray-400 block -mt-1">Indonesian Marketplace</span>
          </div>
        </div>

        <div class="hidden md:flex flex-1 max-w-lg mx-8 relative">
          <input
            id="search-desktop"
            type="text"
            placeholder="Search premium electronics, beauty, groceries, or local delights..."
            value="${escapeHtml(state.searchQuery)}"
            data-action="input-search"
            class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0B57D0]/20 focus:border-[#0B57D0] text-sm transition"
          />
          <i data-lucide="search" class="absolute left-3.5 top-3 text-gray-400 w-4 h-4"></i>
          ${state.searchQuery ? `
            <button data-action="clear-search" class="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600">
              <i data-lucide="x" class="w-4 h-4"></i>
            </button>
          ` : ''}
        </div>

        <div class="flex items-center space-x-5">
          <button data-action="open-wishlist" class="relative p-2.5 hover:bg-gray-50 rounded-xl text-gray-600 hover:text-red-500 transition">
            <i data-lucide="heart" class="w-5.5 h-5.5"></i>
            ${state.wishlist.length > 0 ? `
              <span class="absolute -top-1 -right-1 bg-red-500 text-white font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                ${state.wishlist.length}
              </span>
            ` : ''}
          </button>

          <button data-action="open-cart" class="relative p-2.5 bg-[#0B57D0]/5 hover:bg-[#0B57D0]/10 text-[#0B57D0] rounded-xl font-bold flex items-center space-x-2 transition">
            <i data-lucide="shopping-cart" class="w-5.5 h-5.5"></i>
            <span class="text-sm hidden sm:inline">Cart</span>
            ${state.cart.length > 0 ? `
              <span class="bg-[#0B57D0] text-white font-black text-[10px] px-1.5 py-0.5 rounded-md">
                ${cartCount}
              </span>
            ` : ''}
          </button>
        </div>
      </div>

      <div class="p-4 border-t border-gray-100 bg-white md:hidden block">
        <div class="relative">
          <input
            id="search-mobile"
            type="text"
            placeholder="Search products..."
            value="${escapeHtml(state.searchQuery)}"
            data-action="input-search"
            class="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#0B57D0]/20"
          />
          <i data-lucide="search" class="absolute left-3.5 top-2.5 text-gray-400 w-4 h-4"></i>
        </div>
      </div>
    </header>
  `;
}

// ==========================================================================
// RENDER: HERO
// ==========================================================================

function renderHero() {
  return `
    <div class="mb-10 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl border border-white/5">
      <div class="absolute top-0 right-0 w-96 h-96 bg-[#0B57D0]/10 rounded-full blur-3xl"></div>
      <div class="relative z-10 max-w-xl space-y-4">
        <div class="inline-flex items-center space-x-1 bg-white/10 px-3 py-1 rounded-full text-xs text-[#a8c7fa] font-bold">
          <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
          <span>Sistech Curated Selections</span>
        </div>
        <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
          Premium Indonesian High-Fidelity Products
        </h1>
        <p class="text-sm text-gray-300 leading-relaxed">
          Explore officially certified brands, locally-sourced tea masterpieces, pristine skincare formulations, and top-class consumer tech from the heart of Southeast Asia.
        </p>
        <div class="flex space-x-4 pt-2">
          <button data-action="select-category" data-category="Electronics" class="bg-[#0B57D0] hover:bg-[#0B57D0]/90 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-lg shadow-[#0B57D0]/25 transition">
            Shop Electronics
          </button>
          <button data-action="select-category" data-category="Beauty" class="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-5 py-3 rounded-xl transition">
            Explore Beauty
          </button>
        </div>
      </div>
    </div>
  `;
}

// ==========================================================================
// RENDER: CATEGORY LIST
// ==========================================================================

function renderCategories() {
  return `
    <div class="mb-8 flex space-x-2 overflow-x-auto pb-3 scrollbar-none">
      ${state.categories.map(cat => `
        <button
          data-action="select-category"
          data-category="${escapeHtml(cat)}"
          class="px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition ${
            state.selectedCategory === cat
              ? 'bg-gray-900 text-white shadow-md'
              : 'bg-white text-gray-600 border border-gray-100 hover:bg-gray-50'
          }"
        >
          ${escapeHtml(cat)}
        </button>
      `).join('')}
    </div>
  `;
}

// ==========================================================================
// RENDER: FILTER SIDEBAR
// ==========================================================================

function renderSidebar() {
  return `
    <div class="space-y-6 lg:col-span-1">
      <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">

        <div class="flex justify-between items-center">
          <span class="font-extrabold text-sm tracking-tight text-gray-900 flex items-center space-x-2">
            <i data-lucide="sliders-horizontal" class="w-4 h-4"></i>
            <span>Filters</span>
          </span>
          <button data-action="clear-filters" class="text-xs text-[#0B57D0] font-bold hover:underline">
            Clear All
          </button>
        </div>

        <div class="space-y-2">
          <label class="text-xs font-bold text-gray-400 uppercase tracking-wider block">Sort By</label>
          <div class="relative">
            <select id="sort-select" data-action="set-sort" class="w-full bg-gray-50 border border-gray-200 text-sm py-2 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B57D0]/20">
              <option value="default" ${state.sortBy === 'default' ? 'selected' : ''}>Recommendation</option>
              <option value="price-asc" ${state.sortBy === 'price-asc' ? 'selected' : ''}>Price: Low to High</option>
              <option value="price-desc" ${state.sortBy === 'price-desc' ? 'selected' : ''}>Price: High to Low</option>
              <option value="rating" ${state.sortBy === 'rating' ? 'selected' : ''}>Rating: Highest First</option>
              <option value="discount" ${state.sortBy === 'discount' ? 'selected' : ''}>Biggest Discount</option>
            </select>
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-xs font-bold text-gray-400 uppercase tracking-wider block">Brands</label>
          <div class="space-y-2">
            ${state.brands.map(br => `
              <button
                data-action="select-brand"
                data-brand="${escapeHtml(br)}"
                class="w-full text-left py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-between transition ${
                  state.selectedBrand === br
                    ? 'bg-[#0B57D0]/10 text-[#0B57D0] font-bold'
                    : 'text-gray-600 hover:bg-gray-50'
                }"
              >
                <span>${escapeHtml(br)}</span>
                ${state.selectedBrand === br ? '<i data-lucide="check" class="w-3.5 h-3.5"></i>' : ''}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="pt-2 border-t border-gray-100">
          <label class="flex items-center space-x-3 cursor-pointer">
            <input
              id="official-checkbox"
              type="checkbox"
              data-action="toggle-official"
              ${state.onlyOfficial ? 'checked' : ''}
              class="rounded text-[#0B57D0] focus:ring-[#0B57D0] w-4 h-4"
            />
            <span class="text-xs font-bold text-gray-700 flex items-center space-x-1">
              <i data-lucide="shield-check" class="w-4 h-4 text-blue-600 inline"></i>
              <span>Official Store Only</span>
            </span>
          </label>
        </div>

        <div class="space-y-2 pt-4 border-t border-gray-100">
          <label class="text-xs font-bold text-gray-400 uppercase tracking-wider block">Condition</label>
          <div class="grid grid-cols-3 gap-2">
            ${['All', 'New', 'Used'].map(cond => `
              <button
                data-action="select-condition"
                data-condition="${cond}"
                class="py-1.5 px-2 text-xs font-bold rounded-lg text-center transition border ${
                  state.selectedCondition === cond
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }"
              >
                ${cond}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="space-y-2 pt-4 border-t border-gray-100">
          <label class="text-xs font-bold text-gray-400 uppercase tracking-wider block">Max Price</label>
          <input
            id="max-price-range"
            type="range"
            min="10000"
            max="25000000"
            step="50000"
            value="${state.maxPriceFilter}"
            data-action="input-max-price"
            class="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0B57D0]"
          />
          <div class="flex justify-between text-xs font-extrabold text-gray-700">
            <span>Rp 10rb</span>
            <span class="text-[#0B57D0]">${formatIDR(state.maxPriceFilter)}</span>
          </div>
        </div>

      </div>
    </div>
  `;
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

// ==========================================================================
// RENDER: PRODUCT GRID + CARD
// ==========================================================================

function renderProductCard(product) {
  const finalPrice = product.price * (1 - (product.discountPercentage / 100));
  const isWishlisted = state.wishlist.some(item => item.id === product.id);

  return `
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group overflow-hidden">
      <div class="relative bg-gray-50 h-52 flex items-center justify-center overflow-hidden">
        <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />

        <div class="absolute top-3 left-3 flex flex-col space-y-1">
          ${product.isOfficialStore ? `
            <span class="bg-blue-600 text-white font-extrabold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center space-x-1 shadow">
              <i data-lucide="shield-check" class="w-3 h-3"></i>
              <span>OFFICIAL</span>
            </span>
          ` : ''}
          ${product.discountPercentage > 0 ? `
            <span class="bg-red-500 text-white font-black text-[10px] px-2 py-0.5 rounded-md self-start shadow flex items-center space-x-0.5">
              <i data-lucide="percent" class="w-2.5 h-2.5 inline"></i>
              <span>${product.discountPercentage}% OFF</span>
            </span>
          ` : ''}
        </div>

        <button
          data-action="toggle-wishlist"
          data-id="${product.id}"
          class="absolute top-3 right-3 p-2 rounded-full border shadow transition ${
            isWishlisted ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white border-gray-100 text-gray-400 hover:text-red-500'
          }"
        >
          <i data-lucide="heart" class="w-4 h-4 fill-current"></i>
        </button>
      </div>

      <div class="p-4 flex-1 flex flex-col space-y-2">

        <div class="flex items-center justify-between text-[11px] text-gray-400 font-semibold">
          <span class="flex items-center space-x-1">
            <i data-lucide="store" class="w-3.5 h-3.5 text-gray-400"></i>
            <span class="truncate max-w-[120px]">${escapeHtml(product.store)}</span>
          </span>
          <span class="flex items-center space-x-0.5">
            <i data-lucide="map-pin" class="w-3.5 h-3.5 text-red-400"></i>
            <span>${escapeHtml(product.storeCity)}</span>
          </span>
        </div>

        <h4 class="font-bold text-sm text-gray-800 line-clamp-2 hover:text-[#0B57D0] transition">
          <button data-action="quick-view" data-id="${product.id}" class="text-left font-bold">
            ${escapeHtml(product.name)}
          </button>
        </h4>

        <div class="flex items-center space-x-1.5">
          <div class="flex items-center text-amber-500">
            <i data-lucide="star" class="w-3.5 h-3.5 fill-current"></i>
          </div>
          <span class="text-xs font-bold text-gray-700">${product.rating}</span>
          <span class="text-gray-300 text-xs">|</span>
          <span class="text-[10px] text-gray-400 font-semibold uppercase">${escapeHtml(product.category)}</span>
        </div>

        <div class="pt-2 flex-1 flex flex-col justify-end">
          <div class="flex items-baseline space-x-1.5">
            <span class="text-base font-black text-gray-900">${formatIDR(finalPrice)}</span>
            ${product.discountPercentage > 0 ? `<span class="text-xs text-gray-400 line-through">${formatIDR(product.price)}</span>` : ''}
          </div>
          <span class="text-[10px] text-gray-400 font-semibold block mt-0.5">
            Stock: ${product.stock} units left
          </span>
        </div>

      </div>

      <div class="p-4 pt-0 grid grid-cols-4 gap-2">
        <button data-action="quick-view" data-id="${product.id}" title="Quick View" class="col-span-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl flex items-center justify-center py-2 transition">
          <i data-lucide="eye" class="w-4 h-4"></i>
        </button>
        <button data-action="add-to-cart" data-id="${product.id}" class="col-span-3 bg-[#0B57D0] hover:bg-blue-700 text-white font-bold text-xs py-2 rounded-xl flex items-center justify-center space-x-1 transition shadow-lg shadow-[#0B57D0]/10">
          <i data-lucide="shopping-cart" class="w-3.5 h-3.5"></i>
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
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        ${[1, 2, 3, 4, 5, 6].map(() => `
          <div class="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-4 animate-pulse">
            <div class="w-full h-48 bg-gray-200 rounded-xl"></div>
            <div class="h-4 bg-gray-200 rounded w-2/3"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2"></div>
            <div class="h-10 bg-gray-200 rounded-xl w-full"></div>
          </div>
        `).join('')}
      </div>
    `;
  } else if (processedProducts.length === 0) {
    bodyHtml = `
      <div class="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm max-w-xl mx-auto space-y-4">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
          <i data-lucide="search" class="w-8 h-8"></i>
        </div>
        <h3 class="font-extrabold text-lg text-gray-900">No products found</h3>
        <p class="text-xs text-gray-400 leading-relaxed max-w-sm mx-auto">
          We couldn't find any products matching your specific filters or search keywords. Try adjusting your query or resetting your sidebar options.
        </p>
        <button data-action="reset-filters" class="bg-gray-950 text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-gray-800 transition">
          Reset All Filters
        </button>
      </div>
    `;
  } else {
    bodyHtml = `
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        ${processedProducts.map(renderProductCard).join('')}
      </div>
    `;
  }

  return `
    <div class="lg:col-span-3 space-y-6">

      <div class="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <span class="text-xs text-gray-500 font-semibold">
          Showing <strong class="text-gray-900 font-extrabold">${processedProducts.length}</strong> premium items
        </span>
        <div class="flex items-center space-x-2 text-xs">
          <span class="text-gray-400 font-bold">Category:</span>
          <span class="bg-gray-100 text-gray-800 font-extrabold px-2 py-0.5 rounded-md">${escapeHtml(state.selectedCategory)}</span>
        </div>
      </div>

      ${bodyHtml}

    </div>
  `;
}

// ==========================================================================
// RENDER: CART DRAWER
// ==========================================================================

function renderCartDrawer() {
  if (!state.isCartOpen) return '';

  const { cartSubtotal, discountAmount, taxAmount, cartTotal } = getCartTotals();

  let bodyHtml = '';

  if (state.cart.length === 0) {
    bodyHtml = `
      <div class="h-full flex flex-col items-center justify-center text-center space-y-4">
        <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-[#0B57D0]">
          <i data-lucide="shopping-bag" class="w-8 h-8"></i>
        </div>
        <div>
          <h4 class="font-bold text-gray-900">Your cart is empty</h4>
          <p class="text-xs text-gray-400 max-w-xs mx-auto mt-1 leading-relaxed">
            You haven't added any products to your shipping container yet. Explore the marketplace to find high-quality products.
          </p>
        </div>
        <button data-action="close-cart" class="bg-[#0B57D0] text-white font-bold text-xs px-6 py-2.5 rounded-xl transition shadow-lg shadow-[#0B57D0]/20">
          Start Shopping
        </button>
      </div>
    `;
  } else if (state.checkoutStep === 'cart') {
    bodyHtml = `
      <div class="space-y-4">
        ${state.cart.map(item => {
          const discounted = item.price * (1 - (item.discountPercentage / 100));
          return `
            <div class="flex items-start space-x-4 p-3 border border-gray-100 rounded-xl bg-gray-50">
              <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" class="w-16 h-16 rounded-lg object-cover bg-white" />
              <div class="flex-1 space-y-1">
                <h4 class="font-bold text-xs text-gray-800 line-clamp-1">${escapeHtml(item.name)}</h4>
                <span class="text-[10px] text-gray-400 block font-semibold">${escapeHtml(item.store)}</span>
                <div class="flex items-baseline space-x-1 text-xs">
                  <span class="font-extrabold text-gray-900">${formatIDR(discounted)}</span>
                  ${item.discountPercentage > 0 ? `<span class="text-[10px] text-gray-400 line-through">${formatIDR(item.price)}</span>` : ''}
                </div>
              </div>
              <div class="flex flex-col items-end justify-between h-16">
                <button data-action="remove-item" data-id="${item.id}" class="text-gray-400 hover:text-gray-600">
                  <i data-lucide="x" class="w-3.5 h-3.5"></i>
                </button>
                <div class="flex items-center space-x-2 bg-white rounded-lg border border-gray-100 px-1 py-0.5">
                  <button data-action="update-qty" data-id="${item.id}" data-change="-1" class="p-0.5 text-gray-500 hover:bg-gray-100 rounded">
                    <i data-lucide="minus" class="w-3 h-3"></i>
                  </button>
                  <span class="text-xs font-bold w-4 text-center">${item.quantity}</span>
                  <button data-action="update-qty" data-id="${item.id}" data-change="1" class="p-0.5 text-gray-500 hover:bg-gray-100 rounded">
                    <i data-lucide="plus" class="w-3 h-3"></i>
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  } else if (state.checkoutStep === 'checkout') {
    bodyHtml = `
      <div class="space-y-4">
        <h4 class="font-extrabold text-xs text-gray-400 uppercase tracking-wider">Shipping Destination</h4>
        <div class="space-y-3">
          <div>
            <label class="text-[10px] font-bold text-gray-500 uppercase block mb-1">Full Name</label>
            <input type="text" placeholder="John Doe" class="w-full bg-gray-50 border border-gray-200 text-xs py-2.5 px-3 rounded-lg focus:outline-none" required />
          </div>
          <div>
            <label class="text-[10px] font-bold text-gray-500 uppercase block mb-1">Phone Number</label>
            <input type="tel" placeholder="+62 812-3456-7890" class="w-full bg-gray-50 border border-gray-200 text-xs py-2.5 px-3 rounded-lg focus:outline-none" required />
          </div>
          <div>
            <label class="text-[10px] font-bold text-gray-500 uppercase block mb-1">Full Delivery Address</label>
            <textarea rows="3" placeholder="Sudirman Boulevard No 41, Kuningan, Jakarta Selatan" class="w-full bg-gray-50 border border-gray-200 text-xs py-2 px-3 rounded-lg focus:outline-none" required></textarea>
          </div>
        </div>
      </div>
    `;
  } else {
    // success
    bodyHtml = `
      <div class="h-full flex flex-col items-center justify-center text-center space-y-4">
        <div class="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
          <i data-lucide="check-circle" class="w-10 h-10"></i>
        </div>
        <div>
          <h4 class="font-extrabold text-gray-900">Purchase Simulating Success</h4>
          <p class="text-xs text-gray-400 max-w-xs mx-auto mt-2 leading-relaxed">
            Thank you for purchasing premium products on the Sistech Marketplace. A live shipment coordinate has been assigned to Jabodetabek hubs.
          </p>
        </div>
        <div class="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-200 w-full text-left space-y-1">
          <div class="flex justify-between text-xs">
            <span class="text-gray-400">Order ID:</span>
            <span class="font-mono font-bold text-gray-800">SST-${Math.floor(100000 + Math.random() * 900000)}</span>
          </div>
          <div class="flex justify-between text-xs">
            <span class="text-gray-400">Status:</span>
            <span class="text-emerald-600 font-bold">On Process</span>
          </div>
        </div>
        <button data-action="complete-order" class="bg-gray-900 text-white text-xs font-bold w-full py-3 rounded-xl hover:bg-gray-800 transition">
          Return to Marketplace
        </button>
      </div>
    `;
  }

  const showFooter = state.cart.length > 0 && state.checkoutStep !== 'success';

  const footerHtml = showFooter ? `
    <div class="p-6 border-t border-gray-100 bg-gray-50 space-y-4">

      ${state.checkoutStep === 'cart' ? `
        <div class="space-y-1.5">
          <div class="flex space-x-2">
            <input
              id="promo-code-input"
              type="text"
              placeholder="Promo Code (SISTECH10)"
              value="${escapeHtml(state.promoCode)}"
              data-action="input-promo"
              class="flex-1 pl-3 py-2 border border-gray-200 rounded-lg text-xs uppercase focus:outline-none bg-white"
            />
            <button data-action="apply-promo" class="bg-gray-900 text-white font-bold text-xs px-4 py-2 rounded-lg hover:bg-gray-800 transition">
              Apply
            </button>
          </div>
          ${state.promoMessage ? `
            <p class="text-[10px] font-bold ${state.appliedDiscount > 0 ? 'text-emerald-600' : 'text-red-500'}">
              ${escapeHtml(state.promoMessage)}
            </p>
          ` : ''}
        </div>
      ` : ''}

      <div class="space-y-1.5 text-xs text-gray-500">
        <div class="flex justify-between">
          <span>Subtotal</span>
          <span class="font-semibold text-gray-800">${formatIDR(cartSubtotal)}</span>
        </div>
        ${state.appliedDiscount > 0 ? `
          <div class="flex justify-between text-emerald-600 font-bold">
            <span>Discount (${state.appliedDiscount}%)</span>
            <span>-${formatIDR(discountAmount)}</span>
          </div>
        ` : ''}
        <div class="flex justify-between">
          <span>PPN (11%)</span>
          <span class="font-semibold text-gray-800">${formatIDR(taxAmount)}</span>
        </div>
        <div class="flex justify-between text-sm font-black text-gray-900 pt-2 border-t border-gray-200">
          <span>Total Amount</span>
          <span class="text-[#0B57D0]">${formatIDR(cartTotal)}</span>
        </div>
      </div>

      <div class="pt-2">
        ${state.checkoutStep === 'cart' ? `
          <button data-action="checkout-step" data-step="checkout" class="w-full bg-[#0B57D0] hover:bg-blue-700 text-white font-bold text-sm py-3 rounded-xl flex items-center justify-center space-x-2 transition shadow-lg shadow-[#0B57D0]/20">
            <span>Proceed to Shipping</span>
            <i data-lucide="chevron-right" class="w-4 h-4"></i>
          </button>
        ` : `
          <div class="flex space-x-2">
            <button data-action="checkout-step" data-step="cart" class="flex-1 bg-white border border-gray-200 text-gray-700 font-bold text-xs py-3 rounded-xl hover:bg-gray-50 transition">
              Back to Items
            </button>
            <button data-action="checkout-step" data-step="success" class="flex-1 bg-[#0B57D0] hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-xl transition">
              Place Order Simulation
            </button>
          </div>
        `}
      </div>

    </div>
  ` : '';

  const stepperHtml = state.cart.length > 0 ? `
    <div class="px-6 py-3 bg-gray-50 border-b border-gray-100 flex justify-between text-xs font-bold text-gray-500">
      <span class="${state.checkoutStep === 'cart' ? 'text-[#0B57D0]' : ''}">1. Review Items</span>
      <i data-lucide="chevron-right" class="w-4 h-4 text-gray-300"></i>
      <span class="${state.checkoutStep === 'checkout' ? 'text-[#0B57D0]' : ''}">2. Checkout Details</span>
      <i data-lucide="chevron-right" class="w-4 h-4 text-gray-300"></i>
      <span class="${state.checkoutStep === 'success' ? 'text-[#0B57D0]' : ''}">3. Order Complete</span>
    </div>
  ` : '';

  return `
    <div class="fixed inset-0 z-50 overflow-hidden" aria-modal="true" role="dialog">
      <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" data-action="close-cart"></div>

      <div class="absolute inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl flex flex-col">

        <div class="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <i data-lucide="shopping-cart" class="w-6 h-6 text-[#0B57D0]"></i>
            <h3 class="font-extrabold text-lg text-gray-900">Your Cart</h3>
          </div>
          <button data-action="close-cart" class="p-1 rounded-lg text-gray-400 hover:bg-gray-100 transition">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>

        ${stepperHtml}

        <div class="flex-1 overflow-y-auto p-6 space-y-4">
          ${bodyHtml}
        </div>

        ${footerHtml}

      </div>
    </div>
  `;
}

// ==========================================================================
// RENDER: WISHLIST DRAWER
// ==========================================================================

function renderWishlistDrawer() {
  if (!state.isWishlistOpen) return '';

  const bodyHtml = state.wishlist.length === 0 ? `
    <div class="h-full flex flex-col items-center justify-center text-center space-y-4">
      <div class="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500">
        <i data-lucide="heart" class="w-8 h-8"></i>
      </div>
      <div>
        <h4 class="font-bold text-gray-900">Your wishlist is empty</h4>
        <p class="text-xs text-gray-400 max-w-xs mx-auto mt-1 leading-relaxed">
          Save premium products to your personal favorites container.
        </p>
      </div>
    </div>
  ` : `
    <div class="space-y-4">
      ${state.wishlist.map(item => `
        <div class="flex items-center space-x-4 p-3 border border-gray-100 rounded-xl bg-gray-50">
          <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" class="w-16 h-16 rounded-lg object-cover bg-white" />
          <div class="flex-1 space-y-0.5">
            <h4 class="font-bold text-xs text-gray-800 line-clamp-1">${escapeHtml(item.name)}</h4>
            <span class="text-[10px] text-gray-400 block font-semibold">${escapeHtml(item.store)}</span>
            <span class="font-extrabold text-xs text-gray-900 block">${formatIDR(item.price)}</span>
          </div>
          <div class="flex flex-col space-y-2">
            <button data-action="wishlist-to-cart" data-id="${item.id}" class="bg-[#0B57D0] hover:bg-blue-700 text-white font-bold text-[10px] px-2.5 py-1.5 rounded-lg transition">
              To Cart
            </button>
            <button data-action="toggle-wishlist" data-id="${item.id}" class="text-[10px] font-bold text-gray-400 hover:text-red-500 transition text-center">
              Remove
            </button>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  return `
    <div class="fixed inset-0 z-50 overflow-hidden" aria-modal="true" role="dialog">
      <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" data-action="close-wishlist"></div>

      <div class="absolute inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl flex flex-col">

        <div class="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div class="flex items-center space-x-2 text-red-500">
            <i data-lucide="heart" class="w-6 h-6 fill-current"></i>
            <h3 class="font-extrabold text-lg text-gray-900">Your Wishlist</h3>
          </div>
          <button data-action="close-wishlist" class="p-1 rounded-lg text-gray-400 hover:bg-gray-100 transition">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-6 space-y-4">
          ${bodyHtml}
        </div>

      </div>
    </div>
  `;
}

// ==========================================================================
// RENDER: PRODUCT QUICK VIEW MODAL
// ==========================================================================

function renderProductModal() {
  if (!state.selectedProduct) return '';
  const product = state.selectedProduct;

  return `
    <div class="fixed inset-0 z-50 overflow-y-auto" aria-modal="true" role="dialog">
      <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" data-action="close-modal"></div>

      <div class="flex items-center justify-center min-h-screen p-4">
        <div class="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 relative shadow-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row gap-6">

          <button data-action="close-modal" class="absolute top-4 right-4 p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full transition">
            <i data-lucide="x" class="w-4 h-4"></i>
          </button>

          <div class="md:w-1/2 bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden h-64 md:h-auto">
            <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" class="object-cover w-full h-full" />
          </div>

          <div class="md:w-1/2 flex flex-col justify-between space-y-4">

            <div class="space-y-2">

              <div class="flex flex-wrap items-center gap-1.5">
                <span class="bg-gray-100 text-gray-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                  ${escapeHtml(product.category)}
                </span>
                ${product.isOfficialStore ? `
                  <span class="bg-blue-50 text-blue-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase flex items-center space-x-1">
                    <i data-lucide="shield-check" class="w-3 h-3 text-blue-600 inline"></i>
                    <span>Official Store</span>
                  </span>
                ` : ''}
              </div>

              <h3 class="font-extrabold text-xl text-gray-900 leading-tight">
                ${escapeHtml(product.name)}
              </h3>

              <div class="flex items-center space-x-2">
                <div class="flex items-center text-amber-500">
                  <i data-lucide="star" class="w-4 h-4 fill-current"></i>
                  <span class="text-xs font-bold text-gray-700 ml-1">${product.rating}</span>
                </div>
                <span class="text-gray-300">|</span>
                <span class="text-xs text-gray-400 font-semibold">${escapeHtml(product.condition)} Condition</span>
              </div>

              <div class="space-y-0.5">
                <div class="flex items-baseline space-x-2">
                  <span class="text-2xl font-black text-[#0B57D0]">
                    ${formatIDR(product.price * (1 - (product.discountPercentage / 100)))}
                  </span>
                  ${product.discountPercentage > 0 ? `<span class="text-sm text-gray-400 line-through">${formatIDR(product.price)}</span>` : ''}
                </div>
              </div>

              <p class="text-xs text-gray-500 leading-relaxed max-h-24 overflow-y-auto">
                ${escapeHtml(product.description)}
              </p>

            </div>

            <div class="bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs flex items-center justify-between">
              <div class="space-y-0.5">
                <span class="font-bold text-gray-800 flex items-center space-x-1">
                  <i data-lucide="store" class="w-3.5 h-3.5 text-blue-600"></i>
                  <span>${escapeHtml(product.store)}</span>
                </span>
                <span class="text-[10px] text-gray-400 flex items-center space-x-1">
                  <i data-lucide="map-pin" class="w-3 h-3 text-red-500"></i>
                  <span>Located in ${escapeHtml(product.storeCity)}</span>
                </span>
              </div>
              <span class="bg-white px-2 py-1 rounded-lg text-[10px] font-bold text-amber-500 border border-amber-100 flex items-center space-x-0.5">
                <i data-lucide="star" class="w-3 h-3 fill-current inline"></i>
                <span>${product.storeRating}</span>
              </span>
            </div>

            <div class="flex space-x-3 pt-2">
              <button data-action="buy-now" data-id="${product.id}" class="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs py-3 rounded-xl transition">
                Buy Now
              </button>
              <button data-action="modal-add-to-cart" data-id="${product.id}" class="flex-1 bg-[#0B57D0] hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-xl transition shadow-lg shadow-[#0B57D0]/20">
                Add to Cart
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  `;
}

// ==========================================================================
// RENDER: FOOTER
// ==========================================================================

function renderFooter() {
  return `
    <footer class="mt-20 border-t border-gray-100 bg-white">
      <div class="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div class="space-y-4">
          <div class="flex items-center space-x-2">
            <span class="w-8 h-8 bg-[#0B57D0] rounded-lg inline-block flex items-center justify-center text-white font-bold text-sm">P</span>
            <span class="font-extrabold tracking-tight text-gray-900">SISTECH EXPORTS</span>
          </div>
          <p class="text-[12px] text-gray-400 leading-normal">
            A luxury high-fidelity responsive mockup storefront. Designed gracefully to match premium Indonesian electronics, beauty, and beverages marketplace benchmarks.
          </p>
        </div>

        <div>
          <h5 class="text-[12px] font-bold text-gray-900 uppercase tracking-wider mb-4">Store Departments</h5>
          <ul class="space-y-2 text-[12px] text-gray-400 font-semibold">
            <li><button data-action="select-category" data-category="Electronics" class="hover:text-[#0B57D0] transition">Xiaomi &amp; Samsung Gadgets</button></li>
            <li><button data-action="select-category" data-category="Beauty" class="hover:text-[#0B57D0] transition">Wardah Skincare Serum</button></li>
            <li><button data-action="select-category" data-category="Beverages" class="hover:text-[#0B57D0] transition">Sosro Fresh Jasmine Teas</button></li>
            <li><button data-action="select-category" data-category="Home Appliances" class="hover:text-[#0B57D0] transition">Philips Home Appliances</button></li>
          </ul>
        </div>

        <div>
          <h5 class="text-[12px] font-bold text-gray-900 uppercase tracking-wider mb-4">Customer Care</h5>
          <ul class="space-y-2 text-[12px] text-gray-400 font-semibold">
            <li><a href="#" class="hover:text-[#0B57D0] transition">FAQ &amp; Help Center</a></li>
            <li><a href="#" class="hover:text-[#0B57D0] transition">Shipping &amp; Delivery Information</a></li>
            <li><a href="#" class="hover:text-[#0B57D0] transition">Returns &amp; Exchanges Policy</a></li>
            <li><a href="#" class="hover:text-[#0B57D0] transition">Track Your Order Status</a></li>
          </ul>
        </div>

        <div>
          <h5 class="text-[12px] font-bold text-gray-900 uppercase tracking-wider mb-4">System Context</h5>
          <p class="text-[11.5px] text-gray-400 leading-relaxed">
            Indonesian Rupiah localization enabled. Live dataset mapped from API payload dynamically with robust fallback catalog setups.
          </p>
        </div>
      </div>

      <div class="border-t border-gray-50 py-6 text-center text-xs text-gray-400 font-semibold">
        © 2026 Sistech Ecommerce Platform. Built with Responsiveness &amp; Pride.
      </div>
    </footer>
  `;
}

// ==========================================================================
// MASTER RENDER
// ==========================================================================

function render() {
  const app = document.getElementById('app');
  app.innerHTML = `
    ${renderTopBanner()}
    ${renderNavbar()}
    <main class="max-w-7xl mx-auto px-6 py-8">
      ${renderHero()}
      ${renderCategories()}
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        ${renderSidebar()}
        ${renderProductGrid()}
      </div>
    </main>
    ${renderCartDrawer()}
    ${renderProductModal()}
    ${renderWishlistDrawer()}
    ${renderFooter()}
  `;

  // Replace <i data-lucide="..."> tags with actual SVG icons
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// Wrapper that preserves focus + text-cursor position on inputs across re-renders
// (needed because we fully re-render the DOM on every state change, like typing in search box)
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
        try { el.setSelectionRange(selStart, selEnd); } catch (e) { /* no-op for non-text inputs */ }
      }
    }
  }
}

// ==========================================================================
// EVENT DELEGATION (single listener on #app, handles all clicks/inputs)
// ==========================================================================

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