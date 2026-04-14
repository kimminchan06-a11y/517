const FALLBACK_RATE = 1502;
const RATE_REFRESH_INTERVAL_MS = 30000;
const QUOTE_WINDOW_MINUTES = 10;
const STORAGE_KEY = "crypto-commerce-store-v2";
const memoryStore = {};

const krwFormatter = new Intl.NumberFormat("ko-KR");
const usdtFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});
const rateFormatter = new Intl.NumberFormat("ko-KR", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2
});
const timeFormatter = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false
});

const PRODUCT_CATALOG = [
  {
    id: "iphone-15-pro",
    title: "iPhone 15 Pro",
    brand: "Apple",
    category: "스마트폰",
    priceKrw: 1349000,
    oldPriceKrw: 1499000,
    rating: 4.9,
    reviews: 2187,
    shipping: "내일 도착 보장",
    fastDelivery: true,
    rank: 1,
    releaseYear: 2025,
    accentLabel: "즉시 견적 가능",
    description: "프리미엄 카메라와 티타늄 바디를 담은 플래그십 스마트폰입니다.",
    tags: ["256GB", "A17 Pro", "무료배송"],
    image: "https://www.apple.com/newsroom/images/2023/09/apple-unveils-iphone-15-pro-and-iphone-15-pro-max/article/Apple-iPhone-15-Pro-lineup-hero-230912_big.jpg.large.jpg",
    surface: "linear-gradient(135deg, #0f172a 0%, #123b2c 100%)"
  },
  {
    id: "galaxy-s24-ultra",
    title: "Galaxy S24 Ultra",
    brand: "Samsung",
    category: "스마트폰",
    priceKrw: 1439000,
    oldPriceKrw: 1599000,
    rating: 4.8,
    reviews: 1941,
    shipping: "오늘 출고",
    fastDelivery: true,
    rank: 2,
    releaseYear: 2025,
    accentLabel: "빠른 주문 가능",
    description: "강력한 성능과 선명한 디스플레이를 갖춘 프리미엄 안드로이드 모델입니다.",
    tags: ["S펜 포함", "고배율 줌", "공식라인"],
    image: "https://images.samsung.com/is/image/samsung/assets/latin_en/smartphones/galaxy-s24-ultra/images/S24Ultra_PC1.jpg?imbypass=true",
    surface: "linear-gradient(135deg, #312e81 0%, #111827 100%)"
  },
  {
    id: "ipad-air-6",
    title: "iPad Air 6",
    brand: "Apple",
    category: "태블릿",
    priceKrw: 809000,
    oldPriceKrw: 899000,
    rating: 4.8,
    reviews: 1688,
    shipping: "내일 도착 보장",
    fastDelivery: true,
    rank: 3,
    releaseYear: 2025,
    accentLabel: "재고 문의 가능",
    description: "가벼운 작업과 엔터테인먼트를 모두 커버하는 인기 태블릿입니다.",
    tags: ["M2 칩", "11형", "와이파이"],
    image: "https://www.apple.com/v/ipad-air/x/images/overview/hero/hero_endframe__sg50vzdd6sqm_xlarge.jpg",
    surface: "linear-gradient(135deg, #0f766e 0%, #0f172a 100%)"
  },
  {
    id: "macbook-air-m3",
    title: "MacBook Air M3",
    brand: "Apple",
    category: "노트북",
    priceKrw: 1529000,
    oldPriceKrw: 1699000,
    rating: 4.9,
    reviews: 1234,
    shipping: "내일 도착 보장",
    fastDelivery: true,
    rank: 4,
    releaseYear: 2025,
    accentLabel: "실시간 금액 반영",
    description: "휴대성과 생산성을 함께 챙길 수 있는 대표적인 초경량 노트북입니다.",
    tags: ["M3 칩", "13형", "AppleCare 가능"],
    image: "https://www.apple.com/newsroom/images/2024/03/apple-unveils-the-new-13-and-15-inch-macbook-air-with-the-powerful-m3-chip/article/Apple-MacBook-Air-2-up-240304_big.jpg.large.jpg",
    surface: "linear-gradient(135deg, #f59e0b 0%, #0f172a 100%)"
  },
  {
    id: "airpods-pro-2",
    title: "AirPods Pro 2",
    brand: "Apple",
    category: "오디오",
    priceKrw: 299000,
    oldPriceKrw: 359000,
    rating: 4.9,
    reviews: 5821,
    shipping: "오늘 주문 가능",
    fastDelivery: true,
    rank: 5,
    releaseYear: 2024,
    accentLabel: "오늘의 특가",
    description: "노이즈 캔슬링과 공간 음향을 갖춘 프리미엄 무선 이어폰입니다.",
    tags: ["ANC", "USB-C", "Apple Select"],
    image: "https://www.apple.com/v/airpods/x/images/overview/pro_endframe__bc1d0j5r7s02_xlarge.jpg",
    surface: "linear-gradient(135deg, #fda4af 0%, #fff1f2 100%)"
  },
  {
    id: "galaxy-buds2-pro",
    title: "Galaxy Buds2 Pro",
    brand: "Samsung",
    category: "오디오",
    priceKrw: 169000,
    oldPriceKrw: 199000,
    rating: 4.7,
    reviews: 3102,
    shipping: "내일 도착 보장",
    fastDelivery: true,
    rank: 6,
    releaseYear: 2024,
    accentLabel: "와우 인기템 감성",
    description: "가볍고 편안하게 쓰기 좋은 프리미엄 무선 이어버드입니다.",
    tags: ["Hi-Fi", "360 오디오", "공식정품"],
    image: "https://images.samsung.com/is/image/samsung/assets/global/0824/galaxy-buds2-pro/0811_buds2pro_main2.jpg?$720_N_JPG$",
    surface: "linear-gradient(135deg, #e0f2fe 0%, #ffffff 100%)"
  },
  {
    id: "magic-keyboard",
    title: "Magic Keyboard",
    brand: "Apple",
    category: "액세서리",
    priceKrw: 129000,
    oldPriceKrw: 149000,
    rating: 4.7,
    reviews: 882,
    shipping: "내일 도착 보장",
    fastDelivery: true,
    rank: 7,
    releaseYear: 2024,
    accentLabel: "생산성 추천",
    description: "깔끔한 타건감과 휴대성을 갖춘 공식 키보드 액세서리입니다.",
    tags: ["블루투스", "공식액세서리", "화이트"],
    image: "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/MXCK3?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1721253839521",
    surface: "linear-gradient(135deg, #fde68a 0%, #fff7ed 100%)"
  },
  {
    id: "mx-master-3s",
    title: "MX Master 3S",
    brand: "Logitech",
    category: "액세서리",
    priceKrw: 149000,
    oldPriceKrw: 189000,
    rating: 4.8,
    reviews: 761,
    shipping: "재고 문의",
    fastDelivery: false,
    rank: 8,
    releaseYear: 2024,
    accentLabel: "사무용 베스트",
    description: "정밀한 스크롤과 멀티 디바이스 전환이 강점인 프리미엄 마우스입니다.",
    tags: ["저소음", "USB-C", "멀티 디바이스"],
    icon: "mouse",
    surface: "linear-gradient(135deg, #e2e8f0 0%, #f8fafc 100%)"
  },
  {
    id: "gan-charger-25w",
    title: "25W GaN 듀얼 충전기",
    brand: "신지모루",
    category: "액세서리",
    priceKrw: 8980,
    oldPriceKrw: 19900,
    rating: 5.0,
    reviews: 11710,
    shipping: "오늘 출고",
    fastDelivery: true,
    rank: 9,
    releaseYear: 2025,
    accentLabel: "랭킹 급상승",
    description: "콤팩트한 크기와 안정적인 출력으로 인기 높은 초고속 충전기입니다.",
    tags: ["GaN", "PPS", "초고속충전"],
    icon: "battery-charging",
    surface: "linear-gradient(135deg, #dcfce7 0%, #f0fdf4 100%)"
  },
  {
    id: "display-cable-100w",
    title: "디스플레이 C타입 케이블 100W",
    brand: "굿밸류",
    category: "액세서리",
    priceKrw: 5900,
    oldPriceKrw: 20790,
    rating: 5.0,
    reviews: 8258,
    shipping: "내일 도착 보장",
    fastDelivery: true,
    rank: 10,
    releaseYear: 2025,
    accentLabel: "가성비 추천",
    description: "전력 표시창이 있어 충전 상태를 직관적으로 확인할 수 있는 인기 케이블입니다.",
    tags: ["100W", "2m", "C to C"],
    icon: "plug-zap",
    surface: "linear-gradient(135deg, #cffafe 0%, #eef2ff 100%)"
  },
  {
    id: "beats-pill",
    title: "Beats Pill",
    brand: "Beats",
    category: "오디오",
    priceKrw: 349000,
    oldPriceKrw: 399000,
    rating: 4.7,
    reviews: 642,
    shipping: "재고 문의",
    fastDelivery: false,
    rank: 11,
    releaseYear: 2024,
    accentLabel: "실내외 추천",
    description: "강한 저음과 휴대성을 동시에 챙긴 블루투스 스피커입니다.",
    tags: ["블루투스", "휴대용", "방수"],
    image: "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/MWQW3?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1716571037347",
    surface: "linear-gradient(135deg, #ddd6fe 0%, #faf5ff 100%)"
  },
  {
    id: "apple-watch",
    title: "Apple Watch",
    brand: "Apple",
    category: "웨어러블",
    priceKrw: 389000,
    oldPriceKrw: 429000,
    rating: 4.8,
    reviews: 1425,
    shipping: "내일 도착 보장",
    fastDelivery: true,
    rank: 12,
    releaseYear: 2024,
    accentLabel: "건강 관리 추천",
    description: "건강 기록과 알림을 효율적으로 관리할 수 있는 스마트 워치입니다.",
    tags: ["GPS", "건강센서", "생활방수"],
    image: "https://www.apple.com/v/apple-watch-series-11/c/images/overview/product/product_red_endframe__crb1zth6qq5u_large.jpg",
    surface: "linear-gradient(135deg, #f1f5f9 0%, #e5e7eb 100%)"
  },
  {
    id: "homepod-mini",
    title: "HomePod mini",
    brand: "Apple",
    category: "오디오",
    priceKrw: 169000,
    oldPriceKrw: 199000,
    rating: 4.6,
    reviews: 991,
    shipping: "재고 문의",
    fastDelivery: false,
    rank: 13,
    releaseYear: 2024,
    accentLabel: "거실 추천",
    description: "작은 공간에 잘 어울리는 컴팩트 스마트 스피커입니다.",
    tags: ["Siri", "멀티룸", "화이트"],
    image: "https://www.apple.com/v/homepod-mini/j/images/overview/static_sound_end__c921y5hqs7ki_large.jpg",
    surface: "linear-gradient(135deg, #dbeafe 0%, #eef2ff 100%)"
  },
  {
    id: "phone-stand",
    title: "탁상용 스마트폰 거치대",
    brand: "홈플래닛",
    category: "액세서리",
    priceKrw: 2980,
    oldPriceKrw: 2980,
    rating: 4.5,
    reviews: 13425,
    shipping: "내일 도착 보장",
    fastDelivery: true,
    rank: 14,
    releaseYear: 2025,
    accentLabel: "쿠팡 감성 벤치마크",
    description: "가벼운 가격대로 장바구니에 함께 담기 좋은 보조 액세서리입니다.",
    tags: ["접이식", "화이트", "가성비"],
    icon: "smartphone",
    surface: "linear-gradient(135deg, #ecfccb 0%, #f7fee7 100%)"
  }
];

