/* SERGIO PERERA — INDEX */

/* FOTOGRAFÍAS DESTACADAS */
const featuredPhotos = [
  {
    id: "la-pasion-del-partido",
    title: "La pasión del partido",
    category: "FÚTBOL",
    event: "Partido de fútbol",
    price: 3200,
    image:
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1000&q=85"
  },

  {
    id: "sobre-el-escenario",
    title: "Sobre el escenario",
    category: "RECITALES",
    event: "Recital",
    price: 2800,
    image:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1000&q=85"
  },

  {
    id: "la-celebracion",
    title: "La celebración",
    category: "EVENTOS",
    event: "Evento",
    price: 2900,
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=85"
  },

  {
    id: "la-previa",
    title: "La previa",
    category: "FÚTBOL",
    event: "Fútbol",
    price: 3100,
    image:
      "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=1000&q=85"
  }
];

/* ELEMENTOS */
const featuredGrid = document.getElementById("featuredGrid");
const siteHeader = document.getElementById("siteHeader");
const menuButton = document.getElementById("menuButton");
const mainNav = document.getElementById("mainNav");
const currentYear = document.getElementById("currentYear");
const cartButton = document.getElementById("cartButton");
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const cartClose = document.getElementById("cartClose");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");
const currencyFormatter = new Intl.NumberFormat("es-AR",
    {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0
    }
  );
const cartStorageKey = "sergio-perera-cart";

let cart = JSON.parse(localStorage.getItem(cartStorageKey) || "[]");
let cartCloseTimeout;

function formatCurrency(value) {
  return currencyFormatter.format(
    value
  );
}

function openCart(autoClose = false) {
  if (!cartDrawer || !cartOverlay) {
    return;
  }

  clearTimeout(cartCloseTimeout);
  cartDrawer.classList.add("open");
  cartOverlay.classList.add("active");

  if (autoClose) {
    cartCloseTimeout = setTimeout(closeCart, 2000);
  }
}

function closeCart() {
  if (!cartDrawer || !cartOverlay) {
    return;
  }

  clearTimeout(cartCloseTimeout);
  cartDrawer.classList.remove("open");
  cartOverlay.classList.remove("active");
}

function saveCart() {
  localStorage.setItem(cartStorageKey, JSON.stringify(cart));
}

function loadCart() {
  try {
    const storedCart = JSON.parse(localStorage.getItem(cartStorageKey) || "[]");
    cart = Array.isArray(storedCart)
      ? storedCart.filter(item => !["AUTOMOVILISMO", "RETRATOS"].includes(item.category))
      : [];
    saveCart();
  } catch {
    cart = [];
    saveCart();
  }
}

function updateCartSummary() {
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  if (cartCount) {
    cartCount.textContent = String(itemCount);
  }

  if (cartTotal) {
    cartTotal.textContent = formatCurrency(total);
  }
}

function renderCart() {
  if (!cartItems) {
    return;
  }

  loadCart();

  if (!cart.length) {
    cartItems.innerHTML = `
      <li class="empty-cart">
        Tu carrito está vacío.<br>
        Agregá una foto para empezar.
      </li>`;

    updateCartSummary();
    return;
  }

  cartItems.innerHTML =
    cart
      .map(
        item => `
          <li class="cart-item">
            <img src="${item.image}" alt="${item.title}">
            <div>
              <h4>${item.title}</h4>
              <p>${item.category}</p>
              <div class="cart-item__meta">
                <strong>${formatCurrency(item.price)}</strong>
                <div class="cart-item-actions">
                  <div class="qty-control">
                    <button type="button" data-action="decrease" data-id="${item.id}" aria-label="Restar una unidad">−</button>
                    <span>${item.quantity}</span>
                    <button type="button" data-action="increase" data-id="${item.id}" aria-label="Sumar una unidad">+</button>
                  </div>
                  <button type="button" class="remove-cart-item" data-action="remove" data-id="${item.id}" aria-label="Eliminar ${item.title} del carrito" title="Eliminar del carrito">
                    <i class="fa-solid fa-trash-can" aria-hidden="true"></i>
                  </button>
                </div>
              </div>
            </div>
          </li>
        `
      )
      .join("");
  updateCartSummary();
}

function addToCart(id) {
  const photo = featuredPhotos.find(item => item.id === id);
  if (!photo) {
    return;
  }

  const existingItem = cart.find(item => item.id === id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...photo,
      quantity: 1
    });
  }
  saveCart();
  renderCart();
  openCart(true);
}

function updateQuantity(id,delta) {
  cart = cart
    .map(item => {
      if (item.id !== id) {
        return item;
      }

      const nextQuantity =
        item.quantity + delta;

      return {
        ...item,
        quantity: Math.max(
          0,
          nextQuantity
        )
      };
    })
    .filter(item => item.quantity > 0);

  saveCart();
  renderCart();

}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  renderCart();
}

/* RENDER DESTACADAS */
function renderFeatured() {
  if (!featuredGrid) {
    return;
  }

  featuredGrid.innerHTML = "";

  featuredPhotos.forEach(
    photo => {
      const card = document.createElement("article");
      card.className = "featured-card";
      card.innerHTML = `
        <img src="${photo.image}" alt="${photo.title}" loading="lazy">
        <div class="featured-info">
          <small>${photo.category}</small>
          <h3>${photo.title}</h3>
          <span>${photo.event}</span>
        </div>

        <button type="button" class="add-to-cart" data-id="${photo.id}" aria-label="Agregar ${photo.title} al carrito">Agregar</button>
      `;

      featuredGrid.appendChild(
        card
      );
    }
  );
}

/* HEADER AL HACER SCROLL */
window.addEventListener(
  "scroll",
  () => {
    if (!siteHeader) {
      return;
    }
    siteHeader.classList.toggle("scrolled", window.scrollY > 40);
  }
);

/* MENÚ MOBILE */
if (menuButton && mainNav) {
  menuButton.addEventListener("click",() => {
      const isOpen = mainNav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
    }
  );

  document .querySelectorAll(".main-nav a")
    .forEach(link => {
      link.addEventListener("click",() => {
          mainNav.classList.remove("open");
          menuButton.setAttribute("aria-expanded","false");
        }
      );
    });
}

if (cartButton) {
  cartButton.addEventListener("click",() => {
      const isOpen = cartDrawer && cartDrawer.classList.contains("open");
      if (isOpen) {
        closeCart();
      } else {
        openCart();
      }
    }
  );
}

if (cartOverlay) {
  cartOverlay.addEventListener("click",closeCart);
}

if (cartClose) {
  cartClose.addEventListener("click",closeCart);
}

document.addEventListener("click",event => {
    const addButton = event.target.closest(".add-to-cart");

    if (addButton) {
      addToCart(addButton.dataset.id);
      return;
    }

    const qtyButton = event.target.closest("[data-action]");

    if (qtyButton) {
      const action = qtyButton.dataset.action;
      const id = qtyButton.dataset.id;

      if (action === "increase") {
        updateQuantity(id, 1);
      }

      if (action === "decrease") {
        updateQuantity(id, -1);
      }

      if (action === "remove") {
        removeFromCart(id);
      }
    }
  }
);

/* AÑO DEL FOOTER */
if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

/* ANIMACIONES AL ENTRAR EN PANTALLA */
const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        }
      );
    },
    {
      threshold: 0.12
    }
  );

document .querySelectorAll(".category-card, .featured-card, .about-content, .contact-card")
  .forEach(element => {
      observer.observe(element);
    }
  );

/* INICIAR */
renderFeatured();
renderCart();

