/* ---------- DATA ---------- */
const PRODUCTS = [
  {
    id: 1,
    title: "Classic Cotton Tee",
    price: 499,
    rating: 4.5,
    category: "fashion",
    tags: ["new","men","summer"],
    img: "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Wireless Earbuds Pro",
    price: 2199,
    rating: 4.2,
    category: "electronics",
    tags: ["audio","bestseller"],
    img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Ceramic Planter Set",
    price: 799,
    rating: 4.7,
    category: "home",
    tags: ["decor","trending"],
    img: "https://images.unsplash.com/photo-1493673272479-a20888bcee10?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Athletic Running Shoes",
    price: 2599,
    rating: 4.3,
    category: "sports",
    tags: ["men","running"],
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 5,
    title: "Matte Lipstick Set",
    price: 999,
    rating: 4.4,
    category: "beauty",
    tags: ["women","new"],
    img: "https://images.unsplash.com/photo-1619451334794-57f10d99d8b0?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 6,
    title: "Minimal Desk Lamp",
    price: 1299,
    rating: 4.1,
    category: "home",
    tags: ["lighting","work"],
    img: "https://images.unsplash.com/photo-1487956382158-bb926046304a?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 7,
    title: "Sports Water Bottle",
    price: 349,
    rating: 4.6,
    category: "sports",
    tags: ["bestseller","gym"],
    img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 8,
    title: "Bluetooth Speaker Mini",
    price: 1499,
    rating: 4.3,
    category: "electronics",
    tags: ["audio","party"],
    img: "https://images.unsplash.com/photo-1518444028785-8d7e4e0f0919?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 9,
    title: "Eco Yoga Mat",
    price: 1199,
    rating: 4.8,
    category: "sports",
    tags: ["wellness","trending"],
    img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 10,
    title: "Silk Scarf",
    price: 699,
    rating: 4.0,
    category: "fashion",
    tags: ["women","new"],
    img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1200&auto=format&fit=crop"
  }
];

/* ---------- STATE ---------- */
let state = {
  query: "",
  category: "all",
  maxPrice: 5000,
  sort: "relevant",
  tags: new Set(),
};

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

/* ---------- INIT ---------- */
document.addEventListener("DOMContentLoaded", () => {
  $("#year").textContent = new Date().getFullYear();

  bindTabs();
  bindSearch();
  bindFilters();
  renderTagChips();
  renderProducts();
  hydrateCartUI();
  bindCartDrawer();
});

/* ---------- TABS ---------- */
function bindTabs(){
  $$("#categoryTabs .tab").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      $$("#categoryTabs .tab").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      state.category = btn.dataset.cat;
      renderProducts();
    });
  });
}

/* ---------- SEARCH ---------- */
function bindSearch(){
  $("#searchForm").addEventListener("submit", (e)=>{
    e.preventDefault();
  });
  $("#searchInput").addEventListener("input", (e)=>{
    state.query = e.target.value.trim().toLowerCase();
    renderProducts();
  });
}

/* ---------- FILTERS ---------- */
function bindFilters(){
  const range = $("#priceRange");
  const priceValue = $("#priceValue");
  range.addEventListener("input", ()=>{
    state.maxPrice = Number(range.value);
    priceValue.textContent = `₹${state.maxPrice}`;
    renderProducts();
  });

  $("#sortSelect").addEventListener("change", (e)=>{
    state.sort = e.target.value;
    renderProducts();
  });
}

/* ---------- TAG CHIPS ---------- */
function getAllTags(){
  const set = new Set();
  PRODUCTS.forEach(p => p.tags.forEach(t => set.add(t)));
  return Array.from(set).sort();
}
function renderTagChips(){
  const box = $("#tagBox");
  box.innerHTML = "";
  getAllTags().forEach(tag=>{
    const el = document.createElement("button");
    el.className = "tab";
    el.textContent = `#${tag}`;
    el.addEventListener("click", ()=>{
      if(state.tags.has(tag)) state.tags.delete(tag);
      else state.tags.add(tag);
      el.classList.toggle("active");
      renderProducts();
    });
    box.appendChild(el);
  });
}

