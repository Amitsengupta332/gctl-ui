import { findProductBySlug } from "../utils/product-utils.js";

const root = document.querySelector("#productDetailsRoot");

if (!root) {
  console.warn("productDetailsRoot not found. Skipping product details script.");
} else {
  const querySlug = new URLSearchParams(window.location.search).get("product");

  const pathParts = window.location.pathname.split("/").filter(Boolean);
  const lastPathPart = pathParts[pathParts.length - 1];

  const productSlug = decodeURIComponent(
    querySlug || (lastPathPart !== "product-details.html" ? lastPathPart : "")
  );

  if (querySlug) {
    window.history.replaceState(
      {},
      "",
      `/product-details.html/${encodeURIComponent(productSlug)}`
    );
  }

  console.log("Product Slug:", productSlug);

  const product = findProductBySlug(productSlug);

  if (!product) {
    root.innerHTML = `
      <section class="py-16 bg-white">
        <div class="max-w-[1200px] mx-auto px-4 text-center">
          <h1 class="text-[32px] font-black text-red-600">Product Not Found</h1>
          <p class="mt-3 text-slate-600">Product slug missing or wrong.</p>
          <a href="/index.html" class="mt-6 inline-flex rounded-full bg-[#0057b8] px-6 py-3 text-white font-bold">
            Back Home
          </a>
        </div>
      </section>
    `;
  } else {
    document.title = `${product.name} - GCTL`;

    root.innerHTML = `
      <section class="bg-[#f7fbff] py-8 lg:py-12">
        <div class="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">

          <div class="mb-6 flex flex-wrap items-center gap-2 text-[13px] font-semibold text-[#667993]">
            <a href="/index.html" class="hover:text-[#0068d9]">Home</a>
            <span>›</span>
            <span>${product.categoryTitle || "Products"}</span>
            <span>›</span>
            <span class="text-[#071f4d]">${product.name}</span>
          </div>

          <div class="grid gap-8 rounded-[22px] border border-[#dfeaf7] bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] lg:grid-cols-[520px_1fr] lg:p-8">

            <div class="rounded-[18px] border border-[#e5eef8] bg-white p-6">
              <div class="flex min-h-[360px] items-center justify-center">
                <img
                  src="${product.img}"
                  alt="${product.name}"
                  class="max-h-[340px] max-w-full object-contain"
                />
              </div>
            </div>

            <div class="flex flex-col justify-center">
              <p class="text-[13px] font-black uppercase tracking-[0.18em] text-[#ff5a00]">
                ${product.categoryTitle || "Product"}
              </p>

              <h1 class="mt-3 text-[30px] font-black leading-tight text-[#071f4d] sm:text-[40px] lg:text-[48px]">
                ${product.name}
              </h1>

              <div class="mt-4 flex flex-wrap items-center gap-3">
                <span class="rounded-full bg-[#fff1e8] px-4 py-2 text-[13px] font-bold text-[#ff5a00]">
                  Art.Nr.: <span class="text-[#111827]">${product.artNo || "Call for Price"}</span>
                </span>

                <span class="text-[18px] leading-none text-[#ff4b00]">★★★★★</span>
              </div>

              <p class="mt-5 max-w-[720px] text-[15px] font-medium leading-[1.8] text-[#334155]">
                ${product.details || product.description || ""}
              </p>

              <div class="mt-7 grid gap-3 sm:grid-cols-2">
                ${(product.features || [])
                  .map(
                    (feature) => `
                      <div class="flex items-center gap-3 rounded-[14px] border border-[#e7eef7] bg-[#f8fbff] p-3">
                        <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0057b8] text-white">
                          ✓
                        </span>
                        <span class="text-[13px] font-bold text-[#071f4d]">${feature}</span>
                      </div>
                    `
                  )
                  .join("")}
              </div>

              <div class="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="tel:+8801847213869"
                  class="inline-flex items-center justify-center rounded-full bg-[#ff5a00] px-7 py-3 text-[14px] font-black text-white">
                  Call for Price
                </a>

                <a href="/index.html"
                  class="inline-flex items-center justify-center rounded-full border border-[#d7e4f2] bg-white px-7 py-3 text-[14px] font-black text-[#071f4d]">
                  Back To Home
                </a>
              </div>
            </div>
          </div>

          <div class="mt-8 rounded-[22px] border border-[#dfeaf7] bg-white p-5 shadow-[0_12px_34px_rgba(15,23,42,0.06)] lg:p-7">
            <h2 class="text-[24px] font-black text-[#071f4d]">Product Specifications</h2>

            <div class="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              ${Object.entries(product.specs || {})
                .map(
                  ([key, value]) => `
                    <div class="rounded-[14px] border border-[#e7eef7] bg-[#f8fbff] p-4">
                      <p class="text-[12px] font-black uppercase tracking-[0.12em] text-[#64748b]">${key}</p>
                      <p class="mt-2 text-[14px] font-bold text-[#071f4d]">${value}</p>
                    </div>
                  `
                )
                .join("")}
            </div>
          </div>

        </div>
      </section>
    `;
  }
}