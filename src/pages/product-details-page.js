import { findProductBySlug, getAllProducts } from "../utils/product-utils.js";

// const root = document.querySelector("#productDetailsRoot");
let root = null;

const PHONE_DISPLAY = "+880 1847-213869";
const PHONE_TEL = "+8801847213869";

function escapeHtml(value = "") {
  const div = document.createElement("div");
  div.textContent = String(value);
  return div.innerHTML;
}

function productUrl(product) {
  return `/product-details/${encodeURIComponent(product.slug)}`;
}

function getProductSlug() {
  const pathParts = window.location.pathname.split("/").filter(Boolean);
  const lastPathPart = pathParts[pathParts.length - 1] || "";

  if (
    !lastPathPart ||
    lastPathPart === "product-details" ||
    lastPathPart === "product-details.html"
  ) {
    return "";
  }

  return decodeURIComponent(lastPathPart);
}

// function productUrl(product) {
//   return `/product-details/${encodeURIComponent(product.slug)}`;
// }

// function getProductSlug() {
//   const querySlug = new URLSearchParams(window.location.search).get("product");

//   const pathParts = window.location.pathname.split("/").filter(Boolean);
//   const lastPathPart = pathParts[pathParts.length - 1] || "";

//   const slug = querySlug || (lastPathPart !== "product-details.html" ? lastPathPart : "");

//   // if (querySlug) {
//   //   window.history.replaceState(
//   //     {},
//   //     "",
//   //     `/product-details.html/${encodeURIComponent(querySlug)}`
//   //   );
//   // }

//   return decodeURIComponent(slug);
// }

// function productUrl(product) {
//   return `/product-details.html/${encodeURIComponent(product.slug)}`;
// }

function getPriceText(product) {
  return (
    product.price || product.priceText || product.salePrice || "Call for Price"
  );
}

function getGallery(product) {
  const rawImages = [
    product.img,
    ...(Array.isArray(product.gallery) ? product.gallery : []),
    ...(Array.isArray(product.images) ? product.images : []),
  ];

  const uniqueImages = [...new Set(rawImages.filter(Boolean))];

  if (!uniqueImages.length) {
    uniqueImages.push("/images/products/placeholder.avif");
  }

  while (uniqueImages.length < 4) {
    uniqueImages.push(uniqueImages[0]);
  }

  return uniqueImages.slice(0, 4);
}

function getRelatedProducts(product) {
  const allProducts = getAllProducts();

  const sameCategory = allProducts.filter(
    (item) =>
      item.slug !== product.slug && item.categoryKey === product.categoryKey,
  );

  const fallback = allProducts.filter((item) => item.slug !== product.slug);

  const unique = new Map();

  [...sameCategory, ...fallback].forEach((item) => {
    if (item.slug && !unique.has(item.slug)) {
      unique.set(item.slug, item);
    }
  });

  return [...unique.values()].slice(0, 4);
}

function renderNotFound() {
  root.innerHTML = `
    <section class="bg-white py-20">
      <div class="mx-auto max-w-[1200px] px-4 text-center">
        <h1 class="text-[32px] font-black text-red-600">Product Not Found</h1>
        <p class="mt-3 text-slate-600">Product slug missing or wrong.</p>

        <a
          href="/index.html"
          class="mt-6 inline-flex items-center justify-center bg-[#111827] px-8 py-4 text-[13px] font-black uppercase tracking-wide text-white"
        >
          Back Home
        </a>
      </div>
    </section>
  `;
}

function renderFeaturePills(features) {
  return features
    .slice(0, 8)
    .map(
      (feature) => `
        <span class="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#34c7df] text-[13px] font-black text-[#00a8c8]">
          ✓
        </span>
      `,
    )
    .join("");
}

