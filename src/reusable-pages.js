import { PRODUCT_CATEGORIES } from "./product-data.js";

const PRODUCTS_PER_PAGE = 10;

function getMainElement() {
  return document.querySelector("main[data-page-type]");
}

function getCategory(categoryKey) {
  return PRODUCT_CATEGORIES[categoryKey] || null;
}

function getSubCategory(category, subKey) {
  if (!category || !Array.isArray(category.sub)) return null;
  return category.sub.find((item) => item.key === subKey) || null;
}

function getSubSubCategory(subCategory, subSubKey) {
  if (!subCategory || !Array.isArray(subCategory.subSub)) return null;
  return subCategory.subSub.find((item) => item.key === subSubKey) || null;
}

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function slugify(text = "") {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function imageTag(src, alt, extraClass = "") {
  return `
    <img
      src="${src || "/images/products/placeholder.avif"}"
      alt="${alt || "Product"}"
      class="${extraClass}"
      onerror="this.src='/images/products/placeholder.avif'"
    />
  `;
}

/* =========================
   Banner + Breadcrumb
========================= */
function bannerHtml({ eyebrow, title, description, banner, breadcrumb }) {
  return `
    <div class="relative overflow-hidden border-b border-[#dfeaf7] bg-[#eef6ff]">
      <div class="absolute inset-0">
        <img
          src="${banner || "/images/products/banners/cctv-surveillance.avif"}"
          alt="${title}"
          class="w-full h-full object-cover object-center"
          onerror="this.src='/images/products/banners/cctv-surveillance.avif'"
        />
        <div class="absolute inset-0 bg-gradient-to-r from-white/95 via-white/75 to-white/10"></div>
      </div>

      <div class="relative z-10 max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="min-h-[280px] flex items-center">
          <div class="max-w-[720px]">
            <p class="mb-3 text-[14px] font-bold uppercase tracking-[0.22em] text-[#0057d8]">
              ${eyebrow || "Products"}
            </p>

            <h1 class="text-[36px] sm:text-[48px] lg:text-[56px] leading-[1.05] font-extrabold text-[#071425]">
              ${title}
            </h1>

            <p class="mt-5 text-[16px] sm:text-[18px] leading-8 font-medium text-[#405068]">
              ${description || ""}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="border-b border-[#e6edf5] bg-white">
      <div class="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex flex-wrap items-center gap-2 text-[14px] font-semibold text-[#64748b]">
          ${breadcrumb}
        </div>
      </div>
    </div>
  `;
}

/* =========================
   Category Grid Card
========================= */
function categoryGridCard(item, isActive = false) {
  const activeClass = isActive
    ? "border-2 border-[#0057d8] bg-[#eef7ff]"
    : "border border-[#dfeaf7] bg-white hover:border-[#0057d8]";

  const titleClass = isActive
    ? "text-[#0057d8]"
    : "text-[#071425] group-hover:text-[#0057d8]";

  return `
    <a href="${item.link}"
      class="group h-[170px] rounded-[6px] ${activeClass} overflow-hidden bg-white shadow-[0_5px_16px_rgba(15,23,42,0.04)] hover:shadow-[0_10px_25px_rgba(0,87,216,0.10)] transition-all duration-300 flex flex-col">

      <div class="h-[122px] w-full overflow-hidden bg-white">
        ${imageTag(
          item.img || "/images/products/placeholder.avif",
          item.name,
          "w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105",
        )}
      </div>

      <div class="h-[48px] px-2 flex items-center justify-center bg-white">
        <h3 class="text-center text-[12px] sm:text-[13px] leading-[1.25] font-extrabold ${titleClass}">
          ${item.name}
        </h3>
      </div>
    </a>
  `;
}

/* =========================
   Slider Category Card
========================= */
function categoryCard(item, isActive = false) {
  const activeClass = isActive
    ? "border-2 border-[#0057d8] bg-[#eef7ff]"
    : "border border-[#dfeaf7] bg-white hover:border-[#0057d8]";

  const titleClass = isActive
    ? "text-[#0057d8]"
    : "text-[#071425] group-hover:text-[#0057d8]";

  return `
    <a href="${item.link}"
      class="snap-start shrink-0 w-[180px] sm:w-[200px] md:w-[220px] lg:w-[240px] group h-[170px] rounded-[6px] ${activeClass} overflow-hidden bg-white shadow-[0_5px_16px_rgba(15,23,42,0.04)] hover:shadow-[0_10px_25px_rgba(0,87,216,0.10)] transition-all duration-300 flex flex-col">

      <div class="h-[122px] w-full overflow-hidden bg-white">
        ${imageTag(
          item.img || "/images/products/placeholder.avif",
          item.name,
          "w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105",
        )}
      </div>

      <div class="h-[48px] px-2 flex items-center justify-center bg-white">
        <h3 class="text-center text-[12px] sm:text-[13px] leading-[1.25] font-extrabold ${titleClass}">
          ${item.name}
        </h3>
      </div>
    </a>
  `;
}

/* =========================
   Product Card
========================= */
// function productCard(product) {
//   const phone = product.phone || "+8801847213869";
//   const artNo = product.artNo || product.sku || "GCT0000";
//   const rating = Number(product.rating || 5);
//   const stars = "★★★★★".slice(0, Math.max(1, Math.min(rating, 5)));

//   return `
//     <div
//       class="group relative flex h-[410px] flex-col rounded-[10px] border border-[#e3ecf7] bg-white shadow-[0_10px_28px_rgba(15,23,42,0.07)] transition-all duration-300 overflow-hidden hover:-translate-y-1 hover:border-[#0057d8] hover:shadow-[0_18px_45px_rgba(0,87,216,0.16)]">

//       <div class="h-[245px] shrink-0 flex items-center justify-center p-5 bg-white">
//         ${imageTag(
//           product.img || "/images/products/placeholder.avif",
//           product.name || "Product",
//           "max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105",
//         )}
//       </div>

//       <div class="flex flex-1 flex-col justify-end px-3 sm:px-4 pb-4">
//         <h3 class="min-h-[48px] text-[13px] sm:text-[14px] leading-[1.35] font-black text-[#0057b8] transition-colors duration-300 group-hover:text-[#ff5a00]">
//           ${product.name || "Product Name"}
//         </h3>

//         <div class="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
//           <p class="text-[11px] sm:text-[12px] font-bold text-[#ff5a00]">
//             Art.Nr.: <span class="font-medium text-[#111827]">${artNo}</span>
//           </p>

//           <div class="text-[#ff4b00] text-[15px] sm:text-[17px] leading-none tracking-[-1px]">
//             ${stars}
//           </div>
//         </div>

//         <a href="tel:${phone}"
//           class="mt-4 flex items-center gap-2 text-[12px] sm:text-[13px] font-medium text-[#111827] transition-colors duration-300 group-hover:text-[#0057d8]">
//           <span class="w-4 h-4 rounded-[4px] bg-black text-white flex items-center justify-center shrink-0 transition-colors duration-300 group-hover:bg-[#0057d8]">
//             <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
//               <path
//                 d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.8-.4 1.2-.3 1.3.4 2.6.6 4 .6.7 0 1.2.5 1.2 1.2v3.5c0 .7-.5 1.2-1.2 1.2C10.4 22 2 13.6 2 3.4 2 2.7 2.5 2.2 3.2 2.2h3.5c.7 0 1.2.5 1.2 1.2 0 1.4.2 2.7.6 4 .1.4 0 .9-.3 1.2l-1.6 2.2z">
//               </path>
//             </svg>
//           </span>

//           <span>${phone}</span>
//         </a>
//       </div>
//     </div>
//   `;
// }

function productCard(product) {
  const phone = product.phone || "+8801847213869";
  const artNo = product.artNo || product.sku || "Call for Price";
  const rating = Number(product.rating || 5);
  const stars = "★★★★★".slice(0, Math.max(1, Math.min(rating, 5)));

  const slug = product.slug || slugify(product.name || "product");
 const detailsLink = `/product-details.html/${encodeURIComponent(slug)}`;

  return `
    <div
      class="group relative flex h-[445px] flex-col rounded-[10px] border border-[#e3ecf7] bg-white shadow-[0_10px_28px_rgba(15,23,42,0.07)] transition-all duration-300 overflow-hidden hover:-translate-y-1 hover:border-[#0057d8] hover:shadow-[0_18px_45px_rgba(0,87,216,0.16)]">

      <a href="${detailsLink}" class="h-[245px] shrink-0 flex items-center justify-center p-5 bg-white">
        ${imageTag(
          product.img || "/images/products/placeholder.avif",
          product.name || "Product",
          "max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105",
        )}
      </a>

      <div class="flex flex-1 flex-col justify-end px-3 sm:px-4 pb-4">
        <a href="${detailsLink}">
          <h3 class="min-h-[48px] text-[13px] sm:text-[14px] leading-[1.35] font-black text-[#0057b8] transition-colors duration-300 group-hover:text-[#ff5a00] hover:underline">
            ${product.name || "Product Name"}
          </h3>
        </a>

        <div class="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p class="text-[11px] sm:text-[12px] font-bold text-[#ff5a00]">
            Art.Nr.: <span class="font-medium text-[#111827]">${artNo}</span>
          </p>

          <div class="text-[#ff4b00] text-[15px] sm:text-[17px] leading-none tracking-[-1px]">
            ${stars}
          </div>
        </div>

        <a href="${detailsLink}"
          class="mt-3 inline-flex items-center justify-center rounded-full border border-[#dfeaf7] bg-[#f8fbff] px-4 py-2 text-[12px] font-black text-[#0057b8] hover:bg-[#0057b8] hover:text-white transition">
          View Details
        </a>

        <a href="tel:${phone}"
          class="mt-3 flex items-center gap-2 text-[12px] sm:text-[13px] font-medium text-[#111827] transition-colors duration-300 group-hover:text-[#0057d8]">
          <span class="w-4 h-4 rounded-[4px] bg-black text-white flex items-center justify-center shrink-0 transition-colors duration-300 group-hover:bg-[#0057d8]">
            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.8-.4 1.2-.3 1.3.4 2.6.6 4 .6.7 0 1.2.5 1.2 1.2v3.5c0 .7-.5 1.2-1.2 1.2C10.4 22 2 13.6 2 3.4 2 2.7 2.5 2.2 3.2 2.2h3.5c.7 0 1.2.5 1.2 1.2 0 1.4.2 2.7.6 4 .1.4 0 .9-.3 1.2l-1.6 2.2z">
              </path>
            </svg>
          </span>

          <span>${phone}</span>
        </a>
      </div>
    </div>
  `;
}

/* =========================
   Category Grid Section
========================= */
function categoryGridSection({ title, items, activeKey = "" }) {
  const safeItems = safeArray(items);

  return `
    <div class="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-5 border-b border-[#dfeaf7] pb-4">
        <h2 class="text-[20px] sm:text-[22px] font-extrabold text-[#071425]">
          ${title}
        </h2>
        <div class="mt-3 h-[2px] w-[42px] bg-[#0057d8]"></div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-3">
        ${safeItems
          .map((item) => categoryGridCard(item, item.key === activeKey))
          .join("")}
      </div>
    </div>
  `;
}

/* =========================
   Category Slider Section
========================= */
function categorySliderSection({
  eyebrow,
  title,
  items,
  activeKey = "",
  allProductLink = "",
  showAllProduct = true,
}) {
  const safeItems = safeArray(items);

  return `
    <div class="border-b border-[#e6edf5] bg-[#f8fbff]">
      <div class="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div class="mb-6 border-b border-[#dfeaf7] pb-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p class="text-[13px] font-bold uppercase tracking-[0.18em] text-[#0057d8]">
              ${eyebrow}
            </p>

            <h2 class="mt-2 text-[20px] sm:text-[22px] font-extrabold text-[#071425]">
              ${title}
            </h2>

            <div class="mt-3 h-[2px] w-[42px] bg-[#0057d8]"></div>
          </div>

          <div class="flex items-center gap-3">
            ${
              showAllProduct && allProductLink
                ? `
                  <a href="${allProductLink}"
                    class="inline-flex h-10 items-center justify-center rounded-[6px] border border-[#0057d8] bg-white px-4 text-[13px] font-extrabold text-[#0057d8] hover:bg-[#0057d8] hover:text-white transition-colors">
                    All Product
                  </a>
                `
                : ""
            }

            <button type="button" data-product-prev
              class="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-[6px] border border-[#dfeaf7] bg-white text-[22px] font-bold text-[#071425] hover:border-[#0057d8] hover:text-[#0057d8] transition-colors">
              ‹
            </button>

            <button type="button" data-product-next
              class="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-[6px] border border-[#dfeaf7] bg-white text-[22px] font-bold text-[#071425] hover:border-[#0057d8] hover:text-[#0057d8] transition-colors">
              ›
            </button>
          </div>
        </div>

        <div data-product-slider class="relative">
          <div data-product-track
            class="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-3 [scrollbar-width:none] [-ms-overflow-style:none]">

            ${safeItems
              .map((item) => categoryCard(item, item.key === activeKey))
              .join("")}

          </div>
        </div>
      </div>
    </div>
  `;
}

/* =========================
   Products Section with Pagination
========================= */
function productsSection(title, products) {
  const safeProducts = safeArray(products);

  return `
    <div class="bg-white border-t border-[#e6edf5]" data-paginated-products data-products-per-page="${PRODUCTS_PER_PAGE}">
      <div class="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <div class="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p class="text-[13px] font-bold uppercase tracking-[0.22em] text-[#0057d8]">
              All Products
            </p>

            <h2 class="mt-3 text-[28px] sm:text-[34px] font-extrabold text-[#071425]">
              ${title}
            </h2>

            <div class="mt-3 h-[2px] w-[42px] bg-[#0057d8]"></div>
          </div>

          ${
            safeProducts.length
              ? `
                <p class="text-[13px] sm:text-[14px] font-bold text-[#607086]">
                  Showing
                  <span data-page-start class="text-[#0057d8]">1</span>
                  -
                  <span data-page-end class="text-[#0057d8]">${Math.min(PRODUCTS_PER_PAGE, safeProducts.length)}</span>
                  of
                  <span class="text-[#0057d8]">${safeProducts.length}</span>
                  products
                </p>
              `
              : ""
          }
        </div>

        ${
          safeProducts.length
            ? `
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                ${safeProducts
                  .map(
                    (product) => `
                      <div data-product-item>
                        ${productCard(product)}
                      </div>
                    `,
                  )
                  .join("")}
              </div>

              <div data-product-pagination class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button type="button" data-page-action="prev"
                  class="inline-flex h-10 items-center justify-center rounded-[6px] border border-[#dfeaf7] bg-white px-4 text-[13px] font-extrabold text-[#071425] hover:border-[#0057d8] hover:text-[#0057d8] disabled:cursor-not-allowed disabled:opacity-40 transition-colors">
                  Previous
                </button>

                <div data-page-numbers class="flex flex-wrap items-center justify-center gap-2"></div>

                <button type="button" data-page-action="next"
                  class="inline-flex h-10 items-center justify-center rounded-[6px] border border-[#dfeaf7] bg-white px-4 text-[13px] font-extrabold text-[#071425] hover:border-[#0057d8] hover:text-[#0057d8] disabled:cursor-not-allowed disabled:opacity-40 transition-colors">
                  Next
                </button>
              </div>
            `
            : `
              <p class="text-[16px] font-semibold text-[#607086]">
                Products will be updated soon.
              </p>
            `
        }
      </div>
    </div>
  `;
}

/* =========================
   Init Product Pagination
========================= */
function initProductPagination() {
  document.querySelectorAll("[data-paginated-products]").forEach((section) => {
    const items = Array.from(section.querySelectorAll("[data-product-item]"));
    const pageSize =
      Number(section.getAttribute("data-products-per-page")) ||
      PRODUCTS_PER_PAGE;

    const pagination = section.querySelector("[data-product-pagination]");
    const pageNumbers = section.querySelector("[data-page-numbers]");
    const prevBtn = section.querySelector('[data-page-action="prev"]');
    const nextBtn = section.querySelector('[data-page-action="next"]');
    const pageStart = section.querySelector("[data-page-start]");
    const pageEnd = section.querySelector("[data-page-end]");

    if (!items.length || !pagination || !pageNumbers || !prevBtn || !nextBtn) {
      return;
    }

    const totalPages = Math.ceil(items.length / pageSize);
    let currentPage = 1;

    if (totalPages <= 1) {
      pagination.style.display = "none";
    }

    function renderPage(page) {
      currentPage = Math.max(1, Math.min(page, totalPages));

      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = Math.min(startIndex + pageSize, items.length);

      items.forEach((item, index) => {
        item.style.display =
          index >= startIndex && index < endIndex ? "" : "none";
      });

      if (pageStart) pageStart.textContent = startIndex + 1;
      if (pageEnd) pageEnd.textContent = endIndex;

      prevBtn.disabled = currentPage === 1;
      nextBtn.disabled = currentPage === totalPages;

      pageNumbers.innerHTML = Array.from({ length: totalPages })
        .map((_, index) => {
          const pageNumber = index + 1;
          const isActive = pageNumber === currentPage;

          return `
            <button type="button" data-page-number="${pageNumber}"
              class="h-10 min-w-10 rounded-[6px] border px-3 text-[13px] font-extrabold transition-colors ${
                isActive
                  ? "border-[#0057d8] bg-[#0057d8] text-white"
                  : "border-[#dfeaf7] bg-white text-[#071425] hover:border-[#0057d8] hover:text-[#0057d8]"
              }">
              ${pageNumber}
            </button>
          `;
        })
        .join("");
    }

    pagination.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button) return;

      const action = button.getAttribute("data-page-action");
      const pageNumber = button.getAttribute("data-page-number");

      if (action === "prev") {
        renderPage(currentPage - 1);
      }

      if (action === "next") {
        renderPage(currentPage + 1);
      }

      if (pageNumber) {
        renderPage(Number(pageNumber));
      }

      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });

    renderPage(1);
  });
}

