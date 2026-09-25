/* =========================================================
   SERGIO PERERA — GALERÍA
   Sistema de partidos + previews + modal + carrito

   IMPORTANTE:
   Las imágenes públicas son SIEMPRE previews con marca de agua.
   Los originales profesionales NO están dentro de esta carpeta.
   ========================================================= */

const partidos = [
  {
    id: 1,
    categoria: "deportiva",
    titulo: "Partido de prueba",
    fecha: "SEPTIEMBRE 2026",
    descripcion: "Registro fotográfico del encuentro.",
    portada: "img/deportiva/partido-1/previews/img_5134-preview.jpg",
    fotos: [
      {
        id: 101,
        titulo: "Fotografía 01",
        archivo: "img/deportiva/partido-1/previews/img_5134-preview.jpg",
        precio: 5000
      },
      {
        id: 102,
        titulo: "Fotografía 02",
        archivo: "img/deportiva/partido-1/previews/img_5135-preview.jpg",
        precio: 5000
      },
      {
        id: 103,
        titulo: "Fotografía 03",
        archivo: "img/deportiva/partido-1/previews/img_5136-preview.jpg",
        precio: 5000
      },
      {
        id: 104,
        titulo: "Fotografía 04",
        archivo: "img/deportiva/partido-1/previews/img_5137-preview.jpg",
        precio: 5000
      },
      {
        id: 105,
        titulo: "Fotografía 05",
        archivo: "img/deportiva/partido-1/previews/img_5138-preview.jpg",
        precio: 5000
      },
      {
        id: 106,
        titulo: "Fotografía 06",
        archivo: "img/deportiva/partido-1/previews/img_5139-preview.jpg",
        precio: 5000
      },
      {
        id: 107,
        titulo: "Fotografía 07",
        archivo: "img/deportiva/partido-1/previews/img_5140-preview.jpg",
        precio: 5000
      }
    ]
  }
];

let partidoActual = null;
let fotoActual = null;

/* =========================================================
   UTILIDADES
   ========================================================= */

function formatearPrecio(precio) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  }).format(precio);
}

function escaparHTML(texto) {
  return String(texto ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* =========================================================
   INICIO
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  iniciarGaleria();
});