const PAYMENT_METHODS = [
  {
    id: "card",
    label: "카드 결제",
    description: "국내외 신용카드로 즉시 승인되는 일반 결제 방식",
    icon: "credit-card",
    highlight: "즉시 승인"
  },
  {
    id: "coin",
    label: "코인 결제",
    description: "USDT 기준 금액으로 결제하고 TXID를 남기는 방식",
    icon: "coins",
    highlight: "TRC20 / ERC20"
  },
  {
    id: "toss",
    label: "토스페이",
    description: "휴대폰 번호 기반으로 빠르게 호출하는 간편 결제",
    icon: "receipt",
    highlight: "간편 승인"
  },
  {
    id: "kakao",
    label: "카카오페이",
    description: "카카오페이 알림으로 승인하는 모바일 결제",
    icon: "message-circle",
    highlight: "모바일 전용"
  }
];

const SAMPLE_ORDERS = [
  {
    id: "CC-2026-0411-214",
    email: "haeun@example.com",
    txid: "0x74af...29bc",
    customerName: "김하은",
    productId: "iphone-15-pro",
    productTitle: "iPhone 15 Pro",
    methodLabel: "코인 결제",
    status: "입금 확인 완료",
    statusDetail: "검수 후 발송 준비 중",
    amountKrw: 1349000,
    amountUsdt: 897.76,
    createdAt: "2026-04-11T14:20:00+09:00"
  },
  {
    id: "CC-2026-0412-087",
    email: "mina@example.com",
    txid: "CARD-9918",
    customerName: "박미나",
    productId: "airpods-pro-2",
    productTitle: "AirPods Pro 2",
    methodLabel: "카드 결제",
    status: "결제 승인 완료",
    statusDetail: "출고 대기 중",
    amountKrw: 299000,
    amountUsdt: 198.94,
    createdAt: "2026-04-12T09:05:00+09:00"
  }
];

const DEFAULT_STORE = {
  selectedProductId: PRODUCT_CATALOG[0].id,
  cart: [],
  auth: null,
  orders: []
};

