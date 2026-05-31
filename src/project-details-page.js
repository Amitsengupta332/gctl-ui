import { gctlProjects } from "./data/projects-data.js";

const badgeClasses = {
  Corporate: "bg-[#0068d9]",
  Government: "bg-[#6d5dfc]",
  Industrial: "bg-[#009688]",
  Commercial: "bg-[#f97316]",
  Educational: "bg-[#0077b6]",
  Transportation: "bg-[#f5a800]",
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

  if (parts[0] === "project-details" && parts[1]) {
    return decodeURIComponent(parts[1]);
  }

  return "";
}

function getClientName(project) {
  if (project.client) return project.client;

  const atMatch = project.title.match(/\bat\s+(.+)$/i);
  if (atMatch?.[1]) return atMatch[1].replaceAll('"', "").trim();

  const quoteMatch = project.title.match(/"([^"]+)"/);
  if (quoteMatch?.[1]) return quoteMatch[1].trim();

  return project.title;
}

function getGalleryImages(project) {
  const images =
    Array.isArray(project.gallery) && project.gallery.length > 0
      ? project.gallery
      : [project.image];

  return Array.from({ length: 4 }, (_, index) => images[index % images.length]);
}

function getSystemType(project) {
  const system = String(project.system || "").toLowerCase();

  if (
    system.includes("turnstile") ||
    system.includes("tripod") ||
    system.includes("flap") ||
    system.includes("swing")
  ) {
    return "turnstile";
  }

  if (system.includes("kiosk")) {
    return "kiosk";
  }

  if (
    system.includes("cctv") ||
    system.includes("camera") ||
    system.includes("surveillance")
  ) {
    return "cctv";
  }

  if (
    system.includes("baggage") ||
    system.includes("x-ray") ||
    system.includes("xray")
  ) {
    return "baggage";
  }

  if (
    system.includes("metal detector") ||
    system.includes("archway") ||
    system.includes("walkthrough")
  ) {
    return "metalDetector";
  }

  if (
    system.includes("led") ||
    system.includes("billboard") ||
    system.includes("display")
  ) {
    return "led";
  }

  if (
    system.includes("car parking") ||
    system.includes("parking") ||
    system.includes("vehicle barrier")
  ) {
    return "barrier";
  }

  if (
    system.includes("access") ||
    system.includes("fingerprint") ||
    system.includes("face") ||
    system.includes("qr")
  ) {
    return "access";
  }

  if (system.includes("fire")) {
    return "fire";
  }

  if (system.includes("alarm")) {
    return "alarm";
  }

  return "default";
}
function getProjectCopy(project) {
  const type = getSystemType(project);

  const copy = {
    cctv: {
      heading: "Advanced Surveillance Solution Delivered Successfully",
      paragraphOne: `This project involved the deployment of a professional CCTV surveillance solution at ${project.location}. The system was planned to improve visibility, monitoring control, and overall security coverage across important areas of the site.`,
      paragraphTwo:
        "Our team focused on proper camera placement, cable management, recording setup, and stable monitoring performance to ensure reliable day-to-day security operations.",
      stats: [
        ["200+", "Camera Coverage"],
        ["24/7", "Monitoring"],
        ["100%", "Secure Setup"],
      ],
      scopes: [
        [
          "Site Survey",
          "Reviewed key monitoring points, entry areas, and security-sensitive zones.",
        ],
        [
          "Camera Installation",
          "Installed cameras, cabling, mounting accessories, and related surveillance equipment.",
        ],
        [
          "Recording Setup",
          "Configured recording devices, monitoring display, storage, and camera views.",
        ],
        [
          "Testing & Handover",
          "Tested camera coverage and handed over the system with basic operational guidance.",
        ],
      ],
    },

    baggage: {
      heading: "Reliable Baggage Screening Solution Installed",
      paragraphOne: `This project focused on improving entrance screening and safety operations at ${project.location}. The X-Ray baggage scanner solution helps the client inspect bags and parcels more efficiently before allowing access.`,
      paragraphTwo:
        "The installation was completed with attention to equipment placement, operator usability, power safety, and smooth screening workflow for daily operations.",
      stats: [
        ["Fast", "Screening"],
        ["Safe", "Inspection"],
        ["100%", "Operational"],
      ],
      scopes: [
        [
          "Entrance Assessment",
          "Checked entrance area, traffic flow, and scanner placement requirements.",
        ],
        [
          "Scanner Installation",
          "Installed the baggage scanner with proper positioning and power connection.",
        ],
        [
          "Operator Setup",
          "Configured the system display and basic scanning workflow for operators.",
        ],
        [
          "Final Testing",
          "Tested baggage scanning performance and completed project handover.",
        ],
      ],
    },

    metalDetector: {
      heading: "Smart Entrance Screening System Completed",
      paragraphOne: `This project delivered a professional metal detection solution at ${project.location}. The system helps strengthen visitor screening and supports safer entry control for the premises.`,
      paragraphTwo:
        "Our team ensured proper gate positioning, sensitivity configuration, and operational testing so the client can manage visitor screening with confidence.",
      stats: [
        ["Smart", "Detection"],
        ["Safe", "Entry"],
        ["100%", "Tested"],
      ],
      scopes: [
        [
          "Entry Point Review",
          "Identified the best installation point for controlled visitor screening.",
        ],
        [
          "Gate Installation",
          "Installed the archway metal detector gate with stable setup and alignment.",
        ],
        [
          "Sensitivity Setup",
          "Configured detection sensitivity based on site security requirements.",
        ],
        [
          "Testing & Training",
          "Tested detection performance and provided basic usage guidance.",
        ],
      ],
    },

    led: {
      heading: "High-Impact Digital Display Solution Delivered",
      paragraphOne: `This project included the installation of a professional LED display solution at ${project.location}. The display system was planned to improve visibility, communication, branding, and digital content presentation.`,
      paragraphTwo:
        "We focused on display positioning, visual clarity, stable connectivity, and smooth content presentation to support long-term usage.",
      stats: [
        ["Bright", "Display"],
        ["Clear", "Visuals"],
        ["100%", "Configured"],
      ],
      scopes: [
        [
          "Display Planning",
          "Reviewed viewing distance, installation area, and display visibility requirements.",
        ],
        [
          "LED Installation",
          "Installed LED display modules, structure, wiring, and control equipment.",
        ],
        [
          "Content Setup",
          "Configured display control system and tested sample content playback.",
        ],
        [
          "Quality Check",
          "Checked brightness, alignment, color output, and final display performance.",
        ],
      ],
    },

    kiosk: {
      heading: "Modern Self-Service Display Kiosk Installed",
      paragraphOne: `This project delivered a professional kiosk display solution at ${project.location}. The kiosk helps improve digital communication, information access, and visitor engagement for the client.`,
      paragraphTwo:
        "The installation was completed with focus on placement, display clarity, user accessibility, and stable daily operation.",
      stats: [
        ["Smart", "Display"],
        ["Easy", "Access"],
        ["100%", "Ready"],
      ],
      scopes: [
        [
          "Placement Planning",
          "Selected a suitable area for better visibility and visitor access.",
        ],
        [
          "Kiosk Installation",
          "Installed the kiosk unit with secure positioning and power setup.",
        ],
        [
          "Display Setup",
          "Configured display settings and basic content presentation features.",
        ],
        [
          "Final Handover",
          "Tested the kiosk operation and handed over the project successfully.",
        ],
      ],
    },

    barrier: {
      heading: "Controlled Vehicle Access Solution Completed",
      paragraphOne: `This project involved the installation of a vehicle barrier solution at ${project.location}. The system helps control vehicle entry and exit while improving parking security and traffic management.`,
      paragraphTwo:
        "Our team completed the setup with proper barrier alignment, control configuration, and operational testing for smooth vehicle movement.",
      stats: [
        ["Secure", "Vehicle Entry"],
        ["Smooth", "Operation"],
        ["100%", "Tested"],
      ],
      scopes: [
        [
          "Driveway Assessment",
          "Checked vehicle movement area, entry point, and barrier placement.",
        ],
        [
          "Barrier Installation",
          "Installed the barrier gate, control unit, and necessary accessories.",
        ],
        [
          "Control Setup",
          "Configured opening, closing, and access control operation.",
        ],
        [
          "Testing & Handover",
          "Tested vehicle movement workflow and completed project handover.",
        ],
      ],
    },

    turnstile: {
      heading: "Professional Pedestrian Access Control Delivered",
      paragraphOne: `This project delivered a pedestrian access control solution at ${project.location}. The system helps manage staff and visitor movement through a controlled and organized entry process.`,
      paragraphTwo:
        "The installation was completed with attention to movement flow, access control integration, safety, and long-term operational reliability.",
      stats: [
        ["Controlled", "Entry"],
        ["Smooth", "Movement"],
        ["100%", "Configured"],
      ],
      scopes: [
        [
          "Entry Flow Review",
          "Checked pedestrian movement area and access control requirements.",
        ],
        [
          "Gate Installation",
          "Installed turnstile/barrier gate with proper alignment and stability.",
        ],
        [
          "Access Setup",
          "Configured access control connection and operational behavior.",
        ],
        [
          "Final Testing",
          "Tested entry flow, safety response, and completed handover.",
        ],
      ],
    },

    access: {
      heading: "Smart Access Control System Implemented",
      paragraphOne: `This project focused on secure access management at ${project.location}. The installed system helps the client control authorized entry using modern access verification technology.`,
      paragraphTwo:
        "Our team completed device installation, configuration, testing, and handover to support reliable access and attendance operations.",
      stats: [
        ["Smart", "Access"],
        ["Secure", "Entry"],
        ["100%", "Configured"],
      ],
      scopes: [
        [
          "Requirement Analysis",
          "Reviewed access points, user flow, and security requirements.",
        ],
        [
          "Device Installation",
          "Installed access readers, mounting equipment, and related connections.",
        ],
        [
          "Software Setup",
          "Configured users, access rules, and device communication settings.",
        ],
        [
          "Testing & Handover",
          "Tested access operation and provided basic management guidance.",
        ],
      ],
    },

    fire: {
      heading: "Reliable Fire Safety System Installed",
      paragraphOne: `This project delivered a fire alarm solution at ${project.location}. The system helps improve emergency awareness and supports faster response during fire-related incidents.`,
      paragraphTwo:
        "The installation was completed with proper device placement, wiring, panel setup, testing, and handover for safer facility operation.",
      stats: [
        ["Safe", "Protection"],
        ["Quick", "Alert"],
        ["100%", "Tested"],
      ],
      scopes: [
        [
          "Safety Review",
          "Reviewed fire safety zones and alarm device placement requirements.",
        ],
        [
          "Device Installation",
          "Installed detectors, alarm devices, panel, and related wiring.",
        ],
        ["Panel Setup", "Configured fire alarm panel and zone operation."],
        [
          "Testing & Handover",
          "Tested alarm response and completed system handover.",
        ],
      ],
    },

    alarm: {
      heading: "Intruder Alert Solution Delivered Successfully",
      paragraphOne: `This project focused on strengthening site security at ${project.location}. The intruder alarm system helps detect unauthorized access attempts and improves emergency response capability.`,
      paragraphTwo:
        "Our team completed sensor placement, alarm control setup, testing, and user handover for reliable security monitoring.",
      stats: [
        ["Quick", "Alert"],
        ["Secure", "Zones"],
        ["100%", "Ready"],
      ],
      scopes: [
        [
          "Security Zone Review",
          "Identified sensitive areas and alarm coverage requirements.",
        ],
        [
          "Sensor Installation",
          "Installed sensors, alarm devices, and control accessories.",
        ],
        [
          "System Setup",
          "Configured alarm zones, response behavior, and control options.",
        ],
        ["Final Testing", "Tested alarm triggering and completed handover."],
      ],
    },

    default: {
      heading: "Professional Security Solution Delivered Successfully",
      paragraphOne: `This project was completed at ${project.location} with a focus on quality installation, reliable operation, and long-term usability for the client.`,
      paragraphTwo:
        "Our team handled planning, installation, configuration, testing, and project handover to ensure a smooth and professional delivery.",
      stats: [
        ["Smart", "Solution"],
        ["Reliable", "Setup"],
        ["100%", "Completed"],
      ],
      scopes: [
        [
          "Project Planning",
          "Reviewed the client requirement and prepared the installation approach.",
        ],
        [
          "System Installation",
          "Installed the required devices, accessories, and supporting equipment.",
        ],
        [
          "Configuration",
          "Configured the system for smooth and reliable operation.",
        ],
        [
          "Testing & Handover",
          "Completed final testing and handed over the project successfully.",
        ],
      ],
    },
  };

  return copy[type] || copy.default;
}

