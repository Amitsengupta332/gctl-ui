import fs from "fs";
import path from "path";
import { PRODUCT_CATEGORIES } from "../src/product-data.js";

const categoryKey = process.argv[2];

if (!categoryKey) {
  throw new Error("Please provide category key. Example: node tools/generate-category-pages.js entrance");
}

const category = PRODUCT_CATEGORIES[categoryKey];

if (!category) {
  throw new Error(`Category not found in src/product-data.js: ${categoryKey}`);
}

function createFile(fileName, html) {
  const filePath = path.join(process.cwd(), fileName.replace("/", ""));

  fs.writeFileSync(filePath, html.trim(), "utf8");

  console.log(`Created: ${fileName.replace("/", "")}`);
}

function getTitle(name) {
  return `${name} | GCTL Security & Automation`;
}

function categoryWrapper({ title, categoryKey }) {
  return `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title>${getTitle(title)}</title>
</head>

<body class="bg-white text-slate-900">
  <div data-component="/components/navbar.html"></div>

  <main data-page-type="category" data-category-key="${categoryKey}">
    <div data-component="/pages/templates/category-page.html"></div>
  </main>

  <div data-component="/components/footer.html"></div>

  <script type="module" src="/src/main.js"></script>
</body>

</html>
`;
}

function subCategoryWrapper({ title, categoryKey, subKey }) {
  return `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title>${getTitle(title)}</title>
</head>

<body class="bg-white text-slate-900">
  <div data-component="/components/navbar.html"></div>

  <main
    data-page-type="sub-category"
    data-category-key="${categoryKey}"
    data-sub-key="${subKey}"
  >
    <div data-component="/pages/templates/sub-category-page.html"></div>
  </main>

  <div data-component="/components/footer.html"></div>

  <script type="module" src="/src/main.js"></script>
</body>

</html>
`;
}

function subSubCategoryWrapper({ title, categoryKey, subKey, subSubKey }) {
  return `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title>${getTitle(title)}</title>
</head>

<body class="bg-white text-slate-900">
  <div data-component="/components/navbar.html"></div>

  <main
    data-page-type="sub-sub-category"
    data-category-key="${categoryKey}"
    data-sub-key="${subKey}"
    data-sub-sub-key="${subSubKey}"
  >
    <div data-component="/pages/templates/sub-sub-category-page.html"></div>
  </main>

  <div data-component="/components/footer.html"></div>

  <script type="module" src="/src/main.js"></script>
</body>

</html>
`;
}

createFile(
  category.link,
  categoryWrapper({
    title: category.title,
    categoryKey: category.key,
  })
);

category.sub.forEach((sub) => {
  createFile(
    sub.link,
    subCategoryWrapper({
      title: sub.name,
      categoryKey: category.key,
      subKey: sub.key,
    })
  );

  if (Array.isArray(sub.subSub)) {
    sub.subSub.forEach((subSub) => {
      createFile(
        subSub.link,
        subSubCategoryWrapper({
          title: subSub.name,
          categoryKey: category.key,
          subKey: sub.key,
          subSubKey: subSub.key,
        })
      );
    });
  }
});