function iniciarGaleria() {
  const matchesView = document.getElementById("matchesView");
  const photosView = document.getElementById("photosView");
  const matchesGrid = document.getElementById("matchesGrid");
  const photosGrid = document.getElementById("photosGrid");
  const galleryEmpty = document.getElementById("galleryEmpty");
  const galleryFilters = document.querySelectorAll(".gallery-filter");
  const backToMatches = document.getElementById("backToMatches");

  const photoModal = document.getElementById("photoModal");
  const photoModalOverlay = document.getElementById("photoModalOverlay");
  const photoModalClose = document.getElementById("photoModalClose");
  const modalPhoto = document.getElementById("modalPhoto");
  const modalPhotoTitle = document.getElementById("modalPhotoTitle");
  const modalPhotoMatch = document.getElementById("modalPhotoMatch");
  const modalPhotoCategory = document.getElementById("modalPhotoCategory");
  const modalPhotoPrice = document.getElementById("modalPhotoPrice");
  const modalAddToCart = document.getElementById("modalAddToCart");

  /* Seguridad: si falta un elemento esencial, mostramos un mensaje
     en vez de dejar toda la página en blanco. */
  if (!matchesGrid || !matchesView || !photosView || !photosGrid) {
    console.error("Galería: faltan elementos necesarios en galeria.html.");
    return;
  }

  function mostrarPartidos(categoria = "todas") {
    matchesGrid.innerHTML = "";
    matchesView.hidden = false;
    photosView.hidden = true;
    if (galleryEmpty) galleryEmpty.hidden = true;

    const resultados = categoria === "todas"
      ? partidos
      : partidos.filter(partido => partido.categoria === categoria);

    if (!resultados.length) {
      matchesView.hidden = true;
      if (galleryEmpty) galleryEmpty.hidden = false;
      return;
    }

    resultados.forEach((partido, index) => {
      const card = document.createElement("article");
      card.className = "match-card";

      card.innerHTML = `
        <div class="match-card-image">
          <img
            src="${escaparHTML(partido.portada)}"
            alt="Fotografía de ${escaparHTML(partido.titulo)}"
            loading="lazy"
          >
        </div>

        <div class="match-card-overlay"></div>

        <div class="match-card-info">
          <span class="match-card-number">
            ${String(index + 1).padStart(2, "0")}
          </span>

          <h3>${escaparHTML(partido.titulo)}</h3>

          <p>
            ${escaparHTML(partido.fecha)} ·
            ${partido.fotos.length}
            ${partido.fotos.length === 1 ? "fotografía" : "fotografías"}
          </p>
        </div>

        <span class="match-card-action" aria-hidden="true">
          <i class="fa-solid fa-arrow-right"></i>
        </span>
      `;

      card.addEventListener("click", () => abrirPartido(partido.id));
      matchesGrid.appendChild(card);
    });
  }

  function abrirPartido(id) {
    const partido = partidos.find(item => item.id === id);
    if (!partido) return;

    partidoActual = partido;

    const title = document.getElementById("photosMatchTitle");
    const date = document.getElementById("photosMatchDate");
    const category = document.getElementById("photosCategory");

    if (title) title.textContent = partido.titulo;
    if (date) date.textContent = partido.fecha;
    if (category) category.textContent = partido.categoria.toUpperCase();

    renderizarFotos(partido);

    matchesView.hidden = true;
    photosView.hidden = false;
    if (galleryEmpty) galleryEmpty.hidden = true;

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderizarFotos(partido) {
    photosGrid.innerHTML = "";

    partido.fotos.forEach((foto, index) => {
      const card = document.createElement("article");
      card.className = "photo-card";

      card.innerHTML = `
        <img
          src="${escaparHTML(foto.archivo)}"
          alt="${escaparHTML(foto.titulo)}"
          loading="${index < 3 ? "eager" : "lazy"}"
        >

        <div class="photo-card-info">
          <small>FOTO ${String(index + 1).padStart(2, "0")}</small>
          <h3>${escaparHTML(foto.titulo)}</h3>
        </div>

        <button
          type="button"
          class="photo-card-buy"
          aria-label="Ver ${escaparHTML(foto.titulo)}"
        >
          <i class="fa-solid fa-expand"></i>
        </button>
      `;

      card.addEventListener("click", event => {
        event.preventDefault();
        abrirModalFoto(foto, partido);
      });

      photosGrid.appendChild(card);
    });
  }

  function volverAPartidos() {
    partidoActual = null;
    fotoActual = null;
    mostrarPartidos("todas");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* FILTROS */
  galleryFilters.forEach(filtro => {
    filtro.addEventListener("click", () => {
      galleryFilters.forEach(item => item.classList.remove("active"));
      filtro.classList.add("active");
      mostrarPartidos(filtro.dataset.category || "todas");
    });
  });

  /* VOLVER */
  if (backToMatches) {
    backToMatches.addEventListener("click", volverAPartidos);
  }

  /* =======================================================
     MODAL
     ======================================================= */

  function abrirModalFoto(foto, partido) {
    if (!photoModal || !modalPhoto) return;

    fotoActual = foto;
    partidoActual = partido;

    modalPhoto.src = foto.archivo;
    modalPhoto.alt = foto.titulo || partido.titulo;

    if (modalPhotoTitle) {
      modalPhotoTitle.textContent = foto.titulo || "Fotografía";
    }

    if (modalPhotoMatch) {
      modalPhotoMatch.textContent = `${partido.titulo} · ${partido.fecha}`;
    }

    if (modalPhotoCategory) {
      modalPhotoCategory.textContent = partido.categoria.toUpperCase();
    }

    if (modalPhotoPrice) {
      modalPhotoPrice.textContent = formatearPrecio(foto.precio);
    }

    photoModal.classList.add("open");
    photoModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
  }

  function cerrarModalFoto() {
    if (!photoModal) return;

    photoModal.classList.remove("open");
    photoModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");

    setTimeout(() => {
      if (modalPhoto) modalPhoto.src = "";
    }, 200);
  }

  if (photoModalClose) {
    photoModalClose.addEventListener("click", cerrarModalFoto);
  }

  if (photoModalOverlay) {
    photoModalOverlay.addEventListener("click", cerrarModalFoto);
  }

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && photoModal?.classList.contains("open")) {
      cerrarModalFoto();
    }
  });

  /* =======================================================
     CARRITO
     ======================================================= */

  function agregarFotoAlCarrito(foto, partido) {
    const storageKey = "sergio-perera-cart";
    let carrito = [];

    try {
      carrito = JSON.parse(localStorage.getItem(storageKey) || "[]");
      if (!Array.isArray(carrito)) carrito = [];
    } catch {
      carrito = [];
    }

    const id = `partido-${partido.id}-foto-${foto.id}`;
    const existente = carrito.find(item => item.id === id);

    if (existente) {
      existente.quantity += 1;
    } else {
      carrito.push({
        id,
        title: foto.titulo,
        category: `${partido.titulo} · ${partido.fecha}`,
        event: partido.titulo,
        price: foto.precio,
        image: foto.archivo,
        quantity: 1
      });
    }

    localStorage.setItem(storageKey, JSON.stringify(carrito));

    /* index.js, que maneja el carrito general, vuelve a renderizarlo. */
    if (typeof renderCart === "function") {
      renderCart();
    }

    if (typeof updateCartSummary === "function") {
      updateCartSummary();
    }

    if (typeof openCart === "function") {
      openCart(true);
    }

    cerrarModalFoto();
  }

  if (modalAddToCart) {
    modalAddToCart.addEventListener("click", () => {
      if (!fotoActual || !partidoActual) return;
      agregarFotoAlCarrito(fotoActual, partidoActual);
    });
  }

  /* =======================================================
     INICIO: TODAS muestra los partidos disponibles.
     Por ahora solo existe un partido real de DEPORTIVA.
     ======================================================= */

  mostrarPartidos("todas");

  /* Exponer algunas funciones para futuras conexiones con backend. */
  window.SergioPereraGaleria = {
    partidos,
    mostrarPartidos,
    abrirPartido,
    volverAPartidos,
    abrirModalFoto,
    cerrarModalFoto
  };
}

