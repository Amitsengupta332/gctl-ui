import { gctlProjects } from "./data/projects-data.js";

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

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getProjectIdFromUrl() {
  const parts = window.location.pathname.split("/").filter(Boolean);

  // Example:
  // /project-details/hazrat-shahjalal-airport-cctv
  if (parts[0] === "project-details" && parts[1]) {
    return decodeURIComponent(parts[1]);
  }

  return "";
}

function projectDetailsTemplate(project) {
  const badgeClass = badgeClasses[project.category] || "bg-[#0068d9]";

  return `
    <div class="mx-auto max-w-[1320px] px-4 py-10">
      <div class="grid gap-8 lg:grid-cols-[52%_48%]">
        <div class="overflow-hidden rounded-[18px] border border-[#dfe8f4] bg-[#eef4fb] shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
          <img
            src="${escapeHtml(project.image)}"
            alt="${escapeHtml(project.title)}"
            class="h-[320px] w-full object-cover md:h-[440px]"
          />
        </div>

        <div class="flex flex-col justify-center">
          <span class="inline-flex w-fit rounded-[5px] ${badgeClass} px-3 py-1.5 text-[12px] font-black text-white">
            ${escapeHtml(project.category)}
          </span>

          <h1 class="mt-5 text-[30px] font-black leading-[1.15] tracking-[-0.8px] text-[#071f4d] md:text-[42px]">
            ${escapeHtml(project.title)}
          </h1>

          <div class="mt-6 grid gap-4 sm:grid-cols-2">
            <div class="rounded-[14px] border border-[#dfe8f4] bg-[#f8fbff] p-5">
              <p class="text-[12px] font-black uppercase tracking-[0.12em] text-[#0068d9]">
                Location
              </p>
              <p class="mt-2 text-[15px] font-bold leading-6 text-[#071f4d]">
                ${escapeHtml(project.location)}
              </p>
            </div>

            <div class="rounded-[14px] border border-[#dfe8f4] bg-[#f8fbff] p-5">
              <p class="text-[12px] font-black uppercase tracking-[0.12em] text-[#0068d9]">
                System
              </p>
              <p class="mt-2 text-[15px] font-bold leading-6 text-[#071f4d]">
                ${escapeHtml(project.system)}
              </p>
            </div>
          </div>

          <p class="mt-6 text-[16px] font-semibold leading-8 text-[#40516a]">
            ${escapeHtml(project.details)}
          </p>

          <div class="mt-8 flex flex-wrap gap-3">
            <a
              href="/contact.html"
              class="inline-flex h-[50px] items-center justify-center rounded-[7px] bg-[#0068d9] px-7 text-[14px] font-black text-white shadow-[0_10px_22px_rgba(0,104,217,0.20)] transition hover:bg-[#0058bb]"
            >
              Contact Our Experts
            </a>

            <a
              href="/projects.html"
              class="inline-flex h-[50px] items-center justify-center rounded-[7px] border border-[#cdddf1] bg-white px-7 text-[14px] font-black text-[#0068d9] transition hover:border-[#0068d9] hover:bg-[#f4f9ff]"
            >
              Back to Projects
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
}

function notFoundTemplate() {
  return `
    <div class="mx-auto max-w-[900px] px-4 py-20 text-center">
      <div class="rounded-[18px] border border-[#dfe8f4] bg-[#f8fbff] p-10">
        <h1 class="text-[32px] font-black text-[#071f4d]">
          Project Not Found
        </h1>

        <p class="mx-auto mt-4 max-w-[560px] text-[15px] font-semibold leading-7 text-[#40516a]">
          Sorry, this project details page could not be found. Please go back to the projects page and try again.
        </p>

        <a
          href="/projects.html"
          class="mt-7 inline-flex h-[50px] items-center justify-center rounded-[7px] bg-[#0068d9] px-7 text-[14px] font-black text-white shadow-[0_10px_22px_rgba(0,104,217,0.20)] transition hover:bg-[#0058bb]"
        >
          Back to Projects
        </a>
      </div>
    </div>
  `;
}

export function initProjectDetailsPage() {
  const root = document.querySelector("[data-project-details-page]");
  if (!root || root.dataset.projectDetailsReady === "true") return;

  root.dataset.projectDetailsReady = "true";

  const content = root.querySelector("[data-project-detail-content]");
  if (!content) return;

  const projectId = getProjectIdFromUrl();
  const project = gctlProjects.find((item) => item.id === projectId);

  if (!project) {
    content.innerHTML = notFoundTemplate();
    document.title = "Project Not Found - GCTL";
    return;
  }

  content.innerHTML = projectDetailsTemplate(project);
  document.title = `${project.title} - GCTL`;
}

document.addEventListener("DOMContentLoaded", initProjectDetailsPage);

const projectDetailsObserver = new MutationObserver(() => {
  initProjectDetailsPage();
});

projectDetailsObserver.observe(document.documentElement, {
  childList: true,
  subtree: true,
});