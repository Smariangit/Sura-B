/* =========================================================
   CONFIG
   Paste your deployed Apps Script Web App URL here once it's
   live (see SETUP-GUIDE.md). Until then the site runs on the
   sample data below, so it always works for preview/dev.
   ========================================================= */
const CONFIG = {
  MENU_API_URL: 'https://script.google.com/macros/s/AKfycbx56zsAJ-polOPr79IiI5uwp5XndHNwL3-YKDmTky_BRzhxYBP_TGV5yAYlKl-Aty5y0A/exec?type=menu',
  REVIEWS_API_URL: 'https://script.google.com/macros/s/AKfycbx56zsAJ-polOPr79IiI5uwp5XndHNwL3-YKDmTky_BRzhxYBP_TGV5yAYlKl-Aty5y0A/exec?type=reviews',
  ORDER_API_URL: 'https://script.google.com/macros/s/AKfycbx56zsAJ-polOPr79IiI5uwp5XndHNwL3-YKDmTky_BRzhxYBP_TGV5yAYlKl-Aty5y0A/exec',
};

/* Fallback sample data — mirrors exactly what the Google Sheet
   columns produce, so swapping in the live sheet later needs
   no code changes. */
/* `image` follows the local convention media/<id>.jpg — drop your
   Media folder in as /media next to index.html with files named
   to match (bwn-1.jpg, cak-2.jpg, etc.) and every photo below
   picks itself up automatically. Missing files fall back to a
   clean icon tile instead of a broken-image box — see
   SETUP-GUIDE.md for exact naming and for using the Sheet's
   ImageUrl column instead, once that's connected. */
const FALLBACK_MENU = [
  { id: 'bwn-1', name: 'Fudge Walnut Brownie', category: 'brownies', price: 90, desc: 'Dense dark-chocolate fudge, toasted walnuts.', available: true, image: 'media/bwn-1.jpg' },
  { id: 'bwn-2', name: 'Salted Caramel Brownie', category: 'brownies', price: 110, tag: 'Bestseller', desc: 'Molten caramel core, flaked sea salt.', available: true, image: 'media/bwn-2.jpg' },
  { id: 'bwn-3', name: 'Bombay Choc-Chunk Brownie', category: 'brownies', price: 100, desc: 'Extra-dark cocoa, chunks not chips.', available: false, image: 'media/bwn-3.jpg' },

  { id: 'cak-1', name: 'Belgian Truffle Cake', category: 'cakes', price: 750, desc: 'Layered dark chocolate ganache, half or full kg.', available: true, image: 'media/cak-1.jpg' },
  { id: 'cak-2', name: 'Pista Rose Cake', category: 'cakes', price: 800, tag: 'Signature', desc: 'Pistachio sponge, rose cream, edible petals.', available: true, image: 'media/cak-2.jpg' },
  { id: 'cak-3', name: 'Red Velvet Bloom', category: 'cakes', price: 700, desc: 'Classic red velvet, cream-cheese frosting.', available: true, image: 'media/cak-3.jpg' },

  { id: 'lad-1', name: 'Besan Laddu', category: 'laddus', price: 40, desc: 'Roasted gram flour, ghee, cardamom. Priced per piece.', available: true, image: 'media/lad-1.jpg' },
  { id: 'lad-2', name: 'Motichoor Laddu', category: 'laddus', price: 45, desc: 'Fine boondi, saffron syrup. Priced per piece.', available: true, image: 'media/lad-2.jpg' },
  { id: 'lad-3', name: 'Coconut Laddu', category: 'laddus', price: 35, desc: 'Fresh coconut, condensed milk. Priced per piece.', available: true, image: 'media/lad-3.jpg' },

  { id: 'muf-1', name: 'Double Choc Muffin', category: 'muffins', price: 70, desc: 'Cocoa batter, dark chocolate chips.', available: true, image: 'media/muf-1.jpg' },
  { id: 'muf-2', name: 'Banana Walnut Muffin', category: 'muffins', price: 65, desc: 'Overripe banana, toasted walnut.', available: true, image: 'media/muf-2.jpg' },
  { id: 'muf-3', name: 'Blueberry Muffin', category: 'muffins', price: 75, desc: 'Whole blueberries, a little lemon zest.', available: false, image: 'media/muf-3.jpg' },

  { id: 'coo-1', name: 'Jeera Butter Cookies', category: 'cookies', price: 30, desc: 'Toasted cumin, ghee, a shop classic. Priced per piece.', available: true, image: 'media/coo-1.jpg' },
  { id: 'coo-2', name: 'Choc Chip Cookies', category: 'cookies', price: 35, desc: 'Crisp edges, soft centre. Priced per piece.', available: true, image: 'media/coo-2.jpg' },
  { id: 'coo-3', name: 'Nan Khatai', category: 'cookies', price: 25, desc: 'Traditional semolina shortbread. Priced per piece.', available: true, image: 'media/coo-3.jpg' },
];