function iconSvg(name) {
  const icons = {
    shield: `
      <svg viewBox="0 0 24 24" class="h-7 w-7" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"></path>
        <path d="m9 12 2 2 4-5"></path>
      </svg>
    `,
    camera: `
      <svg viewBox="0 0 24 24" class="h-7 w-7" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M4 7h4l2-3h4l2 3h4v13H4V7Z"></path>
        <circle cx="12" cy="13" r="3"></circle>
      </svg>
    `,
    gear: `
      <svg viewBox="0 0 24 24" class="h-7 w-7" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path>
        <path d="M19.4 15a1.8 1.8 0 0 0 .36 1.98l.04.04a2.1 2.1 0 0 1-2.97 2.97l-.04-.04a1.8 1.8 0 0 0-1.98-.36 1.8 1.8 0 0 0-1.1 1.65V22a2.1 2.1 0 0 1-4.2 0v-.06a1.8 1.8 0 0 0-1.1-1.65 1.8 1.8 0 0 0-1.98.36l-.04.04a2.1 2.1 0 0 1-2.97-2.97l.04-.04A1.8 1.8 0 0 0 4.6 15a1.8 1.8 0 0 0-1.65-1.1H2.9a2.1 2.1 0 0 1 0-4.2h.06A1.8 1.8 0 0 0 4.6 8a1.8 1.8 0 0 0-.36-1.98l-.04-.04A2.1 2.1 0 0 1 7.17 3l.04.04A1.8 1.8 0 0 0 9.2 3.4 1.8 1.8 0 0 0 10.3 1.75V1.7a2.1 2.1 0 0 1 4.2 0v.06a1.8 1.8 0 0 0 1.1 1.65 1.8 1.8 0 0 0 1.98-.36l.04-.04a2.1 2.1 0 0 1 2.97 2.97l-.04.04A1.8 1.8 0 0 0 19.4 8c.18.64.77 1.1 1.65 1.1h.06a2.1 2.1 0 0 1 0 4.2h-.06A1.8 1.8 0 0 0 19.4 15Z"></path>
      </svg>
    `,
    location: `
      <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 21s7-4.4 7-11a7 7 0 1 0-14 0c0 6.6 7 11 7 11Z"></path>
        <circle cx="12" cy="10" r="2.5"></circle>
      </svg>
    `,
    system: `
      <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="5" width="18" height="12" rx="2"></rect>
        <path d="M8 21h8"></path>
        <path d="M12 17v4"></path>
      </svg>
    `,
    calendar: `
      <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="4" width="18" height="18" rx="2"></rect>
        <path d="M16 2v4"></path>
        <path d="M8 2v4"></path>
        <path d="M3 10h18"></path>
      </svg>
    `,
    user: `
      <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="8" r="4"></circle>
        <path d="M4 22c1.5-4 4.5-6 8-6s6.5 2 8 6"></path>
      </svg>
    `,
    headset: `
      <svg viewBox="0 0 24 24" class="h-8 w-8" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M4 13a8 8 0 0 1 16 0"></path>
        <path d="M4 13v4a2 2 0 0 0 2 2h2v-7H6a2 2 0 0 0-2 2Z"></path>
        <path d="M20 13v4a2 2 0 0 1-2 2h-2v-7h2a2 2 0 0 1 2 2Z"></path>
        <path d="M14 21h-2"></path>
      </svg>
    `,
  };

  return icons[name] || icons.shield;
}

