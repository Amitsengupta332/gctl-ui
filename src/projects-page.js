import { gctlProjects } from "./data/projects-data.js";

const PROJECTS_PER_PAGE = 9;

const categoryOrder = [
  "All Projects",
  "Corporate",
  "Government",
  "Industrial",
  "Commercial",
  "Educational",
  "Transportation",
  "Healthcare",
  "Hospitality",
  "Retail",
];

const categoryIcons = {
  "All Projects": "☰",
  Corporate: "▦",
  Government: "🏛",
  Industrial: "▥",
  Commercial: "▤",
  Educational: "🎓",
  Transportation: "▰",
  Healthcare: "+",
  Hospitality: "⌂",
  Retail: "◈",
};

const badgeClasses = {
  Corporate: "bg-[#0068d9]",
  Government: "bg-[#6d5dfc]",
  Industrial: "bg-[#009688]",
  Commercial: "bg-[#f97316]",
  Educational: "bg-[#0077b6]",
  Transportation: "bg-[#f59e0b]",
  Healthcare: "bg-[#16a34a]",
  Hospitality: "bg-[#8b5cf6]",
  Retail: "bg-[#e11d48]",
};

const filterBaseClass =
  "inline-flex h-[48px] items-center gap-3 rounded-[7px] px-5 text-[14px] font-bold transition";
const filterActiveClass =
  "bg-[#0068d9] px-8 text-white shadow-[0_10px_20px_rgba(0,104,217,0.22)]";
const filterInactiveClass =
  "text-[#34445d] hover:bg-[#eef7ff] hover:text-[#0068d9]";

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getVisibleCategories() {
  const available = new Set(gctlProjects.map((project) => project.category));

  return categoryOrder.filter(
    (category) => category === "All Projects" || available.has(category),
  );
}

function createFilterButton(category, activeCategory) {
  const isActive = category === activeCategory;
  const button = document.createElement("button");

  button.type = "button";
  button.dataset.category = category;
  button.className = `${filterBaseClass} ${
    isActive ? filterActiveClass : filterInactiveClass
  }`;

  button.innerHTML = `
    <span class="inline-flex h-5 w-5 items-center justify-center text-[15px] leading-none">
      ${categoryIcons[category] || "•"}
    </span>
    <span>${category}</span>
  `;

  return button;
}

function projectCardTemplate(project) {
  const badgeClass = badgeClasses[project.category] || "bg-[#0068d9]";

  return `
    <article
      class="group overflow-hidden rounded-[12px] border border-[#dfe8f4] bg-white shadow-[0_10px_26px_rgba(15,23,42,0.055)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.10)]"
    >
      <div class="overflow-hidden bg-[#eef4fb]">
        <img
          src="${escapeHtml(project.image)}"
          alt="${escapeHtml(project.title)}"
          loading="lazy"
          class="h-[210px] w-full object-cover transition duration-500 group-hover:scale-[1.04]"
        />
      </div>

      <div class="flex min-h-[255px] flex-col p-5">
        <span class="inline-flex w-fit rounded-[4px] ${badgeClass} px-2.5 py-1 text-[11px] font-black text-white">
          ${escapeHtml(project.category)}
        </span>

        <h3 class="mt-3 text-[18px] font-black leading-snug text-[#071f4d]">
          ${escapeHtml(project.title)}
        </h3>

        <p class="mt-2 flex items-center gap-1.5 text-[12px] font-semibold text-[#5b6b82]">
          <span>📍</span>
          ${escapeHtml(project.location)}
        </p>

        <p class="mt-4 text-[14px] font-medium leading-6 text-[#40516a]">
          ${escapeHtml(project.summary)}
        </p>

        <a
          href="/project-details/${encodeURIComponent(project.id)}"
          class="mt-auto inline-flex w-fit items-center gap-3 pt-5 text-[14px] font-black text-[#0068d9] transition hover:text-[#004ea8]"
        >
          View Details
          <span class="text-lg">→</span>
        </a>
      </div>
    </article>
  `;
}

function getFilteredProjects(activeCategory = "All Projects") {
  return activeCategory === "All Projects"
    ? gctlProjects
    : gctlProjects.filter((project) => project.category === activeCategory);
}

function getPaginationElement(root) {
  const list = root.querySelector("[data-project-list]");
  if (!list) return null;

  let pagination = root.querySelector("[data-project-pagination]");

  if (!pagination) {
    list.insertAdjacentHTML(
      "afterend",
      `
        <div data-project-pagination class="mt-10 flex flex-col items-center justify-center gap-4">
          <p data-project-count class="text-[14px] font-bold text-[#5b6b82]"></p>

          <div class="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              data-project-page-action="prev"
              class="inline-flex h-10 items-center justify-center rounded-[6px] border border-[#dfe8f4] bg-white px-4 text-[13px] font-black text-[#071f4d] transition hover:border-[#0068d9] hover:text-[#0068d9] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <div data-project-page-numbers class="flex flex-wrap items-center justify-center gap-2"></div>

            <button
              type="button"
              data-project-page-action="next"
              class="inline-flex h-10 items-center justify-center rounded-[6px] border border-[#dfe8f4] bg-white px-4 text-[13px] font-black text-[#071f4d] transition hover:border-[#0068d9] hover:text-[#0068d9] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      `,
    );

    pagination = root.querySelector("[data-project-pagination]");
  }

  return pagination;
}

