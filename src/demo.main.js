import "./style.css";

async function loadComponents() {
  const components = document.querySelectorAll("[data-component]");

  for (const component of components) {
    const file = component.getAttribute("data-component");

    try {
      const response = await fetch(file);

      if (!response.ok) {
        throw new Error(`Component not found: ${file}`);
      }

      const html = await response.text();
      component.innerHTML = html;
    } catch (error) {
      console.error(error);
    }
  }

  initNavbarMenu();
  initNavbarSearch();
}

function initNavbarMenu() {
  const mobileMenuButton = document.getElementById("mobileMenuButton");
  const mobileMenu = document.getElementById("mobileMenu");

  if (!mobileMenuButton || !mobileMenu) return;

  mobileMenuButton.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();

    mobileMenu.classList.toggle("hidden");
  });

  mobileMenu.addEventListener("click", function (e) {
    e.stopPropagation();
  });

  document.addEventListener("click", function () {
    mobileMenu.classList.add("hidden");
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth >= 1024) {
      mobileMenu.classList.add("hidden");
    }
  });
}

function initNavbarSearch() {
  const searchButton = document.getElementById("navbarSearchButton");
  const searchBox = document.getElementById("navbarSearchBox");
  const searchClose = document.getElementById("navbarSearchClose");

  if (!searchButton || !searchBox || !searchClose) return;

  searchButton.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();

    searchBox.classList.toggle("hidden");
  });

  searchClose.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();

    searchBox.classList.add("hidden");
  });

  searchBox.addEventListener("click", function (e) {
    e.stopPropagation();
  });

  document.addEventListener("click", function () {
    searchBox.classList.add("hidden");
  });

  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      searchBox.classList.add("hidden");
    }
  });
}

document.addEventListener("DOMContentLoaded", loadComponents);