const FALLBACK_REVIEWS = [
  { name: 'Ritika S.', dish: 'Pista Rose Cake', text: "Ordered this for my mother's birthday. It arrived exactly when promised and looked even better than the photos." },
  { name: 'Aman K.', dish: 'Salted Caramel Brownie', text: 'The caramel centre is no joke. Ordered a dozen for the office and they were gone in ten minutes.' },
  { name: 'Priya M.', dish: 'Besan Laddu', text: 'Tastes exactly like my grandmother used to make. Ordering these every festival from now on.' },
];

const ICONS = {
  brownies: `<svg viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="9" y="18" width="36" height="24" rx="2" stroke="currentColor" stroke-width="2"/><path d="M9 26h36M20 18v24M34 18v24" stroke="currentColor" stroke-width="1.4" opacity=".6"/><path d="M15 13c1-3 3-3 4-1s3 2 4 0 3-3 4-1 3 2 4 0 3-3 4-1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  cakes: `<svg viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 30l18-14 18 14v10a2 2 0 0 1-2 2H11a2 2 0 0 1-2-2V30Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 30h36" stroke="currentColor" stroke-width="1.4" opacity=".6"/><path d="M27 16V9m0 0c-2 0-3-1.5-3-3s1.5-3 3-3 3 1.5 3 3-1 3-3 3Z" stroke="currentColor" stroke-width="1.6"/></svg>`,
  laddus: `<svg viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="27" cy="29" r="15" stroke="currentColor" stroke-width="2"/><circle cx="22" cy="24" r="1.6" fill="currentColor"/><circle cx="31" cy="22" r="1.6" fill="currentColor"/><circle cx="33" cy="31" r="1.6" fill="currentColor"/><circle cx="24" cy="34" r="1.6" fill="currentColor"/><circle cx="20" cy="30" r="1.6" fill="currentColor"/></svg>`,
  muffins: `<svg viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 24c1-6 5-9 14-9s13 3 14 9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M11 24h32l-3 18a3 3 0 0 1-3 2.6H17a3 3 0 0 1-3-2.6L11 24Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M15 24l1 18M39 24l-1 18" stroke="currentColor" stroke-width="1.2" opacity=".5"/></svg>`,
  cookies: `<svg viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="27" cy="27" r="16" stroke="currentColor" stroke-width="2"/><circle cx="21" cy="22" r="1.7" fill="currentColor"/><circle cx="31" cy="20" r="1.7" fill="currentColor"/><circle cx="33" cy="30" r="1.7" fill="currentColor"/><circle cx="23" cy="33" r="1.7" fill="currentColor"/></svg>`,
};

const CATEGORY_LABEL = { brownies: 'Brownies', cakes: 'Cakes', laddus: 'Laddus', muffins: 'Muffins', cookies: 'Cookies' };

let MENU = [];
let cart = {}; // id -> qty

/* ---------- data loading (Sheet if configured, else fallback) ---------- */
async function loadMenu() {
  if (!CONFIG.MENU_API_URL) return FALLBACK_MENU;
  try {
    const res = await fetch(CONFIG.MENU_API_URL);
    const data = await res.json();
    return Array.isArray(data) && data.length ? data : FALLBACK_MENU;
  } catch (err) {
    console.warn('Menu API unavailable, using sample menu.', err);
    return FALLBACK_MENU;
  }
}

async function loadReviews() {
  if (!CONFIG.REVIEWS_API_URL) return FALLBACK_REVIEWS;
  try {
    const res = await fetch(CONFIG.REVIEWS_API_URL);
    const data = await res.json();
    return Array.isArray(data) && data.length ? data : FALLBACK_REVIEWS;
  } catch (err) {
    console.warn('Reviews API unavailable, using sample reviews.', err);
    return FALLBACK_REVIEWS;
  }
}