let currentRate = FALLBACK_RATE;
let isRateRequestInFlight = false;

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function readStorage() {
  const fallback = deepClone(DEFAULT_STORE);

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return fallback;
    }

    const parsed = JSON.parse(raw);

    return {
      ...fallback,
      ...parsed,
      cart: Array.isArray(parsed?.cart) ? parsed.cart : [],
      orders: Array.isArray(parsed?.orders) ? parsed.orders : []
    };
  } catch (error) {
    const parsed = memoryStore[STORAGE_KEY];
    return parsed ? { ...fallback, ...parsed } : fallback;
  }
}

function writeStorage(nextStore) {
  const store = {
    ...deepClone(DEFAULT_STORE),
    ...nextStore,
    cart: Array.isArray(nextStore?.cart) ? nextStore.cart : [],
    orders: Array.isArray(nextStore?.orders) ? nextStore.orders : []
  };

  memoryStore[STORAGE_KEY] = deepClone(store);

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (error) {
    memoryStore[STORAGE_KEY] = deepClone(store);
  }

  return store;
}

function updateStore(updater) {
  const currentStore = readStorage();
  const nextStore = updater(deepClone(currentStore));
  return writeStorage(nextStore);
}

function getProductById(productId) {
  return PRODUCT_CATALOG.find((product) => product.id === productId) || PRODUCT_CATALOG[0];
}

function formatKrw(value) {
  return `₩${krwFormatter.format(value)}`;
}

function formatUsdt(value) {
  return `${usdtFormatter.format(value)} USDT`;
}

function formatCount(value) {
  return krwFormatter.format(value);
}

function getDiscountPercent(product) {
  if (!product.oldPriceKrw || product.oldPriceKrw <= product.priceKrw) {
    return null;
  }

  return Math.round((1 - product.priceKrw / product.oldPriceKrw) * 100);
}

function getQuoteWindowText() {
  return `견적 고정 ${QUOTE_WINDOW_MINUTES}분`;
}

function refreshIcons() {
  if (window.lucide) {
    lucide.createIcons();
  }
}

function ensureToastStack() {
  let stack = document.querySelector("[data-toast-stack]");

  if (!stack) {
    stack = document.createElement("div");
    stack.className = "toast-stack";
    stack.setAttribute("data-toast-stack", "");
    document.body.appendChild(stack);
  }

  return stack;
}

function showToast(message, tone = "default") {
  const stack = ensureToastStack();
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.dataset.tone = tone;
  toast.textContent = message;
  stack.appendChild(toast);

  window.setTimeout(() => {
    toast.remove();
  }, 2600);
}

function updateYear() {
  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });
}

function updateQuoteWindowText() {
  document.querySelectorAll("[data-quote-window]").forEach((node) => {
    node.textContent = getQuoteWindowText();
  });
}

function getCartCount() {
  return readStorage().cart.reduce((sum, item) => sum + Number(item.qty || 0), 0);
}

function updateHeaderState() {
  const store = readStorage();
  const authLabel = store.auth?.name ? `${store.auth.name}님` : "로그인";

  document.querySelectorAll("[data-auth-label]").forEach((node) => {
    node.textContent = authLabel;
  });

  document.querySelectorAll("[data-cart-count]").forEach((node) => {
    const count = getCartCount();
    node.textContent = String(count);
    node.classList.toggle("hidden", count <= 0);
  });
}

function setSelectedProduct(productId) {
  updateStore((store) => {
    store.selectedProductId = productId;
    return store;
  });
  updateHeaderState();
}

function addToCart(productId, qty = 1) {
  const product = getProductById(productId);

  updateStore((store) => {
    store.selectedProductId = productId;
    const existing = store.cart.find((item) => item.productId === productId);

    if (existing) {
      existing.qty += qty;
    } else {
      store.cart.push({ productId, qty });
    }

    return store;
  });

  updateHeaderState();
  showToast(`${product.title}을(를) 선택 상품에 담았습니다.`, "success");
}

function getCartItem(productId) {
  return readStorage().cart.find((item) => item.productId === productId) || null;
}

function setCartQuantity(productId, qty) {
  updateStore((store) => {
    store.selectedProductId = productId;
    const existing = store.cart.find((item) => item.productId === productId);

    if (qty <= 0) {
      store.cart = store.cart.filter((item) => item.productId !== productId);
      return store;
    }

    if (existing) {
      existing.qty = qty;
    } else {
      store.cart.push({ productId, qty });
    }

    return store;
  });

  updateHeaderState();
}

function getActiveProductId() {
  const params = new URLSearchParams(window.location.search);
  const queryProductId = params.get("product");

  if (queryProductId && PRODUCT_CATALOG.some((product) => product.id === queryProductId)) {
    setSelectedProduct(queryProductId);
    return queryProductId;
  }

  return readStorage().selectedProductId || PRODUCT_CATALOG[0].id;
}

function setAuthSession(auth) {
  updateStore((store) => {
    store.auth = auth;
    return store;
  });
  updateHeaderState();
}

function saveOrder(order) {
  updateStore((store) => {
    store.orders.unshift(order);
    return store;
  });
}

function getAllOrders() {
  return [...readStorage().orders, ...SAMPLE_ORDERS];
}

function normalizeQuery(value) {
  return String(value || "").trim().toLowerCase();
}

function findOrder(orderId, secondaryValue) {
  const normalizedOrderId = normalizeQuery(orderId);
  const normalizedSecondary = normalizeQuery(secondaryValue);

  return getAllOrders().find((order) => {
    const matchesId = normalizedOrderId
      ? normalizeQuery(order.id) === normalizedOrderId
      : false;

    const relatedValues = [
      order.email,
      order.txid,
      order.customerName,
      order.productTitle
    ].map(normalizeQuery);

    const matchesSecondary = normalizedSecondary
      ? relatedValues.some((value) => value.includes(normalizedSecondary))
      : false;

    if (normalizedOrderId && normalizedSecondary) {
      return matchesId && matchesSecondary;
    }

    return matchesId || matchesSecondary;
  });
}

function getStatusTone(status) {
  if (String(status).includes("완료")) {
    return "is-ready";
  }

  if (String(status).includes("대기")) {
    return "is-pending";
  }

  return "is-dark";
}

function getProductArt(product) {
  if (product.image) {
    return `
      <img
        class="market-image"
        src="${product.image}"
        alt="${product.title} 이미지"
        loading="lazy"
        decoding="async"
        referrerpolicy="no-referrer"
      >
    `;
  }

  return `
    <div class="market-icon-wrap">
      <i data-lucide="${product.icon || "package"}"></i>
    </div>
  `;
}

