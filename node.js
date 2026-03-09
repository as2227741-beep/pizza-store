const PIZZAS = [
  { id:1, name:'Margherita', emoji:'🍕', desc:'San Marzano tomato, fior di latte, fresh basil, extra virgin olive oil.', prices:{S:12,M:16,L:20}, cat:'classic', badge:'veg' },
  { id:2, name:'Pepperoni', emoji:'🍕', desc:'Tomato base, mozzarella, generous layer of crispy cupped pepperoni.', prices:{S:14,M:18,L:22}, cat:'classic', badge:'hot' },
  { id:3, name:'Quattro Formaggi', emoji:'🍕', desc:'Mozzarella, gorgonzola, taleggio, parmigiano reggiano, truffle honey.', prices:{S:15,M:19,L:24}, cat:'premium', badge:'new' },
  { id:4, name:'Diavola', emoji:'🍕', desc:'Spicy Calabrian salami, chilli oil, mozzarella, tomato base.', prices:{S:14,M:18,L:23}, cat:'spicy', badge:'hot' },
  { id:5, name:'Truffle Mushroom', emoji:'🍕', desc:'White truffle cream, mixed wild mushrooms, mozzarella, thyme, parmesan.', prices:{S:16,M:21,L:26}, cat:'premium', badge:'new' },
  { id:6, name:'Garden Primavera', emoji:'🍕', desc:'Roasted courgette, peppers, cherry tomato, pesto base, ricotta, pine nuts.', prices:{S:13,M:17,L:21}, cat:'veggie', badge:'veg' },
  { id:7, name:'Nduja & Honey', emoji:'🍕', desc:'Spicy spreadable nduja, mozzarella, chilli flakes, wild honey drizzle.', prices:{S:15,M:19,L:24}, cat:'spicy', badge:'hot' },
  { id:8, name:'Prosciutto e Rucola', emoji:'🍕', desc:'San Daniele prosciutto crudo, fresh rocket, shaved parmesan, lemon oil.', prices:{S:16,M:20,L:25}, cat:'premium', badge:null },
  { id:9, name:'Spinach & Artichoke', emoji:'🍕', desc:'Garlic cream base, baby spinach, artichoke hearts, mozzarella, lemon zest.', prices:{S:13,M:17,L:21}, cat:'veggie', badge:'veg' },
  { id:10, name:'BBQ Chicken', emoji:'🍕', desc:'Smoky BBQ base, pulled chicken, red onion, mozzarella, fresh coriander.', prices:{S:14,M:18,L:23}, cat:'classic', badge:null },
  { id:11, name:'Inferno', emoji:'🍕', desc:'Triple chilli: pepperoni, jalapeño, nduja, ghost pepper sauce, mozzarella.', prices:{S:15,M:19,L:24}, cat:'spicy', badge:'hot' },
  { id:12, name:'Burrata e Pomodoro', emoji:'🍕', desc:'Fresh burrata, heirloom tomatoes, basil oil, aged balsamic, fleur de sel.', prices:{S:17,M:22,L:27}, cat:'premium', badge:'new' },
];

let cart = [];
let selectedSizes = {};

// Init sizes
PIZZAS.forEach(p => selectedSizes[p.id] = 'M');

