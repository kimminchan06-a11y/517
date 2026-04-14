document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) {
    lucide.createIcons();
  }

  const FALLBACK_RATE = 1502;
  const RATE_REFRESH_INTERVAL_MS = 30000;
  const QUOTE_WINDOW_MINUTES = 10;
  const krwFormatter = new Intl.NumberFormat("ko-KR");
  const rateFormatter = new Intl.NumberFormat("ko-KR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
  const usdtFormatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  const timeFormatter = new Intl.DateTimeFormat("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });
  const referenceRateNodes = document.querySelectorAll("[data-reference-rate]");
  const rateMetaNodes = document.querySelectorAll("[data-rate-meta]");
  const productCards = document.querySelectorAll("[data-product-card]");
  let currentRate = FALLBACK_RATE;
  let isRateRequestInFlight = false;

  const renderReferenceRate = (rate) => {
    referenceRateNodes.forEach((node) => {
      node.textContent = `1 USDT = ₩${rateFormatter.format(rate)}`;
    });
  };

  const renderRateMeta = (message) => {
    rateMetaNodes.forEach((node) => {
      node.textContent = message;
    });
  };

  document.querySelectorAll("[data-quote-window]").forEach((node) => {
    node.textContent = `견적 고정 ${QUOTE_WINDOW_MINUTES}분`;
  });

  const renderProductPrices = () => {
    productCards.forEach((card) => {
      const currentKrw = Number(card.dataset.krw || 0);
      const oldKrw = Number(card.dataset.oldKrw || 0);
      const price = card.querySelector("[data-price]");
      const old = card.querySelector("[data-old]");
      const usdt = card.querySelector("[data-usdt]");
      const savings = card.querySelector("[data-savings]");

      if (old && oldKrw > 0) {
        old.textContent = `₩${krwFormatter.format(oldKrw)}`;
      }

      if (price) {
        price.textContent = `₩${krwFormatter.format(currentKrw)}`;
      }

      if (usdt) {
        usdt.textContent = `≈ ${usdtFormatter.format(currentKrw / currentRate)} USDT`;
      }

      if (savings && oldKrw > 0) {
        const percent = Math.round((1 - currentKrw / oldKrw) * 100);
        savings.textContent = `${percent}% 절약`;
      }
    });
  };

  const applyLiveRate = ({ rate, source, updatedAt }) => {
    if (!Number.isFinite(rate) || rate <= 0) {
      return;
    }

    currentRate = rate;
    renderReferenceRate(currentRate);

    const timestamp = updatedAt ? timeFormatter.format(new Date(updatedAt)) : timeFormatter.format(new Date());
    renderRateMeta(`${source} 기준 · ${timestamp} 업데이트`);
    renderProductPrices();
  };

  const applyFallbackRate = () => {
    renderReferenceRate(currentRate);
    renderRateMeta("실시간 조회 실패 · 마지막 기준값 표시");
    renderProductPrices();
  };

  const fetchJsonWithTimeout = async (url, options = {}) => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(url, {
        ...options,
        cache: "no-store",
        signal: controller.signal,
        headers: {
          Accept: "application/json",
          ...(options.headers || {})
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return response.json();
    } finally {
      window.clearTimeout(timeoutId);
    }
  };

  const fetchUpbitRate = async () => {
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
  };

  const fetchCoinGeckoRate = async () => {
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
  };

  const refreshLiveRate = async () => {
    if (isRateRequestInFlight) {
      return;
    }

    isRateRequestInFlight = true;
    renderRateMeta("실시간 환율을 확인하는 중...");

    try {
      const rateData = await fetchUpbitRate().catch(() => fetchCoinGeckoRate());
      applyLiveRate(rateData);
    } catch (error) {
      console.error("Failed to refresh live rate", error);
      applyFallbackRate();
    } finally {
      isRateRequestInFlight = false;
    }
  };

  renderReferenceRate(currentRate);
  renderProductPrices();
  refreshLiveRate();
  window.setInterval(refreshLiveRate, RATE_REFRESH_INTERVAL_MS);

  const rail = document.querySelector("[data-carousel-rail]");
  const prevButtons = document.querySelectorAll("[data-carousel-prev]");
  const nextButtons = document.querySelectorAll("[data-carousel-next]");

  const updateCarouselButtons = () => {
    if (!rail) {
      return;
    }

    const nearStart = rail.scrollLeft <= 8;
    const nearEnd = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 8;

    prevButtons.forEach((button) => {
      button.disabled = nearStart;
    });

    nextButtons.forEach((button) => {
      button.disabled = nearEnd;
    });
  };

  const scrollCarousel = (direction) => {
    if (!rail) {
      return;
    }

    const firstCard = rail.querySelector(".product-card");
    const amount = firstCard ? firstCard.getBoundingClientRect().width + 16 : rail.clientWidth * 0.8;

    rail.scrollBy({
      left: direction * amount,
      behavior: "smooth"
    });
  };

  prevButtons.forEach((button) => {
    button.addEventListener("click", () => scrollCarousel(-1));
  });

  nextButtons.forEach((button) => {
    button.addEventListener("click", () => scrollCarousel(1));
  });

  rail?.addEventListener("scroll", updateCarouselButtons, { passive: true });
  window.addEventListener("resize", updateCarouselButtons);
  updateCarouselButtons();

  const toggleDealsButton = document.querySelector("[data-toggle-deals]");
  const extraDeals = document.querySelectorAll("[data-extra-deal]");
  let dealsExpanded = false;

  toggleDealsButton?.addEventListener("click", () => {
    dealsExpanded = !dealsExpanded;
    extraDeals.forEach((card) => {
      card.classList.toggle("hidden", !dealsExpanded);
    });

    toggleDealsButton.textContent = dealsExpanded ? "특가 접기" : "특가 더 보기";
  });

  const year = document.getElementById("year");
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }
});
