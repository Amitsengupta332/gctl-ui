import "./style.css";

import AOS from "aos";
import "aos/dist/aos.css";

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
  initNavbarScroll();
  initProductMegaMenu();
  initHeroSlider();
  initProductSlider();
  initCategoryProductFilter();

  AOS.init({
    duration: 900,
    easing: "ease-out-cubic",
    once: true,
    offset: 80,
  });
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

function initNavbarScroll() {
  const header = document.getElementById("siteHeader");

  if (!header) return;

  function updateNavbar() {
    if (window.scrollY > 40) {
      header.classList.remove("bg-transparent", "border-white/20");
      header.classList.add(
        "bg-white",
        "border-gray-100",
        "shadow-[0_8px_30px_rgba(15,23,42,0.08)]",
      );
    } else {
      header.classList.remove(
        "bg-white",
        "border-gray-100",
        "shadow-[0_8px_30px_rgba(15,23,42,0.08)]",
      );
      header.classList.add("bg-transparent", "border-white/20");
    }
  }

  updateNavbar();
  window.addEventListener("scroll", updateNavbar);
}

function initHeroSlider() {
  const slider = document.getElementById("heroSlider");

  if (!slider) return;

  const slides = Array.from(slider.querySelectorAll("[data-hero-slide]"));
  const prevButton = slider.querySelector("#heroPrev");
  const nextButton = slider.querySelector("#heroNext");
  const dotsWrapper = slider.querySelector("#heroDots");

  if (!slides.length || !dotsWrapper) return;

  let currentSlide = 0;
  let autoplayInterval = null;
  let touchStartX = 0;
  let touchEndX = 0;

  dotsWrapper.innerHTML = "";

  slides.forEach(function (slide, index) {
    slide.classList.add("transition-all", "duration-700");

    if (index === 0) {
      slide.classList.remove("opacity-0", "invisible", "pointer-events-none");
      slide.classList.add("opacity-100", "visible", "pointer-events-auto");
    } else {
      slide.classList.remove("opacity-100", "visible", "pointer-events-auto");
      slide.classList.add("opacity-0", "invisible", "pointer-events-none");
    }

    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Go to slide ${index + 1}`);

    dot.className =
      index === 0
        ? "w-8 h-2 rounded-full bg-[#0068c9] transition-all duration-300"
        : "w-2 h-2 rounded-full bg-[#0068c9]/30 transition-all duration-300";

    dot.addEventListener("click", function (e) {
      e.preventDefault();
      showSlide(index);
      restartAutoplay();
    });

    dotsWrapper.appendChild(dot);
  });

  const dots = Array.from(dotsWrapper.querySelectorAll("button"));

  function updateDots() {
    dots.forEach(function (dot, index) {
      dot.className =
        index === currentSlide
          ? "w-8 h-2 rounded-full bg-[#0068c9] transition-all duration-300"
          : "w-2 h-2 rounded-full bg-[#0068c9]/30 transition-all duration-300";
    });
  }

  function showSlide(index) {
    slides[currentSlide].classList.remove(
      "opacity-100",
      "visible",
      "pointer-events-auto",
    );
    slides[currentSlide].classList.add(
      "opacity-0",
      "invisible",
      "pointer-events-none",
    );

    currentSlide = (index + slides.length) % slides.length;

    slides[currentSlide].classList.remove(
      "opacity-0",
      "invisible",
      "pointer-events-none",
    );
    slides[currentSlide].classList.add(
      "opacity-100",
      "visible",
      "pointer-events-auto",
    );

    updateDots();
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function prevSlide() {
    showSlide(currentSlide - 1);
  }

  function startAutoplay() {
    stopAutoplay();

    autoplayInterval = setInterval(function () {
      nextSlide();
    }, 4500);
  }

  function stopAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
  }

  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  if (nextButton) {
    nextButton.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      nextSlide();
      restartAutoplay();
    });
  }

  if (prevButton) {
    prevButton.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      prevSlide();
      restartAutoplay();
    });
  }

  slider.addEventListener("mouseenter", stopAutoplay);
  slider.addEventListener("mouseleave", startAutoplay);

  slider.addEventListener(
    "touchstart",
    function (e) {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true },
  );

  slider.addEventListener(
    "touchend",
    function (e) {
      touchEndX = e.changedTouches[0].screenX;

      const swipeDistance = touchStartX - touchEndX;

      if (Math.abs(swipeDistance) > 50) {
        if (swipeDistance > 0) {
          nextSlide();
        } else {
          prevSlide();
        }

        restartAutoplay();
      }
    },
    { passive: true },
  );

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  });

  startAutoplay();
}

function initProductSlider() {
  const sliders = document.querySelectorAll("[data-product-slider]");

  if (!sliders.length) return;

  sliders.forEach(function (slider) {
    const section = slider.closest("section");
    const track = slider.querySelector("[data-product-track]");

    const prevButtons = section
      ? section.querySelectorAll("[data-product-prev]")
      : slider.querySelectorAll("[data-product-prev]");

    const nextButtons = section
      ? section.querySelectorAll("[data-product-next]")
      : slider.querySelectorAll("[data-product-next]");

    if (!track) return;

    function getScrollAmount() {
      const firstCard = track.querySelector(".snap-start");

      if (!firstCard) return 280;

      const trackStyle = window.getComputedStyle(track);
      const gap = parseFloat(trackStyle.columnGap || trackStyle.gap || 12);

      return firstCard.offsetWidth + gap;
    }

    nextButtons.forEach(function (button) {
      button.addEventListener("click", function (e) {
        e.preventDefault();

        track.scrollBy({
          left: getScrollAmount(),
          behavior: "smooth",
        });
      });
    });

    prevButtons.forEach(function (button) {
      button.addEventListener("click", function (e) {
        e.preventDefault();

        track.scrollBy({
          left: -getScrollAmount(),
          behavior: "smooth",
        });
      });
    });
  });

  const rotatingTexts = document.querySelectorAll("[data-call-rotate]");

  rotatingTexts.forEach(function (item) {
    const phone = item.getAttribute("data-phone");

    if (!phone) return;

    let showPhone = false;

    setInterval(function () {
      showPhone = !showPhone;
      item.textContent = showPhone ? phone : "Call for Price";
    }, 2200);
  });
}

function initProductMegaMenu() {
  const tabs = document.querySelectorAll("[data-product-mega-tab]");
  const title = document.getElementById("productMegaTitle");
  const subList = document.getElementById("productMegaSubList");
  const previewTitle = document.getElementById("productMegaPreviewTitle");
  const previewList = document.getElementById("productMegaPreviewList");
  const viewAll = document.getElementById("productMegaViewAll");

  if (
    !tabs.length ||
    !title ||
    !subList ||
    !previewTitle ||
    !previewList ||
    !viewAll
  )
    return;

  function slugify(text) {
    return text
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/\//g, "-")
      .replace(/\(|\)/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  const data = {
    cctv: {
      title: "CCTV Surveillance",
      link: "/cctv-surveillance.html",
      sub: [
        { name: "HD CCTV Camera", link: "/hd-cctv-camera.html" },
        { name: "IP Camera", link: "/ip-camera.html" },
        {
          name: "ANPR Number Plate Camera",
          link: "/anpr-number-plate-camera.html",
        },
        { name: "AI Camera", link: "/ai-camera.html" },
        {
          name: "Body Temperature Camera",
          link: "/body-temperature-camera.html",
        },
        {
          name: "Network Video Recorder (NVR)",
          link: "/network-video-recorder-nvr.html",
        },
        {
          name: "Digital Video Recorder (DVR)",
          link: "/digital-video-recorder-dvr.html",
        },
        {
          name: "CCTV Camera Accessories",
          link: "/cctv-camera-accessories.html",
        },
        { name: "CC Camera", link: "/cc-camera.html" },
      ],
    },

    automation: {
      title: "Automation Products",
      link: "/automation-products.html",
      sub: [
        { name: "Sliding Gate Motor", link: "/sliding-gate-motor.html" },
        { name: "Swing Gate Motor", link: "/swing-gate-motor.html" },
        { name: "Automatic Glass Door", link: "/automatic-glass-door.html" },
        {
          name: "Garage Door Automation",
          link: "/garage-door-automation.html",
        },
        { name: "Rolling Shutter Motor", link: "/rolling-shutter-motor.html" },
        { name: "Automatic Sensor Door", link: "/automatic-sensor-door.html" },
        { name: "Road Blocker System", link: "/road-blocker-system.html" },
        {
          name: "Industrial Door Automation",
          link: "/industrial-door-automation.html",
        },
      ],
    },

    entrance: {
      title: "Entrance Security Solutions",
      link: "/entrance-security-solutions.html",
      sub: [
        {
          name: "Walk Through Metal Detector",
          link: "/walk-through-metal-detector.html",
        },
        {
          name: "Hand Held Metal Detector",
          link: "/hand-held-metal-detector.html",
        },
        { name: "X-Ray Baggage Scanner", link: "/x-ray-baggage-scanner.html" },
        { name: "Under Vehicle Scanner", link: "/under-vehicle-scanner.html" },
        { name: "Explosive Detector", link: "/explosive-detector.html" },
        {
          name: "Visitor Management System",
          link: "/visitor-management-system.html",
        },
        {
          name: "Security Inspection System",
          link: "/security-inspection-system.html",
        },
      ],
    },

    analytics: {
      title: "Intelligent Video Analytics",
      link: "/intelligent-video-analytics.html",
      sub: [
        {
          name: "Face Recognition System",
          link: "/face-recognition-system.html",
        },
        {
          name: "People Counting Camera",
          link: "/people-counting-camera.html",
        },
        { name: "Object Detection", link: "/object-detection.html" },
        { name: "Intrusion Detection", link: "/intrusion-detection.html" },
        { name: "Vehicle Analytics", link: "/vehicle-analytics.html" },
        { name: "Heatmap Analytics", link: "/heatmap-analytics.html" },
        {
          name: "Smart Search Analytics",
          link: "/smart-search-analytics.html",
        },
      ],
    },

    access: {
      title: "Access Control & Time Attendance",
      link: "/access-control-time-attendance.html",
      sub: [
        { name: "Biometric Attendance", link: "/biometric-attendance.html" },
        {
          name: "Face Attendance Device",
          link: "/face-attendance-device.html",
        },
        { name: "RFID Access Control", link: "/rfid-access-control.html" },
        { name: "Door Lock System", link: "/door-lock-system.html" },
        { name: "Access Control Panel", link: "/access-control-panel.html" },
        { name: "Hotel Door Lock", link: "/hotel-door-lock.html" },
        {
          name: "Time Attendance Software",
          link: "/time-attendance-software.html",
        },
      ],
    },

    fire: {
      title: "Fire Alarm System",
      link: "/fire-alarm-system.html",
      sub: [
        {
          name: "Addressable Fire Alarm",
          link: "/addressable-fire-alarm.html",
        },
        {
          name: "Conventional Fire Alarm",
          link: "/conventional-fire-alarm.html",
        },
        { name: "Smoke Detector", link: "/smoke-detector.html" },
        { name: "Heat Detector", link: "/heat-detector.html" },
        { name: "Manual Call Point", link: "/manual-call-point.html" },
        { name: "Fire Alarm Bell", link: "/fire-alarm-bell.html" },
        {
          name: "Fire Suppression System",
          link: "/fire-suppression-system.html",
        },
      ],
    },

    barrier: {
      title: "Turnstile Gate & Boom Barrier",
      link: "/turnstile-gate-boom-barrier.html",
      sub: [
        { name: "Tripod Turnstile", link: "/tripod-turnstile.html" },
        { name: "Flap Barrier", link: "/flap-barrier.html" },
        { name: "Swing Barrier", link: "/swing-barrier.html" },
        { name: "Full Height Turnstile", link: "/full-height-turnstile.html" },
        { name: "Boom Barrier Gate", link: "/boom-barrier-gate.html" },
        { name: "Parking Barrier", link: "/parking-barrier.html" },
        { name: "Ticketing Gate System", link: "/ticketing-gate-system.html" },
      ],
    },

    signage: {
      title: "LCD/LED Digital Signage",
      link: "/lcd-led-digital-signage.html",
      sub: [
        { name: "Indoor LED Display", link: "/indoor-led-display.html" },
        { name: "Outdoor LED Display", link: "/outdoor-led-display.html" },
        { name: "Interactive Kiosk", link: "/interactive-kiosk.html" },
        { name: "Video Wall Display", link: "/video-wall-display.html" },
        {
          name: "Digital Signage Player",
          link: "/digital-signage-player.html",
        },
        { name: "Advertising Display", link: "/advertising-display.html" },
      ],
    },

    queue: {
      title: "Queue Management System",
      link: "/queue-management-system.html",
      sub: [
        { name: "Token Machine", link: "/token-machine.html" },
        { name: "Queue Display", link: "/queue-display.html" },
        { name: "Calling System", link: "/calling-system.html" },
        { name: "Counter Display", link: "/counter-display.html" },
        { name: "Queue Software", link: "/queue-software.html" },
        {
          name: "Customer Feedback System",
          link: "/customer-feedback-system.html",
        },
      ],
    },

    vehicle: {
      title: "Vehicle Control System",
      link: "/vehicle-control-system.html",
      sub: [
        {
          name: "Parking Management System",
          link: "/parking-management-system.html",
        },
        { name: "Car Parking Guidance", link: "/car-parking-guidance.html" },
        { name: "RFID Vehicle Access", link: "/rfid-vehicle-access.html" },
        { name: "ANPR Parking System", link: "/anpr-parking-system.html" },
        { name: "Vehicle Loop Detector", link: "/vehicle-loop-detector.html" },
        { name: "Parking Payment Kiosk", link: "/parking-payment-kiosk.html" },
      ],
    },

    conference: {
      title: "Conference & PA System",
      link: "/conference-pa-system.html",
      sub: [
        { name: "Conference Microphone", link: "/conference-microphone.html" },
        { name: "PA Speaker System", link: "/pa-speaker-system.html" },
        { name: "Amplifier System", link: "/amplifier-system.html" },
        { name: "Wireless Microphone", link: "/wireless-microphone.html" },
        { name: "Meeting Room Audio", link: "/meeting-room-audio.html" },
        {
          name: "Public Announcement System",
          link: "/public-announcement-system.html",
        },
      ],
    },

    building: {
      title: "Building Automation Solutions",
      link: "/building-automation-solutions.html",
      sub: [
        { name: "BMS System", link: "/bms-system.html" },
        { name: "Lighting Control", link: "/lighting-control.html" },
        { name: "HVAC Control", link: "/hvac-control.html" },
        { name: "Energy Management", link: "/energy-management.html" },
        {
          name: "Smart Building Control",
          link: "/smart-building-control.html",
        },
        {
          name: "Central Monitoring System",
          link: "/central-monitoring-system.html",
        },
      ],
    },

    smart: {
      title: "Smart Home Solutions",
      link: "/smart-home-solutions.html",
      sub: [
        { name: "Smart Door Lock", link: "/smart-door-lock.html" },
        { name: "Smart Switch", link: "/smart-switch.html" },
        { name: "Smart Curtain", link: "/smart-curtain.html" },
        { name: "Smart Lighting", link: "/smart-lighting.html" },
        { name: "Smart Security Sensor", link: "/smart-security-sensor.html" },
        { name: "Home Automation Hub", link: "/home-automation-hub.html" },
      ],
    },
  };

  function getSubName(subItem) {
    return typeof subItem === "string" ? subItem : subItem.name;
  }

  function getSubLink(subItem) {
    if (typeof subItem === "string") {
      return `/${slugify(subItem)}.html`;
    }

    return subItem.link;
  }

  function makeProducts(subItem) {
    const subName = getSubName(subItem);
    const subSlug = slugify(subName);
    const subLink = getSubLink(subItem);

    return [
      {
        name: subName,
        desc: "View all products and solutions in this sub category.",
        img: `/images/products/${subSlug}.avif`,
        link: subLink,
      },
      {
        name: `${subName} Products`,
        desc: "Explore product models, features and project options.",
        img: `/images/products/${subSlug}-pro.avif`,
        link: subLink,
      },
      {
        name: `${subName} Accessories`,
        desc: "Accessories, parts and installation support.",
        img: `/images/products/${subSlug}-accessories.avif`,
        link: subLink,
      },
    ];
  }

  function renderProducts(categoryKey, subItem) {
    const subName = getSubName(subItem);
    const subSlug = slugify(subName);
    const subLink = getSubLink(subItem);
    const products = makeProducts(subItem);

    previewTitle.textContent = subName;

    previewList.innerHTML = products
      .map(function (product) {
        return `
          <a href="${product.link}" class="flex items-center gap-5 border-b border-[#e6edf5] pb-4 group/product">
            <div class="w-[95px] h-[95px] rounded-xl bg-[#f5f8fc] overflow-hidden shrink-0">
              <img
                src="${product.img}"
                alt="${product.name}"
                class="w-full h-full object-contain p-3"
                onerror="this.src='/images/products/${subSlug}.avif'"
              />
            </div>

            <div>
              <h4 class="text-[17px] font-bold text-[#071425] group-hover/product:text-[#0057d8]">
                ${product.name}
              </h4>
              <p class="mt-1 text-[14px] leading-6 font-medium text-[#4b5565]">
                ${product.desc}
              </p>
            </div>
          </a>
        `;
      })
      .join("");

    viewAll.href = subLink;
    viewAll.querySelector("span").textContent = `View All ${subName}`;
  }

  function renderCategory(categoryKey) {
    const current = data[categoryKey];

    if (!current) return;

    title.textContent = current.title;

    subList.innerHTML = current.sub
      .map(function (subItem, index) {
        const subName = getSubName(subItem);
        const subLink = getSubLink(subItem);

        return `
          <a
            href="${subLink}"
            data-product-sub-index="${index}"
            class="product-mega-sub-link flex min-h-[43px] items-center justify-between rounded-lg px-4 text-[14px] font-semibold transition-colors ${
              index === 0
                ? "bg-[#eef7ff] text-[#0057d8]"
                : "text-[#071425] hover:bg-[#eef7ff] hover:text-[#0057d8]"
            }"
          >
            ${subName}
            <span class="text-xl">›</span>
          </a>
        `;
      })
      .join("");

    tabs.forEach(function (tab) {
      const isActive =
        tab.getAttribute("data-product-mega-tab") === categoryKey;

      tab.classList.toggle("bg-[#eef7ff]", isActive);
      tab.classList.toggle("text-[#0057d8]", isActive);
      tab.classList.toggle("border-l-2", isActive);
      tab.classList.toggle("border-l-[#0057d8]", isActive);

      if (!isActive) {
        tab.classList.remove(
          "bg-[#eef7ff]",
          "text-[#0057d8]",
          "border-l-2",
          "border-l-[#0057d8]",
        );
      }
    });

    const subLinks = subList.querySelectorAll("[data-product-sub-index]");

    subLinks.forEach(function (subLink) {
      subLink.addEventListener("mouseenter", function () {
        const index = Number(subLink.getAttribute("data-product-sub-index"));
        const subItem = current.sub[index];

        subLinks.forEach(function (link) {
          link.classList.remove("bg-[#eef7ff]", "text-[#0057d8]");
          link.classList.add("text-[#071425]");
        });

        subLink.classList.add("bg-[#eef7ff]", "text-[#0057d8]");
        subLink.classList.remove("text-[#071425]");

        renderProducts(categoryKey, subItem);
      });
    });

    renderProducts(categoryKey, current.sub[0]);
  }

  tabs.forEach(function (tab) {
    tab.addEventListener("mouseenter", function () {
      renderCategory(tab.getAttribute("data-product-mega-tab"));
    });

    tab.addEventListener("click", function (e) {
      e.preventDefault();

      const link = tab.getAttribute("data-product-link");

      if (link) {
        window.location.href = link;
        return;
      }

      renderCategory(tab.getAttribute("data-product-mega-tab"));
    });
  });

  renderCategory("cctv");
}

function initCategoryProductFilter() {
  const filterButtons = document.querySelectorAll("[data-product-filter]");
  const productCards = Array.from(
    document.querySelectorAll("[data-product-card]"),
  );
  const sortSelect = document.getElementById("productSort");
  const productGrid = document.getElementById("productGrid");

  if (!filterButtons.length || !productCards.length || !productGrid) return;

  let currentFilter = "all";

  function setActiveButton(filterValue) {
    filterButtons.forEach(function (button) {
      const isActive =
        button.getAttribute("data-product-filter") === filterValue;

      button.classList.toggle("active", isActive);
      button.classList.toggle("bg-[#0057d8]", isActive);
      button.classList.toggle("text-white", isActive);
      button.classList.toggle(
        "shadow-[0_8px_20px_rgba(0,87,216,0.22)]",
        isActive,
      );

      if (!isActive) {
        button.classList.remove(
          "bg-[#0057d8]",
          "text-white",
          "shadow-[0_8px_20px_rgba(0,87,216,0.22)]",
        );
      }
    });
  }

  function filterProducts(filterValue) {
    currentFilter = filterValue;

    productCards.forEach(function (card) {
      const categories = card.getAttribute("data-category") || "";
      const shouldShow =
        filterValue === "all" || categories.includes(filterValue);

      card.classList.toggle("hidden", !shouldShow);
    });

    setActiveButton(filterValue);
  }

  function sortProducts() {
    if (!sortSelect) return;

    const sortValue = sortSelect.value;
    const cards = Array.from(productCards);

    cards.sort(function (a, b) {
      if (sortValue === "name") {
        return (a.getAttribute("data-name") || "").localeCompare(
          b.getAttribute("data-name") || "",
        );
      }

      if (sortValue === "new") {
        return (
          Number(b.getAttribute("data-sort")) -
          Number(a.getAttribute("data-sort"))
        );
      }

      return (
        Number(a.getAttribute("data-sort")) -
        Number(b.getAttribute("data-sort"))
      );
    });

    cards.forEach(function (card) {
      productGrid.appendChild(card);
    });

    filterProducts(currentFilter);
  }

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const filterValue = button.getAttribute("data-product-filter");

      filterProducts(filterValue);
    });
  });

  if (sortSelect) {
    sortSelect.addEventListener("change", sortProducts);
  }

  filterProducts("all");
}
document.addEventListener("DOMContentLoaded", loadComponents);