function createProductCard(product, index, mode = "catalog") {
  const discount = getDiscountPercent(product);
  const actionLabel = mode === "home" ? "선택 상품 저장" : "장바구니 담기";

  return `
    <article
      class="glass section-card market-card${mode === "home" ? " is-preview" : ""}"
      data-product-card
      data-product-id="${product.id}"
      data-krw="${product.priceKrw}"
      data-old-krw="${product.oldPriceKrw || 0}"
    >
      <div class="market-media" style="background:${product.surface}">
        <span class="rank-badge">${mode === "home" ? product.accentLabel : `랭킹 ${index + 1}`}</span>
        <span class="delivery-badge">${product.shipping}</span>
        <div class="market-art">
          ${getProductArt(product)}
        </div>
      </div>

      <div class="market-content">
        <div class="market-meta-line">
          <span>${product.brand}</span>
          <span>${product.category}</span>
          ${discount ? `<span>${discount}% 할인</span>` : `<span>합리적 가격</span>`}
        </div>
        <h3 class="market-title">${product.title}</h3>
        <p class="market-copy">${product.description}</p>
        <p class="market-rating">평점 ${product.rating.toFixed(1)} · 리뷰 ${formatCount(product.reviews)}개</p>

        <div class="market-price-box">
          <p class="market-old-price" data-old>${product.oldPriceKrw > product.priceKrw ? formatKrw(product.oldPriceKrw) : ""}</p>
          <p class="market-current-price" data-price>${formatKrw(product.priceKrw)}</p>
          <p class="market-usdt" data-usdt>${formatUsdt(product.priceKrw / currentRate)}</p>
        </div>

        <div class="market-tags">
          ${product.tags.map((tag) => `<span class="market-tag">${tag}</span>`).join("")}
        </div>

        <div class="market-actions">
          <button type="button" class="button-ghost" data-add-to-cart="${product.id}">${actionLabel}</button>
          <a href="checkout.html?product=${product.id}" class="button-primary" data-product-link="${product.id}">바로 결제</a>
        </div>
      </div>
    </article>
  `;
}

function refreshReferenceRate(rate) {
  document.querySelectorAll("[data-reference-rate]").forEach((node) => {
    node.textContent = `1 USDT = ₩${rateFormatter.format(rate)}`;
  });
}

function refreshRateMeta(message) {
  document.querySelectorAll("[data-rate-meta]").forEach((node) => {
    node.textContent = message;
  });
}

function refreshProductPriceNodes() {
  document.querySelectorAll("[data-product-card]").forEach((card) => {
    const currentKrw = Number(card.dataset.krw || 0);
    const oldKrw = Number(card.dataset.oldKrw || 0);
    const priceNode = card.querySelector("[data-price]");
    const oldNode = card.querySelector("[data-old]");
    const usdtNode = card.querySelector("[data-usdt]");

    if (oldNode) {
      oldNode.textContent = oldKrw > currentKrw ? formatKrw(oldKrw) : "";
    }

    if (priceNode) {
      priceNode.textContent = formatKrw(currentKrw);
    }

    if (usdtNode) {
      usdtNode.textContent = `≈ ${formatUsdt(currentKrw / currentRate)}`;
    }
  });
}

function fetchJsonWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 8000);

  return fetch(url, {
    ...options,
    cache: "no-store",
    signal: controller.signal,
    headers: {
      Accept: "application/json",
      ...(options.headers || {})
    }
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return response.json();
    })
    .finally(() => {
      window.clearTimeout(timeoutId);
    });
}

async function fetchUpbitRate() {
  const payload = await fetchJsonWithTimeout("https://api.upbit.com/v1/ticker?markets=KRW-USDT");
  const ticker = Array.isArray(payload) ? payload[0] : null;
  const rate = Number(ticker?.trade_price);
  const updatedAt = Number(ticker?.trade_timestamp) || Date.now();

  if (!Number.isFinite(rate) || rate <= 0) {
    throw new Error("Invalid Upbit rate");
  }

  return {
    rate,
    source: "Upbit KRW-USDT",
    updatedAt
  };
}

async function fetchCoinGeckoRate() {
  const payload = await fetchJsonWithTimeout("https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=krw&include_last_updated_at=true");
  const rate = Number(payload?.tether?.krw);
  const updatedAt = Number(payload?.tether?.last_updated_at)
    ? Number(payload.tether.last_updated_at) * 1000
    : Date.now();

  if (!Number.isFinite(rate) || rate <= 0) {
    throw new Error("Invalid CoinGecko rate");
  }

  return {
    rate,
    source: "CoinGecko USDT/KRW",
    updatedAt
  };
}

function applyLiveRate({ rate, source, updatedAt }) {
  if (!Number.isFinite(rate) || rate <= 0) {
    return;
  }

  currentRate = rate;
  refreshReferenceRate(currentRate);
  refreshRateMeta(`${source} 기준 · ${timeFormatter.format(new Date(updatedAt))} 업데이트`);
  refreshProductPriceNodes();
  window.dispatchEvent(new CustomEvent("cc:pricing-changed"));
}

function applyFallbackRate() {
  refreshReferenceRate(currentRate);
  refreshRateMeta("실시간 조회 실패 · 마지막 기준값 표시");
  refreshProductPriceNodes();
  window.dispatchEvent(new CustomEvent("cc:pricing-changed"));
}

async function refreshLiveRate() {
  if (isRateRequestInFlight) {
    return;
  }

  isRateRequestInFlight = true;
  refreshRateMeta("실시간 환율을 확인하는 중...");

  try {
    const rateData = await fetchUpbitRate().catch(() => fetchCoinGeckoRate());
    applyLiveRate(rateData);
  } catch (error) {
    console.error("Failed to refresh live rate", error);
    applyFallbackRate();
  } finally {
    isRateRequestInFlight = false;
  }
}

function bindProductActions() {
  document.addEventListener("click", (event) => {
    const addToCartButton = event.target.closest("[data-add-to-cart]");
    if (addToCartButton) {
      addToCart(addToCartButton.dataset.addToCart);
      return;
    }

    const productLink = event.target.closest("[data-product-link]");
    if (productLink) {
      setSelectedProduct(productLink.dataset.productLink);
      return;
    }
  });
}

function initHomePage() {
  const featuredRoot = document.querySelector("[data-home-featured]");
  if (!featuredRoot) {
    return;
  }

  featuredRoot.innerHTML = PRODUCT_CATALOG.slice(0, 4)
    .map((product, index) => createProductCard(product, index, "home"))
    .join("");

  refreshProductPriceNodes();
  refreshIcons();
}

function renderFilterGroup(container, items, inputName, selectedValue, type = "radio") {
  container.innerHTML = items
    .map((item) => {
      const checked = type === "radio"
        ? selectedValue === item.value
        : Array.isArray(selectedValue) && selectedValue.includes(item.value);

      return `
        <label class="filter-option">
          <input
            type="${type}"
            name="${inputName}"
            value="${item.value}"
            ${checked ? "checked" : ""}
          >
          <span>${item.label}</span>
        </label>
      `;
    })
    .join("");
}

