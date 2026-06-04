import { PRODUCT_CATEGORIES, CATEGORY_PAGE_PRODUCTS } from "../product-data.js";

export function slugify(text = "") {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeProduct(product, extra = {}) {
  return {
    ...product,
    slug: product.slug || slugify(product.name),
    artNo: product.artNo || "Call for Price",
    details:
      product.details ||
      product.description ||
      `${product.name} is a professional security product for home, office, commercial and industrial projects.`,
    features: product.features || [
      "Reliable performance",
      "Professional security solution",
      "Easy installation",
      "Suitable for commercial projects",
    ],
    specs: product.specs || {
      Category: extra.categoryTitle || "Security Product",
      Type: extra.subTitle || extra.categoryTitle || "Product",
      Usage: "Home, Office, Commercial, Industrial",
    },
    ...extra,
  };
}

export function getAllProducts() {
  const allProducts = [];

  // old product-data.js products
  Object.values(PRODUCT_CATEGORIES).forEach((category) => {
    category.sub?.forEach((sub) => {
      sub.products?.forEach((product) => {
        allProducts.push(
          normalizeProduct(product, {
            categoryKey: category.key,
            categoryTitle: category.title,
            subKey: sub.key,
            subTitle: sub.name,
          }),
        );
      });

      sub.subSub?.forEach((subSub) => {
        subSub.products?.forEach((product) => {
          allProducts.push(
            normalizeProduct(product, {
              categoryKey: category.key,
              categoryTitle: category.title,
              subKey: sub.key,
              subTitle: sub.name,
              subSubKey: subSub.key,
              subSubTitle: subSub.name,
            }),
          );
        });
      });
    });
  });

  // new 5 HTML page products
  Object.values(CATEGORY_PAGE_PRODUCTS || {}).forEach((section) => {
    section.products?.forEach((product) => {
      allProducts.push(
        normalizeProduct(product, {
          categoryKey: section.categoryKey,
          categoryTitle: section.title,
          sourceSectionKey: section.key,
        }),
      );
    });
  });

  return allProducts;
}

export function findProductBySlug(slug) {
  return getAllProducts().find((product) => product.slug === slug);
}