/* ---------- PRODUCT RENDER ---------- */
function renderProducts(){
  const grid = $("#products");
  const title = $("#resultTitle");
  const count = $("#resultCount");

  let items = PRODUCTS.filter(p =>
    (state.category === "all" || p.category === state.category) &&
    p.price <= state.maxPrice &&
    (state.query === "" || p.title.toLowerCase().includes(state.query)) &&
    (state.tags.size === 0 || [...state.tags].every(t => p.tags.includes(t)))
  );

  switch(state.sort){
    case "low-high": items.sort((a,b)=>a.price-b.price); break;
    case "high-low": items.sort((a,b)=>b.price-a.price); break;
    case "az": items.sort((a,b)=>a.title.localeCompare(b.title)); break;
    case "za": items.sort((a,b)=>b.title.localeCompare(a.title)); break;
  }

  title.textContent = state.category === "all" ? "All Products" :
                      state.category[0].toUpperCase()+state.category.slice(1);
  count.textContent = `${items.length} item${items.length!==1?'s':''}`;

  grid.innerHTML = "";
  if(items.length===0){
    grid.innerHTML = `<div class="filter-card" style="grid-column:1/-1;text-align:center">
      <h3>No results</h3><p class="muted">Try removing some filters or searching for something else.</p></div>`;
    return;
  }

  items.forEach(p=>{
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <div class="thumb">
        <img src="${p.img}" alt="${p.title}">
        ${p.tags.includes("new") ? '<span class="badge">NEW</span>' : ""}
      </div>
      <div class="info">
        <div class="title">${p.title}</div>
        <div class="meta">
          <div class="price">₹${p.price}</div>
          <div class="rating"><i class="ri-star-fill"></i> ${p.rating}</div>
        </div>
      </div>
      <div class="actions">
        <button class="btn" data-id="${p.id}" aria-label="Add to wishlist"><i class="ri-heart-3-line"></i>Wishlist</button>
        <button class="btn primary add-cart" data-id="${p.id}"><i class="ri-shopping-cart-2-line"></i>Add</button>
      </div>
    `;
    grid.appendChild(card);
  });

  $$(".add-cart").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const id = Number(btn.dataset.id);
      addToCart(id);
    });
  });
}

/* ---------- CART ---------- */
const CART_KEY = "rk_shop_cart";

function readCart(){
  try{ return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch{ return []; }
}
function writeCart(items){
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  hydrateCartUI();
}

function addToCart(productId, qty=1){
  const items = readCart();
  const idx = items.findIndex(i=>i.id===productId);
  if(idx>-1) items[idx].qty += qty;
  else items.push({id:productId, qty});
  writeCart(items);
  openCart();
}

function cartSubtotal(items){
  return items.reduce((sum,i)=>{
    const p = PRODUCTS.find(p=>p.id===i.id);
    return sum + (p.price * i.qty);
  },0);
}

function hydrateCartUI(){
  const items = readCart();
  $("#cartCount").textContent = items.reduce((sum,i)=>sum+i.qty,0);

  const wrap = $("#cartItems");
  wrap.innerHTML = "";
  if(items.length===0){
    wrap.innerHTML = `<div class="filter-card"><p class="muted">Your bag is empty.</p></div>`;
  }else{
    items.forEach(i=>{
      const p = PRODUCTS.find(p=>p.id===i.id);
      const row = document.createElement("div");
      row.className = "cart-item";
      row.innerHTML = `
        <img src="${p.img}" alt="${p.title}">
        <div>
          <h4>${p.title}</h4>
          <div class="ci-meta">₹${p.price} • ${p.category}</div>
          <div class="qty">
            <button data-id="${p.id}" class="dec">−</button>
            <input value="${i.qty}" readonly>
            <button data-id="${p.id}" class="inc">+</button>
          </div>
          <div class="ci-price">₹${p.price * i.qty}</div>
        </div>
        <button class="icon-btn remove" data-id="${p.id}" title="Remove">
          <i class="ri-delete-bin-6-line"></i>
        </button>
      `;
      wrap.appendChild(row);
    });
  }

  $("#cartSubtotal").textContent = `₹${cartSubtotal(items)}`;

  // Bind qty & remove
  $$("#cartItems .inc").forEach(b=>b.addEventListener("click",()=>changeQty(b.dataset.id,1)));
  $$("#cartItems .dec").forEach(b=>b.addEventListener("click",()=>changeQty(b.dataset.id,-1)));
  $$("#cartItems .remove").forEach(b=>b.addEventListener("click",()=>removeItem(b.dataset.id)));
}

function changeQty(id, delta){
  id = Number(id);
  const items = readCart();
  const idx = items.findIndex(i=>i.id===id);
  if(idx>-1){
    items[idx].qty += delta;
    if(items[idx].qty<=0) items.splice(idx,1);
    writeCart(items);
  }
}

function removeItem(id){
  id = Number(id);
  const items = readCart().filter(i=>i.id!==id);
  writeCart(items);
}

/* ---------- CART DRAWER ---------- */
function bindCartDrawer(){
  $("#openCart").addEventListener("click", openCart);
  $("#closeCart").addEventListener("click", closeCart);
  $("#cartOverlay").addEventListener("click", closeCart);
}
function openCart(){
  $("#cartDrawer").classList.add("active");
  $("#cartDrawer").setAttribute("aria-hidden","false");
}
function closeCart(){
  $("#cartDrawer").classList.remove("active");
  $("#cartDrawer").setAttribute("aria-hidden","true");
}

/* ---------- MOBILE MENU (bonus) ---------- */
$("#menuBtn")?.addEventListener("click", ()=>{
  const search = document.querySelector(".search");
  if(getComputedStyle(search).display==="none"){
    search.style.display = "flex";
  }else{
    search.style.display = "none";
  }
});
