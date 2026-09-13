/* =========================================================
   CONFIG
   Paste your deployed Apps Script Web App URL here once it's
   live (see SETUP-GUIDE.md). Until then the site runs on the
   sample data below, so it always works for preview/dev.
   ========================================================= */
const CONFIG = {
  MENU_API_URL: 'https://script.google.com/macros/s/AKfycbxU8qAYph3woQjz4OFIQOya-VtxqqsHIg39N623r2HjVSghXhba9YunppUczNnfedZh7Q/exec?type=menu',
  REVIEWS_API_URL: 'https://script.google.com/macros/s/AKfycbxU8qAYph3woQjz4OFIQOya-VtxqqsHIg39N623r2HjVSghXhba9YunppUczNnfedZh7Q/exec?type=reviews',
  ORDER_API_URL:   'https://script.google.com/macros/s/AKfycbxU8qAYph3woQjz4OFIQOya-VtxqqsHIg39N623r2HjVSghXhba9YunppUczNnfedZh7Q/exec',
  // Same deployed script, just a different type — add a "Blocked Dates"
  // tab to the Sheet (Start Date | End Date | Reason) and this picks it
  // up automatically once Code.gs has the matching doGet branch.
  BLOCKED_DATES_API_URL: 'https://script.google.com/macros/s/AKfycbxU8qAYph3woQjz4OFIQOya-VtxqqsHIg39N623r2HjVSghXhba9YunppUczNnfedZh7Q/exec?type=blocked',
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

// No blocks by default — until the Sheet's "Blocked Dates" tab has rows,
// or if that request fails, every day is open for ordering.
const FALLBACK_BLOCKED_DATES = [];

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

async function loadBlockedDates() {
  if (!CONFIG.BLOCKED_DATES_API_URL) return FALLBACK_BLOCKED_DATES;
  try {
    const res = await fetch(CONFIG.BLOCKED_DATES_API_URL);
    const data = await res.json();
    // Unlike menu/reviews, an empty array here is a legitimate real
    // state (no blocked dates right now) — only fall back on an
    // actual failure, not on a valid empty result.
    return Array.isArray(data) ? data : FALLBACK_BLOCKED_DATES;
  } catch (err) {
    console.warn('Blocked dates API unavailable, assuming no blocks.', err);
    return FALLBACK_BLOCKED_DATES;
  }
}

/* ---------- render: menu ---------- */
function renderMenu(filter = 'all') {
  const grid = document.getElementById('menuGrid');
  if (!grid) return; // this page (e.g. gallery.html) doesn't have a menu grid
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
/* ---------- reviews carousel ---------- */
let REVIEW_ITEMS = [];
let reviewIndex = 0;
let reviewAutoTimer = null;

function renderReviews(reviews) {
  const slide = document.getElementById('reviewsSlide');
  if (!slide) return; // this page doesn't have a reviews carousel
  REVIEW_ITEMS = reviews;
  reviewIndex = 0;
  renderReviewSlide();
  renderReviewDots();
  restartReviewAutoplay();
}

function renderReviewSlide() {
  const slide = document.getElementById('reviewsSlide');
  if (!slide || !REVIEW_ITEMS.length) return;
  const r = REVIEW_ITEMS[reviewIndex];
  slide.innerHTML = `
    <div class="review-card">
      <div class="review-dish">${r.dish}</div>
      <p class="review-text">&ldquo;${r.text}&rdquo;</p>
      <div class="review-name">${r.name}</div>
    </div>
  `;
  document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
    dot.classList.toggle('is-active', i === reviewIndex);
  });
}

function renderReviewDots() {
  const dotsEl = document.getElementById('reviewsDots');
  if (!dotsEl) return;
  dotsEl.innerHTML = REVIEW_ITEMS.map((_, i) =>
    `<button type="button" class="carousel-dot${i === 0 ? ' is-active' : ''}" data-index="${i}" aria-label="Go to review ${i + 1}"></button>`
  ).join('');
  dotsEl.querySelectorAll('.carousel-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      reviewIndex = Number(dot.dataset.index);
      renderReviewSlide();
      restartReviewAutoplay();
    });
  });
}