function initProductsPage() {
  const grid = document.querySelector("[data-products-grid]");
  if (!grid) {
    return;
  }

  const searchForm = document.querySelector("[data-product-search-form]");
  const searchInput = document.querySelector("[data-product-search]");
  const categoryRoot = document.querySelector("[data-category-filters]");
  const brandRoot = document.querySelector("[data-brand-filters]");
  const priceRoot = document.querySelector("[data-price-filters]");
  const quickFilterRoot = document.querySelector("[data-quick-filters]");
  const sortSelect = document.querySelector("[data-sort-select]");
  const resultCount = document.querySelector("[data-result-count]");
  const fastDelivery = document.querySelector("[data-fast-delivery]");
  const minRating = document.querySelector("[data-min-rating]");
  const emptyState = document.querySelector("[data-empty-state]");
  const resetFilters = document.querySelector("[data-reset-filters]");
  const params = new URLSearchParams(window.location.search);

  const filterState = {
    search: params.get("search") || "",
    category: params.get("category") || "all",
    brands: [],
    priceRange: "all",
    sort: "recommended",
    fastOnly: false,
    minRating: "all"
  };

  const categories = [
    { value: "all", label: "전체 상품" },
    ...Array.from(new Set(PRODUCT_CATALOG.map((product) => product.category))).map((category) => ({
      value: category,
      label: category
    }))
  ];

  const brands = Array.from(new Set(PRODUCT_CATALOG.map((product) => product.brand))).map((brand) => ({
    value: brand,
    label: brand
  }));

  const priceRanges = [
    { value: "all", label: "전체 가격대" },
    { value: "under-10000", label: "1만원 이하" },
    { value: "10000-100000", label: "1만원 ~ 10만원" },
    { value: "100000-500000", label: "10만원 ~ 50만원" },
    { value: "500000-plus", label: "50만원 이상" }
  ];

  function renderQuickFilters() {
    quickFilterRoot.innerHTML = categories
      .map((item) => {
        const active = filterState.category === item.value ? " is-active" : "";
        return `
          <button
            type="button"
            class="filter-chip${active}"
            data-quick-category="${item.value}"
          >
            ${item.label}
          </button>
        `;
      })
      .join("");
  }

  function matchesPriceRange(product) {
    if (filterState.priceRange === "under-10000") {
      return product.priceKrw < 10000;
    }

    if (filterState.priceRange === "10000-100000") {
      return product.priceKrw >= 10000 && product.priceKrw < 100000;
    }

    if (filterState.priceRange === "100000-500000") {
      return product.priceKrw >= 100000 && product.priceKrw < 500000;
    }

    if (filterState.priceRange === "500000-plus") {
      return product.priceKrw >= 500000;
    }

    return true;
  }

  function getFilteredProducts() {
    const keyword = normalizeQuery(filterState.search);

    const filtered = PRODUCT_CATALOG.filter((product) => {
      const searchPool = [
        product.title,
        product.brand,
        product.category,
        product.description,
        ...product.tags
      ].map(normalizeQuery).join(" ");

      const matchesKeyword = keyword ? searchPool.includes(keyword) : true;
      const matchesCategory = filterState.category === "all" || product.category === filterState.category;
      const matchesBrand = filterState.brands.length === 0 || filterState.brands.includes(product.brand);
      const matchesDelivery = !filterState.fastOnly || product.fastDelivery;
      const matchesRating = filterState.minRating === "all" || product.rating >= Number(filterState.minRating);

      return matchesKeyword
        && matchesCategory
        && matchesBrand
        && matchesPriceRange(product)
        && matchesDelivery
        && matchesRating;
    });

    const sorters = {
      recommended: (a, b) => a.rank - b.rank,
      low: (a, b) => a.priceKrw - b.priceKrw,
      high: (a, b) => b.priceKrw - a.priceKrw,
      rating: (a, b) => b.rating - a.rating || b.reviews - a.reviews,
      newest: (a, b) => b.releaseYear - a.releaseYear || a.rank - b.rank
    };

    return filtered.sort(sorters[filterState.sort] || sorters.recommended);
  }

  function renderCatalog() {
    const products = getFilteredProducts();
    resultCount.textContent = formatCount(products.length);
    grid.innerHTML = products.map((product, index) => createProductCard(product, index)).join("");
    emptyState.classList.toggle("hidden", products.length > 0);
    refreshProductPriceNodes();
    refreshIcons();
    renderQuickFilters();
  }

  renderFilterGroup(categoryRoot, categories, "catalog-category", filterState.category);
  renderFilterGroup(brandRoot, brands, "catalog-brand", filterState.brands, "checkbox");
  renderFilterGroup(priceRoot, priceRanges, "catalog-price", filterState.priceRange);
  renderQuickFilters();

  if (searchInput) {
    searchInput.value = filterState.search;
  }

  searchForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    filterState.search = searchInput?.value.trim() || "";
    renderCatalog();
  });

  categoryRoot?.addEventListener("change", (event) => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) {
      return;
    }

    filterState.category = input.value;
    renderCatalog();
  });

  brandRoot?.addEventListener("change", () => {
    filterState.brands = Array.from(brandRoot.querySelectorAll("input:checked")).map((input) => input.value);
    renderCatalog();
  });

  priceRoot?.addEventListener("change", (event) => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) {
      return;
    }

    filterState.priceRange = input.value;
    renderCatalog();
  });

  quickFilterRoot?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-quick-category]");
    if (!button) {
      return;
    }

    filterState.category = button.dataset.quickCategory || "all";
    renderFilterGroup(categoryRoot, categories, "catalog-category", filterState.category);
    renderCatalog();
  });

  fastDelivery?.addEventListener("change", () => {
    filterState.fastOnly = Boolean(fastDelivery.checked);
    renderCatalog();
  });

  minRating?.addEventListener("change", () => {
    filterState.minRating = minRating.value;
    renderCatalog();
  });

  sortSelect?.addEventListener("change", () => {
    filterState.sort = sortSelect.value;
    renderCatalog();
  });

  resetFilters?.addEventListener("click", () => {
    filterState.search = "";
    filterState.category = "all";
    filterState.brands = [];
    filterState.priceRange = "all";
    filterState.sort = "recommended";
    filterState.fastOnly = false;
    filterState.minRating = "all";

    if (searchInput) {
      searchInput.value = "";
    }
    if (sortSelect) {
      sortSelect.value = "recommended";
    }
    if (fastDelivery) {
      fastDelivery.checked = false;
    }
    if (minRating) {
      minRating.value = "all";
    }

    renderFilterGroup(categoryRoot, categories, "catalog-category", filterState.category);
    renderFilterGroup(brandRoot, brands, "catalog-brand", filterState.brands, "checkbox");
    renderFilterGroup(priceRoot, priceRanges, "catalog-price", filterState.priceRange);
    renderCatalog();
  });

  renderCatalog();

  if (params.get("welcome") === "1") {
    showToast("로그인 상태가 반영되었습니다. 상품을 바로 둘러보세요.", "success");
  }
}