function renderSpecs(specs) {
  const entries = Object.entries(specs || {});

  if (!entries.length) {
    return `<p class="text-[14px] leading-7 text-slate-600">No specifications added.</p>`;
  }

  return `
    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      ${entries
        .map(
          ([key, value]) => `
            <div class="border border-slate-200 bg-white p-4">
              <p class="text-[12px] font-black uppercase tracking-[0.12em] text-slate-500">
                ${escapeHtml(key)}
              </p>
              <p class="mt-2 text-[14px] font-bold text-[#111827]">
                ${escapeHtml(value)}
              </p>
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderRelatedProducts(products) {
  if (!products.length) return "";

  return `
    <section class="mt-20">
      <h2 class="text-[28px] font-black text-[#111827]">Related Products</h2>

      <div class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        ${products
          .map(
            (item) => `
              <a
                href="${productUrl(item)}"
                class="group block border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,0.10)]"
              >
                <div class="flex h-[280px] items-center justify-center bg-white p-8">
                  <img
                    src="${escapeHtml(item.img || "/images/products/placeholder.avif")}"
                    alt="${escapeHtml(item.name)}"
                    class="max-h-full max-w-full object-contain transition duration-300 group-hover:scale-105"
                    onerror="this.src='/images/products/placeholder.avif'"
                  />
                </div>

                <div class="bg-[#eef5fb] px-5 py-5 text-center">
                  <p class="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                    ${escapeHtml(item.categoryTitle || "Product")}
                  </p>

                  <h3 class="mt-2 line-clamp-1 text-[15px] font-bold text-[#111827] group-hover:text-[#0057d8]">
                    ${escapeHtml(item.name)}
                  </h3>

                  <div class="mt-3 text-[13px] tracking-[2px] text-slate-400">
                    ★★★★★
                  </div>

                  <p class="mt-2 text-[18px] font-black text-[#111827]">
                    ${escapeHtml(getPriceText(item))}
                  </p>
                </div>
              </a>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

// function initGallery(gallery) {
//   const mainImage = root.querySelector("[data-main-product-image]");
//   const thumbs = root.querySelectorAll("[data-gallery-thumb]");
//   const prev = root.querySelector("[data-gallery-prev]");
//   const next = root.querySelector("[data-gallery-next]");

//   if (!mainImage || !thumbs.length) return;

//   let currentIndex = 0;

//   function showImage(index) {
//     currentIndex = (index + gallery.length) % gallery.length;
//     mainImage.src = gallery[currentIndex];

//     thumbs.forEach((thumb, thumbIndex) => {
//       const isActive = thumbIndex === currentIndex;

//       thumb.classList.toggle("border-[#2563eb]", isActive);
//       thumb.classList.toggle("border-slate-300", !isActive);
//     });
//   }

//   thumbs.forEach((thumb) => {
//     thumb.addEventListener("click", function () {
//       showImage(Number(thumb.dataset.galleryThumb));
//     });
//   });

//   if (prev) {
//     prev.addEventListener("click", function () {
//       showImage(currentIndex - 1);
//     });
//   }

//   if (next) {
//     next.addEventListener("click", function () {
//       showImage(currentIndex + 1);
//     });
//   }

//   showImage(0);
// }

function initGallery(gallery) {
  const mainImage = root.querySelector("[data-main-product-image]");
  const thumbs = root.querySelectorAll("[data-gallery-thumb]");
  const prev = root.querySelector("[data-gallery-prev]");
  const next = root.querySelector("[data-gallery-next]");

  if (!mainImage || !thumbs.length) return;

  let currentIndex = 0;

  function resetZoom() {
    mainImage.style.transform = "scale(1)";
    mainImage.style.transformOrigin = "center center";
    mainImage.style.zIndex = "1";
  }

  function showImage(index) {
    currentIndex = (index + gallery.length) % gallery.length;
    mainImage.src = gallery[currentIndex];

    resetZoom();

    thumbs.forEach((thumb, thumbIndex) => {
      const isActive = thumbIndex === currentIndex;

      thumb.classList.toggle("border-[#2563eb]", isActive);
      thumb.classList.toggle("border-slate-300", !isActive);
    });
  }

  function handleZoomMove(event) {
    const rect = mainImage.getBoundingClientRect();

    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    mainImage.style.transformOrigin = `${x}% ${y}%`;
    mainImage.style.transform = "scale(2)";
    mainImage.style.zIndex = "20";
  }

  mainImage.addEventListener("mousemove", handleZoomMove);
  mainImage.addEventListener("mouseenter", handleZoomMove);
  mainImage.addEventListener("mouseleave", resetZoom);

  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", function () {
      showImage(Number(thumb.dataset.galleryThumb));
    });
  });

  if (prev) {
    prev.addEventListener("click", function () {
      showImage(currentIndex - 1);
    });
  }

  if (next) {
    next.addEventListener("click", function () {
      showImage(currentIndex + 1);
    });
  }

  showImage(0);
}

function initTabs() {
  const buttons = root.querySelectorAll("[data-tab-button]");
  const panels = root.querySelectorAll("[data-tab-panel]");

  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      const tab = button.dataset.tabButton;

      buttons.forEach((item) => {
        const active = item.dataset.tabButton === tab;

        item.classList.toggle("border-[#111827]", active);
        item.classList.toggle("text-[#111827]", active);
        item.classList.toggle("border-transparent", !active);
        item.classList.toggle("text-slate-500", !active);
      });

      panels.forEach((panel) => {
        panel.classList.toggle("hidden", panel.dataset.tabPanel !== tab);
      });
    });
  });
}