/* =========================
   SEO + FAQ
   Main Category + Sub Category + Sub Sub Category
========================= */
function seoAndFaqHtml(item) {
  if (!item) return "";

  const title = item.title || item.name || "Products";

  const seoTextFromData = safeArray(item.seoText);
  const faqFromData = safeArray(item.faq);

  const seoText = seoTextFromData.length
    ? seoTextFromData
    : [
        item.description ||
          `${title} solutions for professional security, automation and technology projects.`,
        `GCTL provides ${title} products for homes, offices, factories, warehouses, apartments, schools, hospitals, banks and commercial buildings.`,
        `${title} products are suitable for reliable performance, professional installation and long-term project support.`,
      ];

  const faq = faqFromData.length
    ? faqFromData
    : [
        {
          question: `What is ${title}?`,
          answer:
            item.description ||
            `${title} is a professional product category used for security, automation and technology projects.`,
        },
        {
          question: `Where can ${title} be used?`,
          answer: `${title} can be used in homes, offices, factories, warehouses, apartments, schools, hospitals, banks, shopping malls and commercial buildings.`,
        },
        {
          question: `Do you provide installation support for ${title}?`,
          answer: `Yes, GCTL provides product supply, installation, configuration and project support for ${title}.`,
        },
      ];

  return `
    <!-- SEO Text -->
    <div class="bg-[#f7fbff] py-12 lg:py-16 border-t border-[#e4eef8]">
      <div class="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="rounded-[22px] border border-[#dfeaf7] bg-white p-5 sm:p-8 lg:p-10 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
          <h2 class="text-[24px] sm:text-[32px] leading-tight font-extrabold text-[#071b45] tracking-[-0.02em]">
            ${item.seoTitle || `${title} in Bangladesh`}
          </h2>

          <div class="mt-5 space-y-5 text-[15px] sm:text-[16px] leading-7 sm:leading-8 font-medium text-[#40516b]">
            ${seoText.map((text) => `<p>${text}</p>`).join("")}
          </div>
        </div>
      </div>
    </div>

    <!-- FAQ -->
    <div class="bg-white py-12 lg:py-16 pb-24 lg:pb-16">
      <div class="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-8">
          <h2 class="text-[28px] sm:text-[34px] leading-tight font-extrabold text-[#071b45] tracking-[-0.02em]">
            Frequently Asked Questions
          </h2>
          <div class="w-[52px] h-[3px] bg-[#0057d8] mx-auto mt-4 rounded-full"></div>
        </div>

        <div class="space-y-4">
          ${faq
            .map(
              (faqItem) => `
                <details class="group rounded-[16px] border border-[#dfeaf7] bg-white p-5 open:shadow-[0_12px_35px_rgba(15,23,42,0.08)]">
                  <summary class="cursor-pointer list-none flex items-center justify-between gap-5">
                    <span class="text-[16px] sm:text-[17px] font-extrabold text-[#071b45]">
                      ${faqItem.question}
                    </span>

                    <span class="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#eef6ff] text-xl font-bold text-[#0057d8] group-open:rotate-45 transition-transform">
                      +
                    </span>
                  </summary>

                  <p class="mt-4 text-[15px] leading-7 font-medium text-[#40516b]">
                    ${faqItem.answer}
                  </p>
                </details>
              `,
            )
            .join("")}
        </div>
      </div>
    </div>
  `;
}