/* ---------- render: menu ---------- */
function renderMenu(filter = 'all') {
  const grid = document.getElementById('menuGrid');
  grid.innerHTML = '';
  MENU.forEach(dish => {
    const el = document.createElement('article');
    el.className = 'dish' + (dish.available ? '' : ' is-unavailable') + (filter !== 'all' && dish.category !== filter ? ' is-hidden' : '');
    el.dataset.category = dish.category;

    const qty = cart[dish.id] || 0;

    el.innerHTML = `
      <div class="dish-photo">
        ${dish.image ? `<img src="${dish.image}" alt="${dish.name}" loading="lazy" onerror="this.remove()">` : ''}
        <span class="dish-photo-fallback">${ICONS[dish.category] || ''}</span>
      </div>
      <div class="dish-content">
        ${dish.tag && dish.available ? `<span class="dish-tag">${dish.tag}</span>` : ''}
        <h3 class="dish-name">${dish.name}</h3>
        <p class="dish-desc">${dish.desc || ''}</p>
        <div class="dish-foot">
          <span class="dish-price">₹${dish.price}</span>
          <div class="dish-controls" data-id="${dish.id}"></div>
        </div>
      </div>
      ${!dish.available ? `<span class="stamp">Sold out today</span>` : ''}
    `;

    const controls = el.querySelector('.dish-controls');
    renderDishControls(controls, dish, qty);

    grid.appendChild(el);
  });
}

function renderDishControls(container, dish, qty) {
  if (!dish.available) {
    container.innerHTML = '';
    return;
  }
  if (qty > 0) {
    container.innerHTML = `
      <div class="dish-qty">
        <button type="button" data-action="dec">&minus;</button>
        <span>${qty}</span>
        <button type="button" data-action="inc">+</button>
      </div>`;
    container.querySelector('[data-action="dec"]').onclick = () => changeQty(dish, -1);
    container.querySelector('[data-action="inc"]').onclick = () => changeQty(dish, 1);
  } else {
    container.innerHTML = `<button type="button" class="dish-add">Add</button>`;
    container.querySelector('.dish-add').onclick = () => changeQty(dish, 1);
  }
}

function changeQty(dish, delta) {
  const current = cart[dish.id] || 0;
  const next = Math.max(0, current + delta);
  if (next === 0) delete cart[dish.id];
  else cart[dish.id] = next;

  const container = document.querySelector(`.dish-controls[data-id="${dish.id}"]`);
  if (container) renderDishControls(container, dish, cart[dish.id] || 0);

  updateTrayCount();
  renderTrayBody();
}

/* ---------- render: reviews ---------- */
function renderReviews(reviews) {
  const grid = document.getElementById('reviewsGrid');
  grid.innerHTML = reviews.map(r => `
    <div class="review-card">
      <div class="review-dish">${r.dish}</div>
      <p class="review-text">&ldquo;${r.text}&rdquo;</p>
      <div class="review-name">${r.name}</div>
    </div>
  `).join('');
}

/* ---------- filters ---------- */
document.getElementById('filterRow').addEventListener('click', (e) => {
  const btn = e.target.closest('.filter-chip');
  if (!btn) return;
  document.querySelectorAll('.filter-chip').forEach(c => {
    c.classList.remove('is-active');
    c.setAttribute('aria-selected', 'false');
  });
  btn.classList.add('is-active');
  btn.setAttribute('aria-selected', 'true');
  renderMenu(btn.dataset.filter);
});

/* ---------- tray / cart panel ---------- */
const trayBtn = document.getElementById('trayBtn');
const trayPanel = document.getElementById('trayPanel');
const trayOverlay = document.getElementById('trayOverlay');
const trayClose = document.getElementById('trayClose');
const trayCount = document.getElementById('trayCount');
const trayBody = document.getElementById('trayBody');
const trayTotal = document.getElementById('trayTotal');
const orderForm = document.getElementById('orderForm');
const traySuccess = document.getElementById('traySuccess');

function cartEntries() {
  return Object.entries(cart)
    .map(([id, qty]) => ({ dish: MENU.find(d => d.id === id), qty }))
    .filter(e => e.dish);
}

function cartTotal() {
  return cartEntries().reduce((sum, e) => sum + e.dish.price * e.qty, 0);
}

function updateTrayCount() {
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  trayCount.hidden = count === 0;
  trayCount.textContent = count;
}