function renderPagination(root, totalProjects, currentPage) {
  const pagination = getPaginationElement(root);
  if (!pagination) return;

  const totalPages = Math.ceil(totalProjects / PROJECTS_PER_PAGE);
  const countText = pagination.querySelector("[data-project-count]");
  const pageNumbers = pagination.querySelector("[data-project-page-numbers]");
  const prevBtn = pagination.querySelector('[data-project-page-action="prev"]');
  const nextBtn = pagination.querySelector('[data-project-page-action="next"]');

  if (!countText || !pageNumbers || !prevBtn || !nextBtn) return;

  if (totalPages <= 1) {
    pagination.classList.add("hidden");
    return;
  }

  pagination.classList.remove("hidden");

  const startItem = (currentPage - 1) * PROJECTS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * PROJECTS_PER_PAGE, totalProjects);

  countText.innerHTML = `
    Showing
    <span class="text-[#0068d9]">${startItem}</span>
    -
    <span class="text-[#0068d9]">${endItem}</span>
    of
    <span class="text-[#0068d9]">${totalProjects}</span>
    projects
  `;

  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;

  pageNumbers.innerHTML = Array.from({ length: totalPages })
    .map((_, index) => {
      const pageNumber = index + 1;
      const isActive = pageNumber === currentPage;

      return `
        <button
          type="button"
          data-project-page="${pageNumber}"
          class="inline-flex h-10 min-w-10 items-center justify-center rounded-[6px] border px-3 text-[13px] font-black transition ${
            isActive
              ? "border-[#0068d9] bg-[#0068d9] text-white shadow-[0_8px_18px_rgba(0,104,217,0.18)]"
              : "border-[#dfe8f4] bg-white text-[#071f4d] hover:border-[#0068d9] hover:text-[#0068d9]"
          }"
        >
          ${pageNumber}
        </button>
      `;
    })
    .join("");
}

function renderProjects(root, activeCategory = "All Projects", currentPage = 1) {
  const list = root.querySelector("[data-project-list]");
  const empty = root.querySelector("[data-project-empty]");

  if (!list || !empty) return;

  const filteredProjects = getFilteredProjects(activeCategory);
  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);
  const safePage = Math.max(1, Math.min(currentPage, totalPages || 1));

  const startIndex = (safePage - 1) * PROJECTS_PER_PAGE;
  const endIndex = startIndex + PROJECTS_PER_PAGE;
  const visibleProjects = filteredProjects.slice(startIndex, endIndex);

  list.innerHTML = visibleProjects.map(projectCardTemplate).join("");

  empty.classList.toggle("hidden", filteredProjects.length > 0);

  renderPagination(root, filteredProjects.length, safePage);
}

function renderFilters(root, activeCategory = "All Projects") {
  const filters = root.querySelector("[data-project-filters]");
  if (!filters) return;

  filters.innerHTML = "";

  getVisibleCategories().forEach((category) => {
    filters.appendChild(createFilterButton(category, activeCategory));
  });
}

export function initProjectsPage() {
  const root = document.querySelector("[data-projects-page]");
  if (!root || root.dataset.projectReady === "true") return;

  root.dataset.projectReady = "true";

  let activeCategory = "All Projects";
  let currentPage = 1;

  renderFilters(root, activeCategory);
  renderProjects(root, activeCategory, currentPage);

  root.addEventListener("click", (event) => {
    const filterButton = event.target.closest("[data-category]");
    const pageButton = event.target.closest("[data-project-page]");
    const pageActionButton = event.target.closest("[data-project-page-action]");

    if (filterButton) {
      activeCategory = filterButton.dataset.category;
      currentPage = 1;

      renderFilters(root, activeCategory);
      renderProjects(root, activeCategory, currentPage);

      const list = root.querySelector("[data-project-list]");
      if (list) {
        list.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      return;
    }

    if (pageButton) {
      currentPage = Number(pageButton.dataset.projectPage) || 1;
      renderProjects(root, activeCategory, currentPage);

      const list = root.querySelector("[data-project-list]");
      if (list) {
        list.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      return;
    }

    if (pageActionButton) {
      const filteredProjects = getFilteredProjects(activeCategory);
      const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);
      const action = pageActionButton.dataset.projectPageAction;

      if (action === "prev") {
        currentPage = Math.max(1, currentPage - 1);
      }

      if (action === "next") {
        currentPage = Math.min(totalPages, currentPage + 1);
      }

      renderProjects(root, activeCategory, currentPage);

      const list = root.querySelector("[data-project-list]");
      if (list) {
        list.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", initProjectsPage);

const projectObserver = new MutationObserver(() => {
  initProjectsPage();
});

projectObserver.observe(document.documentElement, {
  childList: true,
  subtree: true,
});