/* =========================
   Render Main Category Page
========================= */
function renderCategoryPage(category) {
  const root = document.getElementById("reusableCategoryPage");
  if (!root) return;

  const subCategories = safeArray(category.sub);
  const products = subCategories.flatMap((sub) => safeArray(sub.products));

  root.innerHTML = `
    ${bannerHtml({
      eyebrow: category.eyebrow || "Products",
      title: category.title,
      description: category.description,
      banner: category.banner,
      breadcrumb: `
        <a href="/index.html" class="hover:text-[#0057d8]">Home</a>
        <span>/</span>
        <span class="text-[#0057d8]">${category.title}</span>
      `,
    })}

    ${categoryGridSection({
      title: "Browse by Category",
      items: subCategories,
    })}

    ${productsSection(`${category.title} Products`, products)}

    ${seoAndFaqHtml(category)}
  `;

  initProductPagination();
}

/* =========================
   Render Sub Category Page
========================= */
function renderSubCategoryPage(category, subCategory) {
  const root = document.getElementById("reusableSubCategoryPage");
  if (!root) return;

  const subSubItems = safeArray(subCategory.subSub);
  const products = safeArray(subCategory.products);

  root.innerHTML = `
    ${bannerHtml({
      eyebrow: category.title,
      title: subCategory.name,
      description: subCategory.description,
      banner: subCategory.banner || category.banner,
      breadcrumb: `
        <a href="/index.html" class="hover:text-[#0057d8]">Home</a>
        <span>/</span>
        <a href="${category.link}" class="hover:text-[#0057d8]">${category.title}</a>
        <span>/</span>
        <span class="text-[#0057d8]">${subCategory.name}</span>
      `,
    })}

    ${
      subSubItems.length
        ? categoryGridSection({
            title: "Browse by Category",
            items: subSubItems,
          })
        : ""
    }

    ${productsSection(`${subCategory.name} Products`, products)}

    ${seoAndFaqHtml(subCategory)}
  `;

  initProductPagination();
}