function renderTrayBody() {
  const entries = cartEntries();
  if (entries.length === 0) {
    trayBody.innerHTML = `<p class="tray-empty">Nothing added yet — pick something from today's menu.</p>`;
  } else {
    trayBody.innerHTML = entries.map(e => `
      <div class="tray-item">
        <div>
          <div class="tray-item-name">${e.dish.name} &times; ${e.qty}</div>
          <div class="tray-item-price">₹${e.dish.price * e.qty}</div>
        </div>
        <button type="button" class="tray-item-remove" data-id="${e.dish.id}">Remove</button>
      </div>
    `).join('');
    trayBody.querySelectorAll('.tray-item-remove').forEach(btn => {
      btn.onclick = () => {
        const dish = MENU.find(d => d.id === btn.dataset.id);
        delete cart[dish.id];
        const container = document.querySelector(`.dish-controls[data-id="${dish.id}"]`);
        if (container) renderDishControls(container, dish, 0);
        updateTrayCount();
        renderTrayBody();
      };
    });
  }
  trayTotal.textContent = `Total: ₹${cartTotal()}`;
  const submitBtn = document.getElementById('submitOrderBtn');
  submitBtn.disabled = entries.length === 0;
}

function openTray() {
  trayOverlay.hidden = false;
  trayPanel.hidden = false;
  requestAnimationFrame(() => trayPanel.classList.add('is-open'));
  orderForm.hidden = false;
  traySuccess.hidden = true;
  renderTrayBody();
  document.body.style.overflow = 'hidden';
}
function closeTray() {
  trayPanel.classList.remove('is-open');
  document.body.style.overflow = '';
  setTimeout(() => { trayOverlay.hidden = true; trayPanel.hidden = true; }, 320);
}

trayBtn.addEventListener('click', openTray);
trayClose.addEventListener('click', closeTray);
trayOverlay.addEventListener('click', closeTray);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && trayPanel.classList.contains('is-open')) closeTray(); });

/* ---------- order submission (one-way: fires the request, then
   confirms on-screen — no reply email is expected or waited on) ---------- */
orderForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const entries = cartEntries();
  if (entries.length === 0) return;

  const formData = new FormData(orderForm);
  const payload = {
    name: formData.get('name'),
    phone: formData.get('phone'),
    address: formData.get('address'),
    date: formData.get('date'),
    slot: formData.get('slot'),
    notes: formData.get('notes'),
    total: cartTotal(),
    items: entries.map(e => ({ name: e.dish.name, qty: e.qty, price: e.dish.price })),
    submittedAt: new Date().toISOString(),
  };

  const submitBtn = document.getElementById('submitOrderBtn');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';

  try {
    if (CONFIG.ORDER_API_URL) {
      // text/plain avoids a CORS preflight against Apps Script;
      // no-cors means we can't read the response, so we confirm
      // optimistically once the request has been dispatched.
      await fetch(CONFIG.ORDER_API_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      });
    } else {
      console.info('ORDER_API_URL not set — order captured locally only:', payload);
    }
  } catch (err) {
    console.warn('Order request failed to dispatch:', err);
  }

  document.getElementById('successPhone').textContent = payload.phone;
  orderForm.hidden = true;
  traySuccess.hidden = false;

  cart = {};
  updateTrayCount();
  renderMenu(document.querySelector('.filter-chip.is-active')?.dataset.filter || 'all');

  submitBtn.disabled = false;
  submitBtn.textContent = 'Send order to the kitchen';
  orderForm.reset();
});

document.getElementById('trayDone').addEventListener('click', closeTray);

/* ---------- mobile nav ---------- */
const navToggle = document.getElementById('navToggle');
const mobileNav = document.getElementById('mobileNav');
navToggle.addEventListener('click', () => {
  const isOpen = !mobileNav.hidden;
  mobileNav.hidden = isOpen;
  navToggle.setAttribute('aria-expanded', String(!isOpen));
});
mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { mobileNav.hidden = true; navToggle.setAttribute('aria-expanded', 'false'); }));

/* ---------- scroll reveal for "how it works" ---------- */
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('is-visible'), i * 90);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.reveal-on-scroll').forEach(el => revealObserver.observe(el));
} else {
  // no IntersectionObserver support — show the steps immediately rather
  // than leaving them permanently invisible
  document.querySelectorAll('.reveal-on-scroll').forEach(el => el.classList.add('is-visible'));
}

/* ---------- misc ---------- */
document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- init (menu + reviews) ----------
   Runs independently of the enhancements above, and is wrapped so a
   failure here surfaces in the console instead of silently leaving
   the page blank. */
(async function init() {
  try {
    const [menu, reviews] = await Promise.all([loadMenu(), loadReviews()]);
    MENU = menu;
    renderMenu('all');
    renderReviews(reviews);
    updateTrayCount();
  } catch (err) {
    console.error('Failed to initialize menu/reviews:', err);
  }
})();