function reviewNext() {
  if (!REVIEW_ITEMS.length) return;
  reviewIndex = (reviewIndex + 1) % REVIEW_ITEMS.length;
  renderReviewSlide();
}
function reviewPrev() {
  if (!REVIEW_ITEMS.length) return;
  reviewIndex = (reviewIndex - 1 + REVIEW_ITEMS.length) % REVIEW_ITEMS.length;
  renderReviewSlide();
}
function restartReviewAutoplay() {
  if (reviewAutoTimer) clearInterval(reviewAutoTimer);
  if (REVIEW_ITEMS.length <= 1) return;
  reviewAutoTimer = setInterval(reviewNext, 6000);
}

function initReviewsCarousel() {
  const prevBtn = document.getElementById('reviewsPrev');
  const nextBtn = document.getElementById('reviewsNext');
  if (!prevBtn || !nextBtn) return; // this page doesn't have a reviews carousel
  prevBtn.addEventListener('click', () => { reviewPrev(); restartReviewAutoplay(); });
  nextBtn.addEventListener('click', () => { reviewNext(); restartReviewAutoplay(); });
}

/* ---------- filters ---------- */
const filterRow = document.getElementById('filterRow');
if (filterRow) {
  filterRow.addEventListener('click', (e) => {
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
}

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

/* ---------- delivery-date calendar ----------
   Blocked ranges come from the "Blocked Dates" sheet tab via
   loadBlockedDates(); BLOCKED_RANGES starts empty (nothing blocked)
   and is filled in once that request resolves — the calendar is
   fully usable even before that happens. */
let BLOCKED_RANGES = [];

function parseISODate(str) {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}
function formatISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}
function findBlockedRange(date) {
  const t = startOfDay(date).getTime();
  return BLOCKED_RANGES.find(r => {
    const start = startOfDay(parseISODate(r.start)).getTime();
    const end = startOfDay(parseISODate(r.end)).getTime();
    return t >= start && t <= end;
  }) || null;
}

/** Builds one independent date-picker widget. Every instance reads
 *  from the same shared BLOCKED_RANGES, so calling .render() on all
 *  of them after blocked dates load keeps every calendar on the page
 *  in sync — there's exactly one source of truth, just multiple
 *  places it's drawn. Past days are always disabled, on every
 *  instance, regardless of blocked dates. */
function createDatePicker(ids) {
  let viewDate = new Date();
  let selectedDate = null;

  function render() {
    const grid = document.getElementById(ids.grid);
    const monthLabel = document.getElementById(ids.monthLabel);
    if (!grid || !monthLabel) return; // this instance isn't on the current page

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    monthLabel.textContent = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const startWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = startOfDay(new Date());

    grid.innerHTML = '';
    for (let i = 0; i < startWeekday; i++) {
      const filler = document.createElement('span');
      filler.className = 'date-cell is-empty';
      grid.appendChild(filler);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const cellDate = new Date(year, month, day);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'date-cell';
      btn.textContent = day;

      const isPast = cellDate.getTime() < today.getTime();
      const blockedRange = findBlockedRange(cellDate);

      if (isPast || blockedRange) {
        btn.disabled = true;
        if (isPast) btn.classList.add('is-past');
        if (blockedRange) {
          btn.classList.add('is-blocked');
          btn.title = blockedRange.reason ? `Fully booked — ${blockedRange.reason}` : 'Fully booked';
        }
      } else {
        btn.addEventListener('click', () => selectDate(cellDate));
      }
      if (cellDate.getTime() === today.getTime()) btn.classList.add('is-today');
      if (selectedDate && cellDate.getTime() === startOfDay(selectedDate).getTime()) {
        btn.classList.add('is-selected');
      }

      grid.appendChild(btn);
    }
  }

  function selectDate(date) {
    selectedDate = date;
    const hidden = document.getElementById(ids.hiddenInput);
    if (hidden) hidden.value = formatISODate(date);
    const label = document.getElementById(ids.label);
    if (label) label.textContent = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    const trigger = document.getElementById(ids.trigger);
    if (trigger) trigger.classList.add('has-value');
    clearError();
    close();
    render();
  }

  function showError(message) {
    if (!ids.errorEl) return;
    const el = document.getElementById(ids.errorEl);
    if (!el) return;
    el.textContent = message;
    el.hidden = false;
  }
  function clearError() {
    if (!ids.errorEl) return;
    const el = document.getElementById(ids.errorEl);
    if (el) el.hidden = true;
  }

  function open() {
    const panel = document.getElementById(ids.panel);
    const trigger = document.getElementById(ids.trigger);
    if (!panel) return;
    panel.hidden = false;
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
    render();
  }
  function close() {
    const panel = document.getElementById(ids.panel);
    const trigger = document.getElementById(ids.trigger);
    if (!panel) return;
    panel.hidden = true;
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  }

  function reset() {
    selectedDate = null;
    const hidden = document.getElementById(ids.hiddenInput);
    if (hidden) hidden.value = '';
    const label = document.getElementById(ids.label);
    if (label) label.textContent = 'Choose a date';
    const trigger = document.getElementById(ids.trigger);
    if (trigger) trigger.classList.remove('has-value');
    clearError();
  }

  function init() {
    const trigger = document.getElementById(ids.trigger);
    const panel = document.getElementById(ids.panel);
    if (!trigger || !panel) return; // this instance isn't on the current page

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      if (panel.hidden) open(); else close();
    });
    panel.addEventListener('click', (e) => e.stopPropagation());
    document.addEventListener('click', () => { if (!panel.hidden) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !panel.hidden) close(); });

    const prevBtn = document.getElementById(ids.prevBtn);
    const nextBtn = document.getElementById(ids.nextBtn);
    if (prevBtn) prevBtn.addEventListener('click', () => { viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1); render(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1); render(); });

    render();
  }

  return { init, render, reset, showError, clearError, getSelectedDate: () => selectedDate };
}