function createAuthSuccessCard(title, description, primaryHref, primaryLabel, secondaryHref, secondaryLabel) {
  return `
    <div class="result-card">
      <p class="eyebrow text-emerald-700">${title}</p>
      <p class="mt-3 text-sm leading-7 text-slate-700">${description}</p>
      <div class="mt-5 flex flex-wrap gap-3">
        <a href="${primaryHref}" class="button-secondary">${primaryLabel}</a>
        <a href="${secondaryHref}" class="button-ghost">${secondaryLabel}</a>
      </div>
    </div>
  `;
}

function renderOrderResult(container, order) {
  if (!container) {
    return;
  }

  if (!order) {
    container.innerHTML = `
      <div class="empty-state">
        <p class="text-sm font-semibold text-slate-900">일치하는 주문을 찾지 못했습니다.</p>
        <p class="mt-2 text-sm leading-7 text-slate-600">
          샘플 주문번호 <strong>${SAMPLE_ORDERS[0].id}</strong> 와 보조 값 <strong>${SAMPLE_ORDERS[0].txid}</strong> 로 다시 확인해 보세요.
        </p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="result-card">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p class="eyebrow text-emerald-700">Order result</p>
          <h3 class="mt-2 text-xl font-semibold text-slate-950">${order.id}</h3>
        </div>
        <span class="status-pill ${getStatusTone(order.status)}">${order.status}</span>
      </div>

      <div class="mt-5 grid gap-3 text-sm text-slate-700">
        <p><strong>상품</strong> ${order.productTitle}</p>
        <p><strong>결제 수단</strong> ${order.methodLabel}</p>
        <p><strong>진행 상태</strong> ${order.statusDetail}</p>
        <p><strong>결제 금액</strong> ${formatKrw(order.amountKrw)} / ${formatUsdt(order.amountUsdt)}</p>
        <p><strong>접수 시각</strong> ${timeFormatter.format(new Date(order.createdAt))}</p>
      </div>
    </div>
  `;
}

function initLoginPage() {
  const tabRoot = document.querySelector("[data-auth-tabs]");
  if (!tabRoot) {
    return;
  }

  const tabButtons = Array.from(tabRoot.querySelectorAll("[data-auth-tab-target]"));
  const panels = Array.from(document.querySelectorAll("[data-auth-panel]"));
  const signInForm = document.querySelector("[data-signin-form]");
  const signUpForm = document.querySelector("[data-signup-form]");
  const lookupForm = document.querySelector("[data-order-lookup-form]");
  const signInResult = document.querySelector("[data-signin-result]");
  const signUpResult = document.querySelector("[data-signup-result]");
  const lookupResult = document.querySelector("[data-lookup-result]");
  const demoLoginButton = document.querySelector("[data-demo-login]");
  const sampleLookupButton = document.querySelector("[data-sample-lookup]");
  const params = new URLSearchParams(window.location.search);

  function activateTab(tabId) {
    tabButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.authTabTarget === tabId);
    });

    panels.forEach((panel) => {
      panel.hidden = panel.dataset.authPanel !== tabId;
    });
  }

  tabRoot.addEventListener("click", (event) => {
    const button = event.target.closest("[data-auth-tab-target]");
    if (!button) {
      return;
    }

    activateTab(button.dataset.authTabTarget || "signin");
  });

  signInForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(signInForm);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "").trim();

    if (!email || !password) {
      showToast("이메일과 비밀번호를 입력해 주세요.", "warning");
      return;
    }

    const name = email.split("@")[0] || "고객";
    setAuthSession({ name, email });
    signInResult.innerHTML = createAuthSuccessCard(
      "Signed in",
      `${name}님으로 로그인 상태를 반영했습니다. 이제 상품 페이지나 결제 페이지로 바로 이동할 수 있습니다.`,
      "products.html?welcome=1",
      "상품 페이지 이동",
      "checkout.html",
      "결제창 열기"
    );
    showToast("로그인 상태가 저장되었습니다.", "success");
  });

  signUpForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(signUpForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "").trim();

    if (!name || !email || password.length < 4) {
      showToast("이름, 이메일, 4자 이상 비밀번호를 확인해 주세요.", "warning");
      return;
    }

    setAuthSession({ name, email });
    signUpResult.innerHTML = createAuthSuccessCard(
      "Account created",
      `${name}님 계정을 생성한 상태로 저장했습니다. 지금 바로 상품 탐색을 이어가실 수 있습니다.`,
      "products.html?welcome=1",
      "가입 후 상품 보기",
      "checkout.html",
      "바로 결제창 보기"
    );
    showToast("회원가입 흐름이 반영되었습니다.", "success");
  });

  lookupForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(lookupForm);
    const orderId = String(formData.get("orderId") || "").trim();
    const lookupValue = String(formData.get("lookupValue") || "").trim();
    renderOrderResult(lookupResult, findOrder(orderId, lookupValue));
  });

  demoLoginButton?.addEventListener("click", () => {
    setAuthSession({ name: "게스트 고객", email: "guest@crypto-commerce.io" });
    signInResult.innerHTML = createAuthSuccessCard(
      "Demo login",
      "게스트 계정으로 빠르게 둘러볼 수 있게 준비했습니다. 상품 비교나 결제 테스트에 바로 들어갈 수 있습니다.",
      "products.html?welcome=1",
      "상품 둘러보기",
      "checkout.html",
      "결제 테스트 하기"
    );
    showToast("체험 계정으로 진입했습니다.", "success");
  });

  sampleLookupButton?.addEventListener("click", () => {
    const latestOrder = getAllOrders()[0];
    const orderIdField = lookupForm?.querySelector("[name='orderId']");
    const lookupValueField = lookupForm?.querySelector("[name='lookupValue']");

    activateTab("lookup");
    if (orderIdField) {
      orderIdField.value = latestOrder.id;
    }
    if (lookupValueField) {
      lookupValueField.value = latestOrder.txid;
    }
    renderOrderResult(lookupResult, latestOrder);
  });

  const initialTab = params.get("tab");
  activateTab(initialTab === "signup" || initialTab === "lookup" ? initialTab : "signin");

  const orderIdFromQuery = params.get("order");
  if (initialTab === "lookup" && orderIdFromQuery) {
    const orderIdField = lookupForm?.querySelector("[name='orderId']");
    if (orderIdField) {
      orderIdField.value = orderIdFromQuery;
    }
  }
}

function createPaymentOptions(selectedMethodId) {
  return PAYMENT_METHODS.map((method) => {
    const activeClass = method.id === selectedMethodId ? " is-active" : "";
    const checked = method.id === selectedMethodId ? "checked" : "";

    return `
      <label class="payment-option${activeClass}">
        <input type="radio" name="paymentMethod" value="${method.id}" ${checked}>
        <div class="payment-icon">
          <i data-lucide="${method.icon}"></i>
        </div>
        <div class="mt-4">
          <p class="text-sm font-semibold text-slate-900">${method.label}</p>
          <p class="mt-2 text-sm leading-6 text-slate-600">${method.description}</p>
          <p class="mt-3 text-xs font-semibold text-emerald-700">${method.highlight}</p>
        </div>
      </label>
    `;
  }).join("");
}

