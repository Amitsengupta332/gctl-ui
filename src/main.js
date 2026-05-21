import "./style.css";

import AOS from "aos";
import "aos/dist/aos.css";

import { initReusablePages } from "./reusable-pages.js";

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
              link: "/sub-hd-dome-camera.html",
              img: "/images/products/cctv_category_images_avif/hd_dome_camera.avif",
            },
            {
              name: "HD Bullet Camera",
              link: "/sub-hd-bullet-camera.html",
              img: "/images/products/cctv_category_images_avif/hd_bullet_camera_1.avif",
            },
            {
              name: "HD Turret Camera",
              link: "/sub-hd-turret-camera.html",
              img: "/images/products/cctv_category_images_avif/hd_turret_camera_600x450.avif",
            },
            {
              name: "HD PTZ Camera",
              link: "/sub-hd-ptz-camera.html",
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
              link: "/sub-ip-dome-camera.html",
              img: "/public/images/products/all-ip-camera-category-avif-600x450/ip-dome-camera-category-600x450.avif",
            },
            {
              name: "IP Bullet Camera",
              link: "/sub-ip-bullet-camera.html",
              img: "/public/images/products/all-ip-camera-category-avif-600x450/ip-bullet-camera-category-600x450.avif",
            },
            {
              name: "WiFi IP Camera",
              link: "/sub-wifi-ip-camera.html",
              img: "/public/images/products/all-ip-camera-category-avif-600x450/wifi-ip-camera-category-600x450.avif",
            },
            {
              name: "PoE IP Camera",
              link: "/sub-poe-ip-camera.html",
              img: "/public/images/products/all-ip-camera-category-avif-600x450/poe-ip-camera-category-600x450.avif",
            },
          ],
        },
        {
          name: "ANPR Number Plate Camera",
          link: "/anpr-number-plate-camera.html",
          subSub: [
            {
              name: "Fixed ANPR Camera",
              link: "/sub-fixed-anpr-camera.html",
              img: "/public/images/sub-sub-categories/cctv-surveillance-sub-sub/anpr/fixed-anpr-camera.avif",
            },
            {
              name: "Parking ANPR Camera",
              link: "/sub-parking-anpr-camera.html",
              img: "/public/images/sub-sub-categories/cctv-surveillance-sub-sub/anpr/parking-anpr-camera.avif",
            },
            {
              name: "Traffic ANPR Camera",
              link: "/sub-traffic-anpr-camera.html",
              img: "/public/images/sub-sub-categories/cctv-surveillance-sub-sub/anpr/traffic-anpr-camera.avif",
            },
          ],
        },
        {
          name: "AI Camera",
          link: "/ai-camera.html",
          subSub: [
            {
              name: "Face Recognition Camera",
              link: "/sub-face-recognition-camera.html",
              img: "/public/images/sub-sub-categories/cctv-surveillance-sub-sub/ai-camera/face-recognition-camera.avif",
            },
            {
              name: "People Counting Camera",
              link: "/sub-people-counting-camera.html",
              img: "/public/images/sub-sub-categories/cctv-surveillance-sub-sub/ai-camera/people-counting-camera.avif",
            },
            {
              name: "Human Detection Camera",
              link: "/sub-human-detection-camera.html",
              img: "/public/images/sub-sub-categories/cctv-surveillance-sub-sub/ai-camera/human-detection-camera.avif",
            },
            {
              name: "Vehicle Detection Camera",
              link: "/sub-vehicle-detection-camera.html",
              img: "/public/images/sub-sub-categories/cctv-surveillance-sub-sub/ai-camera/vehicle-detection-camera.avif",
            },
          ],
        },
        {
          name: "Body Temperature Camera",
          link: "/body-temperature-camera.html",
          subSub: [
            {
              name: "Thermal Temperature Camera",
              link: "/sub-thermal-temperature-camera.html",
              img: "/public/images/sub-sub-categories/cctv-surveillance-sub-sub/Body-Temperature/thermal-temperature-camera.avif",
            },
            {
              name: "Face Temperature Camera",
              link: "/sub-face-temperature-camera.html",
              img: "/public/images/sub-sub-categories/cctv-surveillance-sub-sub/Body-Temperature/face-temperature-camera.avif",
            },
          ],
        },
        {
          name: "Network Video Recorder (NVR)",
          link: "/network-video-recorder-nvr.html",
          subSub: [
            {
              name: "4 Channel NVR",
              link: "/sub-4-channel-nvr.html",
              img: "/public/images/sub-sub-categories/cctv-surveillance-sub-sub/nvr/4-channel-nvr.avif",
            },
            {
              name: "8 Channel NVR",
              link: "/sub-8-channel-nvr.html",
              img: "/public/images/sub-sub-categories/cctv-surveillance-sub-sub/nvr/8-channel-nvr.avif",
            },
            {
              name: "16 Channel NVR",
              link: "/sub-16-channel-nvr.html",
              img: "/public/images/sub-sub-categories/cctv-surveillance-sub-sub/nvr/16-channel-nvr.avif",
            },
            {
              name: "32 Channel NVR",
              link: "/sub-32-channel-nvr.html",
              img: "/public/images/sub-sub-categories/cctv-surveillance-sub-sub/nvr/32-channel-nvr.avif",
            },
          ],
        },
        {
          name: "Digital Video Recorder (DVR)",
          link: "/digital-video-recorder-dvr.html",
          subSub: [
            {
              name: "4 Channel DVR",
              link: "/sub-4-channel-dvr.html",
              img: "/public/images/sub-sub-categories/cctv-surveillance-sub-sub/dvr/4-channel-dvr.avif",
            },
            {
              name: "8 Channel DVR",
              link: "/sub-8-channel-dvr.html",
              img: "/public/images/sub-sub-categories/cctv-surveillance-sub-sub/dvr/8-channel-dvr.avif",
            },
            {
              name: "16 Channel DVR",
              link: "/sub-16-channel-dvr.html",
              img: "/public/images/sub-sub-categories/cctv-surveillance-sub-sub/dvr/16-channel-dvr.avif",
            },
          ],
        },
        {
          name: "CCTV Camera Accessories",
          link: "/cctv-camera-accessories.html",
          subSub: [
            {
              name: "CCTV Cable",
              link: "/sub-cctv-cable.html",
              img: "/public/images/sub-sub-categories/cctv-surveillance-sub-sub/cctv-camera-accessories/cctv-cable.avif",
            },
            {
              name: "CCTV Power Supply",
              link: "/sub-cctv-power-supply.html",
              img: "/public/images/sub-sub-categories/cctv-surveillance-sub-sub/cctv-camera-accessories/cctv-power-supply.avif",
            },
            {
              name: "CCTV Bracket",
              link: "/sub-cctv-bracket.html",
              img: "/public/images/sub-sub-categories/cctv-surveillance-sub-sub/cctv-camera-accessories/cctv-bracket.avif",
            },
            {
              name: "CCTV Connector",
              link: "/sub-cctv-connector.html",
              img: "/public/images/sub-sub-categories/cctv-surveillance-sub-sub/cctv-camera-accessories/cctv-connector.avif",
            },
          ],
        },
        {
          name: "CC Camera",
          link: "/cc-camera.html",
          subSub: [
            {
              name: "Indoor CC Camera",
              link: "/sub-indoor-cc-camera.html",
              img: "/public/images/sub-sub-categories/cctv-surveillance-sub-sub/cc-camera/indoor-cc-camera.avif",
            },
            {
              name: "Outdoor CC Camera",
              link: "/sub-outdoor-cc-camera.html",
              img: "/public/images/sub-sub-categories/cctv-surveillance-sub-sub/cc-camera/indoor-cc-camera.avif",
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
              link: "/sub-residential-sliding-gate-motor.html",
              img: "/images/sub-sub-categories/sub-residential-sliding-gate-motor.avif",
            },
            {
              name: "Industrial Sliding Gate Motor",
              link: "/sub-industrial-sliding-gate-motor.html",
              img: "/images/sub-sub-categories/sub-industrial-sliding-gate-motor.avif",
            },
            {
              name: "Heavy Duty Sliding Gate Motor",
              link: "/sub-heavy-duty-sliding-gate-motor.html",
              img: "/images/sub-sub-categories/sub-heavy-duty-sliding-gate-motor.avif",
            },
          ],
        },
        {
          name: "Swing Gate Motor",
          link: "/swing-gate-motor.html",
          subSub: [
            {
              name: "Single Leaf Swing Gate Motor",
              link: "/sub-single-leaf-swing-gate-motor.html",
              img: "/images/sub-sub-categories/sub-single-leaf-swing-gate-motor.avif",
            },
            {
              name: "Double Leaf Swing Gate Motor",
              link: "/sub-double-leaf-swing-gate-motor.html",
              img: "/images/sub-sub-categories/sub-double-leaf-swing-gate-motor.avif",
            },
            {
              name: "Underground Swing Gate Motor",
              link: "/sub-underground-swing-gate-motor.html",
              img: "/images/sub-sub-categories/sub-underground-swing-gate-motor.avif",
            },
          ],
        },
        {
          name: "Automatic Glass Door",
          link: "/automatic-glass-door.html",
          subSub: [
            {
              name: "Sensor Sliding Glass Door",
              link: "/sub-sensor-sliding-glass-door.html",
              img: "/images/sub-sub-categories/sub-sensor-sliding-glass-door.avif",
            },
            {
              name: "Telescopic Glass Door",
              link: "/sub-telescopic-glass-door.html",
              img: "/images/sub-sub-categories/sub-telescopic-glass-door.avif",
            },
            {
              name: "Glass Door Accessories",
              link: "/sub-glass-door-accessories.html",
              img: "/images/sub-sub-categories/sub-glass-door-accessories.avif",
            },
          ],
        },
        {
          name: "Garage Door Automation",
          link: "/garage-door-automation.html",
          subSub: [
            {
              name: "Sectional Garage Door",
              link: "/sub-sectional-garage-door.html",
              img: "/images/sub-sub-categories/sub-sectional-garage-door.avif",
            },
            {
              name: "Rolling Garage Door",
              link: "/sub-rolling-garage-door.html",
              img: "/images/sub-sub-categories/sub-rolling-garage-door.avif",
            },
          ],
        },
        {
          name: "Rolling Shutter Motor",
          link: "/rolling-shutter-motor.html",
          subSub: [
            {
              name: "AC Rolling Shutter Motor",
              link: "/sub-ac-rolling-shutter-motor.html",
              img: "/images/sub-sub-categories/sub-ac-rolling-shutter-motor.avif",
            },
            {
              name: "DC Rolling Shutter Motor",
              link: "/sub-dc-rolling-shutter-motor.html",
              img: "/images/sub-sub-categories/sub-dc-rolling-shutter-motor.avif",
            },
          ],
        },
        {
          name: "Automatic Sensor Door",
          link: "/automatic-sensor-door.html",
          subSub: [
            {
              name: "Sliding Sensor Door",
              link: "/sub-sliding-sensor-door.html",
              img: "/images/sub-sub-categories/sub-sliding-sensor-door.avif",
            },
            {
              name: "Swing Sensor Door",
              link: "/sub-swing-sensor-door.html",
              img: "/images/sub-sub-categories/sub-swing-sensor-door.avif",
            },
          ],
        },
        {
          name: "Road Blocker System",
          link: "/road-blocker-system.html",
          subSub: [
            {
              name: "Hydraulic Road Blocker",
              link: "/sub-hydraulic-road-blocker.html",
              img: "/images/sub-sub-categories/sub-hydraulic-road-blocker.avif",
            },
            {
              name: "Automatic Road Blocker",
              link: "/sub-automatic-road-blocker.html",
              img: "/images/sub-sub-categories/sub-automatic-road-blocker.avif",
            },
          ],
        },
        {
          name: "Industrial Door Automation",
          link: "/industrial-door-automation.html",
          subSub: [
            {
              name: "High Speed Door",
              link: "/sub-high-speed-door.html",
              img: "/images/sub-sub-categories/sub-high-speed-door.avif",
            },
            {
              name: "Sectional Industrial Door",
              link: "/sub-sectional-industrial-door.html",
              img: "/images/sub-sub-categories/sub-sectional-industrial-door.avif",
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
            {
              name: "Single Zone Metal Detector",
              link: "/sub-single-zone-metal-detector.html",
              img: "/images/sub-sub-categories/sub-single-zone-metal-detector.avif",
            },
            {
              name: "Multi Zone Metal Detector",
              link: "/sub-multi-zone-metal-detector.html",
              img: "/images/sub-sub-categories/sub-multi-zone-metal-detector.avif",
            },
            {
              name: "Weatherproof Metal Detector",
              link: "/sub-weatherproof-metal-detector.html",
              img: "/images/sub-sub-categories/sub-weatherproof-metal-detector.avif",
            },
          ],
        },
        {
          name: "Hand Held Metal Detector",
          link: "/hand-held-metal-detector.html",
          subSub: [
            {
              name: "Rechargeable Hand Held Detector",
              link: "/sub-rechargeable-hand-held-detector.html",
              img: "/images/sub-sub-categories/sub-rechargeable-hand-held-detector.avif",
            },
            {
              name: "Portable Hand Held Detector",
              link: "/sub-portable-hand-held-detector.html",
              img: "/images/sub-sub-categories/sub-portable-hand-held-detector.avif",
            },
          ],
        },
        {
          name: "X-Ray Baggage Scanner",
          link: "/x-ray-baggage-scanner.html",
          subSub: [
            {
              name: "Small Baggage Scanner",
              link: "/sub-small-baggage-scanner.html",
              img: "/images/sub-sub-categories/sub-small-baggage-scanner.avif",
            },
            {
              name: "Medium Baggage Scanner",
              link: "/sub-medium-baggage-scanner.html",
              img: "/images/sub-sub-categories/sub-medium-baggage-scanner.avif",
            },
            {
              name: "Large Baggage Scanner",
              link: "/sub-large-baggage-scanner.html",
              img: "/images/sub-sub-categories/sub-large-baggage-scanner.avif",
            },
          ],
        },
        {
          name: "Under Vehicle Scanner",
          link: "/under-vehicle-scanner.html",
          subSub: [
            {
              name: "Fixed Under Vehicle Scanner",
              link: "/sub-fixed-under-vehicle-scanner.html",
              img: "/images/sub-sub-categories/sub-fixed-under-vehicle-scanner.avif",
            },
            {
              name: "Portable Under Vehicle Scanner",
              link: "/sub-portable-under-vehicle-scanner.html",
              img: "/images/sub-sub-categories/sub-portable-under-vehicle-scanner.avif",
            },
          ],
        },
        {
          name: "Explosive Detector",
          link: "/explosive-detector.html",
          subSub: [
            {
              name: "Portable Explosive Detector",
              link: "/sub-portable-explosive-detector.html",
              img: "/images/sub-sub-categories/sub-portable-explosive-detector.avif",
            },
            {
              name: "Trace Explosive Detector",
              link: "/sub-trace-explosive-detector.html",
              img: "/images/sub-sub-categories/sub-trace-explosive-detector.avif",
            },
          ],
        },
        {
          name: "Visitor Management System",
          link: "/visitor-management-system.html",
          subSub: [
            {
              name: "Visitor Registration Kiosk",
              link: "/sub-visitor-registration-kiosk.html",
              img: "/images/sub-sub-categories/sub-visitor-registration-kiosk.avif",
            },
            {
              name: "Visitor Pass System",
              link: "/sub-visitor-pass-system.html",
              img: "/images/sub-sub-categories/sub-visitor-pass-system.avif",
            },
          ],
        },
        {
          name: "Security Inspection System",
          link: "/security-inspection-system.html",
          subSub: [
            {
              name: "Inspection Mirror",
              link: "/sub-inspection-mirror.html",
              img: "/images/sub-sub-categories/sub-inspection-mirror.avif",
            },
            {
              name: "Security Screening Kit",
              link: "/sub-security-screening-kit.html",
              img: "/images/sub-sub-categories/sub-security-screening-kit.avif",
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
              link: "/sub-face-recognition-camera.html",
              img: "/images/sub-sub-categories/sub-face-recognition-camera.avif",
            },
            {
              name: "Face Recognition Terminal",
              link: "/sub-face-recognition-terminal.html",
              img: "/images/sub-sub-categories/sub-face-recognition-terminal.avif",
            },
            {
              name: "Face Recognition Software",
              link: "/sub-face-recognition-software.html",
              img: "/images/sub-sub-categories/sub-face-recognition-software.avif",
            },
          ],
        },
        {
          name: "People Counting System",
          link: "/people-counting-system.html",
          subSub: [
            {
              name: "People Counting Camera",
              link: "/sub-people-counting-camera.html",
              img: "/images/sub-sub-categories/sub-people-counting-camera.avif",
            },
            {
              name: "Visitor Counting System",
              link: "/sub-visitor-counting-system.html",
              img: "/images/sub-sub-categories/sub-visitor-counting-system.avif",
            },
            {
              name: "Occupancy Monitoring System",
              link: "/sub-occupancy-monitoring-system.html",
              img: "/images/sub-sub-categories/sub-occupancy-monitoring-system.avif",
            },
          ],
        },
        {
          name: "Perimeter Intrusion Detection",
          link: "/perimeter-intrusion-detection.html",
          subSub: [
            {
              name: "Fence Intrusion Detection",
              link: "/sub-fence-intrusion-detection.html",
              img: "/images/sub-sub-categories/sub-fence-intrusion-detection.avif",
            },
            {
              name: "Restricted Area Detection",
              link: "/sub-restricted-area-detection.html",
              img: "/images/sub-sub-categories/sub-restricted-area-detection.avif",
            },
            {
              name: "AI Perimeter Camera",
              link: "/sub-ai-perimeter-camera.html",
              img: "/images/sub-sub-categories/sub-ai-perimeter-camera.avif",
            },
          ],
        },
        {
          name: "Line Crossing Detection",
          link: "/line-crossing-detection.html",
          subSub: [
            {
              name: "Virtual Line Crossing",
              link: "/sub-virtual-line-crossing.html",
              img: "/images/sub-sub-categories/sub-virtual-line-crossing.avif",
            },
            {
              name: "Direction Detection",
              link: "/sub-direction-detection.html",
              img: "/images/sub-sub-categories/sub-direction-detection.avif",
            },
          ],
        },
        {
          name: "Object Detection System",
          link: "/object-detection-system.html",
          subSub: [
            {
              name: "Abandoned Object Detection",
              link: "/sub-abandoned-object-detection.html",
              img: "/images/sub-sub-categories/sub-abandoned-object-detection.avif",
            },
            {
              name: "Missing Object Detection",
              link: "/sub-missing-object-detection.html",
              img: "/images/sub-sub-categories/sub-missing-object-detection.avif",
            },
            {
              name: "Suspicious Object Detection",
              link: "/sub-suspicious-object-detection.html",
              img: "/images/sub-sub-categories/sub-suspicious-object-detection.avif",
            },
          ],
        },
        {
          name: "Vehicle Analytics System",
          link: "/vehicle-analytics-system.html",
          subSub: [
            {
              name: "Vehicle Detection System",
              link: "/sub-vehicle-detection-system.html",
              img: "/images/sub-sub-categories/sub-vehicle-detection-system.avif",
            },
            {
              name: "Vehicle Counting System",
              link: "/sub-vehicle-counting-system.html",
              img: "/images/sub-sub-categories/sub-vehicle-counting-system.avif",
            },
            {
              name: "Traffic Flow Analytics",
              link: "/sub-traffic-flow-analytics.html",
              img: "/images/sub-sub-categories/sub-traffic-flow-analytics.avif",
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
              link: "/sub-fingerprint-attendance-device.html",
              img: "/images/sub-sub-categories/sub-fingerprint-attendance-device.avif",
            },
            {
              name: "Face Attendance Device",
              link: "/sub-face-attendance-device.html",
              img: "/images/sub-sub-categories/sub-face-attendance-device.avif",
            },
            {
              name: "Card Attendance Device",
              link: "/sub-card-attendance-device.html",
              img: "/images/sub-sub-categories/sub-card-attendance-device.avif",
            },
          ],
        },
        {
          name: "Door Access Control System",
          link: "/door-access-control-system.html",
          subSub: [
            {
              name: "Single Door Access Control",
              link: "/sub-single-door-access-control.html",
              img: "/images/sub-sub-categories/sub-single-door-access-control.avif",
            },
            {
              name: "Multi Door Access Control",
              link: "/sub-multi-door-access-control.html",
              img: "/images/sub-sub-categories/sub-multi-door-access-control.avif",
            },
            {
              name: "Network Access Controller",
              link: "/sub-network-access-controller.html",
              img: "/images/sub-sub-categories/sub-network-access-controller.avif",
            },
          ],
        },
        {
          name: "Face Recognition Access Control",
          link: "/face-recognition-access-control.html",
          subSub: [
            {
              name: "Face Access Terminal",
              link: "/sub-face-access-terminal.html",
              img: "/images/sub-sub-categories/sub-face-access-terminal.avif",
            },
            {
              name: "Mask Detection Access Control",
              link: "/sub-mask-detection-access-control.html",
              img: "/images/sub-sub-categories/sub-mask-detection-access-control.avif",
            },
            {
              name: "Temperature Detection Terminal",
              link: "/sub-temperature-detection-terminal.html",
              img: "/images/sub-sub-categories/sub-temperature-detection-terminal.avif",
            },
          ],
        },
        {
          name: "RFID Card Access System",
          link: "/rfid-card-access-system.html",
          subSub: [
            {
              name: "RFID Card Reader",
              link: "/sub-rfid-card-reader.html",
              img: "/images/sub-sub-categories/sub-rfid-card-reader.avif",
            },
            {
              name: "RFID Access Card",
              link: "/sub-rfid-access-card.html",
              img: "/images/sub-sub-categories/sub-rfid-access-card.avif",
            },
            {
              name: "RFID Key Fob",
              link: "/sub-rfid-key-fob.html",
              img: "/images/sub-sub-categories/sub-rfid-key-fob.avif",
            },
          ],
        },
        {
          name: "Electric Door Lock",
          link: "/electric-door-lock.html",
          subSub: [
            {
              name: "Magnetic Door Lock",
              link: "/sub-magnetic-door-lock.html",
              img: "/images/sub-sub-categories/sub-magnetic-door-lock.avif",
            },
            {
              name: "Electric Bolt Lock",
              link: "/sub-electric-bolt-lock.html",
              img: "/images/sub-sub-categories/sub-electric-bolt-lock.avif",
            },
            {
              name: "Door Exit Button",
              link: "/sub-door-exit-button.html",
              img: "/images/sub-sub-categories/sub-door-exit-button.avif",
            },
          ],
        },
        {
          name: "Attendance Management Software",
          link: "/attendance-management-software.html",
          subSub: [
            {
              name: "Employee Attendance Software",
              link: "/sub-employee-attendance-software.html",
              img: "/images/sub-sub-categories/sub-employee-attendance-software.avif",
            },
            {
              name: "Cloud Attendance Software",
              link: "/sub-cloud-attendance-software.html",
              img: "/images/sub-sub-categories/sub-cloud-attendance-software.avif",
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
              link: "/sub-conventional-fire-alarm-panel.html",
              img: "/images/sub-sub-categories/sub-conventional-fire-alarm-panel.avif",
            },
            {
              name: "Conventional Smoke Detector",
              link: "/sub-conventional-smoke-detector.html",
              img: "/images/sub-sub-categories/sub-conventional-smoke-detector.avif",
            },
            {
              name: "Conventional Heat Detector",
              link: "/sub-conventional-heat-detector.html",
              img: "/images/sub-sub-categories/sub-conventional-heat-detector.avif",
            },
          ],
        },
        {
          name: "Addressable Fire Alarm System",
          link: "/addressable-fire-alarm-system.html",
          subSub: [
            {
              name: "Addressable Fire Alarm Panel",
              link: "/sub-addressable-fire-alarm-panel.html",
              img: "/images/sub-sub-categories/sub-addressable-fire-alarm-panel.avif",
            },
            {
              name: "Addressable Smoke Detector",
              link: "/sub-addressable-smoke-detector.html",
              img: "/images/sub-sub-categories/sub-addressable-smoke-detector.avif",
            },
            {
              name: "Addressable Heat Detector",
              link: "/sub-addressable-heat-detector.html",
              img: "/images/sub-sub-categories/sub-addressable-heat-detector.avif",
            },
          ],
        },
        {
          name: "Fire Alarm Control Panel",
          link: "/fire-alarm-control-panel.html",
          subSub: [
            {
              name: "2 Zone Fire Alarm Panel",
              link: "/sub-2-zone-fire-alarm-panel.html",
              img: "/images/sub-sub-categories/sub-2-zone-fire-alarm-panel.avif",
            },
            {
              name: "4 Zone Fire Alarm Panel",
              link: "/sub-4-zone-fire-alarm-panel.html",
              img: "/images/sub-sub-categories/sub-4-zone-fire-alarm-panel.avif",
            },
            {
              name: "8 Zone Fire Alarm Panel",
              link: "/sub-8-zone-fire-alarm-panel.html",
              img: "/images/sub-sub-categories/sub-8-zone-fire-alarm-panel.avif",
            },
          ],
        },
        {
          name: "Smoke Detector",
          link: "/smoke-detector.html",
          subSub: [
            {
              name: "Optical Smoke Detector",
              link: "/sub-optical-smoke-detector.html",
              img: "/images/sub-sub-categories/sub-optical-smoke-detector.avif",
            },
            {
              name: "Photoelectric Smoke Detector",
              link: "/sub-photoelectric-smoke-detector.html",
              img: "/images/sub-sub-categories/sub-photoelectric-smoke-detector.avif",
            },
          ],
        },
        {
          name: "Heat Detector",
          link: "/heat-detector.html",
          subSub: [
            {
              name: "Fixed Temperature Heat Detector",
              link: "/sub-fixed-temperature-heat-detector.html",
              img: "/images/sub-sub-categories/sub-fixed-temperature-heat-detector.avif",
            },
            {
              name: "Rate of Rise Heat Detector",
              link: "/sub-rate-of-rise-heat-detector.html",
              img: "/images/sub-sub-categories/sub-rate-of-rise-heat-detector.avif",
            },
          ],
        },
        {
          name: "Manual Call Point",
          link: "/manual-call-point.html",
          subSub: [
            {
              name: "Break Glass Call Point",
              link: "/sub-break-glass-call-point.html",
              img: "/images/sub-sub-categories/sub-break-glass-call-point.avif",
            },
            {
              name: "Resettable Call Point",
              link: "/sub-resettable-call-point.html",
              img: "/images/sub-sub-categories/sub-resettable-call-point.avif",
            },
          ],
        },
        {
          name: "Fire Alarm Sounder & Strobe",
          link: "/fire-alarm-sounder-strobe.html",
          subSub: [
            {
              name: "Fire Alarm Sounder",
              link: "/sub-fire-alarm-sounder.html",
              img: "/images/sub-sub-categories/sub-fire-alarm-sounder.avif",
            },
            {
              name: "Fire Alarm Strobe",
              link: "/sub-fire-alarm-strobe.html",
              img: "/images/sub-sub-categories/sub-fire-alarm-strobe.avif",
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
              link: "/sub-manual-tripod-turnstile.html",
              img: "/images/sub-sub-categories/sub-manual-tripod-turnstile.avif",
            },
            {
              name: "Automatic Tripod Turnstile",
              link: "/sub-automatic-tripod-turnstile.html",
              img: "/images/sub-sub-categories/sub-automatic-tripod-turnstile.avif",
            },
          ],
        },
        {
          name: "Flap Barrier",
          link: "/flap-barrier.html",
          subSub: [
            {
              name: "Single Lane Flap Barrier",
              link: "/sub-single-lane-flap-barrier.html",
              img: "/images/sub-sub-categories/sub-single-lane-flap-barrier.avif",
            },
            {
              name: "Double Lane Flap Barrier",
              link: "/sub-double-lane-flap-barrier.html",
              img: "/images/sub-sub-categories/sub-double-lane-flap-barrier.avif",
            },
          ],
        },
        {
          name: "Swing Barrier",
          link: "/swing-barrier.html",
          subSub: [
            {
              name: "Single Swing Barrier",
              link: "/sub-single-swing-barrier.html",
              img: "/images/sub-sub-categories/sub-single-swing-barrier.avif",
            },
            {
              name: "Double Swing Barrier",
              link: "/sub-double-swing-barrier.html",
              img: "/images/sub-sub-categories/sub-double-swing-barrier.avif",
            },
          ],
        },
        {
          name: "Full Height Turnstile",
          link: "/full-height-turnstile.html",
          subSub: [
            {
              name: "Single Full Height Turnstile",
              link: "/sub-single-full-height-turnstile.html",
              img: "/images/sub-sub-categories/sub-single-full-height-turnstile.avif",
            },
            {
              name: "Double Full Height Turnstile",
              link: "/sub-double-full-height-turnstile.html",
              img: "/images/sub-sub-categories/sub-double-full-height-turnstile.avif",
            },
          ],
        },
        {
          name: "Boom Barrier Gate",
          link: "/boom-barrier-gate.html",
          subSub: [
            {
              name: "Straight Arm Boom Barrier",
              link: "/sub-straight-arm-boom-barrier.html",
              img: "/images/sub-sub-categories/sub-straight-arm-boom-barrier.avif",
            },
            {
              name: "Folding Arm Boom Barrier",
              link: "/sub-folding-arm-boom-barrier.html",
              img: "/images/sub-sub-categories/sub-folding-arm-boom-barrier.avif",
            },
          ],
        },
        {
          name: "Parking Barrier",
          link: "/parking-barrier.html",
          subSub: [
            {
              name: "RFID Parking Barrier",
              link: "/sub-rfid-parking-barrier.html",
              img: "/images/sub-sub-categories/sub-rfid-parking-barrier.avif",
            },
            {
              name: "ANPR Parking Barrier",
              link: "/sub-anpr-parking-barrier.html",
              img: "/images/sub-sub-categories/sub-anpr-parking-barrier.avif",
            },
          ],
        },
        {
          name: "Ticketing Gate System",
          link: "/ticketing-gate-system.html",
          subSub: [
            {
              name: "QR Ticketing Gate",
              link: "/sub-qr-ticketing-gate.html",
              img: "/images/sub-sub-categories/sub-qr-ticketing-gate.avif",
            },
            {
              name: "RFID Ticketing Gate",
              link: "/sub-rfid-ticketing-gate.html",
              img: "/images/sub-sub-categories/sub-rfid-ticketing-gate.avif",
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
              link: "/sub-p2-indoor-led-display.html",
              img: "/images/sub-sub-categories/sub-p2-indoor-led-display.avif",
            },
            {
              name: "P3 Indoor LED Display",
              link: "/sub-p3-indoor-led-display.html",
              img: "/images/sub-sub-categories/sub-p3-indoor-led-display.avif",
            },
          ],
        },
        {
          name: "Outdoor LED Display",
          link: "/outdoor-led-display.html",
          subSub: [
            {
              name: "P4 Outdoor LED Display",
              link: "/sub-p4-outdoor-led-display.html",
              img: "/images/sub-sub-categories/sub-p4-outdoor-led-display.avif",
            },
            {
              name: "P5 Outdoor LED Display",
              link: "/sub-p5-outdoor-led-display.html",
              img: "/images/sub-sub-categories/sub-p5-outdoor-led-display.avif",
            },
          ],
        },
        {
          name: "Interactive Kiosk",
          link: "/interactive-kiosk.html",
          subSub: [
            {
              name: "Touch Kiosk",
              link: "/sub-touch-kiosk.html",
              img: "/images/sub-sub-categories/sub-touch-kiosk.avif",
            },
            {
              name: "Self Service Kiosk",
              link: "/sub-self-service-kiosk.html",
              img: "/images/sub-sub-categories/sub-self-service-kiosk.avif",
            },
          ],
        },
        {
          name: "Video Wall Display",
          link: "/video-wall-display.html",
          subSub: [
            {
              name: "LCD Video Wall",
              link: "/sub-lcd-video-wall.html",
              img: "/images/sub-sub-categories/sub-lcd-video-wall.avif",
            },
            {
              name: "LED Video Wall",
              link: "/sub-led-video-wall.html",
              img: "/images/sub-sub-categories/sub-led-video-wall.avif",
            },
          ],
        },
        {
          name: "Digital Signage Player",
          link: "/digital-signage-player.html",
          subSub: [
            {
              name: "Android Signage Player",
              link: "/sub-android-signage-player.html",
              img: "/images/sub-sub-categories/sub-android-signage-player.avif",
            },
            {
              name: "Windows Signage Player",
              link: "/sub-windows-signage-player.html",
              img: "/images/sub-sub-categories/sub-windows-signage-player.avif",
            },
          ],
        },
        {
          name: "Advertising Display",
          link: "/advertising-display.html",
          subSub: [
            {
              name: "Floor Standing Display",
              link: "/sub-floor-standing-display.html",
              img: "/images/sub-sub-categories/sub-floor-standing-display.avif",
            },
            {
              name: "Wall Mounted Display",
              link: "/sub-wall-mounted-display.html",
              img: "/images/sub-sub-categories/sub-wall-mounted-display.avif",
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
              link: "/sub-basic-token-machine.html",
              img: "/images/sub-sub-categories/sub-basic-token-machine.avif",
            },
            {
              name: "Touch Token Machine",
              link: "/sub-touch-token-machine.html",
              img: "/images/sub-sub-categories/sub-touch-token-machine.avif",
            },
            {
              name: "Kiosk Token Machine",
              link: "/sub-kiosk-token-machine.html",
              img: "/images/sub-sub-categories/sub-kiosk-token-machine.avif",
            },
          ],
        },
        {
          name: "Queue Display",
          link: "/queue-display.html",
          subSub: [
            {
              name: "Counter Display",
              link: "/sub-counter-display.html",
              img: "/images/sub-sub-categories/sub-counter-display.avif",
            },
            {
              name: "Main Queue Display",
              link: "/sub-main-queue-display.html",
              img: "/images/sub-sub-categories/sub-main-queue-display.avif",
            },
          ],
        },
        {
          name: "Calling System",
          link: "/calling-system.html",
          subSub: [
            {
              name: "Wireless Calling System",
              link: "/sub-wireless-calling-system.html",
              img: "/images/sub-sub-categories/sub-wireless-calling-system.avif",
            },
            {
              name: "Software Calling System",
              link: "/sub-software-calling-system.html",
              img: "/images/sub-sub-categories/sub-software-calling-system.avif",
            },
          ],
        },
        {
          name: "Counter Display",
          link: "/counter-display-system.html",
          subSub: [
            {
              name: "LED Counter Display",
              link: "/sub-led-counter-display.html",
              img: "/images/sub-sub-categories/sub-led-counter-display.avif",
            },
            {
              name: "LCD Counter Display",
              link: "/sub-lcd-counter-display.html",
              img: "/images/sub-sub-categories/sub-lcd-counter-display.avif",
            },
          ],
        },
        {
          name: "Queue Software",
          link: "/queue-software.html",
          subSub: [
            {
              name: "Cloud Queue Software",
              link: "/sub-cloud-queue-software.html",
              img: "/images/sub-sub-categories/sub-cloud-queue-software.avif",
            },
            {
              name: "Local Queue Software",
              link: "/sub-local-queue-software.html",
              img: "/images/sub-sub-categories/sub-local-queue-software.avif",
            },
          ],
        },
        {
          name: "Customer Feedback System",
          link: "/customer-feedback-system.html",
          subSub: [
            {
              name: "Feedback Kiosk",
              link: "/sub-feedback-kiosk.html",
              img: "/images/sub-sub-categories/sub-feedback-kiosk.avif",
            },
            {
              name: "Feedback Software",
              link: "/sub-feedback-software.html",
              img: "/images/sub-sub-categories/sub-feedback-software.avif",
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
              link: "/sub-ticket-parking-system.html",
              img: "/images/sub-sub-categories/sub-ticket-parking-system.avif",
            },
            {
              name: "RFID Parking System",
              link: "/sub-rfid-parking-system.html",
              img: "/images/sub-sub-categories/sub-rfid-parking-system.avif",
            },
            {
              name: "ANPR Parking System",
              link: "/sub-anpr-parking-system.html",
              img: "/images/sub-sub-categories/sub-anpr-parking-system.avif",
            },
          ],
        },
        {
          name: "Car Parking Guidance",
          link: "/car-parking-guidance.html",
          subSub: [
            {
              name: "Indoor Parking Guidance",
              link: "/sub-indoor-parking-guidance.html",
              img: "/images/sub-sub-categories/sub-indoor-parking-guidance.avif",
            },
            {
              name: "Outdoor Parking Guidance",
              link: "/sub-outdoor-parking-guidance.html",
              img: "/images/sub-sub-categories/sub-outdoor-parking-guidance.avif",
            },
          ],
        },
        {
          name: "RFID Vehicle Access",
          link: "/rfid-vehicle-access.html",
          subSub: [
            {
              name: "RFID Long Range Reader",
              link: "/sub-rfid-long-range-reader.html",
              img: "/images/sub-sub-categories/sub-rfid-long-range-reader.avif",
            },
            {
              name: "RFID Vehicle Tag",
              link: "/sub-rfid-vehicle-tag.html",
              img: "/images/sub-sub-categories/sub-rfid-vehicle-tag.avif",
            },
          ],
        },
        {
          name: "ANPR Parking System",
          link: "/anpr-parking-control.html",
          subSub: [
            {
              name: "ANPR Entry System",
              link: "/sub-anpr-entry-system.html",
              img: "/images/sub-sub-categories/sub-anpr-entry-system.avif",
            },
            {
              name: "ANPR Exit System",
              link: "/sub-anpr-exit-system.html",
              img: "/images/sub-sub-categories/sub-anpr-exit-system.avif",
            },
          ],
        },
        {
          name: "Vehicle Loop Detector",
          link: "/vehicle-loop-detector.html",
          subSub: [
            {
              name: "Single Channel Loop Detector",
              link: "/sub-single-channel-loop-detector.html",
              img: "/images/sub-sub-categories/sub-single-channel-loop-detector.avif",
            },
            {
              name: "Dual Channel Loop Detector",
              link: "/sub-dual-channel-loop-detector.html",
              img: "/images/sub-sub-categories/sub-dual-channel-loop-detector.avif",
            },
          ],
        },
        {
          name: "Parking Payment Kiosk",
          link: "/parking-payment-kiosk.html",
          subSub: [
            {
              name: "Cash Payment Kiosk",
              link: "/sub-cash-payment-kiosk.html",
              img: "/images/sub-sub-categories/sub-cash-payment-kiosk.avif",
            },
            {
              name: "Card Payment Kiosk",
              link: "/sub-card-payment-kiosk.html",
              img: "/images/sub-sub-categories/sub-card-payment-kiosk.avif",
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
              link: "/sub-wired-conference-microphone.html",
              img: "/images/sub-sub-categories/sub-wired-conference-microphone.avif",
            },
            {
              name: "Wireless Conference Microphone",
              link: "/sub-wireless-conference-microphone.html",
              img: "/images/sub-sub-categories/sub-wireless-conference-microphone.avif",
            },
          ],
        },
        {
          name: "PA Speaker System",
          link: "/pa-speaker-system.html",
          subSub: [
            {
              name: "Wall Mount PA Speaker",
              link: "/sub-wall-mount-pa-speaker.html",
              img: "/images/sub-sub-categories/sub-wall-mount-pa-speaker.avif",
            },
            {
              name: "Ceiling PA Speaker",
              link: "/sub-ceiling-pa-speaker.html",
              img: "/images/sub-sub-categories/sub-ceiling-pa-speaker.avif",
            },
          ],
        },
        {
          name: "Amplifier System",
          link: "/amplifier-system.html",
          subSub: [
            {
              name: "Mixer Amplifier",
              link: "/sub-mixer-amplifier.html",
              img: "/images/sub-sub-categories/sub-mixer-amplifier.avif",
            },
            {
              name: "Power Amplifier",
              link: "/sub-power-amplifier.html",
              img: "/images/sub-sub-categories/sub-power-amplifier.avif",
            },
          ],
        },
        {
          name: "Wireless Microphone",
          link: "/wireless-microphone.html",
          subSub: [
            {
              name: "Handheld Wireless Microphone",
              link: "/sub-handheld-wireless-microphone.html",
              img: "/images/sub-sub-categories/sub-handheld-wireless-microphone.avif",
            },
            {
              name: "Lapel Wireless Microphone",
              link: "/sub-lapel-wireless-microphone.html",
              img: "/images/sub-sub-categories/sub-lapel-wireless-microphone.avif",
            },
          ],
        },
        {
          name: "Meeting Room Audio",
          link: "/meeting-room-audio.html",
          subSub: [
            {
              name: "Small Meeting Room Audio",
              link: "/sub-small-meeting-room-audio.html",
              img: "/images/sub-sub-categories/sub-small-meeting-room-audio.avif",
            },
            {
              name: "Large Meeting Room Audio",
              link: "/sub-large-meeting-room-audio.html",
              img: "/images/sub-sub-categories/sub-large-meeting-room-audio.avif",
            },
          ],
        },
        {
          name: "Public Announcement System",
          link: "/public-announcement-system.html",
          subSub: [
            {
              name: "Zone PA System",
              link: "/sub-zone-pa-system.html",
              img: "/images/sub-sub-categories/sub-zone-pa-system.avif",
            },
            {
              name: "Emergency PA System",
              link: "/sub-emergency-pa-system.html",
              img: "/images/sub-sub-categories/sub-emergency-pa-system.avif",
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
              link: "/sub-bms-controller.html",
              img: "/images/sub-sub-categories/sub-bms-controller.avif",
            },
            {
              name: "BMS Monitoring Software",
              link: "/sub-bms-monitoring-software.html",
              img: "/images/sub-sub-categories/sub-bms-monitoring-software.avif",
            },
          ],
        },
        {
          name: "Lighting Control",
          link: "/lighting-control.html",
          subSub: [
            {
              name: "Dimming Control",
              link: "/sub-dimming-control.html",
              img: "/images/sub-sub-categories/sub-dimming-control.avif",
            },
            {
              name: "Motion Lighting Control",
              link: "/sub-motion-lighting-control.html",
              img: "/images/sub-sub-categories/sub-motion-lighting-control.avif",
            },
          ],
        },
        {
          name: "HVAC Control",
          link: "/hvac-control.html",
          subSub: [
            {
              name: "Thermostat Control",
              link: "/sub-thermostat-control.html",
              img: "/images/sub-sub-categories/sub-thermostat-control.avif",
            },
            {
              name: "AHU Control",
              link: "/sub-ahu-control.html",
              img: "/images/sub-sub-categories/sub-ahu-control.avif",
            },
          ],
        },
        {
          name: "Energy Management",
          link: "/energy-management.html",
          subSub: [
            {
              name: "Energy Meter",
              link: "/sub-energy-meter.html",
              img: "/images/sub-sub-categories/sub-energy-meter.avif",
            },
            {
              name: "Energy Monitoring Software",
              link: "/sub-energy-monitoring-software.html",
              img: "/images/sub-sub-categories/sub-energy-monitoring-software.avif",
            },
          ],
        },
        {
          name: "Smart Building Control",
          link: "/smart-building-control.html",
          subSub: [
            {
              name: "Smart Building Controller",
              link: "/sub-smart-building-controller.html",
              img: "/images/sub-sub-categories/sub-smart-building-controller.avif",
            },
            {
              name: "Smart Building Dashboard",
              link: "/sub-smart-building-dashboard.html",
              img: "/images/sub-sub-categories/sub-smart-building-dashboard.avif",
            },
          ],
        },
        {
          name: "Central Monitoring System",
          link: "/central-monitoring-system.html",
          subSub: [
            {
              name: "Central Monitoring Software",
              link: "/sub-central-monitoring-software.html",
              img: "/images/sub-sub-categories/sub-central-monitoring-software.avif",
            },
            {
              name: "Monitoring Workstation",
              link: "/sub-monitoring-workstation.html",
              img: "/images/sub-sub-categories/sub-monitoring-workstation.avif",
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
              link: "/sub-fingerprint-smart-lock.html",
              img: "/images/sub-sub-categories/sub-fingerprint-smart-lock.avif",
            },
            {
              name: "WiFi Smart Lock",
              link: "/sub-wifi-smart-lock.html",
              img: "/images/sub-sub-categories/sub-wifi-smart-lock.avif",
            },
            {
              name: "Card Smart Lock",
              link: "/sub-card-smart-lock.html",
              img: "/images/sub-sub-categories/sub-card-smart-lock.avif",
            },
          ],
        },
        {
          name: "Smart Switch",
          link: "/smart-switch.html",
          subSub: [
            {
              name: "One Gang Smart Switch",
              link: "/sub-one-gang-smart-switch.html",
              img: "/images/sub-sub-categories/sub-one-gang-smart-switch.avif",
            },
            {
              name: "Two Gang Smart Switch",
              link: "/sub-two-gang-smart-switch.html",
              img: "/images/sub-sub-categories/sub-two-gang-smart-switch.avif",
            },
            {
              name: "Three Gang Smart Switch",
              link: "/sub-three-gang-smart-switch.html",
              img: "/images/sub-sub-categories/sub-three-gang-smart-switch.avif",
            },
          ],
        },
        {
          name: "Smart Curtain",
          link: "/smart-curtain.html",
          subSub: [
            {
              name: "Smart Curtain Motor",
              link: "/sub-smart-curtain-motor.html",
              img: "/images/sub-sub-categories/sub-smart-curtain-motor.avif",
            },
            {
              name: "Smart Curtain Track",
              link: "/sub-smart-curtain-track.html",
              img: "/images/sub-sub-categories/sub-smart-curtain-track.avif",
            },
          ],
        },
        {
          name: "Smart Lighting",
          link: "/smart-lighting.html",
          subSub: [
            {
              name: "Smart LED Bulb",
              link: "/sub-smart-led-bulb.html",
              img: "/images/sub-sub-categories/sub-smart-led-bulb.avif",
            },
            {
              name: "Smart Strip Light",
              link: "/sub-smart-strip-light.html",
              img: "/images/sub-sub-categories/sub-smart-strip-light.avif",
            },
          ],
        },
        {
          name: "Smart Security Sensor",
          link: "/smart-security-sensor.html",
          subSub: [
            {
              name: "Smart Motion Sensor",
              link: "/sub-smart-motion-sensor.html",
              img: "/images/sub-sub-categories/sub-smart-motion-sensor.avif",
            },
            {
              name: "Smart Door Sensor",
              link: "/sub-smart-door-sensor.html",
              img: "/images/sub-sub-categories/sub-smart-door-sensor.avif",
            },
          ],
        },
        {
          name: "Home Automation Hub",
          link: "/home-automation-hub.html",
          subSub: [
            {
              name: "WiFi Automation Hub",
              link: "/sub-wifi-automation-hub.html",
              img: "/images/sub-sub-categories/sub-wifi-automation-hub.avif",
            },
            {
              name: "Zigbee Automation Hub",
              link: "/sub-zigbee-automation-hub.html",
              img: "/images/sub-sub-categories/sub-zigbee-automation-hub.avif",
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
