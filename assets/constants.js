// Essential constants and utilities for Shopify theme

const ON_CHANGE_DEBOUNCE_TIMER = 300;

const PUB_SUB_EVENTS = {
  cartUpdate: 'cart-update',
  quantityUpdate: 'quantity-update',
  variantChange: 'variant-change',
  cartError: 'cart-error',
};

let subscribers = {};

function subscribe(eventName, callback) {
  if (subscribers[eventName] === undefined) {
    subscribers[eventName] = [];
  }

  subscribers[eventName] = [...subscribers[eventName], callback];

  return function unsubscribe() {
    subscribers[eventName] = subscribers[eventName].filter((cb) => {
      return cb !== callback;
    });
  };
}

function publish(eventName, data) {
  if (subscribers[eventName]) {
    subscribers[eventName].forEach((callback) => {
      callback(data);
    });
  }
}

// Fetch configuration helper
function fetchConfig(type = 'json') {
  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': `application/${type}`,
    },
  };
}

// Debounce function
function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

// Throttle function  
function throttle(fn, delay) {
  let timeoutID;
  let lastExec = 0;
  return function (...args) {
    const elapsed = Date.now() - lastExec;
    clearTimeout(timeoutID);
    if (elapsed > delay) {
      fn.apply(this, args);
      lastExec = Date.now();
    } else {
      timeoutID = setTimeout(() => {
        fn.apply(this, args);
        lastExec = Date.now();
      }, delay - elapsed);
    }
  };
}

// Animation frame helpers
function raf(fn) {
  return window.requestAnimationFrame ? window.requestAnimationFrame(fn) : setTimeout(fn, 16);
}

function caf(id) {
  return window.cancelAnimationFrame ? window.cancelAnimationFrame(id) : clearTimeout(id);
}

// Media query helpers
const mediaQueries = {
  mobile: '(max-width: 749px)',
  tablet: '(min-width: 750px) and (max-width: 989px)', 
  desktop: '(min-width: 990px)',
};

function matchMedia(query) {
  return window.matchMedia(query).matches;
}

// Scroll helpers
function getScrollTop() {
  return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
}

function isScrollingDown(currentScrollTop, lastScrollTop) {
  return currentScrollTop > lastScrollTop;
}

// Element helpers
function getHeight(el) {
  return parseInt(window.getComputedStyle(el).height, 10);
}

function getWidth(el) {
  return parseInt(window.getComputedStyle(el).width, 10);
}

function isVisible(el) {
  return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
}

// Animation helpers
function fadeIn(el, duration = 300) {
  el.style.opacity = 0;
  el.style.display = 'block';

  const start = performance.now();

  function animate(time) {
    const elapsed = time - start;
    const progress = elapsed / duration;

    if (progress < 1) {
      el.style.opacity = progress;
      requestAnimationFrame(animate);
    } else {
      el.style.opacity = 1;
    }
  }

  requestAnimationFrame(animate);
}

function fadeOut(el, duration = 300) {
  const start = performance.now();
  const startOpacity = parseFloat(window.getComputedStyle(el).opacity);

  function animate(time) {
    const elapsed = time - start;
    const progress = elapsed / duration;

    if (progress < 1) {
      el.style.opacity = startOpacity * (1 - progress);
      requestAnimationFrame(animate);
    } else {
      el.style.opacity = 0;
      el.style.display = 'none';
    }
  }

  requestAnimationFrame(animate);
}

// Cookie helpers
function setCookie(name, value, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

function getCookie(name) {
  return document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=');
    return parts[0] === name ? decodeURIComponent(parts[1]) : r;
  }, '');
}

// Form helpers
function serializeForm(form) {
  const obj = {};
  const formData = new FormData(form);
  for (const key of formData.keys()) {
    obj[key] = formData.get(key);
  }
  return obj;
}

// URL helpers
function updateSearchParams(key, value) {
  const url = new URL(window.location);
  if (value) {
    url.searchParams.set(key, value);
  } else {
    url.searchParams.delete(key);
  }
  window.history.replaceState({}, '', url);
}

// Storage helpers (with fallback for environments without localStorage)
const storage = {
  get(key) {
    try {
      return localStorage ? localStorage.getItem(key) : getCookie(key);
    } catch (e) {
      return getCookie(key);
    }
  },
  
  set(key, value) {
    try {
      if (localStorage) {
        localStorage.setItem(key, value);
      } else {
        setCookie(key, value);
      }
    } catch (e) {
      setCookie(key, value);
    }
  },
  
  remove(key) {
    try {
      if (localStorage) {
        localStorage.removeItem(key);
      } else {
        setCookie(key, '', -1);
      }
    } catch (e) {
      setCookie(key, '', -1);
    }
  }
};

// Export for global use
window.theme = {
  pubsub: { subscribe, publish, PUB_SUB_EVENTS },
  utils: { debounce, throttle, raf, caf, fetchConfig },
  media: { mediaQueries, matchMedia },
  scroll: { getScrollTop, isScrollingDown },
  element: { getHeight, getWidth, isVisible, fadeIn, fadeOut },
  storage,
  form: { serializeForm },
  url: { updateSearchParams }
};