function initQuantity(product) {
  const minusBtn = root.querySelector("[data-qty-minus]");
  const plusBtn = root.querySelector("[data-qty-plus]");
  const qtyValue = root.querySelector("[data-qty-value]");
  const whatsappLink = root.querySelector("[data-whatsapp-link]");

  if (!minusBtn || !plusBtn || !qtyValue) return;

  let quantity = 1;

  function updateQuantity() {
    qtyValue.textContent = quantity;

    minusBtn.disabled = quantity <= 1;
    minusBtn.classList.toggle("opacity-40", quantity <= 1);
    minusBtn.classList.toggle("cursor-not-allowed", quantity <= 1);

    if (whatsappLink) {
      whatsappLink.href = `https://wa.me/8801847213869?text=${encodeURIComponent(
        `I am interested in ${product.name}. Quantity: ${quantity}`,
      )}`;
    }
  }

  minusBtn.addEventListener("click", function () {
    if (quantity > 1) {
      quantity -= 1;
      updateQuantity();
    }
  });

  plusBtn.addEventListener("click", function () {
    quantity += 1;
    updateQuantity();
  });

  updateQuantity();
}

function renderProduct(product) {
  const gallery = getGallery(product);
  const relatedProducts = getRelatedProducts(product);

  const description =
    product.description ||
    product.details ||
    `${product.name} is a professional security product for home, office, commercial and industrial projects.`;

  const details = product.details || description;

  const features =
    Array.isArray(product.features) && product.features.length
      ? product.features
      : [
          "Reliable performance",
          "Professional security solution",
          "Easy installation",
          "Suitable for commercial projects",
        ];

  const specs = product.specs || {
    Category: product.categoryTitle || "Security Product",
    Type: product.subTitle || product.categoryTitle || "Product",
    Usage: "Home, Office, Commercial, Industrial",
  };

  const whatsappUrl = `https://wa.me/8801847213869?text=${encodeURIComponent(
    `I am interested in ${product.name}`,
  )}`;

  document.title = `${product.name} - GCTL`;

  root.innerHTML = `
    <section class="bg-white py-8 md:py-12">
      <div class="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">

        <nav class="mb-8 flex flex-wrap items-center gap-3 text-[12px] font-medium uppercase tracking-wide text-slate-400">
          <a href="/index.html" class="hover:text-[#111827]">Home</a>
          <span>/</span>
          <span>Shop</span>
          <span>/</span>
          <span class="text-slate-500">${escapeHtml(product.name)}</span>
        </nav>

        <div class="grid gap-8 lg:grid-cols-[105px_minmax(0,1fr)_520px]">

          <div class="order-2 flex gap-3 overflow-x-auto lg:order-1 lg:flex-col lg:overflow-visible">
            ${gallery
              .map(
                (img, index) => `
                  <button
                    type="button"
                    data-gallery-thumb="${index}"
                    class="h-[118px] w-[118px] shrink-0 border border-slate-300 bg-white p-3 transition hover:border-[#2563eb] lg:w-full"
                  >
                    <img
                      src="${escapeHtml(img)}"
                      alt="${escapeHtml(product.name)}"
                      class="h-full w-full object-contain"
                      onerror="this.src='/images/products/placeholder.avif'"
                    />
                  </button>
                `,
              )
              .join("")}
          </div>

          <div class="order-1 lg:order-2">
            <div class="relative flex min-h-[460px] items-center justify-center bg-white p-8">
              <span class="absolute left-0 top-4 bg-[#05c755] px-4 py-2 text-[12px] font-black uppercase text-white">
                Hot
              </span>

              <button
                type="button"
                data-gallery-prev
                class="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-slate-200 bg-white text-[24px] shadow-sm"
              >
                ‹
              </button>

              <img
                data-main-product-image
                src="${escapeHtml(gallery[0])}"
                alt="${escapeHtml(product.name)}"
                class="max-h-[420px] max-w-full object-contain"
                onerror="this.src='/images/products/placeholder.avif'"
              />

              <button
                type="button"
                data-gallery-next
                class="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-slate-200 bg-white text-[24px] shadow-sm"
              >
                ›
              </button>
            </div>

            <div class="mt-5 flex justify-center gap-3">
              ${renderFeaturePills(features)}
            </div>
          </div>

          <div class="order-3">
            <h1 class="text-[30px] font-black leading-tight text-[#111827] md:text-[36px]">
              ${escapeHtml(product.name)}
            </h1>

            <div class="mt-4 flex flex-wrap items-center gap-3">
              <span class="text-[18px] tracking-[2px] text-slate-300">★★★★★</span>
              <span class="text-[14px] font-medium text-slate-400">
                ( There are no reviews yet. )
              </span>
            </div>

            <div class="mt-6 flex flex-wrap items-center gap-3">
              <span class="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-[13px] font-bold">f</span>
              <span class="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-[13px] font-bold">x</span>
              <span class="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-[13px] font-bold">in</span>
              <span class="ml-2 text-[13px] font-black uppercase text-[#111827]">♡ Add to Wishlist</span>
              <span class="text-[13px] font-black uppercase text-[#111827]">⚖ Compare</span>
            </div>

            <div class="mt-8 h-px w-10 bg-slate-300"></div>

            <p class="mt-7 text-[30px] font-black text-[#111827]">
              ${escapeHtml(getPriceText(product))}
            </p>

            <p class="mt-5 max-w-[560px] text-[18px] font-medium leading-8 text-slate-600">
              ${escapeHtml(description)}
            </p>

            <div class="mt-7 space-y-3 text-[14px]">
              <p>
                <span class="font-black uppercase text-[#111827]">SKU:</span>
                <span class="font-medium text-slate-500">${escapeHtml(product.artNo || "Call for Price")}</span>
              </p>

              <p>
                <span class="font-black uppercase text-[#111827]">Category:</span>
                <span class="font-medium uppercase text-slate-500">${escapeHtml(product.categoryTitle || "Product")}</span>
              </p>
            </div>

            <div class="mt-8 border-t border-slate-200 pt-6">
              <div class="flex flex-wrap items-center gap-3">
              <div class="flex h-12 items-center border border-slate-200">
  <button
    type="button"
    data-qty-minus
    class="h-full w-12 text-[20px] transition hover:bg-slate-100"
  >
    -
  </button>

  <span
    data-qty-value
    class="flex h-full w-12 items-center justify-center text-[15px] font-bold"
  >
    1
  </span>

  <button
    type="button"
    data-qty-plus
    class="h-full w-12 text-[20px] transition hover:bg-slate-100"
  >
    +
  </button>
</div>

                <a
                  href="tel:${PHONE_TEL}"
                  class="flex h-12 items-center justify-center bg-[#8b8f96] px-9 text-[13px] font-black uppercase text-white transition hover:bg-[#111827]"
                >
                  Call Now
                </a>

          <a
  href="${whatsappUrl}"
  data-whatsapp-link
  target="_blank"
  rel="noopener"
  class="flex h-12 items-center justify-center bg-[#111827] px-9 text-[13px] font-black uppercase text-white transition hover:bg-[#05c755]"
>
  WhatsApp
</a>
              </div>

              <p class="mt-4 text-[13px] font-semibold text-slate-500">
                Need price? Call: ${PHONE_DISPLAY}
              </p>
            </div>
          </div>
        </div>

        <section class="mt-16">
          <div class="border-b border-slate-200">
            <div class="flex flex-wrap gap-8">
              <button
                type="button"
                data-tab-button="description"
                class="border-b-2 border-[#111827] pb-4 text-[14px] font-black uppercase text-[#111827]"
              >
                Description
              </button>

              <button
                type="button"
                data-tab-button="details"
                class="border-b-2 border-transparent pb-4 text-[14px] font-black uppercase text-slate-500"
              >
                Details
              </button>

              <button
                type="button"
                data-tab-button="specifications"
                class="border-b-2 border-transparent pb-4 text-[14px] font-black uppercase text-slate-500"
              >
                Specifications
              </button>
            </div>
          </div>

          <div class="py-8">
            <div data-tab-panel="description">
              <p class="max-w-[900px] text-[15px] font-medium leading-8 text-slate-600">
                ${escapeHtml(description)}
              </p>
            </div>

            <div data-tab-panel="details" class="hidden">
              <p class="max-w-[900px] text-[15px] font-medium leading-8 text-slate-600">
                ${escapeHtml(details)}
              </p>

              <ul class="mt-5 grid gap-3 sm:grid-cols-2">
                ${features
                  .map(
                    (feature) => `
                      <li class="flex items-center gap-3 text-[14px] font-bold text-[#111827]">
                        <span class="flex h-7 w-7 items-center justify-center rounded-full bg-[#e8f8fb] text-[#00a8c8]">✓</span>
                        ${escapeHtml(feature)}
                      </li>
                    `,
                  )
                  .join("")}
              </ul>
            </div>

            <div data-tab-panel="specifications" class="hidden">
              ${renderSpecs(specs)}
            </div>
          </div>
        </section>

        ${renderRelatedProducts(relatedProducts)}
      </div>
    </section>
  `;

  initGallery(gallery);
  initTabs();
  initQuantity(product);
}

// if (!root) {
//   console.warn("productDetailsRoot not found. Skipping product details script.");
// } else {
//   const productSlug = getProductSlug();
//   const product = findProductBySlug(productSlug);

//   if (!product) {
//     renderNotFound();
//   } else {
//     renderProduct(product);
//   }
// }

export function initProductDetailsPage() {
  root = document.querySelector("#productDetailsRoot");
  // const root = document.querySelector("#productDetailsRoot");

  if (!root) return;

  const productSlug = getProductSlug();
  const product = findProductBySlug(productSlug);

  if (!product) {
    renderNotFound();
  } else {
    renderProduct(product);
  }
}