/* =========================
   Render Sub Sub Category Page
========================= */
function renderSubSubCategoryPage(category, subCategory, subSubCategory) {
  const root = document.getElementById("reusableSubSubCategoryPage");
  if (!root) return;

  const subSubItems = safeArray(subCategory.subSub);
  const products = safeArray(subSubCategory.products);

  root.innerHTML = `
    ${bannerHtml({
      eyebrow: subCategory.name,
      title: subSubCategory.name,
      description: subSubCategory.description,
      banner: subSubCategory.banner || subCategory.banner || category.banner,
      breadcrumb: `
        <a href="/index.html" class="hover:text-[#0057d8]">Home</a>
        <span>/</span>
        <a href="${category.link}" class="hover:text-[#0057d8]">${category.title}</a>
        <span>/</span>
        <a href="${subCategory.link}" class="hover:text-[#0057d8]">${subCategory.name}</a>
        <span>/</span>
        <span class="text-[#0057d8]">${subSubCategory.name}</span>
      `,
    })}

    ${categorySliderSection({
      eyebrow: `${subCategory.name} Types`,
      title: `Browse ${subCategory.name} Categories`,
      items: subSubItems,
      activeKey: subSubCategory.key,
      allProductLink: subCategory.link,
      showAllProduct: true,
    })}

    ${productsSection(`${subSubCategory.name} Products`, products)}

    ${seoAndFaqHtml(subSubCategory)}
  `;

  initProductPagination();
}

/* =========================
   Init Reusable Pages
========================= */
export function initReusablePages() {
  const main = getMainElement();
  if (!main) return;

  const pageType = main.getAttribute("data-page-type");
  const categoryKey = main.getAttribute("data-category-key");
  const subKey = main.getAttribute("data-sub-key");
  const subSubKey = main.getAttribute("data-sub-sub-key");

  const category = getCategory(categoryKey);

  if (!category) {
    console.warn("Reusable page category not found:", categoryKey);
    return;
  }

  if (pageType === "category") {
    renderCategoryPage(category);
    return;
  }

  const subCategory = getSubCategory(category, subKey);

  if (!subCategory) {
    console.warn("Reusable page sub category not found:", subKey);
    return;
  }

  if (pageType === "sub-category") {
    renderSubCategoryPage(category, subCategory);
    return;
  }

  const subSubCategory = getSubSubCategory(subCategory, subSubKey);

  if (!subSubCategory) {
    console.warn("Reusable page sub sub category not found:", subSubKey);
    return;
  }

  if (pageType === "sub-sub-category") {
    renderSubSubCategoryPage(category, subCategory, subSubCategory);
  }
}