function renderPizzas(filter = 'all') {
  const grid = document.getElementById('pizzaGrid');
  grid.innerHTML = PIZZAS.map(p => {
    const badgeHtml = p.badge
      ? `<div class="pizza-badge-top badge-${p.badge}">${p.badge === 'new' ? 'New' : p.badge === 'hot' ? '🔥 Hot' : '🌿 Veg'}</div>`
      : '';
    const selectedSize = selectedSizes[p.id] || 'M';
    return `
    <div class="pizza-card ${filter !== 'all' && p.cat !== filter ? 'hidden' : ''}" id="card-${p.id}">
      <div class="pizza-img">
        ${badgeHtml}
        <div class="pizza-emoji">${p.emoji}</div>
      </div>
      <div class="pizza-info">
        <div class="pizza-name">${p.name}</div>
        <div class="pizza-desc">${p.desc}</div>
        <div class="size-select">
          ${['S','M','L'].map(s => `<button class="size-btn ${selectedSize === s ? 'selected' : ''}" onclick="selectSize(${p.id},'${s}',this)">${s} — $${p.prices[s]}</button>`).join('')}
        </div>
        <div class="pizza-meta">
          <div class="pizza-price">$${p.prices[selectedSize]} <span>/ pizza</span></div>
          <button class="add-btn" onclick="addToCart(${p.id})">+</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

function selectSize(id, size, btn) {
  selectedSizes[id] = size;
  const card = document.getElementById('card-' + id);
  card.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  // Update price display
  const pizza = PIZZAS.find(p => p.id === id);
  card.querySelector('.pizza-price').innerHTML = `$${pizza.prices[size]} <span>/ pizza</span>`;
}

function filterPizzas(cat, btn) {
  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.pizza-card').forEach(card => {
    const id = parseInt(card.id.split('-')[1]);
    const pizza = PIZZAS.find(p => p.id === id);
    card.classList.toggle('hidden', cat !== 'all' && pizza.cat !== cat);
  });
}

function addToCart(id) {
  const pizza = PIZZAS.find(p => p.id === id);
  const size = selectedSizes[id] || 'M';
  const price = pizza.prices[size];
  const existing = cart.find(i => i.id === id && i.size === size);
  if (existing) { existing.qty++; }
  else { cart.push({ id, name: pizza.name, emoji: pizza.emoji, size, price, qty: 1 }); }
  renderCart();
  showToast(`${pizza.emoji} ${pizza.name} (${size}) added!`);
  // bump count
  const countEl = document.getElementById('cartCount');
  countEl.classList.remove('bump');
  void countEl.offsetWidth;
  countEl.classList.add('bump');
}

function updateCart(price) {
  cart.push({ id: Date.now(), name: 'Bundle', emoji: '🍕', size: 'L', price, qty: 1 });
  renderCart();
  const countEl = document.getElementById('cartCount');
  countEl.classList.remove('bump');
  void countEl.offsetWidth;
  countEl.classList.add('bump');
}

function changeQty(id, size, delta) {
  const item = cart.find(i => i.id === id && i.size === size);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => !(i.id === id && i.size === size));
  renderCart();
}

function removeItem(id, size) {
  cart = cart.filter(i => !(i.id === id && i.size === size));
  renderCart();
}

function renderCart() {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);
  document.getElementById('cartCount').textContent = count;
  const itemsEl = document.getElementById('cartItems');
  const footerEl = document.getElementById('cartFooter');

  if (cart.length === 0) {
    itemsEl.innerHTML = `<div class="cart-empty"><div class="cart-empty-icon">🍕</div><p>Your cart is empty</p><p style="font-size:12px;margin-top:4px">Add some pizzas!</p></div>`;
    footerEl.style.display = 'none';
    return;
  }

  footerEl.style.display = 'block';
  itemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-emoji">${item.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-size">Size ${item.size}</div>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="changeQty(${item.id},'${item.size}',-1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id},'${item.size}',1)">+</button>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px">
        <button class="remove-btn" onclick="removeItem(${item.id},'${item.size}')">✕</button>
        <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
      </div>
    </div>`).join('');

  document.getElementById('cartSubtotal').textContent = '$' + total.toFixed(2);
  document.getElementById('cartTotal').textContent = '$' + (total + 2.99).toFixed(2);
}

function toggleCart() {
  document.getElementById('cartOverlay').classList.toggle('open');
  document.getElementById('cartSidebar').classList.toggle('open');
}

function checkout() {
  showToast('🎉 Order placed! Arriving in 30 minutes.');
  cart = [];
  renderCart();
  toggleCart();
}

function showToast(msg) {
  const wrap = document.getElementById('toastWrap');
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  wrap.appendChild(t);
  setTimeout(() => t.remove(), 2600);
}

// Scroll reveal
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Init
renderPizzas();
renderCart();