function createPaymentPanels(selectedMethodId, auth) {
  return `
    <div class="payment-panel ${selectedMethodId === "card" ? "is-active" : ""}" data-method-panel="card">
      <div class="grid gap-4 md:grid-cols-2">
        <div class="field">
          <span>카드 소유자명</span>
          <input type="text" name="cardName" placeholder="홍길동" value="${auth?.name || ""}">
        </div>
        <div class="field">
          <span>카드 번호</span>
          <input type="text" name="cardNumber" placeholder="1234 5678 9012 3456">
        </div>
        <div class="field">
          <span>유효기간</span>
          <input type="text" name="cardExpiry" placeholder="MM/YY">
        </div>
        <div class="field">
          <span>CVC</span>
          <input type="password" name="cardCvc" placeholder="123">
        </div>
      </div>
    </div>

    <div class="payment-panel ${selectedMethodId === "coin" ? "is-active" : ""}" data-method-panel="coin">
      <div class="grid gap-4 md:grid-cols-2">
        <div class="field">
          <span>결제 네트워크</span>
          <select name="coinNetwork">
            <option value="">네트워크 선택</option>
            <option value="TRC20">TRC20</option>
            <option value="ERC20">ERC20</option>
          </select>
        </div>
        <div class="field">
          <span>TXID 또는 전송 해시</span>
          <input type="text" name="coinTxid" placeholder="0x 또는 해시값 입력">
        </div>
      </div>
      <div class="mt-4 rounded-[22px] border border-slate-200 bg-slate-50 p-4">
        <p class="text-sm font-semibold text-slate-900">수취 주소</p>
        <p class="mt-2 break-all text-sm text-slate-600" data-wallet-address>TVm7e2Xf7q8QKqStorefrontDemo4MVP</p>
        <div class="mt-4 flex flex-wrap gap-3">
          <button type="button" class="button-ghost" data-copy-address>주소 복사</button>
          <span class="chip">지원 네트워크: TRC20 / ERC20</span>
        </div>
      </div>
    </div>

    <div class="payment-panel ${selectedMethodId === "toss" ? "is-active" : ""}" data-method-panel="toss">
      <div class="grid gap-4 md:grid-cols-2">
        <div class="field">
          <span>이름</span>
          <input type="text" name="tossName" placeholder="결제자 이름" value="${auth?.name || ""}">
        </div>
        <div class="field">
          <span>휴대폰 번호</span>
          <input type="tel" name="tossPhone" placeholder="010-1234-5678">
        </div>
      </div>
      <p class="mt-4 text-sm leading-6 text-slate-600">결제 버튼을 누르면 토스페이 승인 요청을 보내는 시뮬레이션 상태 카드가 생성됩니다.</p>
    </div>

    <div class="payment-panel ${selectedMethodId === "kakao" ? "is-active" : ""}" data-method-panel="kakao">
      <div class="grid gap-4 md:grid-cols-2">
        <div class="field">
          <span>이름</span>
          <input type="text" name="kakaoName" placeholder="결제자 이름" value="${auth?.name || ""}">
        </div>
        <div class="field">
          <span>휴대폰 번호</span>
          <input type="tel" name="kakaoPhone" placeholder="010-1234-5678">
        </div>
      </div>
      <p class="mt-4 text-sm leading-6 text-slate-600">카카오페이 알림 승인 방식으로 동작하는 시뮬레이션 결제창입니다.</p>
    </div>
  `;
}