const orderDatePicker = createDatePicker({
  trigger: 'dateTrigger', panel: 'datePickerPanel', label: 'dateTriggerLabel',
  hiddenInput: 'custDate', grid: 'datePickerGrid', monthLabel: 'datePickerMonthLabel',
  prevBtn: 'datePrevMonth', nextBtn: 'dateNextMonth', errorEl: 'dateFieldError',
});
const customDatePicker = createDatePicker({
  trigger: 'customDateTrigger', panel: 'customDatePickerPanel', label: 'customDateTriggerLabel',
  hiddenInput: 'customNeededBy', grid: 'customDatePickerGrid', monthLabel: 'customDatePickerMonthLabel',
  prevBtn: 'customDatePrevMonth', nextBtn: 'customDateNextMonth', errorEl: null,
});

function updateBreakBanner() {
  const banner = document.getElementById('breakBanner');
  const text = document.getElementById('breakBannerText');
  if (!banner || !text) return;

  const activeRange = findBlockedRange(new Date());
  if (activeRange) {
    const endLabel = parseISODate(activeRange.end).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    text.textContent = activeRange.reason
      ? `We're currently on a short break (${activeRange.reason}) — back to taking orders after ${endLabel}.`
      : `We're not taking new orders right now — back after ${endLabel}.`;
    banner.hidden = false;
  } else {
    banner.hidden = true;
  }
}

/* ---------- order submission (one-way: fires the request, then
   confirms on-screen — no reply email is expected or waited on) ---------- */
orderForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const entries = cartEntries();
  if (entries.length === 0) return;

  const dateValue = document.getElementById('custDate').value;
  if (!dateValue) {
    orderDatePicker.showError('Please choose a delivery date.');
    return;
  }
  // Defensive re-check in case the blocked-dates list loaded or changed
  // after the calendar was first rendered — the calendar itself already
  // disables these days, this just makes sure a stale state can never
  // slip an order through.
  const blockedRange = findBlockedRange(parseISODate(dateValue));
  if (blockedRange) {
    orderDatePicker.showError(
      blockedRange.reason
        ? `Sorry, we're fully booked then — ${blockedRange.reason}. Please pick another date.`
        : `Sorry, we're fully booked on that date. Please pick another date.`
    );
    return;
  }

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
  orderDatePicker.reset();
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

