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

  if (!tabs.length || !title || !subList || !previewTitle || !previewList || !viewAll) return;

  function slugify(text) {
    return text
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/\//g, "-")
      .replace(/\(|\)/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function makeProducts(categorySlug, subName) {
    const subSlug = slugify(subName);

    return [
      {
        name: subName,
        desc: "Professional security & automation product solution.",
        img: `/images/products/${subSlug}.avif`,
        link: `/products/${categorySlug}/${subSlug}.html`,
      },
      {
        name: `${subName} Pro`,
        desc: "Advanced model for commercial and industrial projects.",
        img: `/images/products/${subSlug}-pro.avif`,
        link: `/products/${categorySlug}/${subSlug}-pro.html`,
      },
      {
        name: `${subName} Accessories`,
        desc: "Required accessories, parts and installation support.",
        img: `/images/products/${subSlug}-accessories.avif`,
        link: `/products/${categorySlug}/${subSlug}-accessories.html`,
      },
    ];
  }

  const data = {
    cctv: {
      title: "CCTV Surveillance",
      link: "/products/cctv-surveillance.html",
      sub: [
        "HD CCTV Camera",
        "IP Camera",
        "ANPR Number Plate Camera",
        "AI Camera",
        "Body Temperature Camera",
        "Network Video Recorder (NVR)",
        "Digital Video Recorder (DVR)",
        "CCTV Camera Accessories",
        "CC Camera",
      ],
    },

    automation: {
      title: "Automation Products",
      link: "/products/automation-products.html",
      sub: [
        "Sliding Gate Motor",
        "Swing Gate Motor",
        "Automatic Glass Door",
        "Garage Door Automation",
        "Rolling Shutter Motor",
        "Automatic Sensor Door",
        "Road Blocker System",
        "Industrial Door Automation",
      ],
    },

    entrance: {
      title: "Entrance Security Solutions",
      link: "/products/entrance-security-solutions.html",
      sub: [
        "Walk Through Metal Detector",
        "Hand Held Metal Detector",
        "X-Ray Baggage Scanner",
        "Under Vehicle Scanner",
        "Explosive Detector",
        "Visitor Management System",
        "Security Inspection System",
      ],
    },

    analytics: {
      title: "Intelligent Video Analytics",
      link: "/products/intelligent-video-analytics.html",
      sub: [
        "Face Recognition System",
        "People Counting Camera",
        "Object Detection",
        "Intrusion Detection",
        "Vehicle Analytics",
        "Heatmap Analytics",
        "Smart Search Analytics",
      ],
    },

    access: {
      title: "Access Control & Time Attendance",
      link: "/products/access-control-time-attendance.html",
      sub: [
        "Biometric Attendance",
        "Face Attendance Device",
        "RFID Access Control",
        "Door Lock System",
        "Access Control Panel",
        "Hotel Door Lock",
        "Time Attendance Software",
      ],
    },

    fire: {
      title: "Fire Alarm System",
      link: "/products/fire-alarm-system.html",
      sub: [
        "Addressable Fire Alarm",
        "Conventional Fire Alarm",
        "Smoke Detector",
        "Heat Detector",
        "Manual Call Point",
        "Fire Alarm Bell",
        "Fire Suppression System",
      ],
    },

    barrier: {
      title: "Turnstile Gate & Boom Barrier",
      link: "/products/turnstile-gate-boom-barrier.html",
      sub: [
        "Tripod Turnstile",
        "Flap Barrier",
        "Swing Barrier",
        "Full Height Turnstile",
        "Boom Barrier Gate",
        "Parking Barrier",
        "Ticketing Gate System",
      ],
    },

    signage: {
      title: "LCD/LED Digital Signage",
      link: "/products/lcd-led-digital-signage.html",
      sub: [
        "Indoor LED Display",
        "Outdoor LED Display",
        "Interactive Kiosk",
        "Video Wall Display",
        "Digital Signage Player",
        "Advertising Display",
      ],
    },

    queue: {
      title: "Queue Management System",
      link: "/products/queue-management-system.html",
      sub: [
        "Token Machine",
        "Queue Display",
        "Calling System",
        "Counter Display",
        "Queue Software",
        "Customer Feedback System",
      ],
    },

    vehicle: {
      title: "Vehicle Control System",
      link: "/products/vehicle-control-system.html",
      sub: [
        "Parking Management System",
        "Car Parking Guidance",
        "RFID Vehicle Access",
        "ANPR Parking System",
        "Vehicle Loop Detector",
        "Parking Payment Kiosk",
      ],
    },

    conference: {
      title: "Conference & PA System",
      link: "/products/conference-pa-system.html",
      sub: [
        "Conference Microphone",
        "PA Speaker System",
        "Amplifier System",
        "Wireless Microphone",
        "Meeting Room Audio",
        "Public Announcement System",
      ],
    },

    building: {
      title: "Building Automation Solutions",
      link: "/products/building-automation-solutions.html",
      sub: [
        "BMS System",
        "Lighting Control",
        "HVAC Control",
        "Energy Management",
        "Smart Building Control",
        "Central Monitoring System",
      ],
    },

    smart: {
      title: "Smart Home Solutions",
      link: "/products/smart-home-solutions.html",
      sub: [
        "Smart Door Lock",
        "Smart Switch",
        "Smart Curtain",
        "Smart Lighting",
        "Smart Security Sensor",
        "Home Automation Hub",
      ],
    },
  };

  function renderProducts(categoryKey, subName) {
    const category = data[categoryKey];
    const categorySlug = slugify(category.title);
    const subSlug = slugify(subName);
    const products = makeProducts(categorySlug, subName);

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

    viewAll.href = `/products/${categorySlug}/${subSlug}.html`;
    viewAll.querySelector("span").textContent = `View All ${subName}`;
  }

  function renderCategory(categoryKey) {
    const current = data[categoryKey];
    if (!current) return;

    const categorySlug = slugify(current.title);

    title.textContent = current.title;

    subList.innerHTML = current.sub
      .map(function (subName, index) {
        const subSlug = slugify(subName);

        return `
          <a
            href="/products/${categorySlug}/${subSlug}.html"
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
      const isActive = tab.getAttribute("data-product-mega-tab") === categoryKey;

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
        const subName = current.sub[index];

        subLinks.forEach(function (link) {
          link.classList.remove("bg-[#eef7ff]", "text-[#0057d8]");
          link.classList.add("text-[#071425]");
        });

        subLink.classList.add("bg-[#eef7ff]", "text-[#0057d8]");
        subLink.classList.remove("text-[#071425]");

        renderProducts(categoryKey, subName);
      });

      subLink.addEventListener("click", function (e) {
        const index = Number(subLink.getAttribute("data-product-sub-index"));
        const subName = current.sub[index];

        renderProducts(categoryKey, subName);
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
      renderCategory(tab.getAttribute("data-product-mega-tab"));
    });
  });

  renderCategory("cctv");
}
document.addEventListener("DOMContentLoaded", loadComponents);
