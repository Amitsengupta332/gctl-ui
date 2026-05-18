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
      src="${src}"
      alt="${alt}"
      class="${extraClass}"
      onerror="this.src='/images/products/placeholder.avif'"
    />
  `;
}

function productCard(product) {
  return `
    <div class="group rounded-[18px] border border-[#dfeaf7] bg-white overflow-hidden shadow-[0_10px_30px_rgba(15,23,42,0.06)] hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(0,87,216,0.14)] transition-all duration-300">
      <div class="h-[260px] bg-[#f4f8fd] flex items-center justify-center">
        ${imageTag(
          product.img || "/images/products/placeholder.avif",
          product.name || "Product",
          "w-full h-full object-contain p-8"
        )}
      </div>

      <div class="p-5">
        <h3 class="text-[19px] font-extrabold text-[#071425] group-hover:text-[#0057d8]">
          ${product.name || "Product Name"}
        </h3>

        <p class="mt-3 text-[14px] leading-6 font-medium text-[#5b6b80]">
          ${product.description || "Product description will be updated soon."}
        </p>

        <div class="mt-5 flex items-center justify-between">
          <span class="text-[14px] font-bold text-[#0057d8]">Call for Price</span>
          <a href="/contact.html"
            class="inline-flex h-10 items-center justify-center rounded-lg bg-[#0057d8] px-4 text-[14px] font-bold text-white hover:bg-[#004bb8] transition-colors">
            Ask Quote
          </a>
        </div>
      </div>
    </div>
  `;
}

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
        <div class="min-h-[300px] flex items-center">
          <div class="max-w-[760px]">
            <p class="mb-3 text-[14px] font-extrabold uppercase tracking-[0.18em] text-[#0057d8]">
              ${eyebrow || "Products"}
            </p>

            <h1 class="text-[38px] sm:text-[48px] lg:text-[58px] leading-tight font-extrabold text-[#071b45]">
              ${title}
            </h1>

            <p class="mt-5 text-[17px] sm:text-[18px] leading-8 font-medium text-[#40516b]">
              ${description || ""}
            </p>

            <div class="mt-7 flex flex-wrap items-center gap-3 text-[14px] font-bold text-[#40516b]">
              ${breadcrumb}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function categoryCard(item, isActive = false) {
  const activeClass = isActive
    ? "border-2 border-[#0057d8] bg-[#eef7ff] shadow-[0_16px_40px_rgba(0,87,216,0.12)]"
    : "border border-[#dfeaf7] bg-white hover:border-[#0057d8] hover:shadow-[0_16px_40px_rgba(0,87,216,0.12)]";

  const imageBg = isActive ? "bg-white" : "bg-[#f7fbff]";

  const titleClass = isActive
    ? "text-[#0057d8]"
    : "text-[#071b45] group-hover:text-[#0057d8]";

  return `
    <a href="${item.link}"
      class="group rounded-[16px] ${activeClass} p-4 transition-all duration-300">
      <div class="h-[160px] rounded-[14px] ${imageBg} flex items-center justify-center p-5">
        ${imageTag(
          item.img || "/images/products/placeholder.avif",
          item.name,
          "max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
        )}
      </div>

      <h3 class="mt-4 text-[17px] font-extrabold ${titleClass}">
        ${item.name}
      </h3>

      <p class="mt-1 text-[13px] leading-5 font-medium text-[#607086]">
        ${isActive ? "Current category" : item.description || "View category"}
      </p>
    </a>
  `;
}

function seoAndFaqHtml(category) {
  const seoText = safeArray(category.seoText);
  const faq = safeArray(category.faq);

  if (!seoText.length && !faq.length) return "";

  return `
    ${
      seoText.length
        ? `
          <div class="bg-white py-12 lg:py-16 border-t border-[#e4eef8]">
            <div class="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
              <div class="rounded-[18px] border border-[#dfeaf7] bg-white p-6 sm:p-8 lg:p-10 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
                <h2 class="text-[26px] sm:text-[32px] font-extrabold text-[#071b45]">
                  ${category.seoTitle || category.title}
                </h2>

                <div class="mt-5 space-y-5 text-[16px] leading-8 font-medium text-[#40516b]">
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
          <div class="bg-[#f7fbff] py-12 lg:py-16 border-t border-[#e4eef8]">
            <div class="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
              <h2 class="text-[28px] sm:text-[36px] font-extrabold text-[#071b45] text-center">
                Frequently Asked Questions
              </h2>

              <div class="mt-8 space-y-4">
                ${faq
                  .map(
                    (item) => `
                      <div class="rounded-[16px] border border-[#dfeaf7] bg-white p-5">
                        <h3 class="text-[18px] font-extrabold text-[#071b45]">
                          ${item.question}
                        </h3>
                        <p class="mt-2 text-[15px] leading-7 font-medium text-[#40516b]">
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
        <a href="/products.html" class="hover:text-[#0057d8]">Products</a>
        <span>/</span>
        <span class="text-[#0057d8]">${category.title}</span>
      `,
    })}

    <div class="bg-white py-10 lg:py-12">
      <div class="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-7">
          <p class="text-[14px] font-extrabold uppercase tracking-[0.18em] text-[#0057d8]">
            Categories
          </p>
          <h2 class="mt-2 text-[28px] sm:text-[36px] font-extrabold text-[#071b45]">
            Choose ${category.title} Category
          </h2>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          ${subCategories.map((item) => categoryCard(item)).join("")}
        </div>
      </div>
    </div>

    <div class="bg-[#f7fbff] py-10 lg:py-12 border-t border-[#e4eef8]">
      <div class="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-7">
          <p class="text-[14px] font-extrabold uppercase tracking-[0.18em] text-[#0057d8]">
            Products
          </p>
          <h2 class="mt-2 text-[28px] sm:text-[36px] font-extrabold text-[#071b45]">
            ${category.title} Products
          </h2>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          ${
            products.length
              ? products.map(productCard).join("")
              : `<p class="text-[16px] font-semibold text-[#607086]">Products will be updated soon.</p>`
          }
        </div>
      </div>
    </div>

    ${seoAndFaqHtml(category)}
  `;
}

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
      banner: category.banner,
      breadcrumb: `
        <a href="/index.html" class="hover:text-[#0057d8]">Home</a>
        <span>/</span>
        <a href="/products.html" class="hover:text-[#0057d8]">Products</a>
        <span>/</span>
        <a href="${category.link}" class="hover:text-[#0057d8]">${category.title}</a>
        <span>/</span>
        <span class="text-[#0057d8]">${subCategory.name}</span>
      `,
    })}

    <div class="bg-white py-10 lg:py-12">
      <div class="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-7">
          <div>
            <p class="text-[14px] font-extrabold uppercase tracking-[0.18em] text-[#0057d8]">
              ${category.title}
            </p>
            <h2 class="mt-2 text-[28px] sm:text-[36px] font-extrabold text-[#071b45]">
              Browse ${subCategory.name} Categories
            </h2>
          </div>

          <a href="${category.link}"
            class="inline-flex h-11 items-center justify-center rounded-full border border-[#cfe0f5] px-5 text-[14px] font-bold text-[#0057d8] hover:bg-[#eef7ff] transition-colors">
            Back to ${category.title}
          </a>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          ${
            subSubItems.length
              ? subSubItems.map((item) => categoryCard(item)).join("")
              : `<p class="text-[16px] font-semibold text-[#607086]">Sub categories will be updated soon.</p>`
          }
        </div>
      </div>
    </div>

    <div class="bg-[#f7fbff] py-10 lg:py-12 border-t border-[#e4eef8]">
      <div class="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-7">
          <p class="text-[14px] font-extrabold uppercase tracking-[0.18em] text-[#0057d8]">
            Products
          </p>
          <h2 class="mt-2 text-[28px] sm:text-[36px] font-extrabold text-[#071b45]">
            ${subCategory.name} Products
          </h2>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          ${
            products.length
              ? products.map(productCard).join("")
              : `<p class="text-[16px] font-semibold text-[#607086]">Products will be updated soon.</p>`
          }
        </div>
      </div>
    </div>
  `;
}

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
      banner: category.banner,
      breadcrumb: `
        <a href="/index.html" class="hover:text-[#0057d8]">Home</a>
        <span>/</span>
        <a href="/products.html" class="hover:text-[#0057d8]">Products</a>
        <span>/</span>
        <a href="${category.link}" class="hover:text-[#0057d8]">${category.title}</a>
        <span>/</span>
        <a href="${subCategory.link}" class="hover:text-[#0057d8]">${subCategory.name}</a>
        <span>/</span>
        <span class="text-[#0057d8]">${subSubCategory.name}</span>
      `,
    })}

    <div class="bg-white py-10 lg:py-12">
      <div class="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-7">
          <div>
            <p class="text-[14px] font-extrabold uppercase tracking-[0.18em] text-[#0057d8]">
              ${subCategory.name}
            </p>
            <h2 class="mt-2 text-[28px] sm:text-[36px] font-extrabold text-[#071b45]">
              Browse ${subCategory.name} Categories
            </h2>
          </div>

          <a href="${subCategory.link}"
            class="inline-flex h-11 items-center justify-center rounded-full border border-[#cfe0f5] px-5 text-[14px] font-bold text-[#0057d8] hover:bg-[#eef7ff] transition-colors">
            Back to ${subCategory.name}
          </a>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          ${subSubItems
            .map((item) => categoryCard(item, item.key === subSubCategory.key))
            .join("")}
        </div>
      </div>
    </div>

    <div class="bg-[#f7fbff] py-10 lg:py-12 border-t border-[#e4eef8]">
      <div class="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-7">
          <p class="text-[14px] font-extrabold uppercase tracking-[0.18em] text-[#0057d8]">
            Products
          </p>
          <h2 class="mt-2 text-[28px] sm:text-[36px] font-extrabold text-[#071b45]">
            ${subSubCategory.name} Products
          </h2>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          ${
            products.length
              ? products.map(productCard).join("")
              : `<p class="text-[16px] font-semibold text-[#607086]">Products will be updated soon.</p>`
          }
        </div>
      </div>
    </div>
  `;
}

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