import { gctlProjects } from "./data/projects-data.js";

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
    (category) => category === "All Projects" || available.has(category)
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

        <button
          type="button"
          data-project-detail="${escapeHtml(project.id)}"
          class="mt-auto inline-flex w-fit items-center gap-3 pt-5 text-[14px] font-black text-[#0068d9] transition hover:text-[#004ea8]"
        >
          View Details
          <span class="text-lg">→</span>
        </button>
      </div>
    </article>
  `;
}

function modalTemplate(project) {
  const badgeClass = badgeClasses[project.category] || "bg-[#0068d9]";

  return `
    <div class="grid max-h-[92vh] overflow-y-auto md:grid-cols-[45%_55%]">
      <div class="bg-[#eef4fb]">
        <img
          src="${escapeHtml(project.image)}"
          alt="${escapeHtml(project.title)}"
          class="h-[300px] w-full object-cover md:h-full"
        />
      </div>

      <div class="p-7 md:p-9">
        <span class="inline-flex rounded-[4px] ${badgeClass} px-3 py-1.5 text-[12px] font-black text-white">
          ${escapeHtml(project.category)}
        </span>

        <h2 class="mt-4 pr-8 text-[27px] font-black leading-[1.2] tracking-[-0.6px] text-[#071f4d]">
          ${escapeHtml(project.title)}
        </h2>

        <div class="mt-5 grid gap-3 rounded-[12px] border border-[#dfe8f4] bg-[#f8fbff] p-4 text-[14px] font-semibold text-[#40516a]">
          <p>
            <span class="font-black text-[#071f4d]">Location:</span>
            ${escapeHtml(project.location)}
          </p>
          <p>
            <span class="font-black text-[#071f4d]">System:</span>
            ${escapeHtml(project.system)}
          </p>
        </div>

        <p class="mt-6 text-[15px] font-medium leading-7 text-[#40516a]">
          ${escapeHtml(project.details)}
        </p>

        <div class="mt-7 flex flex-wrap gap-3">
          <a
            href="/contact.html"
            class="inline-flex h-[46px] items-center justify-center rounded-[7px] bg-[#0068d9] px-6 text-[14px] font-black text-white shadow-[0_10px_22px_rgba(0,104,217,0.20)] transition hover:bg-[#0058bb]"
          >
            Contact Our Experts
          </a>

          <button
            type="button"
            data-project-modal-close
            class="inline-flex h-[46px] items-center justify-center rounded-[7px] border border-[#cdddf1] bg-white px-6 text-[14px] font-black text-[#0068d9] transition hover:border-[#0068d9]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderProjects(root, activeCategory = "All Projects") {
  const list = root.querySelector("[data-project-list]");
  const empty = root.querySelector("[data-project-empty]");

  const filteredProjects =
    activeCategory === "All Projects"
      ? gctlProjects
      : gctlProjects.filter((project) => project.category === activeCategory);

  list.innerHTML = filteredProjects.map(projectCardTemplate).join("");
  empty.classList.toggle("hidden", filteredProjects.length > 0);
}

function renderFilters(root, activeCategory = "All Projects") {
  const filters = root.querySelector("[data-project-filters]");
  filters.innerHTML = "";

  getVisibleCategories().forEach((category) => {
    filters.appendChild(createFilterButton(category, activeCategory));
  });
}

function openProjectModal(root, projectId) {
  const project = gctlProjects.find((item) => item.id === projectId);
  if (!project) return;

  const modal = root.querySelector("[data-project-modal]");
  const content = root.querySelector("[data-project-modal-content]");

  content.innerHTML = modalTemplate(project);
  modal.classList.remove("hidden");
  modal.classList.add("flex");
  document.body.classList.add("overflow-hidden");
}

function closeProjectModal(root) {
  const modal = root.querySelector("[data-project-modal]");
  const content = root.querySelector("[data-project-modal-content]");

  modal.classList.add("hidden");
  modal.classList.remove("flex");
  content.innerHTML = "";
  document.body.classList.remove("overflow-hidden");
}

export function initProjectsPage() {
  const root = document.querySelector("[data-projects-page]");
  if (!root || root.dataset.projectReady === "true") return;

  root.dataset.projectReady = "true";

  let activeCategory = "All Projects";

  renderFilters(root, activeCategory);
  renderProjects(root, activeCategory);

  root.addEventListener("click", (event) => {
    const filterButton = event.target.closest("[data-category]");
    const detailButton = event.target.closest("[data-project-detail]");
    const closeButton = event.target.closest("[data-project-modal-close]");
    const modal = root.querySelector("[data-project-modal]");
    const modalPanel = root.querySelector("[data-project-modal-panel]");

    if (filterButton) {
      activeCategory = filterButton.dataset.category;
      renderFilters(root, activeCategory);
      renderProjects(root, activeCategory);
      return;
    }

    if (detailButton) {
      openProjectModal(root, detailButton.dataset.projectDetail);
      return;
    }

    if (closeButton) {
      closeProjectModal(root);
      return;
    }

    if (
      modal &&
      !modal.classList.contains("hidden") &&
      event.target === modal &&
      !modalPanel.contains(event.target)
    ) {
      closeProjectModal(root);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeProjectModal(root);
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