function projectDetailsTemplate(project) {
  const badgeClass = badgeClasses[project.category] || "bg-[#0068d9]";
  const clientName = getClientName(project);
  const galleryImages = getGalleryImages(project);
  const projectCopy = getProjectCopy(project);
  return `
    <div class="bg-[#f6f9fd] px-4 py-8">
      <div class="mx-auto max-w-[1320px] overflow-hidden rounded-[16px] border border-[#dce8f6] bg-white shadow-[0_16px_45px_rgba(15,23,42,0.08)]">

        <!-- Breadcrumb -->
        <div class="border-b border-[#dce8f6] bg-white px-6 py-5 md:px-10">
          <div class="flex items-center gap-3 text-[13px] font-bold">
            <a href="/index.html" class="text-[#005eea] transition hover:text-[#071f4d]">Home</a>
            <span class="text-[#9aaabe]">›</span>
            <a href="/projects.html" class="text-[#005eea] transition hover:text-[#071f4d]">Projects</a>
            <span class="text-[#9aaabe]">›</span>
            <span class="text-[#071f4d]">Project Details</span>
          </div>
        </div>

        <!-- Hero -->
        <section class="bg-[radial-gradient(circle_at_top_left,#eef8ff_0%,#ffffff_45%,#eef7ff_100%)] px-6 py-10 md:px-10 md:py-14">
          <div class="grid items-center gap-10 lg:grid-cols-[1.03fr_0.97fr]">
            <div>
              <span class="inline-flex rounded-full ${badgeClass} px-5 py-1.5 text-[12px] font-black uppercase tracking-[0.04em] text-white shadow-[0_8px_18px_rgba(0,104,217,0.18)]">
                ${escapeHtml(project.category)}
              </span>

              <h1 class="mt-6 max-w-[650px] text-[34px] font-black leading-[1.17] tracking-[-1.2px] text-[#071f4d] md:text-[48px]">
                ${escapeHtml(project.title)}
              </h1>

              <p class="mt-6 max-w-[620px] text-[16px] font-semibold leading-8 text-[#40516a]">
                ${escapeHtml(project.details)}
              </p>

              <div class="mt-8 flex flex-wrap gap-4">
                <a
                  href="/contact.html"
                  class="inline-flex h-[54px] items-center justify-center gap-4 rounded-[8px] bg-[#005eea] px-7 text-[15px] font-black text-white shadow-[0_14px_26px_rgba(0,94,234,0.24)] transition hover:bg-[#004fc5]"
                >
                  Contact Our Experts
                  <span class="text-[24px] leading-none">→</span>
                </a>

                <a
                  href="/projects.html"
                  class="inline-flex h-[54px] items-center justify-center rounded-[8px] border border-[#005eea] bg-white px-7 text-[15px] font-black text-[#005eea] transition hover:bg-[#f2f7ff]"
                >
                  Back to Projects
                </a>
              </div>

              <div class="mt-10 grid gap-5 sm:grid-cols-3">
                <div class="flex items-center gap-3">
                  <div class="text-[#005eea]">${iconSvg("shield")}</div>
                  <div>
                    <p class="text-[13px] font-black text-[#071f4d]">High Security</p>
                    <p class="text-[12px] font-medium text-[#51647e]">Advanced protection</p>
                  </div>
                </div>

                <div class="flex items-center gap-3">
                  <div class="text-[#005eea]">${iconSvg("camera")}</div>
                  <div>
                    <p class="text-[13px] font-black text-[#071f4d]">24/7 Monitoring</p>
                    <p class="text-[12px] font-medium text-[#51647e]">Continuous surveillance</p>
                  </div>
                </div>

                <div class="flex items-center gap-3">
                  <div class="text-[#005eea]">${iconSvg("gear")}</div>
                  <div>
                    <p class="text-[13px] font-black text-[#071f4d]">Professional Setup</p>
                    <p class="text-[12px] font-medium text-[#51647e]">Expert installation</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="overflow-hidden rounded-[16px] bg-[#eef4fb] shadow-[0_20px_50px_rgba(15,23,42,0.14)]">
              <img
                src="${escapeHtml(project.image)}"
                alt="${escapeHtml(project.title)}"
                class="h-[330px] w-full object-cover md:h-[500px]"
              />
            </div>
          </div>
        </section>

        <!-- Body -->
        <section class="border-t border-[#dce8f6] px-6 py-10 md:px-10 md:py-12">
          <div class="grid gap-10 lg:grid-cols-[1fr_380px]">

            <!-- Left Content -->
            <!-- Left Content -->
            <div>
              <div class="mb-6 flex items-center gap-4">
                <span class="h-8 w-1 rounded-full bg-[#005eea]"></span>
                <h2 class="text-[18px] font-black text-[#071f4d]">Project Overview</h2>
              </div>

              <h3 class="text-[27px] font-black leading-tight tracking-[-0.5px] text-[#071f4d]">
                ${escapeHtml(projectCopy.heading)}
              </h3>

              <p class="mt-5 text-[15px] font-medium leading-8 text-[#40516a]">
                ${escapeHtml(projectCopy.paragraphOne)}
              </p>

              <p class="mt-4 text-[15px] font-medium leading-8 text-[#40516a]">
                ${escapeHtml(projectCopy.paragraphTwo)}
              </p>

              <!-- Stats -->
              <div class="mt-8 grid gap-5 md:grid-cols-3">
                ${projectCopy.stats
                  .map(
                    ([number, label]) => `
                      <div class="rounded-[12px] border border-[#dce8f6] bg-white p-7 text-center shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
                        <div class="mx-auto flex h-12 w-12 items-center justify-center text-[#005eea]">
                          ${iconSvg("shield")}
                        </div>
                        <p class="mt-3 text-[30px] font-black text-[#071f4d]">
                          ${escapeHtml(number)}
                        </p>
                        <p class="text-[14px] font-semibold text-[#40516a]">
                          ${escapeHtml(label)}
                        </p>
                      </div>
                    `,
                  )
                  .join("")}
              </div>

              <!-- Scope -->
              <div class="mb-6 mt-10 flex items-center gap-4">
                <span class="h-8 w-1 rounded-full bg-[#005eea]"></span>
                <h2 class="text-[18px] font-black text-[#071f4d]">Project Scope</h2>
              </div>

              <div class="grid gap-5 md:grid-cols-2">
                ${projectCopy.scopes
                  .map(
                    ([title, text], index) => `
                      <div class="flex gap-5 rounded-[12px] border border-[#dce8f6] bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.04)]">
                        <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#005eea] text-[20px] font-black text-white">
                          ${String(index + 1).padStart(2, "0")}
                        </div>
                        <div>
                          <h4 class="text-[16px] font-black text-[#071f4d]">
                            ${escapeHtml(title)}
                          </h4>
                          <p class="mt-2 text-[14px] font-medium leading-6 text-[#40516a]">
                            ${escapeHtml(text)}
                          </p>
                        </div>
                      </div>
                    `,
                  )
                  .join("")}
              </div>
            </div>

            <!-- Right Sidebar -->
            <aside>
              <div class="sticky top-28 rounded-[14px] border border-[#dce8f6] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.07)]">
                <div class="mb-5 flex items-center gap-4">
                  <span class="h-8 w-1 rounded-full bg-[#005eea]"></span>
                  <h2 class="text-[18px] font-black text-[#071f4d]">Project Information</h2>
                </div>

                <div class="divide-y divide-[#dce8f6] border-t border-[#dce8f6]">
                  <div class="grid grid-cols-[36px_1fr_1.2fr] items-center gap-3 py-5">
                    <div class="text-[#005eea]">${iconSvg("system")}</div>
                    <p class="text-[14px] font-black text-[#071f4d]">Category</p>
                    <p class="text-[14px] font-semibold text-[#40516a]">${escapeHtml(project.category)}</p>
                  </div>

                  <div class="grid grid-cols-[36px_1fr_1.2fr] items-center gap-3 py-5">
                    <div class="text-[#005eea]">${iconSvg("location")}</div>
                    <p class="text-[14px] font-black text-[#071f4d]">Location</p>
                    <p class="text-[14px] font-semibold text-[#40516a]">${escapeHtml(project.location)}</p>
                  </div>

                  <div class="grid grid-cols-[36px_1fr_1.2fr] items-center gap-3 py-5">
                    <div class="text-[#005eea]">${iconSvg("camera")}</div>
                    <p class="text-[14px] font-black text-[#071f4d]">System</p>
                    <p class="text-[14px] font-semibold text-[#40516a]">${escapeHtml(project.system)}</p>
                  </div>

                  <div class="grid grid-cols-[36px_1fr_1.2fr] items-center gap-3 py-5">
                    <div class="text-[#005eea]">${iconSvg("shield")}</div>
                    <p class="text-[14px] font-black text-[#071f4d]">Status</p>
                    <p>
                      <span class="inline-flex rounded-full bg-[#dff7e7] px-4 py-1.5 text-[12px] font-black text-[#0d9b4d]">
                        Completed
                      </span>
                    </p>
                  </div>

                  <div class="grid grid-cols-[36px_1fr_1.2fr] items-center gap-3 py-5">
                    <div class="text-[#005eea]">${iconSvg("calendar")}</div>
                    <p class="text-[14px] font-black text-[#071f4d]">Year</p>
                    <p class="text-[14px] font-semibold text-[#40516a]">Completed</p>
                  </div>

                  <div class="grid grid-cols-[36px_1fr_1.2fr] items-center gap-3 py-5">
                    <div class="text-[#005eea]">${iconSvg("user")}</div>
                    <p class="text-[14px] font-black text-[#071f4d]">Client</p>
                    <p class="text-[14px] font-semibold leading-6 text-[#40516a]">${escapeHtml(clientName)}</p>
                  </div>
                </div>

                <div class="mt-7 rounded-[12px] bg-[#005eea] p-6 text-white shadow-[0_18px_35px_rgba(0,94,234,0.25)]">
                  <div class="flex items-center gap-4">
                    <div class="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/80">
                      ${iconSvg("shield")}
                    </div>
                    <h3 class="text-[22px] font-black leading-tight">Have a Similar Project?</h3>
                  </div>

                  <p class="mt-5 text-[14px] font-semibold leading-7 text-white/90">
                    Let’s discuss how we can help you with the best security solution.
                  </p>

                  <a
                    href="/contact.html"
                    class="mt-6 inline-flex h-[52px] w-full items-center justify-center gap-4 rounded-[8px] bg-white px-6 text-[15px] font-black text-[#005eea] transition hover:bg-[#eef6ff]"
                  >
                    Contact Our Experts
                    <span class="text-[22px]">→</span>
                  </a>
                </div>
              </div>
            </aside>
          </div>

          <!-- Gallery -->
          <div class="mb-6 mt-12 flex items-center gap-4">
            <span class="h-8 w-1 rounded-full bg-[#005eea]"></span>
            <h2 class="text-[18px] font-black text-[#071f4d]">Project Gallery</h2>
          </div>

          <div class="relative grid gap-5 md:grid-cols-4">
            ${galleryImages
              .map(
                (image, index) => `
                  <div class="overflow-hidden rounded-[10px] bg-[#eef4fb] shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
                    <img
                      src="${escapeHtml(image)}"
                      alt="${escapeHtml(project.title)} gallery ${index + 1}"
                      class="h-[185px] w-full object-cover transition duration-500 hover:scale-[1.05]"
                    />
                  </div>
                `,
              )
              .join("")}

            <button
              type="button"
              class="absolute -right-4 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[28px] font-bold text-[#071f4d] shadow-[0_12px_30px_rgba(15,23,42,0.16)] md:flex"
              aria-label="Next gallery image"
            >
              ›
            </button>
          </div>

          <!-- Bottom CTA -->
          <div class="mt-10 rounded-[14px] bg-[linear-gradient(90deg,#eef7ff_0%,#ffffff_48%,#eaf5ff_100%)] p-7 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div class="flex items-center gap-6">
                <div class="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#005eea] text-white ring-[8px] ring-[#d8ecff]">
                  ${iconSvg("headset")}
                </div>

                <div>
                  <h2 class="text-[28px] font-black tracking-[-0.6px] text-[#071f4d]">
                    Have a Project in Mind?
                  </h2>
                  <p class="mt-2 text-[15px] font-semibold text-[#40516a]">
                    Let’s work together to build a smarter, safer and more secure tomorrow.
                  </p>
                </div>
              </div>

              <a
                href="/contact.html"
                class="inline-flex h-[56px] items-center justify-center gap-4 rounded-[8px] bg-[#005eea] px-8 text-[15px] font-black text-white shadow-[0_14px_26px_rgba(0,94,234,0.22)] transition hover:bg-[#004fc5]"
              >
                Contact Our Experts
                <span class="text-[24px]">→</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  `;
}

function notFoundTemplate() {
  return `
    <div class="bg-[#f6f9fd] px-4 py-16">
      <div class="mx-auto max-w-[900px] rounded-[16px] border border-[#dce8f6] bg-white p-10 text-center shadow-[0_16px_45px_rgba(15,23,42,0.08)]">
        <h1 class="text-[34px] font-black text-[#071f4d]">
          Project Not Found
        </h1>

        <p class="mx-auto mt-4 max-w-[560px] text-[15px] font-semibold leading-7 text-[#40516a]">
          Sorry, this project details page could not be found. Please go back to the projects page and try again.
        </p>

        <a
          href="/projects.html"
          class="mt-7 inline-flex h-[52px] items-center justify-center rounded-[8px] bg-[#005eea] px-7 text-[14px] font-black text-white shadow-[0_12px_24px_rgba(0,94,234,0.20)] transition hover:bg-[#004fc5]"
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