/* ---------- gallery page (only runs where #galleryGrid exists) ---------- */
let GALLERY_ITEMS = [];
let lightboxIndex = 0;

function renderGallery(dishes) {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return; // not on the gallery page

  const withPhotos = dishes.filter(d => d.image);
  if (!withPhotos.length) {
    grid.innerHTML = `<p class="gallery-empty">Photos are on their way — check back soon.</p>`;
    return;
  }

  GALLERY_ITEMS = withPhotos;
  grid.innerHTML = withPhotos.map((d, i) => `
    <button type="button" class="gallery-item" data-index="${i}" aria-label="View larger photo of ${d.name}">
      <img src="${d.image}" alt="${d.name}" loading="lazy" onerror="this.closest('.gallery-item').remove()">
      <span class="gallery-caption">${d.name}</span>
    </button>
  `).join('');

  grid.querySelectorAll('.gallery-item').forEach(btn => {
    btn.addEventListener('click', () => openLightbox(Number(btn.dataset.index)));
  });
}

function renderLightbox() {
  const item = GALLERY_ITEMS[lightboxIndex];
  if (!item) return;
  const img = document.getElementById('lightboxImg');
  img.src = item.image;
  img.alt = item.name;
  document.getElementById('lightboxCaption').textContent = item.name;
}
function openLightbox(index) {
  lightboxIndex = index;
  renderLightbox();
  const lb = document.getElementById('lightbox');
  lb.hidden = false;
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  document.getElementById('lightbox').hidden = true;
  document.body.style.overflow = '';
}
function lightboxNext() { lightboxIndex = (lightboxIndex + 1) % GALLERY_ITEMS.length; renderLightbox(); }
function lightboxPrev() { lightboxIndex = (lightboxIndex - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length; renderLightbox(); }

function initLightbox() {
  const lb = document.getElementById('lightbox');
  if (!lb) return; // not on the gallery page

  document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
  document.getElementById('lightboxNext').addEventListener('click', lightboxNext);
  document.getElementById('lightboxPrev').addEventListener('click', lightboxPrev);
  lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') lightboxNext();
    if (e.key === 'ArrowLeft') lightboxPrev();
  });
}

/* ---------- custom order request panel (only runs where it exists
   in the page — currently the main page only) ---------- */
function initCustomRequestPanel() {
  const overlay = document.getElementById('customOverlay');
  const panel = document.getElementById('customPanel');
  const form = document.getElementById('customForm');
  const success = document.getElementById('customSuccess');
  if (!overlay || !panel || !form || !success) return;

  const openBtns = [document.getElementById('customRequestBtn'), document.getElementById('customRequestBtnMenu')]
    .filter(Boolean);
  const closeBtn = document.getElementById('customClose');
  const doneBtn = document.getElementById('customDone');

  function open() {
    overlay.hidden = false;
    panel.hidden = false;
    requestAnimationFrame(() => panel.classList.add('is-open'));
    form.hidden = false;
    success.hidden = true;
    document.body.style.overflow = 'hidden';
  }
  function close() {
    panel.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(() => { overlay.hidden = true; panel.hidden = true; }, 320);
  }

  openBtns.forEach(btn => btn.addEventListener('click', open));
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', close);
  doneBtn.addEventListener('click', close);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && panel.classList.contains('is-open')) close(); });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const payload = {
      kind: 'custom',
      name: formData.get('name'),
      phone: formData.get('phone'),
      item: formData.get('item'),
      quantity: formData.get('quantity'),
      neededBy: formData.get('neededBy'),
      details: formData.get('details'),
      submittedAt: new Date().toISOString(),
    };

    const submitBtn = document.getElementById('submitCustomBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      if (CONFIG.ORDER_API_URL) {
        // same one-way pattern as a regular order — see the comment
        // above the order form's submit handler for why no-cors + an
        // optimistic confirmation is the right call here.
        await fetch(CONFIG.ORDER_API_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload),
        });
      } else {
        console.info('ORDER_API_URL not set — custom request captured locally only:', payload);
      }
    } catch (err) {
      console.warn('Custom request failed to dispatch:', err);
    }

    document.getElementById('customSuccessPhone').textContent = payload.phone;
    form.hidden = true;
    success.hidden = false;

    submitBtn.disabled = false;
    submitBtn.textContent = 'Send request';
    form.reset();
  });
}