/* =========================================================
   PROTECCIÓN DE IMÁGENES
   ========================================================= */

/* Bloquear menú contextual */
document.addEventListener("contextmenu", function (event) {

    const imagen = event.target.closest(
        ".foto-imagen, " +
        ".foto-imagen img, " +
        ".partido-imagen, " +
        ".partido-imagen img, " +
        ".modal-image-container, " +
        ".modal-image-container img, " +
        "#photoModal img"
    );

    if (imagen) {
        event.preventDefault();
        return false;
    }

});


/* Bloquear arrastre */
document.addEventListener("dragstart", function (event) {

    const imagen = event.target.closest(
        ".foto-imagen, " +
        ".foto-imagen img, " +
        ".partido-imagen, " +
        ".partido-imagen img, " +
        ".modal-image-container, " +
        ".modal-image-container img, " +
        "#photoModal img"
    );

    if (imagen) {
        event.preventDefault();
        return false;
    }

});


/* Bloquear guardar mediante algunas combinaciones */
document.addEventListener("keydown", function (event) {

    const tecla = event.key.toLowerCase();

    /*
     * Ctrl + S
     */
    if (event.ctrlKey && tecla === "s") {

        event.preventDefault();

    }

    /*
     * Ctrl + Shift + S
     */
    if (
        event.ctrlKey &&
        event.shiftKey &&
        tecla === "s"
    ) {

        event.preventDefault();

    }

});


/* Bloquear selección de imágenes */
document.addEventListener("selectstart", function (event) {

    if (
        event.target.closest(
            ".foto-imagen, " +
            ".partido-imagen, " +
            ".modal-image-container, " +
            "#photoModal"
        )
    ) {

        event.preventDefault();

    }

});

document.addEventListener("contextmenu", function (event) {

    if (event.target.tagName === "IMG") {
        event.preventDefault();
        return false;
    }

});

document.addEventListener("dragstart", function (event) {

    if (event.target.tagName === "IMG") {
        event.preventDefault();
        return false;
    }

});

document.addEventListener("keydown", function (event) {

    if (event.ctrlKey && event.key.toLowerCase() === "s") {
        event.preventDefault();
    }

});