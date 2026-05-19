import { PRODUCT_CATEGORIES } from "./product-data.js";

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
   Used in:
   - Main category page
   - Sub category page
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
      class="group h-[165px] rounded-[6px] ${activeClass} p-3 shadow-[0_6px_20px_rgba(15,23,42,0.04)] hover:shadow-[0_12px_30px_rgba(0,87,216,0.10)] transition-all duration-300 flex flex-col items-center justify-center">

      <div class="h-[90px] w-full flex items-center justify-center overflow-hidden">
        ${imageTag(
          item.img || "/images/products/placeholder.avif",
          item.name,
          "max-h-[86px] max-w-[170px] object-contain mx-auto mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
        )}
      </div>

      <h3 class="mt-3 text-center text-[14px] sm:text-[15px] font-extrabold ${titleClass}">
        ${item.name}
      </h3>
    </a>
  `;
}

/* =========================
   Slider Category Card
   Used in:
   - Sub-sub category page
========================= */
function categoryCard(item, isActive = false) {
  const activeClass = isActive
    ? "border-2 border-[#0057d8] bg-[#eef7ff] shadow-[0_10px_25px_rgba(0,87,216,0.10)]"
    : "border border-[#dfeaf7] bg-white hover:border-[#0057d8] hover:shadow-[0_12px_30px_rgba(0,87,216,0.10)]";

  const titleClass = isActive
    ? "text-[#0057d8]"
    : "text-[#071425] group-hover:text-[#0057d8]";

  return `
    <a href="${item.link}"
      class="snap-start shrink-0 w-[210px] sm:w-[230px] md:w-[250px] lg:w-[270px] group h-[150px] rounded-[6px] ${activeClass} px-4 py-3 transition-all duration-300 flex flex-col items-center justify-center">

      <div class="h-[92px] w-full flex items-center justify-center overflow-hidden">
        ${imageTag(
          item.img || "/images/products/placeholder.avif",
          item.name,
          "max-h-[88px] max-w-[180px] object-contain mx-auto mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
        )}
      </div>

      <h3 class="mt-2 text-center text-[14px] sm:text-[15px] font-extrabold ${titleClass}">
        ${item.name}
      </h3>
    </a>
  `;
}

/* =========================
   Product Card
========================= */
function productCard(product) {
  return `
    <div class="group rounded-[6px] border border-[#dfeaf7] bg-white overflow-hidden shadow-[0_6px_20px_rgba(15,23,42,0.04)] hover:border-[#0057d8] hover:shadow-[0_12px_30px_rgba(0,87,216,0.10)] transition-all duration-300">
      <div class="h-[230px] bg-white flex items-center justify-center border-b border-[#eef3f8]">
        ${imageTag(
          product.img || "/images/products/placeholder.avif",
          product.name,
          "w-full h-full object-contain p-7 mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
        )}
      </div>

      <div class="p-5">
        <h3 class="text-[18px] font-extrabold text-[#071425] group-hover:text-[#0057d8]">
          ${product.name || "Product Name"}
        </h3>

        <p class="mt-3 text-[14px] leading-6 font-medium text-[#5b6b80]">
          ${product.description || "Product description will be updated soon."}
        </p>

        <div class="mt-5 flex items-center justify-between">
          <span class="text-[13px] font-extrabold uppercase tracking-[0.12em] text-[#0057d8]">
            Call for Price
          </span>

          <a href="/contact.html"
            class="inline-flex h-10 items-center justify-center rounded-[6px] bg-[#0057d8] px-4 text-[13px] font-extrabold text-white hover:bg-[#004bb8] transition-colors">
            Ask Quote
          </a>
        </div>
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
    <div class="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="mb-6 border-b border-[#dfeaf7] pb-4">
        <h2 class="text-[20px] sm:text-[22px] font-extrabold text-[#071425]">
          ${title}
        </h2>
        <div class="mt-3 h-[2px] w-[42px] bg-[#0057d8]"></div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
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
            class="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-3">

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
   Products Section
========================= */
function productsSection(title, products) {
  const safeProducts = safeArray(products);

  return `
    <div class="bg-white border-t border-[#e6edf5]">
      <div class="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <div class="mb-7">
          <p class="text-[13px] font-bold uppercase tracking-[0.22em] text-[#0057d8]">
            Products
          </p>

          <h2 class="mt-3 text-[28px] sm:text-[34px] font-extrabold text-[#071425]">
            ${title}
          </h2>

          <p class="mt-3 text-[15px] sm:text-[16px] font-medium text-[#64748b]">
            Choose from available products for your project.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          ${
            safeProducts.length
              ? safeProducts.map(productCard).join("")
              : `<p class="text-[16px] font-semibold text-[#607086]">Products will be updated soon.</p>`
          }
        </div>
      </div>
    </div>
  `;
}

/* =========================
   SEO + FAQ
========================= */
function seoAndFaqHtml(category) {
  const seoText = safeArray(category.seoText);
  const faq = safeArray(category.faq);

  if (!seoText.length && !faq.length) return "";

  return `
    ${
      seoText.length
        ? `
          <div class="bg-[#f8fbff] py-10 border-t border-[#e6edf5]">
            <div class="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
              <div class="rounded-[6px] border border-[#dfeaf7] bg-white p-6 sm:p-8 shadow-[0_6px_20px_rgba(15,23,42,0.04)]">
                <h2 class="text-[24px] sm:text-[30px] font-extrabold text-[#071425]">
                  ${category.seoTitle || category.title}
                </h2>

                <div class="mt-5 space-y-4 text-[15px] leading-8 font-medium text-[#405068]">
                  ${seoText.map((text) => `<p>${text}</p>`).join("")}
                </div>
              </div>
            </div>
          </div>
        `
        : ""
    }

    ${
      faq.length
        ? `
          <div class="bg-white py-10 border-t border-[#e6edf5]">
            <div class="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
              <h2 class="text-[26px] sm:text-[34px] font-extrabold text-[#071425] text-center">
                Frequently Asked Questions
              </h2>

              <div class="mt-8 space-y-4">
                ${faq
                  .map(
                    (item) => `
                      <div class="rounded-[6px] border border-[#dfeaf7] bg-white p-5 shadow-[0_6px_20px_rgba(15,23,42,0.04)]">
                        <h3 class="text-[17px] font-extrabold text-[#071425]">
                          ${item.question}
                        </h3>
                        <p class="mt-2 text-[15px] leading-7 font-medium text-[#405068]">
                          ${item.answer}
                        </p>
                      </div>
                    `
                  )
                  .join("")}
              </div>
            </div>
          </div>
        `
        : ""
    }
  `;
}

/* =========================
   Render Main Category Page
   Example:
   /cctv-surveillance.html
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
}

/* =========================
   Render Sub Category Page
   Example:
   /hd-cctv-camera.html
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
  `;
}

/* =========================
   Render Sub Sub Category Page
   Example:
   /sub-hd-dome-camera.html
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
  `;
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