/* ---------- review submission panel ----------
   Every submission lands in the Reviews sheet with Approved
   unchecked — same as one the owner types in directly — so nothing
   reaches the site's carousel without being read first. */
function populateReviewDishSelect() {
  const select = document.getElementById('reviewDish');
  if (!select) return;
  const dishOptions = MENU.map(d => `<option value="${d.name}">${d.name}</option>`).join('');
  select.innerHTML = `<option value="">Choose a dish</option>${dishOptions}<option value="Something else">Something else / custom order</option>`;
}

function initReviewPanel() {
  const overlay = document.getElementById('reviewOverlay');
  const panel = document.getElementById('reviewPanel');
  const form = document.getElementById('reviewForm');
  const success = document.getElementById('reviewSuccess');
  if (!overlay || !panel || !form || !success) return;

  const openBtn = document.getElementById('reviewRequestBtn');
  const closeBtn = document.getElementById('reviewClose');
  const doneBtn = document.getElementById('reviewDone');

  function open() {
    overlay.hidden = false;
    panel.hidden = false;
    requestAnimationFrame(() => panel.classList.add('is-open'));
    form.hidden = false;
    success.hidden = true;
    document.body.style.overflow = 'hidden';
  }
  function close() {
    panel.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(() => { overlay.hidden = true; panel.hidden = true; }, 320);
  }

  if (openBtn) openBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', close);
  doneBtn.addEventListener('click', close);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && panel.classList.contains('is-open')) close(); });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const payload = {
      kind: 'review',
      name: formData.get('name'),
      dish: formData.get('dish'),
      text: formData.get('text'),
      submittedAt: new Date().toISOString(),
    };

    const submitBtn = document.getElementById('submitReviewBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      if (CONFIG.ORDER_API_URL) {
        await fetch(CONFIG.ORDER_API_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload),
        });
      } else {
        console.info('ORDER_API_URL not set — review captured locally only:', payload);
      }
    } catch (err) {
      console.warn('Review failed to dispatch:', err);
    }

    form.hidden = true;
    success.hidden = false;

    submitBtn.disabled = false;
    submitBtn.textContent = 'Send review';
    form.reset();
  });
}

/* ---------- misc ---------- */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

try {
  orderDatePicker.init();
} catch (err) {
  console.error('Order date picker failed to start:', err);
}

try {
  customDatePicker.init();
} catch (err) {
  console.error('Custom-request date picker failed to start:', err);
}

try {
  initLightbox();
} catch (err) {
  console.error('Lightbox failed to start:', err);
}

try {
  initCustomRequestPanel();
} catch (err) {
  console.error('Custom request panel failed to start:', err);
}

try {
  initReviewsCarousel();
} catch (err) {
  console.error('Reviews carousel failed to start:', err);
}

try {
  initReviewPanel();
} catch (err) {
  console.error('Review panel failed to start:', err);
}

/* ---------- init (menu + reviews) ----------
   Runs independently of the enhancements above, and is wrapped so a
   failure here surfaces in the console instead of silently leaving
   the page blank. */
(async function init() {
  try {
    const [menu, reviews, blockedDates] = await Promise.all([loadMenu(), loadReviews(), loadBlockedDates()]);
    MENU = menu;
    renderMenu('all');
    renderReviews(reviews);
    renderGallery(menu);
    populateReviewDishSelect();
    updateTrayCount();

    // One shared source of truth — re-rendering every calendar
    // instance here keeps the order form and the custom-request
    // form's calendars in sync with each other automatically.
    BLOCKED_RANGES = blockedDates;
    orderDatePicker.render();
    customDatePicker.render();
    updateBreakBanner();
  } catch (err) {
    console.error('Failed to initialize menu/reviews:', err);
  }
})();