function createSelectedProductPanel(product, quantity) {
  return `
    <div
      class="rounded-[26px] border border-slate-200 bg-white p-5"
      data-product-card
      data-product-id="${product.id}"
      data-krw="${product.priceKrw}"
      data-old-krw="${product.oldPriceKrw || 0}"
    >
      <div class="grid gap-5 md:grid-cols-[220px_minmax(0,1fr)]">
        <div class="market-media rounded-[24px]" style="background:${product.surface}">
          <span class="rank-badge">${product.accentLabel}</span>
          <span class="delivery-badge">${product.shipping}</span>
          <div class="market-art">
            ${getProductArt(product)}
          </div>
        </div>

        <div class="flex flex-col gap-4">
          <div>
            <p class="eyebrow text-emerald-700">${product.brand} · ${product.category}</p>
            <h3 class="mt-2 text-2xl font-semibold text-slate-950">${product.title}</h3>
            <p class="mt-3 text-sm leading-7 text-slate-600">${product.description}</p>
          </div>

          <div class="market-price-box">
            <p class="market-old-price" data-old>${product.oldPriceKrw > product.priceKrw ? formatKrw(product.oldPriceKrw) : ""}</p>
            <p class="market-current-price" data-price>${formatKrw(product.priceKrw)}</p>
            <p class="market-usdt" data-usdt>${formatUsdt(product.priceKrw / currentRate)}</p>
          </div>

          <div class="flex flex-wrap items-center justify-between gap-4">
            <div class="quantity-controls">
              <button type="button" data-qty="decrease">-</button>
              <span>${quantity}</span>
              <button type="button" data-qty="increase">+</button>
            </div>

            <div class="flex flex-wrap gap-2">
              ${product.tags.map((tag) => `<span class="market-tag">${tag}</span>`).join("")}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function buildOrderId() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const random = String(Math.floor(Math.random() * 900) + 100);

  return `CC-${yyyy}-${mm}${dd}-${random}`;
}

function createSuccessResult(order, methodLabel) {
  return `
    <div class="success-card">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p class="eyebrow text-emerald-700">Payment complete</p>
          <h3 class="mt-2 text-xl font-semibold text-slate-950">${order.id}</h3>
        </div>
        <span class="status-pill ${getStatusTone(order.status)}">${order.status}</span>
      </div>

      <div class="mt-5 grid gap-3 text-sm text-slate-700">
        <p><strong>결제 수단</strong> ${methodLabel}</p>
        <p><strong>안내</strong> ${order.statusDetail}</p>
        <p><strong>결제 금액</strong> ${formatKrw(order.amountKrw)} / ${formatUsdt(order.amountUsdt)}</p>
      </div>

      <div class="mt-6 flex flex-wrap gap-3">
        <a href="login.html?tab=lookup&order=${order.id}" class="button-secondary">주문 조회하기</a>
        <a href="products.html" class="button-ghost">다른 상품 보기</a>
      </div>
    </div>
  `;
}

function initCheckoutPage() {
  const selectedProductRoot = document.querySelector("[data-selected-product]");
  if (!selectedProductRoot) {
    return;
  }

  const paymentOptionsRoot = document.querySelector("[data-payment-options]");
  const paymentPanelsRoot = document.querySelector("[data-payment-panels]");
  const orderSummaryRoot = document.querySelector("[data-order-summary]");
  const checkoutForm = document.querySelector("[data-checkout-form]");
  const checkoutResult = document.querySelector("[data-checkout-result]");
  const agreement = document.querySelector("[data-checkout-agreement]");

  let productId = getActiveProductId();
  let quantity = getCartItem(productId)?.qty || 1;
  let selectedMethod = "card";

  function syncSelection() {
    setSelectedProduct(productId);
    setCartQuantity(productId, quantity);
  }

  function renderSummary() {
    const product = getProductById(productId);
    const subtotalKrw = product.priceKrw * quantity;
    const totalUsdt = subtotalKrw / currentRate;
    const methodLabel = PAYMENT_METHODS.find((method) => method.id === selectedMethod)?.label || "카드 결제";

    orderSummaryRoot.innerHTML = `
      <div class="summary-list">
        <div class="summary-row">
          <span>선택 상품</span>
          <strong>${product.title}</strong>
        </div>
        <div class="summary-row">
          <span>수량</span>
          <strong>${quantity}개</strong>
        </div>
        <div class="summary-row">
          <span>상품 금액</span>
          <strong>${formatKrw(subtotalKrw)}</strong>
        </div>
        <div class="summary-row">
          <span>예상 USDT</span>
          <strong>${formatUsdt(totalUsdt)}</strong>
        </div>
        <div class="summary-row">
          <span>선택 결제 수단</span>
          <strong>${methodLabel}</strong>
        </div>
        <div class="summary-row is-total">
          <span>최종 결제</span>
          <strong>${selectedMethod === "coin" ? formatUsdt(totalUsdt) : formatKrw(subtotalKrw)}</strong>
        </div>
      </div>
    `;
  }

  function renderSelectedProductCard() {
    const product = getProductById(productId);

    selectedProductRoot.innerHTML = createSelectedProductPanel(product, quantity);
    refreshProductPriceNodes();
    refreshIcons();
  }

  function renderPaymentSection() {
    const auth = readStorage().auth;

    paymentOptionsRoot.innerHTML = createPaymentOptions(selectedMethod);
    paymentPanelsRoot.innerHTML = createPaymentPanels(selectedMethod, auth);
    refreshIcons();
  }

  function validatePayment() {
    const formData = new FormData(checkoutForm);

    if (!agreement?.checked) {
      return { ok: false, message: "결제 금액과 수단을 확인한 뒤 동의해 주세요." };
    }

    if (selectedMethod === "card") {
      const requiredFields = ["cardName", "cardNumber", "cardExpiry", "cardCvc"];
      const missing = requiredFields.some((field) => !String(formData.get(field) || "").trim());
      return missing ? { ok: false, message: "카드 결제 정보를 모두 입력해 주세요." } : { ok: true };
    }

    if (selectedMethod === "coin") {
      const network = String(formData.get("coinNetwork") || "").trim();
      const txid = String(formData.get("coinTxid") || "").trim();
      return !network || !txid
        ? { ok: false, message: "코인 결제는 네트워크와 TXID 입력이 필요합니다." }
        : { ok: true };
    }

    if (selectedMethod === "toss") {
      const name = String(formData.get("tossName") || "").trim();
      const phone = String(formData.get("tossPhone") || "").trim();
      return !name || !phone
        ? { ok: false, message: "토스페이 결제자 이름과 휴대폰 번호를 입력해 주세요." }
        : { ok: true };
    }

    if (selectedMethod === "kakao") {
      const name = String(formData.get("kakaoName") || "").trim();
      const phone = String(formData.get("kakaoPhone") || "").trim();
      return !name || !phone
        ? { ok: false, message: "카카오페이 결제자 이름과 휴대폰 번호를 입력해 주세요." }
        : { ok: true };
    }

    return { ok: true };
  }

  selectedProductRoot.addEventListener("click", (event) => {
    const button = event.target.closest("[data-qty]");
    if (!button) {
      return;
    }

    quantity = button.dataset.qty === "increase" ? quantity + 1 : Math.max(1, quantity - 1);
    syncSelection();
    renderSelectedProductCard();
    renderSummary();
  });

  paymentOptionsRoot.addEventListener("change", (event) => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) {
      return;
    }

    selectedMethod = input.value;
    renderPaymentSection();
    renderSummary();
  });

  paymentPanelsRoot.addEventListener("click", async (event) => {
    const copyButton = event.target.closest("[data-copy-address]");
    if (!copyButton) {
      return;
    }

    const addressNode = paymentPanelsRoot.querySelector("[data-wallet-address]");
    const address = addressNode?.textContent || "";

    try {
      await navigator.clipboard.writeText(address);
      showToast("지갑 주소를 복사했습니다.", "success");
    } catch (error) {
      showToast("복사 권한이 없어 주소를 직접 선택해 주세요.", "warning");
    }
  });

  checkoutForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const validation = validatePayment();

    if (!validation.ok) {
      showToast(validation.message, "warning");
      return;
    }

    const product = getProductById(productId);
    const method = PAYMENT_METHODS.find((item) => item.id === selectedMethod);
    const totalKrw = product.priceKrw * quantity;
    const totalUsdt = Number((totalKrw / currentRate).toFixed(2));
    const formData = new FormData(checkoutForm);

    const order = {
      id: buildOrderId(),
      email: readStorage().auth?.email || "",
      txid: selectedMethod === "coin"
        ? String(formData.get("coinTxid") || "").trim()
        : `${selectedMethod.toUpperCase()}-${Math.floor(Math.random() * 9000) + 1000}`,
      customerName: readStorage().auth?.name
        || String(formData.get("cardName") || formData.get("tossName") || formData.get("kakaoName") || "고객").trim(),
      productId: product.id,
      productTitle: product.title,
      methodLabel: method?.label || "카드 결제",
      status: selectedMethod === "coin" ? "입금 확인 대기" : "결제 승인 완료",
      statusDetail: selectedMethod === "coin"
        ? "TXID를 기준으로 입금 확인 후 주문 상태가 갱신됩니다."
        : "승인 완료 상태로 주문 접수가 반영되었습니다.",
      amountKrw: totalKrw,
      amountUsdt: totalUsdt,
      createdAt: new Date().toISOString()
    };

    saveOrder(order);
    checkoutResult.innerHTML = createSuccessResult(order, method?.label || "카드 결제");
    showToast("결제 시뮬레이션이 완료되었습니다.", "success");
  });

  window.addEventListener("cc:pricing-changed", renderSummary);

  syncSelection();
  renderSelectedProductCard();
  renderPaymentSection();
  renderSummary();
}

function initSharedPageState() {
  updateYear();
  updateQuoteWindowText();
  updateHeaderState();
  refreshReferenceRate(currentRate);
  refreshProductPriceNodes();
  refreshLiveRate();
  window.setInterval(refreshLiveRate, RATE_REFRESH_INTERVAL_MS);
}

document.addEventListener("DOMContentLoaded", () => {
  initSharedPageState();
  bindProductActions();
  initHomePage();
  initLoginPage();
  initProductsPage();
  initCheckoutPage();
  refreshIcons();
});
