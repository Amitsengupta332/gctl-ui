import "./style.css";

import AOS from "aos";
import "aos/dist/aos.css";

import { initReusablePages } from "./reusable-pages.js";

import { initProjectsPage } from "./projects-page.js";
import { initProjectDetailsPage } from "./project-details-page.js";
import { renderCategoryProductSections } from "./pages/category-products-renderer.js";
import { initProductDetailsPage } from "./pages/product-details-page.js";

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

  initReusablePages();
  renderCategoryProductSections();
  initProductDetailsPage();

  initProjectsPage();
  initProjectDetailsPage();
  initHeroSlider();
  initProductSlider();
  initCategoryProductFilter();
  initFooterYear();

  AOS.init({
    duration: 900,
    easing: "ease-out-cubic",
    once: true,
    offset: 80,
  });
}

function initFooterYear() {
  const yearSpan = document.getElementById("copyrightYear");

  if (!yearSpan) return;

  yearSpan.textContent = new Date().getFullYear();
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
  ) {
    return;
  }

  const data = {
    cctv: {
      title: "CCTV Surveillance",
      link: "/cctv-surveillance.html",
      sub: [
        {
          name: "HD CCTV Camera",
          link: "/hd-cctv-camera.html",
          subSub: [
            {
              name: "HD Dome Camera",
              link: "/hd-dome-camera.html",
              img: "/images/products/cctv_category_images_avif/hd_dome_camera.avif",
            },
            {
              name: "HD Bullet Camera",
              link: "/hd-bullet-camera.html",
              img: "/images/products/cctv_category_images_avif/hd_bullet_camera_1.avif",
            },
            {
              name: "HD Turret Camera",
              link: "/hd-turret-camera.html",
              img: "/images/products/cctv_category_images_avif/hd_turret_camera_600x450.avif",
            },
            {
              name: "HD PTZ Camera",
              link: "/hd-ptz-camera.html",
              img: "/images/products/cctv_category_images_avif/hd_ptz_camera.avif",
            },
          ],
        },
        {
          name: "IP Camera",
          link: "/ip-camera.html",
          subSub: [
            {
              name: "IP Dome Camera",
              link: "/ip-dome-camera.html",
              img: "/images/products/all-ip-camera-category-avif-600x450/ip-dome-camera-category-600x450.avif",
            },
            {
              name: "IP Bullet Camera",
              link: "/ip-bullet-camera.html",
              img: "/images/products/all-ip-camera-category-avif-600x450/ip-bullet-camera-category-600x450.avif",
            },
            {
              name: "WiFi IP Camera",
              link: "/wifi-ip-camera.html",
              img: "/images/products/all-ip-camera-category-avif-600x450/wifi-ip-camera-category-600x450.avif",
            },
            {
              name: "PoE IP Camera",
              link: "/poe-ip-camera.html",
              img: "/images/products/all-ip-camera-category-avif-600x450/poe-ip-camera-category-600x450.avif",
            },
          ],
        },
        {
          name: "ANPR Number Plate Camera",
          link: "/anpr-number-plate-camera.html",
          subSub: [
            {
              name: "Fixed ANPR Camera",
              link: "/fixed-anpr-camera.html",
              img: "/images/sub-sub-categories/cctv-surveillance-sub-sub/anpr/fixed-anpr-camera.avif",
            },
            {
              name: "Parking ANPR Camera",
              link: "/parking-anpr-camera.html",
              img: "/images/sub-sub-categories/cctv-surveillance-sub-sub/anpr/parking-anpr-camera.avif",
            },
            {
              name: "Traffic ANPR Camera",
              link: "/traffic-anpr-camera.html",
              img: "/images/sub-sub-categories/cctv-surveillance-sub-sub/anpr/traffic-anpr-camera.avif",
            },
          ],
        },
        {
          name: "AI Camera",
          link: "/ai-camera.html",
          subSub: [
            {
              name: "Face Recognition Camera",
              link: "/face-recognition-camera.html",
              img: "/images/sub-sub-categories/cctv-surveillance-sub-sub/ai-camera/face-recognition-camera.avif",
            },
            {
              name: "People Counting Camera",
              link: "/people-counting-camera.html",
              img: "/images/sub-sub-categories/cctv-surveillance-sub-sub/ai-camera/people-counting-camera.avif",
            },
            {
              name: "Human Detection Camera",
              link: "/human-detection-camera.html",
              img: "/images/sub-sub-categories/cctv-surveillance-sub-sub/ai-camera/human-detection-camera.avif",
            },
            {
              name: "Vehicle Detection Camera",
              link: "/vehicle-detection-camera.html",
              img: "/images/sub-sub-categories/cctv-surveillance-sub-sub/ai-camera/vehicle-detection-camera.avif",
            },
          ],
        },
        {
          name: "Body Temperature Camera",
          link: "/body-temperature-camera.html",
          subSub: [
            {
              name: "Thermal Temperature Camera",
              link: "/thermal-temperature-camera.html",
              img: "/images/sub-sub-categories/cctv-surveillance-sub-sub/Body-Temperature/thermal-temperature-camera.avif",
            },
            {
              name: "Face Temperature Camera",
              link: "/face-temperature-camera.html",
              img: "/images/sub-sub-categories/cctv-surveillance-sub-sub/Body-Temperature/face-temperature-camera.avif",
            },
          ],
        },
        {
          name: "Network Video Recorder (NVR)",
          link: "/network-video-recorder-nvr.html",
          subSub: [
            {
              name: "4 Channel NVR",
              link: "/4-channel-nvr.html",
              img: "/images/sub-sub-categories/cctv-surveillance-sub-sub/nvr/4-channel-nvr.avif",
            },
            {
              name: "8 Channel NVR",
              link: "/8-channel-nvr.html",
              img: "/images/sub-sub-categories/cctv-surveillance-sub-sub/nvr/8-channel-nvr.avif",
            },
            {
              name: "16 Channel NVR",
              link: "/16-channel-nvr.html",
              img: "/images/sub-sub-categories/cctv-surveillance-sub-sub/nvr/16-channel-nvr.avif",
            },
            {
              name: "32 Channel NVR",
              link: "/32-channel-nvr.html",
              img: "/images/sub-sub-categories/cctv-surveillance-sub-sub/nvr/32-channel-nvr.avif",
            },
          ],
        },
        {
          name: "Digital Video Recorder (DVR)",
          link: "/digital-video-recorder-dvr.html",
          subSub: [
            {
              name: "4 Channel DVR",
              link: "/4-channel-dvr.html",
              img: "/images/sub-sub-categories/cctv-surveillance-sub-sub/dvr/4-channel-dvr.avif",
            },
            {
              name: "8 Channel DVR",
              link: "/8-channel-dvr.html",
              img: "/images/sub-sub-categories/cctv-surveillance-sub-sub/dvr/8-channel-dvr.avif",
            },
            {
              name: "16 Channel DVR",
              link: "/16-channel-dvr.html",
              img: "/images/sub-sub-categories/cctv-surveillance-sub-sub/dvr/16-channel-dvr.avif",
            },
          ],
        },
        {
          name: "CCTV Camera Accessories",
          link: "/cctv-camera-accessories.html",
          subSub: [
            {
              name: "CCTV Cable",
              link: "/cctv-cable.html",
              img: "/images/sub-sub-categories/cctv-surveillance-sub-sub/cctv-camera-accessories/cctv-cable.avif",
            },
            {
              name: "CCTV Power Supply",
              link: "/cctv-power-supply.html",
              img: "/images/sub-sub-categories/cctv-surveillance-sub-sub/cctv-camera-accessories/cctv-power-supply.avif",
            },
            {
              name: "CCTV Bracket",
              link: "/cctv-bracket.html",
              img: "/images/sub-sub-categories/cctv-surveillance-sub-sub/cctv-camera-accessories/cctv-bracket.avif",
            },
            {
              name: "CCTV Connector",
              link: "/cctv-connector.html",
              img: "/images/sub-sub-categories/cctv-surveillance-sub-sub/cctv-camera-accessories/cctv-connector.avif",
            },
          ],
        },
        {
          name: "CC Camera",
          link: "/cc-camera.html",
          subSub: [
            {
              name: "Indoor CC Camera",
              link: "/indoor-cc-camera.html",
              img: "/images/sub-sub-categories/cctv-surveillance-sub-sub/cc-camera/indoor-cc-camera.avif",
            },
            {
              name: "Outdoor CC Camera",
              link: "/outdoor-cc-camera.html",
              img: "/images/sub-sub-categories/cctv-surveillance-sub-sub/cc-camera/indoor-cc-camera.avif",
            },
          ],
        },
      ],
    },

    automation: {
      title: "Automation Products",
      link: "/automation-products.html",
      sub: [
        {
          name: "Sliding Gate Motor",
          link: "/sliding-gate-motor.html",
          subSub: [
            {
              name: "Residential Sliding Gate Motor",
              link: "/residential-sliding-gate-motor.html",
              img: "/images/sub-sub-categories/automation-products/sliding-gate-motor/residential_sliding_gate_motor.avif",
            },
            {
              name: "Industrial Sliding Gate Motor",
              link: "/industrial-sliding-gate-motor.html",
              img: "/images/sub-sub-categories/automation-products/sliding-gate-motor/industrial_sliding_gate_motor.avif",
            },
            {
              name: "Heavy Duty Sliding Gate Motor",
              link: "/heavy-duty-sliding-gate-motor.html",
              img: "/images/sub-sub-categories/automation-products/sliding-gate-motor/heavy_duty_sliding_gate_motor.avif",
            },
          ],
        },
        {
          name: "Swing Gate Motor",
          link: "/swing-gate-motor.html",
          subSub: [
            {
              name: "Single Leaf Swing Gate Motor",
              link: "/single-leaf-swing-gate-motor.html",
              img: "/images/sub-sub-categories/automation-products/swing-gate-motor/single_leaf_swing_gate_motor.avif",
            },
            {
              name: "Double Leaf Swing Gate Motor",
              link: "/double-leaf-swing-gate-motor.html",
              img: "/images/sub-sub-categories/automation-products/swing-gate-motor/double_leaf_swing_gate_motor.avif",
            },
            {
              name: "Underground Swing Gate Motor",
              link: "/underground-swing-gate-motor.html",
              img: "/images/sub-sub-categories/automation-products/swing-gate-motor/underground_swing_gate_motor.avif",
            },
          ],
        },
        {
          name: "Automatic Glass Door",
          link: "/automatic-glass-door.html",
          subSub: [
            {
              name: "Sensor Sliding Glass Door",
              link: "/sensor-sliding-glass-door.html",
              img: "/images/sub-sub-categories/automation-products/automatic-glassdoor/sensor-sliding-glass-door.avif",
            },
            {
              name: "Telescopic Glass Door",
              link: "/telescopic-glass-door.html",
              img: "/images/sub-sub-categories/automation-products/automatic-glassdoor/telescopic-glass-door.avif",
            },
            {
              name: "Glass Door Accessories",
              link: "/glass-door-accessories.html",
              img: "/images/sub-sub-categories/automation-products/automatic-glassdoor/glass-door-accessories.avif",
            },
          ],
        },
        {
          name: "Garage Door Automation",
          link: "/garage-door-automation.html",
          subSub: [
            {
              name: "Sectional Garage Door",
              link: "/sectional-garage-door.html",
              img: "/images/sub-sub-categories/automation-products/automation-products-sub-sub-category-avif-600x450/sectional-garage-door.avif",
            },
            {
              name: "Rolling Garage Door",
              link: "/rolling-garage-door.html",
              img: "/images/sub-sub-categories/automation-products/automation-products-sub-sub-category-avif-600x450/rolling-garage-door.avif",
            },
          ],
        },
        {
          name: "Rolling Shutter Motor",
          link: "/rolling-shutter-motor.html",
          subSub: [
            {
              name: "AC Rolling Shutter Motor",
              link: "/ac-rolling-shutter-motor.html",
              img: "/images/sub-sub-categories/automation-products/automation-products-sub-sub-category-avif-600x450/ac-rolling-shutter-motor.avif",
            },
            {
              name: "DC Rolling Shutter Motor",
              link: "/dc-rolling-shutter-motor.html",
              img: "/images/sub-sub-categories/automation-products/automation-products-sub-sub-category-avif-600x450/dc-rolling-shutter-motor.avif",
            },
          ],
        },
        {
          name: "Automatic Sensor Door",
          link: "/automatic-sensor-door.html",
          subSub: [
            {
              name: "Sliding Sensor Door",
              link: "/sliding-sensor-door.html",
              img: "/images/sub-sub-categories/automation-products/automation-products-sub-sub-category-avif-600x450/sliding-sensor-door.avif",
            },
            {
              name: "Swing Sensor Door",
              link: "/swing-sensor-door.html",
              img: "/images/sub-sub-categories/automation-products/automation-products-sub-sub-category-avif-600x450/swing-sensor-door.avif",
            },
          ],
        },
        {
          name: "Road Blocker System",
          link: "/road-blocker-system.html",
          subSub: [
            {
              name: "Hydraulic Road Blocker",
              link: "/hydraulic-road-blocker.html",
              img: "/images/sub-sub-categories/automation-products/automation-products-sub-sub-category-avif-600x450/hydraulic-road-blocker.avif",
            },
            {
              name: "Automatic Road Blocker",
              link: "/automatic-road-blocker.html",
              img: "/images/sub-sub-categories/automation-products/automation-products-sub-sub-category-avif-600x450/automatic-road-blocker.avif",
            },
          ],
        },
        {
          name: "Industrial Door Automation",
          link: "/industrial-door-automation.html",
          subSub: [
            {
              name: "High Speed Door",
              link: "/high-speed-door.html",
              img: "/images/sub-sub-categories/automation-products/automation-products-sub-sub-category-avif-600x450/high-speed-door.avif",
            },
            {
              name: "Sectional Industrial Door",
              link: "/sectional-industrial-door.html",
              img: "/images/sub-sub-categories/automation-products/automation-products-sub-sub-category-avif-600x450/sectional-industrial-door.avif",
            },
          ],
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
          subSub: [
            // {
            //   name: "Single Zone Metal Detector",
            //   link: "/single-zone-metal-detector.html",
            //   img: "/images/sub-sub-categories/entrance-security/metal-detector/single_zone_metal_detector.avif",
            // },
            // {
            //   name: "Multi Zone Metal Detector",
            //   link: "/multi-zone-metal-detector.html",
            //   img: "/images/sub-sub-categories/entrance-security/metal-detector/multi_zone_metal_detector.avif",
            // },
            // {
            //   name: "Weatherproof Metal Detector",
            //   link: "/weatherproof-metal-detector.html",
            //   img: "/images/sub-sub-categories/entrance-security/metal-detector/weatherproof_metal_detector.avif",
            // },

            {
              name: "6 Zone Walk Through Metal Detector",
              link: "/6-zone-walk-through-metal-detector.html",
              img: "/images/sub-sub-categories/entrance-security/metal-detector/6-zone-walk-through-metal-detector.avif",
            },
            {
              name: "18 Zone Walk Through Metal Detector",
              link: "/18-zone-walk-through-metal-detector.html",
              img: "/images/sub-sub-categories/entrance-security/metal-detector/18-zone-walk-through-metal-detector.avif",
            },
            {
              name: "33 Zone Walk Through Metal Detector",
              link: "/33-zone-walk-through-metal-detector.html",
              img: "/images/sub-sub-categories/entrance-security/metal-detector/33-zone-walk-through-metal-detector.avif",
            },
            {
              name: "45 Zone Walk Through Metal Detector",
              link: "/45-zone-walk-through-metal-detector.html",
              img: "/images/sub-sub-categories/entrance-security/metal-detector/45-zone-walk-through-metal-detector.avif",
            },
            {
              name: "60 Zone Walk Through Metal Detector",
              link: "/60-zone-walk-through-metal-detector.html",
              img: "/images/sub-sub-categories/entrance-security/metal-detector/60-zone-walk-through-metal-detector.avif",
            },
            {
              name: "Waterproof Walk Through Metal Detector",
              link: "/waterproof-walk-through-metal-detector.html",
              img: "/images/sub-sub-categories/entrance-security/metal-detector/waterproof-walk-through-metal-detector.avif",
            },
            {
              name: "Portable Walk Through Metal Detector",
              link: "/portable-walk-through-metal-detector.html",
              img: "/images/sub-sub-categories/entrance-security/metal-detector/portable-walk-through-metal-detector.avif",
            },
            {
              name: "Single Panel Walk Through Metal Detector",
              link: "/single-panel-walk-through-metal-detector.html",
              img: "/images/sub-sub-categories/entrance-security/metal-detector/single-panel-walk-through-metal-detector.avif",
            },
          ],
        },
        {
          name: "Hand Held Metal Detector",
          link: "/hand-held-metal-detector.html",
          subSub: [
            {
              name: "Rechargeable Hand Held Detector",
              link: "/rechargeable-hand-held-detector.html",
              img: "/images/sub-sub-categories/entrance-security/Hand-Held-metal-detector/rechargeable-hand-held-detector.avif",
            },
            {
              name: "Portable Hand Held Detector",
              link: "/portable-hand-held-detector.html",
              img: "/images/sub-sub-categories/entrance-security/Hand-Held-metal-detector/portable-hand-held-detector.avif",
            },
          ],
        },
        {
          name: "X-Ray Baggage Scanner",
          link: "/x-ray-baggage-scanner.html",
          subSub: [
            {
              name: "Small Baggage Scanner",
              link: "/small-baggage-scanner.html",
              img: "/images/sub-sub-categories/entrance-security/baggage-scanner/small-baggage-scanner.avif",
            },
            {
              name: "Medium Baggage Scanner",
              link: "/medium-baggage-scanner.html",
              img: "/images/sub-sub-categories/entrance-security/baggage-scanner/medium-baggage-scanner.avif",
            },
            {
              name: "Large Baggage Scanner",
              link: "/large-baggage-scanner.html",
              img: "/images/sub-sub-categories/entrance-security/baggage-scanner/large-baggage-scanner.avif",
            },
          ],
        },
        {
          name: "Under Vehicle Scanner",
          link: "/under-vehicle-scanner.html",
          subSub: [
            {
              name: "Fixed Under Vehicle Scanner",
              link: "/fixed-under-vehicle-scanner.html",
              img: "/images/sub-sub-categories/entrance-security/under-vehicle-scanner/fixed-under-vehicle-scanner.avif",
            },
            {
              name: "Portable Under Vehicle Scanner",
              link: "/portable-under-vehicle-scanner.html",
              img: "/images/sub-sub-categories/entrance-security/under-vehicle-scanner/portable-under-vehicle-scanner.avif",
            },
          ],
        },
        {
          name: "Explosive Detector",
          link: "/explosive-detector.html",
          subSub: [
            {
              name: "Portable Explosive Detector",
              link: "/portable-explosive-detector.html",
              img: "/images/sub-sub-categories/entrance-security/security_sub_sub_category/portable-explosive-detector.avif",
            },
            {
              name: "Trace Explosive Detector",
              link: "/trace-explosive-detector.html",
              img: "/images/sub-sub-categories/entrance-security/security_sub_sub_category/trace-explosive-detector.avif",
            },
          ],
        },
        {
          name: "Visitor Management System",
          link: "/visitor-management-system.html",
          subSub: [
            {
              name: "Visitor Registration Kiosk",
              link: "/visitor-registration-kiosk.html",
              img: "/images/sub-sub-categories/entrance-security/security_sub_sub_category/visitor-registration-kiosk.avif",
            },
            {
              name: "Visitor Pass System",
              link: "/visitor-pass-system.html",
              img: "/images/sub-sub-categories/entrance-security/security_sub_sub_category/visitor-pass-system.avif",
            },
          ],
        },
        {
          name: "Security Inspection System",
          link: "/security-inspection-system.html",
          subSub: [
            {
              name: "Inspection Mirror",
              link: "/inspection-mirror.html",
              img: "/images/sub-sub-categories/entrance-security/security_sub_sub_category/inspection-mirror.avif",
            },
            {
              name: "Security Screening Kit",
              link: "/security-screening-kit.html",
              img: "/images/sub-sub-categories/entrance-security/security_sub_sub_category/security-screening-kit.avif",
            },
          ],
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
          subSub: [
            {
              name: "Face Recognition Camera",
              link: "/face-recognition-camera.html",
              img: "/images/sub-sub-categories/intelligent-video-analytics/Face Recognition Camera.avif",
            },
            {
              name: "Face Recognition Terminal",
              link: "/face-recognition-terminal.html",
              img: "/images/sub-sub-categories/intelligent-video-analytics/Face Recognition Terminal.avif",
            },
            {
              name: "Face Recognition Software",
              link: "/face-recognition-software.html",
              img: "/images/sub-sub-categories/intelligent-video-analytics/Face Recognition Software.avif",
            },
          ],
        },
        {
          name: "People Counting System",
          link: "/people-counting-system.html",
          subSub: [
            {
              name: "People Counting Camera",
              link: "/people-counting-camera.html",
              img: "/images/sub-sub-categories/intelligent-video-analytics/People Counting Camera.avif",
            },
            {
              name: "Visitor Counting System",
              link: "/visitor-counting-system.html",
              img: "/images/sub-sub-categories/intelligent-video-analytics/Visitor Counting System.avif",
            },
            {
              name: "Occupancy Monitoring System",
              link: "/occupancy-monitoring-system.html",
              img: "/images/sub-sub-categories/intelligent-video-analytics/Occupancy Monitoring System.avif",
            },
          ],
        },
        {
          name: "Perimeter Intrusion Detection",
          link: "/perimeter-intrusion-detection.html",
          subSub: [
            {
              name: "Fence Intrusion Detection",
              link: "/fence-intrusion-detection.html",
              img: "/images/sub-sub-categories/intelligent-video-analytics/Fence Intrusion Detection.avif",
            },
            {
              name: "Restricted Area Detection",
              link: "/restricted-area-detection.html",
              img: "/images/sub-sub-categories/intelligent-video-analytics/Restricted Area Detection.avif",
            },
            {
              name: "AI Perimeter Camera",
              link: "/ai-perimeter-camera.html",
              img: "/images/sub-sub-categories/intelligent-video-analytics/AI Perimeter Camera.avif",
            },
          ],
        },
        {
          name: "Line Crossing Detection",
          link: "/line-crossing-detection.html",
          subSub: [
            {
              name: "Virtual Line Crossing",
              link: "/virtual-line-crossing.html",
              img: "/images/sub-sub-categories/intelligent-video-analytics/Virtual Line Crossing.avif",
            },
            {
              name: "Direction Detection",
              link: "/direction-detection.html",
              img: "/images/sub-sub-categories/intelligent-video-analytics/Direction Detection.avif",
            },
          ],
        },
        {
          name: "Object Detection System",
          link: "/object-detection-system.html",
          subSub: [
            {
              name: "Abandoned Object Detection",
              link: "/abandoned-object-detection.html",
              img: "/images/sub-sub-categories/intelligent-video-analytics/Abandoned Object Detection.avif",
            },
            {
              name: "Missing Object Detection",
              link: "/missing-object-detection.html",
              img: "/images/sub-sub-categories/intelligent-video-analytics/Missing Object Detection.avif",
            },
            {
              name: "Suspicious Object Detection",
              link: "/suspicious-object-detection.html",
              img: "/images/sub-sub-categories/intelligent-video-analytics/Suspicious Object Detection.avif",
            },
          ],
        },
        {
          name: "Vehicle Analytics System",
          link: "/vehicle-analytics-system.html",
          subSub: [
            {
              name: "Vehicle Detection System",
              link: "/vehicle-detection-system.html",
              img: "/images/sub-sub-categories/intelligent-video-analytics/Vehicle Detection System.avif",
            },
            {
              name: "Vehicle Counting System",
              link: "/vehicle-counting-system.html",
              img: "/images/sub-sub-categories/intelligent-video-analytics/Vehicle Counting System.avif",
            },
            {
              name: "Traffic Flow Analytics",
              link: "/traffic-flow-analytics.html",
              img: "/images/sub-sub-categories/intelligent-video-analytics/Traffic Flow Analytics.avif",
            },
          ],
        },
      ],
    },

    access: {
      title: "Access Control & Time Attendance",
      link: "/access-control-time-attendance.html",
      sub: [
        {
          name: "Biometric Attendance System",
          link: "/biometric-attendance-system.html",
          subSub: [
            {
              name: "Fingerprint Attendance Device",
              link: "/fingerprint-attendance-device.html",
              img: "/images/sub-sub-categories/access-control/Fingerprint Attendance Device.avif",
            },
            {
              name: "Face Attendance Device",
              link: "/face-attendance-device.html",
              img: "/images/sub-sub-categories/access-control/Face Attendance Device.avif",
            },
            {
              name: "Card Attendance Device",
              link: "/card-attendance-device.html",
              img: "/images/sub-sub-categories/access-control/Card Attendance Device.avif",
            },
          ],
        },
        {
          name: "Door Access Control System",
          link: "/door-access-control-system.html",
          subSub: [
            {
              name: "Single Door Access Control",
              link: "/single-door-access-control.html",
              img: "/images/sub-sub-categories/access-control/Single Door Access Control.avif",
            },
            {
              name: "Multi Door Access Control",
              link: "/multi-door-access-control.html",
              img: "/images/sub-sub-categories/access-control/Multi Door Access Control.avif",
            },
            {
              name: "Network Access Controller",
              link: "/network-access-controller.html",
              img: "/images/sub-sub-categories/access-control/Network Access Controller.avif",
            },
          ],
        },
        {
          name: "Face Recognition Access Control",
          link: "/face-recognition-access-control.html",
          subSub: [
            {
              name: "Face Access Terminal",
              link: "/face-access-terminal.html",
              img: "/images/sub-sub-categories/access-control/Face Access Terminal.avif",
            },
            {
              name: "Mask Detection Access Control",
              link: "/mask-detection-access-control.html",
              img: "/images/sub-sub-categories/access-control/Mask Detection Access Control.avif",
            },
            {
              name: "Temperature Detection Terminal",
              link: "/temperature-detection-terminal.html",
              img: "/images/sub-sub-categories/access-control/Temperature Detection Terminal.avif",
            },
          ],
        },
        {
          name: "RFID Card Access System",
          link: "/rfid-card-access-system.html",
          subSub: [
            {
              name: "RFID Card Reader",
              link: "/rfid-card-reader.html",
              img: "/images/sub-sub-categories/access-control/RFID Card Reader.avif",
            },
            {
              name: "RFID Access Card",
              link: "/rfid-access-card.html",
              img: "/images/sub-sub-categories/access-control/RFID Access Card.avif",
            },
            {
              name: "RFID Key Fob",
              link: "/rfid-key-fob.html",
              img: "/images/sub-sub-categories/access-control/RFID Key Fob.avif",
            },
          ],
        },
        {
          name: "Electric Door Lock",
          link: "/electric-door-lock.html",
          subSub: [
            {
              name: "Magnetic Door Lock",
              link: "/magnetic-door-lock.html",
              img: "/images/sub-sub-categories/access-control/Magnetic Door Lock.avif",
            },
            {
              name: "Electric Bolt Lock",
              link: "/electric-bolt-lock.html",
              img: "/images/sub-sub-categories/access-control/Electric Bolt Lock.avif",
            },
            {
              name: "Door Exit Button",
              link: "/door-exit-button.html",
              img: "/images/sub-sub-categories/access-control/Door Exit Button.avif",
            },
          ],
        },
        {
          name: "Attendance Management Software",
          link: "/attendance-management-software.html",
          subSub: [
            {
              name: "Employee Attendance Software",
              link: "/employee-attendance-software.html",
              img: "/images/sub-sub-categories/access-control/Employee Attendance Software.avif",
            },
            {
              name: "Cloud Attendance Software",
              link: "/cloud-attendance-software.html",
              img: "/images/sub-sub-categories/access-control/Cloud Attendance Software.avif",
            },
          ],
        },
      ],
    },

    fire: {
      title: "Fire Alarm System",
      link: "/fire-alarm-system.html",
      sub: [
        {
          name: "Conventional Fire Alarm System",
          link: "/conventional-fire-alarm-system.html",
          subSub: [
            {
              name: "Conventional Fire Alarm Panel",
              link: "/conventional-fire-alarm-panel.html",
              img: "/images/sub-sub-categories/fire-alarm/Conventional Fire Alarm Panel.avif",
            },
            {
              name: "Conventional Smoke Detector",
              link: "/conventional-smoke-detector.html",
              img: "/images/sub-sub-categories/fire-alarm/Conventional Smoke Detector.avif",
            },
            {
              name: "Conventional Heat Detector",
              link: "/conventional-heat-detector.html",
              img: "/images/sub-sub-categories/fire-alarm/Conventional Heat Detector.avif",
            },
          ],
        },
        {
          name: "Addressable Fire Alarm System",
          link: "/addressable-fire-alarm-system.html",
          subSub: [
            {
              name: "Addressable Fire Alarm Panel",
              link: "/addressable-fire-alarm-panel.html",
              img: "/images/sub-sub-categories/fire-alarm/Addressable Fire Alarm Panel.avif",
            },
            {
              name: "Addressable Smoke Detector",
              link: "/addressable-smoke-detector.html",
              img: "/images/sub-sub-categories/fire-alarm/Addressable Smoke Detector.avif",
            },
            {
              name: "Addressable Heat Detector",
              link: "/addressable-heat-detector.html",
              img: "/images/sub-sub-categories/fire-alarm/Addressable Heat Detector.avif",
            },
          ],
        },
        {
          name: "Fire Alarm Control Panel",
          link: "/fire-alarm-control-panel.html",
          subSub: [
            {
              name: "2 Zone Fire Alarm Panel",
              link: "/2-zone-fire-alarm-panel.html",
              img: "/images/sub-sub-categories/fire-alarm/2 Zone Fire Alarm Panel.avif",
            },
            {
              name: "4 Zone Fire Alarm Panel",
              link: "/4-zone-fire-alarm-panel.html",
              img: "/images/sub-sub-categories/fire-alarm/4 Zone Fire Alarm Panel.avif",
            },
            {
              name: "8 Zone Fire Alarm Panel",
              link: "/8-zone-fire-alarm-panel.html",
              img: "/images/sub-sub-categories/fire-alarm/8 Zone Fire Alarm Panel.avif",
            },
          ],
        },
        {
          name: "Smoke Detector",
          link: "/smoke-detector.html",
          subSub: [
            {
              name: "Optical Smoke Detector",
              link: "/optical-smoke-detector.html",
              img: "/images/sub-sub-categories/fire-alarm/Optical Smoke Detector.avif",
            },
            {
              name: "Photoelectric Smoke Detector",
              link: "/photoelectric-smoke-detector.html",
              img: "/images/sub-sub-categories/fire-alarm/Photoelectric Smoke Detector.avif",
            },
          ],
        },
        {
          name: "Heat Detector",
          link: "/heat-detector.html",
          subSub: [
            {
              name: "Fixed Temperature Heat Detector",
              link: "/fixed-temperature-heat-detector.html",
              img: "/images/sub-sub-categories/fire-alarm/Fixed Temperature Heat Detector.avif",
            },
            {
              name: "Rate of Rise Heat Detector",
              link: "/rate-of-rise-heat-detector.html",
              img: "/images/sub-sub-categories/fire-alarm/Rate of Rise Heat Detector.avif",
            },
          ],
        },
        {
          name: "Manual Call Point",
          link: "/manual-call-point.html",
          subSub: [
            {
              name: "Break Glass Call Point",
              link: "/break-glass-call-point.html",
              img: "/images/sub-sub-categories/fire-alarm/Break Glass Call Point.avif",
            },
            {
              name: "Resettable Call Point",
              link: "/resettable-call-point.html",
              img: "/images/sub-sub-categories/fire-alarm/Resettable Call Point.avif",
            },
          ],
        },
        {
          name: "Fire Alarm Sounder & Strobe",
          link: "/fire-alarm-sounder-strobe.html",
          subSub: [
            {
              name: "Fire Alarm Sounder",
              link: "/fire-alarm-sounder.html",
              img: "/images/sub-sub-categories/fire-alarm/Fire Alarm Sounder.avif",
            },
            {
              name: "Fire Alarm Strobe",
              link: "/fire-alarm-strobe.html",
              img: "/images/sub-sub-categories/fire-alarm/Fire Alarm Strobe.avif",
            },
          ],
        },
      ],
    },
    barrier: {
      title: "Turnstile Gate & Boom Barrier",
      link: "/turnstile-gate-boom-barrier.html",
      sub: [
        {
          name: "Tripod Turnstile",
          link: "/tripod-turnstile.html",
          subSub: [
            {
              name: "Manual Tripod Turnstile",
              link: "/manual-tripod-turnstile.html",
              img: "/images/sub-sub-categories/Turnstile-Gate/Manual Tripod Turnstile.avif",
            },
            {
              name: "Automatic Tripod Turnstile",
              link: "/automatic-tripod-turnstile.html",
              img: "/images/sub-sub-categories/Turnstile-Gate/Automatic Tripod Turnstile.avif",
            },
          ],
        },
        {
          name: "Flap Barrier",
          link: "/flap-barrier.html",
          subSub: [
            {
              name: "Single Lane Flap Barrier",
              link: "/single-lane-flap-barrier.html",
              img: "/images/sub-sub-categories/Turnstile-Gate/Single Lane Flap Barrier.avif",
            },
            {
              name: "Double Lane Flap Barrier",
              link: "/double-lane-flap-barrier.html",
              img: "/images/sub-sub-categories/Turnstile-Gate/flap_barrier_gate.avif",
            },
          ],
        },
        {
          name: "Swing Barrier",
          link: "/swing-barrier.html",
          subSub: [
            {
              name: "Single Swing Barrier",
              link: "/single-swing-barrier.html",
              img: "/images/sub-sub-categories/Turnstile-Gate/Single Swing Barrier.avif",
            },
            {
              name: "Double Swing Barrier",
              link: "/double-swing-barrier.html",
              img: "/images/sub-sub-categories/Turnstile-Gate/Double Swing Barrier.avif",
            },
          ],
        },
        {
          name: "Full Height Turnstile",
          link: "/full-height-turnstile.html",
          subSub: [
            {
              name: "Single Full Height Turnstile",
              link: "/single-full-height-turnstile.html",
              img: "/images/sub-sub-categories/Turnstile-Gate/Single Full Height Turnstile.avif",
            },
            {
              name: "Double Full Height Turnstile",
              link: "/double-full-height-turnstile.html",
              img: "/images/sub-sub-categories/Turnstile-Gate/Double Full Height Turnstile.avif",
            },
          ],
        },
        {
          name: "Boom Barrier Gate",
          link: "/boom-barrier-gate.html",
          subSub: [
            {
              name: "Straight Arm Boom Barrier",
              link: "/straight-arm-boom-barrier.html",
              img: "/images/sub-sub-categories/Turnstile-Gate/Straight Arm Boom Barrier.avif",
            },
            {
              name: "Folding Arm Boom Barrier",
              link: "/folding-arm-boom-barrier.html",
              img: "/images/sub-sub-categories/Turnstile-Gate/Folding Arm Boom Barrier.avif",
            },
          ],
        },
        {
          name: "Parking Barrier",
          link: "/parking-barrier.html",
          subSub: [
            {
              name: "RFID Parking Barrier",
              link: "/rfid-parking-barrier.html",
              img: "/images/sub-sub-categories/Turnstile-Gate/RFID Parking Barrier.avif",
            },
            {
              name: "ANPR Parking Barrier",
              link: "/anpr-parking-barrier.html",
              img: "/images/sub-sub-categories/Turnstile-Gate/ANPR Parking Barrier.avif",
            },
          ],
        },
        {
          name: "Ticketing Gate System",
          link: "/ticketing-gate-system.html",
          subSub: [
            {
              name: "QR Ticketing Gate",
              link: "/qr-ticketing-gate.html",
              img: "/images/sub-sub-categories/Turnstile-Gate/QR Ticketing Gate.avif",
            },
            {
              name: "RFID Ticketing Gate",
              link: "/rfid-ticketing-gate.html",
              img: "/images/sub-sub-categories/Turnstile-Gate/RFID Ticketing Gate.avif",
            },
          ],
        },
      ],
    },

    signage: {
      title: "LCD/LED Digital Signage",
      link: "/lcd-led-digital-signage.html",
      sub: [
        {
          name: "Indoor LED Display",
          link: "/indoor-led-display.html",
          subSub: [
            {
              name: "P2 Indoor LED Display",
              link: "/p2-indoor-led-display.html",
              img: "/images/sub-sub-categories/lcd-led-digital-signage/p2-indoor-led-display.avif",
            },
            {
              name: "P3 Indoor LED Display",
              link: "/p3-indoor-led-display.html",
              img: "/images/sub-sub-categories/lcd-led-digital-signage/p3-indoor-led-display.avif",
            },
          ],
        },
        {
          name: "Outdoor LED Display",
          link: "/outdoor-led-display.html",
          subSub: [
            {
              name: "P4 Outdoor LED Display",
              link: "/p4-outdoor-led-display.html",
              img: "/images/sub-sub-categories/lcd-led-digital-signage/p4-outdoor-led-display.avif",
            },
            {
              name: "P5 Outdoor LED Display",
              link: "/p5-outdoor-led-display.html",
              img: "/images/sub-sub-categories/lcd-led-digital-signage/p5-outdoor-led-display.avif",
            },
          ],
        },
        {
          name: "Interactive Kiosk",
          link: "/interactive-kiosk.html",
          subSub: [
            {
              name: "Touch Kiosk",
              link: "/touch-kiosk.html",
              img: "/images/sub-sub-categories/lcd-led-digital-signage/touch-kiosk.avif",
            },
            {
              name: "Self Service Kiosk",
              link: "/self-service-kiosk.html",
              img: "/images/sub-sub-categories/lcd-led-digital-signage/self-service-kiosk.avif",
            },
          ],
        },
        {
          name: "Video Wall Display",
          link: "/video-wall-display.html",
          subSub: [
            {
              name: "LCD Video Wall",
              link: "/lcd-video-wall.html",
              img: "/images/sub-sub-categories/lcd-led-digital-signage/lcd-video-wall.avif",
            },
            {
              name: "LED Video Wall",
              link: "/led-video-wall.html",
              img: "/images/sub-sub-categories/lcd-led-digital-signage/led-video-wall.avif",
            },
          ],
        },
        {
          name: "Digital Signage Player",
          link: "/digital-signage-player.html",
          subSub: [
            {
              name: "Android Signage Player",
              link: "/android-signage-player.html",
              img: "/images/sub-sub-categories/lcd-led-digital-signage/android-signage-player.avif",
            },
            {
              name: "Windows Signage Player",
              link: "/windows-signage-player.html",
              img: "/images/sub-sub-categories/lcd-led-digital-signage/windows-signage-player.avif",
            },
          ],
        },
        {
          name: "Advertising Display",
          link: "/advertising-display.html",
          subSub: [
            {
              name: "Floor Standing Display",
              link: "/floor-standing-display.html",
              img: "/images/sub-sub-categories/lcd-led-digital-signage/floor-standing-display.avif",
            },
            {
              name: "Wall Mounted Display",
              link: "/wall-mounted-display.html",
              img: "/images/sub-sub-categories/lcd-led-digital-signage/wall-mounted-display.avif",
            },
          ],
        },
      ],
    },

    queue: {
      title: "Queue Management System",
      link: "/queue-management-system.html",
      sub: [
        {
          name: "Token Machine",
          link: "/token-machine.html",
          subSub: [
            {
              name: "Basic Token Machine",
              link: "/basic-token-machine.html",
              img: "/images/sub-sub-categories/queue_management_avif_images/Basic Token Machine.avif",
            },
            {
              name: "Touch Token Machine",
              link: "/touch-token-machine.html",
              img: "/images/sub-sub-categories/queue_management_avif_images/Touch Token Machine.avif",
            },
            {
              name: "Kiosk Token Machine",
              link: "/kiosk-token-machine.html",
              img: "/images/sub-sub-categories/queue_management_avif_images/Kiosk Token Machine.avif",
            },
          ],
        },
        {
          name: "Queue Display",
          link: "/queue-display.html",
          subSub: [
            {
              name: "Counter Display",
              link: "/counter-display.html",
              img: "/images/sub-sub-categories/queue_management_avif_images/Counter Display.avif",
            },
            {
              name: "Main Queue Display",
              link: "/main-queue-display.html",
              img: "/images/sub-sub-categories/queue_management_avif_images/Main Queue Display.avif",
            },
          ],
        },
        {
          name: "Calling System",
          link: "/calling-system.html",
          subSub: [
            {
              name: "Wireless Calling System",
              link: "/wireless-calling-system.html",
              img: "/images/sub-sub-categories/queue_management_avif_images/Wireless Calling System.avif",
            },
            {
              name: "Software Calling System",
              link: "/software-calling-system.html",
              img: "/images/sub-sub-categories/queue_management_avif_images/Software Calling System.avif",
            },
          ],
        },
        {
          name: "Counter Display",
          link: "/counter-display-system.html",
          subSub: [
            {
              name: "LED Counter Display",
              link: "/led-counter-display.html",
              img: "/images/sub-sub-categories/queue_management_avif_images/LED Counter Display.avif",
            },
            {
              name: "LCD Counter Display",
              link: "/lcd-counter-display.html",
              img: "/images/sub-sub-categories/queue_management_avif_images/LCD Counter Display.avif",
            },
          ],
        },
        {
          name: "Queue Software",
          link: "/queue-software.html",
          subSub: [
            {
              name: "Cloud Queue Software",
              link: "/cloud-queue-software.html",
              img: "/images/sub-sub-categories/queue_management_avif_images/Cloud Queue Software.avif",
            },
            {
              name: "Local Queue Software",
              link: "/local-queue-software.html",
              img: "/images/sub-sub-categories/queue_management_avif_images/Local Queue Software.avif",
            },
          ],
        },
        {
          name: "Customer Feedback System",
          link: "/customer-feedback-system.html",
          subSub: [
            {
              name: "Feedback Kiosk",
              link: "/feedback-kiosk.html",
              img: "/images/sub-sub-categories/queue_management_avif_images/Feedback Kiosk.avif",
            },
            {
              name: "Feedback Software",
              link: "/feedback-software.html",
              img: "/images/sub-sub-categories/queue_management_avif_images/Feedback Software.avif",
            },
          ],
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
          subSub: [
            {
              name: "Ticket Parking System",
              link: "/ticket-parking-system.html",
              img: "/images/sub-sub-categories/vehicle-control-system/Ticket Parking System.avif",
            },
            {
              name: "RFID Parking System",
              link: "/rfid-parking-system.html",
              img: "/images/sub-sub-categories/vehicle-control-system/RFID Parking System.avif",
            },
            {
              name: "ANPR Parking System",
              link: "/anpr-parking-system.html",
              img: "/images/sub-sub-categories/vehicle-control-system/ANPR Parking System.avif",
            },
          ],
        },
        {
          name: "Car Parking Guidance",
          link: "/car-parking-guidance.html",
          subSub: [
            {
              name: "Indoor Parking Guidance",
              link: "/indoor-parking-guidance.html",
              img: "/images/sub-sub-categories/vehicle-control-system/Indoor Parking Guidance.avif",
            },
            {
              name: "Outdoor Parking Guidance",
              link: "/outdoor-parking-guidance.html",
              img: "/images/sub-sub-categories/vehicle-control-system/Outdoor Parking Guidance.avif",
            },
          ],
        },
        {
          name: "RFID Vehicle Access",
          link: "/rfid-vehicle-access.html",
          subSub: [
            {
              name: "RFID Long Range Reader",
              link: "/rfid-long-range-reader.html",
              img: "/images/sub-sub-categories/vehicle-control-system/RFID Long Range Reader.avif",
            },
            {
              name: "RFID Vehicle Tag",
              link: "/rfid-vehicle-tag.html",
              img: "/images/sub-sub-categories/vehicle-control-system/RFID Vehicle Tag.avif",
            },
          ],
        },
        {
          name: "ANPR Parking System",
          link: "/anpr-parking-control.html",
          subSub: [
            {
              name: "ANPR Entry System",
              link: "/anpr-entry-system.html",
              img: "/images/sub-sub-categories/vehicle-control-system/ANPR Entry System.avif",
            },
            {
              name: "ANPR Exit System",
              link: "/anpr-exit-system.html",
              img: "/images/sub-sub-categories/vehicle-control-system/ANPR Exit System.avif",
            },
          ],
        },
        {
          name: "Vehicle Loop Detector",
          link: "/vehicle-loop-detector.html",
          subSub: [
            {
              name: "Single Channel Loop Detector",
              link: "/single-channel-loop-detector.html",
              img: "/images/sub-sub-categories/vehicle-control-system/Single Channel Loop Detector.avif",
            },
            {
              name: "Dual Channel Loop Detector",
              link: "/dual-channel-loop-detector.html",
              img: "/images/sub-sub-categories/vehicle-control-system/Dual Channel Loop Detector.avif",
            },
          ],
        },
        {
          name: "Parking Payment Kiosk",
          link: "/parking-payment-kiosk.html",
          subSub: [
            {
              name: "Cash Payment Kiosk",
              link: "/cash-payment-kiosk.html",
              img: "/images/sub-sub-categories/vehicle-control-system/Cash Payment Kiosk.avif",
            },
            {
              name: "Card Payment Kiosk",
              link: "/card-payment-kiosk.html",
              img: "/images/sub-sub-categories/vehicle-control-system/Card Payment Kiosk.avif",
            },
          ],
        },
      ],
    },

    conference: {
      title: "Conference & PA System",
      link: "/conference-pa-system.html",
      sub: [
        {
          name: "Conference Microphone",
          link: "/conference-microphone.html",
          subSub: [
            {
              name: "Wired Conference Microphone",
              link: "/wired-conference-microphone.html",
              img: "/images/sub-sub-categories/conference-pa/Wired Conference Microphone.avif",
            },
            {
              name: "Wireless Conference Microphone",
              link: "/wireless-conference-microphone.html",
              img: "/images/sub-sub-categories/conference-pa/Wireless Conference Microphone.avif",
            },
          ],
        },
        {
          name: "PA Speaker System",
          link: "/pa-speaker-system.html",
          subSub: [
            {
              name: "Wall Mount PA Speaker",
              link: "/wall-mount-pa-speaker.html",
              img: "/images/sub-sub-categories/conference-pa/Wall Mount PA Speaker.avif",
            },
            {
              name: "Ceiling PA Speaker",
              link: "/ceiling-pa-speaker.html",
              img: "/images/sub-sub-categories/conference-pa/Ceiling PA Speaker.avif",
            },
          ],
        },
        {
          name: "Amplifier System",
          link: "/amplifier-system.html",
          subSub: [
            {
              name: "Mixer Amplifier",
              link: "/mixer-amplifier.html",
              img: "/images/sub-sub-categories/conference-pa/Mixer Amplifier.avif",
            },
            {
              name: "Power Amplifier",
              link: "/power-amplifier.html",
              img: "/images/sub-sub-categories/conference-pa/Power Amplifier.avif",
            },
          ],
        },
        {
          name: "Wireless Microphone",
          link: "/wireless-microphone.html",
          subSub: [
            {
              name: "Handheld Wireless Microphone",
              link: "/handheld-wireless-microphone.html",
              img: "/images/sub-sub-categories/conference-pa/Handheld Wireless Microphone.avif",
            },
            {
              name: "Lapel Wireless Microphone",
              link: "/lapel-wireless-microphone.html",
              img: "/images/sub-sub-categories/conference-pa/Lapel Wireless Microphone.avif",
            },
          ],
        },
        {
          name: "Meeting Room Audio",
          link: "/meeting-room-audio.html",
          subSub: [
            {
              name: "Small Meeting Room Audio",
              link: "/small-meeting-room-audio.html",
              img: "/images/sub-sub-categories/conference-pa/Small Meeting Room Audio.avif",
            },
            {
              name: "Large Meeting Room Audio",
              link: "/large-meeting-room-audio.html",
              img: "/images/sub-sub-categories/conference-pa/Large Meeting Room Audio.avif",
            },
          ],
        },
        {
          name: "Public Announcement System",
          link: "/public-announcement-system.html",
          subSub: [
            {
              name: "Zone PA System",
              link: "/zone-pa-system.html",
              img: "/images/sub-sub-categories/conference-pa/Zone PA System.avif",
            },
            {
              name: "Emergency PA System",
              link: "/emergency-pa-system.html",
              img: "/images/sub-sub-categories/conference-pa/Emergency PA System.avif",
            },
          ],
        },
      ],
    },

    building: {
      title: "Building Automation Solutions",
      link: "/building-automation-solutions.html",
      sub: [
        {
          name: "BMS System",
          link: "/bms-system.html",
          subSub: [
            {
              name: "BMS Controller",
              link: "/bms-controller.html",
              img: "/images/sub-sub-categories/building-automation/BMS Controller.avif",
            },
            {
              name: "BMS Monitoring Software",
              link: "/bms-monitoring-software.html",
              img: "/images/sub-sub-categories/building-automation/BMS Monitoring Software.avif",
            },
          ],
        },
        {
          name: "Lighting Control",
          link: "/lighting-control.html",
          subSub: [
            {
              name: "Dimming Control",
              link: "/dimming-control.html",
              img: "/images/sub-sub-categories/building-automation/Dimming Control.avif",
            },
            {
              name: "Motion Lighting Control",
              link: "/motion-lighting-control.html",
              img: "/images/sub-sub-categories/building-automation/Motion Lighting Control.avif",
            },
          ],
        },
        {
          name: "HVAC Control",
          link: "/hvac-control.html",
          subSub: [
            {
              name: "Thermostat Control",
              link: "/thermostat-control.html",
              img: "/images/sub-sub-categories/building-automation/Thermostat Control.avif",
            },
            {
              name: "AHU Control",
              link: "/ahu-control.html",
              img: "/images/sub-sub-categories/building-automation/AHU Control.avif",
            },
          ],
        },
        {
          name: "Energy Management",
          link: "/energy-management.html",
          subSub: [
            {
              name: "Energy Meter",
              link: "/energy-meter.html",
              img: "/images/sub-sub-categories/building-automation/Energy Meter.avif",
            },
            {
              name: "Energy Monitoring Software",
              link: "/energy-monitoring-software.html",
              img: "/images/sub-sub-categories/building-automation/Energy Monitoring Software.avif",
            },
          ],
        },
        {
          name: "Smart Building Control",
          link: "/smart-building-control.html",
          subSub: [
            {
              name: "Smart Building Controller",
              link: "/smart-building-controller.html",
              img: "/images/sub-sub-categories/building-automation/Smart Building Controller.avif",
            },
            {
              name: "Smart Building Dashboard",
              link: "/smart-building-dashboard.html",
              img: "/images/sub-sub-categories/building-automation/Smart Building Dashboard.avif",
            },
          ],
        },
        {
          name: "Central Monitoring System",
          link: "/central-monitoring-system.html",
          subSub: [
            {
              name: "Central Monitoring Software",
              link: "/central-monitoring-software.html",
              img: "/images/sub-sub-categories/building-automation/Central Monitoring Software.avif",
            },
            {
              name: "Monitoring Workstation",
              link: "/monitoring-workstation.html",
              img: "/images/sub-sub-categories/building-automation/Monitoring Workstation.avif",
            },
          ],
        },
      ],
    },
    smart: {
      title: "Smart Home Solutions",
      link: "/smart-home-solutions.html",
      sub: [
        {
          name: "Smart Door Lock",
          link: "/smart-door-lock.html",
          subSub: [
            {
              name: "Fingerprint Smart Lock",
              link: "/fingerprint-smart-lock.html",
              img: "/images/sub-sub-categories/smart-home/Fingerprint Smart Lock.avif",
            },
            {
              name: "WiFi Smart Lock",
              link: "/wifi-smart-lock.html",
              img: "/images/sub-sub-categories/smart-home/WiFi Smart Lock.avif",
            },
            {
              name: "Card Smart Lock",
              link: "/card-smart-lock.html",
              img: "/images/sub-sub-categories/smart-home/Card Smart Lock.avif",
            },
          ],
        },
        {
          name: "Smart Switch",
          link: "/smart-switch.html",
          subSub: [
            {
              name: "One Gang Smart Switch",
              link: "/one-gang-smart-switch.html",
              img: "/images/sub-sub-categories/smart-home/One Gang Smart Switch.avif",
            },
            {
              name: "Two Gang Smart Switch",
              link: "/two-gang-smart-switch.html",
              img: "/images/sub-sub-categories/smart-home/Two Gang Smart Switch.avif",
            },
            {
              name: "Three Gang Smart Switch",
              link: "/three-gang-smart-switch.html",
              img: "/images/sub-sub-categories/smart-home/Three Gang Smart Switch.avif",
            },
          ],
        },
        {
          name: "Smart Curtain",
          link: "/smart-curtain.html",
          subSub: [
            {
              name: "Smart Curtain Motor",
              link: "/smart-curtain-motor.html",
              img: "/images/sub-sub-categories/smart-home/Smart Curtain Motor.avif",
            },
            {
              name: "Smart Curtain Track",
              link: "/smart-curtain-track.html",
              img: "/images/sub-sub-categories/smart-home/Smart Curtain Track.avif",
            },
          ],
        },
        {
          name: "Smart Lighting",
          link: "/smart-lighting.html",
          subSub: [
            {
              name: "Smart LED Bulb",
              link: "/smart-led-bulb.html",
              img: "/images/sub-sub-categories/smart-home/Smart LED Bulb.avif",
            },
            {
              name: "Smart Strip Light",
              link: "/smart-strip-light.html",
              img: "/images/sub-sub-categories/smart-home/Smart Strip Light.avif",
            },
          ],
        },
        {
          name: "Smart Security Sensor",
          link: "/smart-security-sensor.html",
          subSub: [
            {
              name: "Smart Motion Sensor",
              link: "/smart-motion-sensor.html",
              img: "/images/sub-sub-categories/smart-home/Smart Motion Sensor.avif",
            },
            {
              name: "Smart Door Sensor",
              link: "/smart-door-sensor.html",
              img: "/images/sub-sub-categories/smart-home/Smart Door Sensor.avif",
            },
          ],
        },
        {
          name: "Home Automation Hub",
          link: "/home-automation-hub.html",
          subSub: [
            {
              name: "WiFi Automation Hub",
              link: "/wifi-automation-hub.html",
              img: "/images/sub-sub-categories/smart-home/WiFi Automation Hub.avif",
            },
            {
              name: "Zigbee Automation Hub",
              link: "/zigbee-automation-hub.html",
              img: "/images/sub-sub-categories/smart-home/Zigbee Automation Hub.avif",
            },
          ],
        },
      ],
    },
  };

  function getSubName(subItem) {
    return subItem.name;
  }

  function getSubLink(subItem) {
    return subItem.link;
  }

  function renderSubSubCategories(categoryKey, subItem) {
    const subName = getSubName(subItem);
    const subLink = getSubLink(subItem);
    const subSubItems = Array.isArray(subItem.subSub) ? subItem.subSub : [];

    previewTitle.textContent = subName;

    if (!subSubItems.length) {
      previewList.innerHTML = `
        <a href="${subLink}" class="flex items-center gap-5 border-b border-[#e6edf5] pb-4 group/product">
          <div class="w-[95px] h-[95px] rounded-xl bg-[#f5f8fc] overflow-hidden shrink-0 flex items-center justify-center text-3xl">
            ›
          </div>

          <div>
            <h4 class="text-[17px] font-bold text-[#071425] group-hover/product:text-[#0057d8]">
              View All ${subName}
            </h4>
            <p class="mt-1 text-[14px] leading-6 font-medium text-[#4b5565]">
              Open this sub category page and view all products.
            </p>
          </div>
        </a>
      `;
    } else {
      previewList.innerHTML = subSubItems
        .map(function (item) {
          return `
            <a href="${item.link}" class="flex items-center gap-5 border-b border-[#e6edf5] pb-4 group/product">
          <div class="w-[96px] h-[96px] rounded-xl bg-[#f5f8fc] overflow-hidden shrink-0 flex items-center justify-center">
  <img
    src="${item.img}"
    alt="${item.name}"
    class="w-full h-full object-contain p-1"
    style="transform: scale(1.35); transform-origin: center;"
    onerror="this.src='/images/products/placeholder.avif'"
  />
</div>

              <div>
                <h4 class="text-[17px] font-bold text-[#071425] group-hover/product:text-[#0057d8]">
                  ${item.name}
                </h4>
                <p class="mt-1 text-[14px] leading-6 font-medium text-[#4b5565]">
                  View products under ${item.name}.
                </p>
              </div>
            </a>
          `;
        })
        .join("");
    }

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

        renderSubSubCategories(categoryKey, subItem);
      });
    });

    renderSubSubCategories(categoryKey, current.sub[0]);
  }

  tabs.forEach(function (tab) {
    tab.addEventListener("mouseenter", function () {
      const categoryKey = tab.getAttribute("data-product-mega-tab");
      renderCategory(categoryKey);
    });

    tab.addEventListener("click", function (e) {
      e.preventDefault();

      const categoryKey = tab.getAttribute("data-product-mega-tab");
      const current = data[categoryKey];

      if (current && current.link) {
        window.location.href = current.link;
      }
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
