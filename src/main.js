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
              img: "/images/sub-sub-categories/sub-fixed-anpr-camera.avif",
            },
            {
              name: "Parking ANPR Camera",
              link: "/sub-parking-anpr-camera.html",
              img: "/images/sub-sub-categories/sub-parking-anpr-camera.avif",
            },
            {
              name: "Traffic ANPR Camera",
              link: "/sub-traffic-anpr-camera.html",
              img: "/images/sub-sub-categories/sub-traffic-anpr-camera.avif",
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
              img: "/images/sub-sub-categories/sub-face-recognition-camera.avif",
            },
            {
              name: "People Counting Camera",
              link: "/sub-people-counting-camera.html",
              img: "/images/sub-sub-categories/sub-people-counting-camera.avif",
            },
            {
              name: "Human Detection Camera",
              link: "/sub-human-detection-camera.html",
              img: "/images/sub-sub-categories/sub-human-detection-camera.avif",
            },
            {
              name: "Vehicle Detection Camera",
              link: "/sub-vehicle-detection-camera.html",
              img: "/images/sub-sub-categories/sub-vehicle-detection-camera.avif",
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
              img: "/images/sub-sub-categories/sub-thermal-temperature-camera.avif",
            },
            {
              name: "Face Temperature Camera",
              link: "/sub-face-temperature-camera.html",
              img: "/images/sub-sub-categories/sub-face-temperature-camera.avif",
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
              img: "/images/sub-sub-categories/sub-4-channel-nvr.avif",
            },
            {
              name: "8 Channel NVR",
              link: "/sub-8-channel-nvr.html",
              img: "/images/sub-sub-categories/sub-8-channel-nvr.avif",
            },
            {
              name: "16 Channel NVR",
              link: "/sub-16-channel-nvr.html",
              img: "/images/sub-sub-categories/sub-16-channel-nvr.avif",
            },
            {
              name: "32 Channel NVR",
              link: "/sub-32-channel-nvr.html",
              img: "/images/sub-sub-categories/sub-32-channel-nvr.avif",
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
              img: "/images/sub-sub-categories/sub-4-channel-dvr.avif",
            },
            {
              name: "8 Channel DVR",
              link: "/sub-8-channel-dvr.html",
              img: "/images/sub-sub-categories/sub-8-channel-dvr.avif",
            },
            {
              name: "16 Channel DVR",
              link: "/sub-16-channel-dvr.html",
              img: "/images/sub-sub-categories/sub-16-channel-dvr.avif",
            },
          ],
        },
        {
          name: "CCTV Camera Accessories",
          link: "/sub-category-pages/cctv-surveillance/cctv-camera-accessories.html",
          subSub: [
            {
              name: "CCTV Cable",
              link: "/sub-sub-category-pages/cctv-surveillance/cctv-camera-accessories/sub-cctv-cable.html",
              img: "/images/sub-sub-categories/sub-cctv-cable.avif",
            },
            {
              name: "CCTV Power Supply",
              link: "/sub-sub-category-pages/cctv-surveillance/cctv-camera-accessories/sub-cctv-power-supply.html",
              img: "/images/sub-sub-categories/sub-cctv-power-supply.avif",
            },
            {
              name: "CCTV Bracket",
              link: "/sub-sub-category-pages/cctv-surveillance/cctv-camera-accessories/sub-cctv-bracket.html",
              img: "/images/sub-sub-categories/sub-cctv-bracket.avif",
            },
            {
              name: "CCTV Connector",
              link: "/sub-sub-category-pages/cctv-surveillance/cctv-camera-accessories/sub-cctv-connector.html",
              img: "/images/sub-sub-categories/sub-cctv-connector.avif",
            },
          ],
        },
        {
          name: "CC Camera",
          link: "/sub-category-pages/cctv-surveillance/cc-camera.html",
          subSub: [
            {
              name: "Indoor CC Camera",
              link: "/sub-sub-category-pages/cctv-surveillance/cc-camera/sub-indoor-cc-camera.html",
              img: "/images/sub-sub-categories/sub-indoor-cc-camera.avif",
            },
            {
              name: "Outdoor CC Camera",
              link: "/sub-sub-category-pages/cctv-surveillance/cc-camera/sub-outdoor-cc-camera.html",
              img: "/images/sub-sub-categories/sub-outdoor-cc-camera.avif",
            },
          ],
        },
      ],
    },

    automation: {
      title: "Automation Products",
      link: "/category-pages/automation-products.html",
      sub: [
        {
          name: "Sliding Gate Motor",
          link: "/sub-category-pages/automation-products/sliding-gate-motor.html",
          subSub: [
            {
              name: "Residential Sliding Gate Motor",
              link: "/sub-sub-category-pages/automation-products/sliding-gate-motor/sub-residential-sliding-gate-motor.html",
              img: "/images/sub-sub-categories/sub-residential-sliding-gate-motor.avif",
            },
            {
              name: "Industrial Sliding Gate Motor",
              link: "/sub-sub-category-pages/automation-products/sliding-gate-motor/sub-industrial-sliding-gate-motor.html",
              img: "/images/sub-sub-categories/sub-industrial-sliding-gate-motor.avif",
            },
            {
              name: "Heavy Duty Sliding Gate Motor",
              link: "/sub-sub-category-pages/automation-products/sliding-gate-motor/sub-heavy-duty-sliding-gate-motor.html",
              img: "/images/sub-sub-categories/sub-heavy-duty-sliding-gate-motor.avif",
            },
          ],
        },
        {
          name: "Swing Gate Motor",
          link: "/sub-category-pages/automation-products/swing-gate-motor.html",
          subSub: [
            {
              name: "Single Leaf Swing Gate Motor",
              link: "/sub-sub-category-pages/automation-products/swing-gate-motor/sub-single-leaf-swing-gate-motor.html",
              img: "/images/sub-sub-categories/sub-single-leaf-swing-gate-motor.avif",
            },
            {
              name: "Double Leaf Swing Gate Motor",
              link: "/sub-sub-category-pages/automation-products/swing-gate-motor/sub-double-leaf-swing-gate-motor.html",
              img: "/images/sub-sub-categories/sub-double-leaf-swing-gate-motor.avif",
            },
            {
              name: "Underground Swing Gate Motor",
              link: "/sub-sub-category-pages/automation-products/swing-gate-motor/sub-underground-swing-gate-motor.html",
              img: "/images/sub-sub-categories/sub-underground-swing-gate-motor.avif",
            },
          ],
        },
        {
          name: "Automatic Glass Door",
          link: "/sub-category-pages/automation-products/automatic-glass-door.html",
          subSub: [
            {
              name: "Sensor Sliding Glass Door",
              link: "/sub-sub-category-pages/automation-products/automatic-glass-door/sub-sensor-sliding-glass-door.html",
              img: "/images/sub-sub-categories/sub-sensor-sliding-glass-door.avif",
            },
            {
              name: "Telescopic Glass Door",
              link: "/sub-sub-category-pages/automation-products/automatic-glass-door/sub-telescopic-glass-door.html",
              img: "/images/sub-sub-categories/sub-telescopic-glass-door.avif",
            },
            {
              name: "Glass Door Accessories",
              link: "/sub-sub-category-pages/automation-products/automatic-glass-door/sub-glass-door-accessories.html",
              img: "/images/sub-sub-categories/sub-glass-door-accessories.avif",
            },
          ],
        },
        {
          name: "Garage Door Automation",
          link: "/sub-category-pages/automation-products/garage-door-automation.html",
          subSub: [
            {
              name: "Sectional Garage Door",
              link: "/sub-sub-category-pages/automation-products/garage-door-automation/sub-sectional-garage-door.html",
              img: "/images/sub-sub-categories/sub-sectional-garage-door.avif",
            },
            {
              name: "Rolling Garage Door",
              link: "/sub-sub-category-pages/automation-products/garage-door-automation/sub-rolling-garage-door.html",
              img: "/images/sub-sub-categories/sub-rolling-garage-door.avif",
            },
          ],
        },
        {
          name: "Rolling Shutter Motor",
          link: "/sub-category-pages/automation-products/rolling-shutter-motor.html",
          subSub: [
            {
              name: "AC Rolling Shutter Motor",
              link: "/sub-sub-category-pages/automation-products/rolling-shutter-motor/sub-ac-rolling-shutter-motor.html",
              img: "/images/sub-sub-categories/sub-ac-rolling-shutter-motor.avif",
            },
            {
              name: "DC Rolling Shutter Motor",
              link: "/sub-sub-category-pages/automation-products/rolling-shutter-motor/sub-dc-rolling-shutter-motor.html",
              img: "/images/sub-sub-categories/sub-dc-rolling-shutter-motor.avif",
            },
          ],
        },
        {
          name: "Automatic Sensor Door",
          link: "/sub-category-pages/automation-products/automatic-sensor-door.html",
          subSub: [
            {
              name: "Sliding Sensor Door",
              link: "/sub-sub-category-pages/automation-products/automatic-sensor-door/sub-sliding-sensor-door.html",
              img: "/images/sub-sub-categories/sub-sliding-sensor-door.avif",
            },
            {
              name: "Swing Sensor Door",
              link: "/sub-sub-category-pages/automation-products/automatic-sensor-door/sub-swing-sensor-door.html",
              img: "/images/sub-sub-categories/sub-swing-sensor-door.avif",
            },
          ],
        },
        {
          name: "Road Blocker System",
          link: "/sub-category-pages/automation-products/road-blocker-system.html",
          subSub: [
            {
              name: "Hydraulic Road Blocker",
              link: "/sub-sub-category-pages/automation-products/road-blocker-system/sub-hydraulic-road-blocker.html",
              img: "/images/sub-sub-categories/sub-hydraulic-road-blocker.avif",
            },
            {
              name: "Automatic Road Blocker",
              link: "/sub-sub-category-pages/automation-products/road-blocker-system/sub-automatic-road-blocker.html",
              img: "/images/sub-sub-categories/sub-automatic-road-blocker.avif",
            },
          ],
        },
        {
          name: "Industrial Door Automation",
          link: "/sub-category-pages/automation-products/industrial-door-automation.html",
          subSub: [
            {
              name: "High Speed Door",
              link: "/sub-sub-category-pages/automation-products/industrial-door-automation/sub-high-speed-door.html",
              img: "/images/sub-sub-categories/sub-high-speed-door.avif",
            },
            {
              name: "Sectional Industrial Door",
              link: "/sub-sub-category-pages/automation-products/industrial-door-automation/sub-sectional-industrial-door.html",
              img: "/images/sub-sub-categories/sub-sectional-industrial-door.avif",
            },
          ],
        },
      ],
    },

    entrance: {
      title: "Entrance Security Solutions",
      link: "/category-pages/entrance-security-solutions.html",
      sub: [
        {
          name: "Walk Through Metal Detector",
          link: "/sub-category-pages/entrance-security-solutions/walk-through-metal-detector.html",
          subSub: [
            {
              name: "Single Zone Metal Detector",
              link: "/sub-sub-category-pages/entrance-security-solutions/walk-through-metal-detector/sub-single-zone-metal-detector.html",
              img: "/images/sub-sub-categories/sub-single-zone-metal-detector.avif",
            },
            {
              name: "Multi Zone Metal Detector",
              link: "/sub-sub-category-pages/entrance-security-solutions/walk-through-metal-detector/sub-multi-zone-metal-detector.html",
              img: "/images/sub-sub-categories/sub-multi-zone-metal-detector.avif",
            },
            {
              name: "Weatherproof Metal Detector",
              link: "/sub-sub-category-pages/entrance-security-solutions/walk-through-metal-detector/sub-weatherproof-metal-detector.html",
              img: "/images/sub-sub-categories/sub-weatherproof-metal-detector.avif",
            },
          ],
        },
        {
          name: "Hand Held Metal Detector",
          link: "/sub-category-pages/entrance-security-solutions/hand-held-metal-detector.html",
          subSub: [
            {
              name: "Rechargeable Hand Held Detector",
              link: "/sub-sub-category-pages/entrance-security-solutions/hand-held-metal-detector/sub-rechargeable-hand-held-detector.html",
              img: "/images/sub-sub-categories/sub-rechargeable-hand-held-detector.avif",
            },
            {
              name: "Portable Hand Held Detector",
              link: "/sub-sub-category-pages/entrance-security-solutions/hand-held-metal-detector/sub-portable-hand-held-detector.html",
              img: "/images/sub-sub-categories/sub-portable-hand-held-detector.avif",
            },
          ],
        },
        {
          name: "X-Ray Baggage Scanner",
          link: "/sub-category-pages/entrance-security-solutions/x-ray-baggage-scanner.html",
          subSub: [
            {
              name: "Small Baggage Scanner",
              link: "/sub-sub-category-pages/entrance-security-solutions/x-ray-baggage-scanner/sub-small-baggage-scanner.html",
              img: "/images/sub-sub-categories/sub-small-baggage-scanner.avif",
            },
            {
              name: "Medium Baggage Scanner",
              link: "/sub-sub-category-pages/entrance-security-solutions/x-ray-baggage-scanner/sub-medium-baggage-scanner.html",
              img: "/images/sub-sub-categories/sub-medium-baggage-scanner.avif",
            },
            {
              name: "Large Baggage Scanner",
              link: "/sub-sub-category-pages/entrance-security-solutions/x-ray-baggage-scanner/sub-large-baggage-scanner.html",
              img: "/images/sub-sub-categories/sub-large-baggage-scanner.avif",
            },
          ],
        },
        {
          name: "Under Vehicle Scanner",
          link: "/sub-category-pages/entrance-security-solutions/under-vehicle-scanner.html",
          subSub: [
            {
              name: "Fixed Under Vehicle Scanner",
              link: "/sub-sub-category-pages/entrance-security-solutions/under-vehicle-scanner/sub-fixed-under-vehicle-scanner.html",
              img: "/images/sub-sub-categories/sub-fixed-under-vehicle-scanner.avif",
            },
            {
              name: "Portable Under Vehicle Scanner",
              link: "/sub-sub-category-pages/entrance-security-solutions/under-vehicle-scanner/sub-portable-under-vehicle-scanner.html",
              img: "/images/sub-sub-categories/sub-portable-under-vehicle-scanner.avif",
            },
          ],
        },
        {
          name: "Explosive Detector",
          link: "/sub-category-pages/entrance-security-solutions/explosive-detector.html",
          subSub: [
            {
              name: "Portable Explosive Detector",
              link: "/sub-sub-category-pages/entrance-security-solutions/explosive-detector/sub-portable-explosive-detector.html",
              img: "/images/sub-sub-categories/sub-portable-explosive-detector.avif",
            },
            {
              name: "Trace Explosive Detector",
              link: "/sub-sub-category-pages/entrance-security-solutions/explosive-detector/sub-trace-explosive-detector.html",
              img: "/images/sub-sub-categories/sub-trace-explosive-detector.avif",
            },
          ],
        },
        {
          name: "Visitor Management System",
          link: "/sub-category-pages/entrance-security-solutions/visitor-management-system.html",
          subSub: [
            {
              name: "Visitor Registration Kiosk",
              link: "/sub-sub-category-pages/entrance-security-solutions/visitor-management-system/sub-visitor-registration-kiosk.html",
              img: "/images/sub-sub-categories/sub-visitor-registration-kiosk.avif",
            },
            {
              name: "Visitor Pass System",
              link: "/sub-sub-category-pages/entrance-security-solutions/visitor-management-system/sub-visitor-pass-system.html",
              img: "/images/sub-sub-categories/sub-visitor-pass-system.avif",
            },
          ],
        },
        {
          name: "Security Inspection System",
          link: "/sub-category-pages/entrance-security-solutions/security-inspection-system.html",
          subSub: [
            {
              name: "Inspection Mirror",
              link: "/sub-sub-category-pages/entrance-security-solutions/security-inspection-system/sub-inspection-mirror.html",
              img: "/images/sub-sub-categories/sub-inspection-mirror.avif",
            },
            {
              name: "Security Screening Kit",
              link: "/sub-sub-category-pages/entrance-security-solutions/security-inspection-system/sub-security-screening-kit.html",
              img: "/images/sub-sub-categories/sub-security-screening-kit.avif",
            },
          ],
        },
      ],
    },

    analytics: {
      title: "Intelligent Video Analytics",
      link: "/category-pages/intelligent-video-analytics.html",
      sub: [
        {
          name: "Face Recognition System",
          link: "/sub-category-pages/intelligent-video-analytics/face-recognition-system.html",
          subSub: [
            {
              name: "Face Recognition Camera",
              link: "/sub-sub-category-pages/intelligent-video-analytics/face-recognition-system/sub-face-recognition-camera.html",
              img: "/images/sub-sub-categories/sub-face-recognition-camera.avif",
            },
            {
              name: "Face Recognition Terminal",
              link: "/sub-sub-category-pages/intelligent-video-analytics/face-recognition-system/sub-face-recognition-terminal.html",
              img: "/images/sub-sub-categories/sub-face-recognition-terminal.avif",
            },
          ],
        },
        {
          name: "People Counting Camera",
          link: "/sub-category-pages/intelligent-video-analytics/people-counting-camera.html",
          subSub: [
            {
              name: "Single Lens People Counter",
              link: "/sub-sub-category-pages/intelligent-video-analytics/people-counting-camera/sub-single-lens-people-counter.html",
              img: "/images/sub-sub-categories/sub-single-lens-people-counter.avif",
            },
            {
              name: "Dual Lens People Counter",
              link: "/sub-sub-category-pages/intelligent-video-analytics/people-counting-camera/sub-dual-lens-people-counter.html",
              img: "/images/sub-sub-categories/sub-dual-lens-people-counter.avif",
            },
          ],
        },
        {
          name: "Object Detection",
          link: "/sub-category-pages/intelligent-video-analytics/object-detection.html",
          subSub: [
            {
              name: "Object Classification",
              link: "/sub-sub-category-pages/intelligent-video-analytics/object-detection/sub-object-classification.html",
              img: "/images/sub-sub-categories/sub-object-classification.avif",
            },
            {
              name: "Abandoned Object Detection",
              link: "/sub-sub-category-pages/intelligent-video-analytics/object-detection/sub-abandoned-object-detection.html",
              img: "/images/sub-sub-categories/sub-abandoned-object-detection.avif",
            },
          ],
        },
        {
          name: "Intrusion Detection",
          link: "/sub-category-pages/intelligent-video-analytics/intrusion-detection.html",
          subSub: [
            {
              name: "Line Crossing Detection",
              link: "/sub-sub-category-pages/intelligent-video-analytics/intrusion-detection/sub-line-crossing-detection.html",
              img: "/images/sub-sub-categories/sub-line-crossing-detection.avif",
            },
            {
              name: "Area Intrusion Detection",
              link: "/sub-sub-category-pages/intelligent-video-analytics/intrusion-detection/sub-area-intrusion-detection.html",
              img: "/images/sub-sub-categories/sub-area-intrusion-detection.avif",
            },
          ],
        },
        {
          name: "Vehicle Analytics",
          link: "/sub-category-pages/intelligent-video-analytics/vehicle-analytics.html",
          subSub: [
            {
              name: "Vehicle Counting Analytics",
              link: "/sub-sub-category-pages/intelligent-video-analytics/vehicle-analytics/sub-vehicle-counting-analytics.html",
              img: "/images/sub-sub-categories/sub-vehicle-counting-analytics.avif",
            },
            {
              name: "Vehicle Detection Analytics",
              link: "/sub-sub-category-pages/intelligent-video-analytics/vehicle-analytics/sub-vehicle-detection-analytics.html",
              img: "/images/sub-sub-categories/sub-vehicle-detection-analytics.avif",
            },
          ],
        },
        {
          name: "Heatmap Analytics",
          link: "/sub-category-pages/intelligent-video-analytics/heatmap-analytics.html",
          subSub: [
            {
              name: "People Heatmap",
              link: "/sub-sub-category-pages/intelligent-video-analytics/heatmap-analytics/sub-people-heatmap.html",
              img: "/images/sub-sub-categories/sub-people-heatmap.avif",
            },
            {
              name: "Traffic Heatmap",
              link: "/sub-sub-category-pages/intelligent-video-analytics/heatmap-analytics/sub-traffic-heatmap.html",
              img: "/images/sub-sub-categories/sub-traffic-heatmap.avif",
            },
          ],
        },
        {
          name: "Smart Search Analytics",
          link: "/sub-category-pages/intelligent-video-analytics/smart-search-analytics.html",
          subSub: [
            {
              name: "Human Search Analytics",
              link: "/sub-sub-category-pages/intelligent-video-analytics/smart-search-analytics/sub-human-search-analytics.html",
              img: "/images/sub-sub-categories/sub-human-search-analytics.avif",
            },
            {
              name: "Vehicle Search Analytics",
              link: "/sub-sub-category-pages/intelligent-video-analytics/smart-search-analytics/sub-vehicle-search-analytics.html",
              img: "/images/sub-sub-categories/sub-vehicle-search-analytics.avif",
            },
          ],
        },
      ],
    },

    access: {
      title: "Access Control & Time Attendance",
      link: "/category-pages/access-control-time-attendance.html",
      sub: [
        {
          name: "Biometric Attendance",
          link: "/sub-category-pages/access-control-time-attendance/biometric-attendance.html",
          subSub: [
            {
              name: "Fingerprint Attendance",
              link: "/sub-sub-category-pages/access-control-time-attendance/biometric-attendance/sub-fingerprint-attendance.html",
              img: "/images/sub-sub-categories/sub-fingerprint-attendance.avif",
            },
            {
              name: "Face Attendance",
              link: "/sub-sub-category-pages/access-control-time-attendance/biometric-attendance/sub-face-attendance.html",
              img: "/images/sub-sub-categories/sub-face-attendance.avif",
            },
            {
              name: "Palm Attendance",
              link: "/sub-sub-category-pages/access-control-time-attendance/biometric-attendance/sub-palm-attendance.html",
              img: "/images/sub-sub-categories/sub-palm-attendance.avif",
            },
          ],
        },
        {
          name: "Face Attendance Device",
          link: "/sub-category-pages/access-control-time-attendance/face-attendance-device.html",
          subSub: [
            {
              name: "Face Recognition Attendance",
              link: "/sub-sub-category-pages/access-control-time-attendance/face-attendance-device/sub-face-recognition-attendance.html",
              img: "/images/sub-sub-categories/sub-face-recognition-attendance.avif",
            },
            {
              name: "Face Access Terminal",
              link: "/sub-sub-category-pages/access-control-time-attendance/face-attendance-device/sub-face-access-terminal.html",
              img: "/images/sub-sub-categories/sub-face-access-terminal.avif",
            },
          ],
        },
        {
          name: "RFID Access Control",
          link: "/sub-category-pages/access-control-time-attendance/rfid-access-control.html",
          subSub: [
            {
              name: "RFID Card Reader",
              link: "/sub-sub-category-pages/access-control-time-attendance/rfid-access-control/sub-rfid-card-reader.html",
              img: "/images/sub-sub-categories/sub-rfid-card-reader.avif",
            },
            {
              name: "RFID Controller",
              link: "/sub-sub-category-pages/access-control-time-attendance/rfid-access-control/sub-rfid-controller.html",
              img: "/images/sub-sub-categories/sub-rfid-controller.avif",
            },
          ],
        },
        {
          name: "Door Lock System",
          link: "/sub-category-pages/access-control-time-attendance/door-lock-system.html",
          subSub: [
            {
              name: "Magnetic Lock",
              link: "/sub-sub-category-pages/access-control-time-attendance/door-lock-system/sub-magnetic-lock.html",
              img: "/images/sub-sub-categories/sub-magnetic-lock.avif",
            },
            {
              name: "Drop Bolt Lock",
              link: "/sub-sub-category-pages/access-control-time-attendance/door-lock-system/sub-drop-bolt-lock.html",
              img: "/images/sub-sub-categories/sub-drop-bolt-lock.avif",
            },
            {
              name: "Electric Strike Lock",
              link: "/sub-sub-category-pages/access-control-time-attendance/door-lock-system/sub-electric-strike-lock.html",
              img: "/images/sub-sub-categories/sub-electric-strike-lock.avif",
            },
          ],
        },
        {
          name: "Access Control Panel",
          link: "/sub-category-pages/access-control-time-attendance/access-control-panel.html",
          subSub: [
            {
              name: "Single Door Controller",
              link: "/sub-sub-category-pages/access-control-time-attendance/access-control-panel/sub-single-door-controller.html",
              img: "/images/sub-sub-categories/sub-single-door-controller.avif",
            },
            {
              name: "Multi Door Controller",
              link: "/sub-sub-category-pages/access-control-time-attendance/access-control-panel/sub-multi-door-controller.html",
              img: "/images/sub-sub-categories/sub-multi-door-controller.avif",
            },
          ],
        },
        {
          name: "Hotel Door Lock",
          link: "/sub-category-pages/access-control-time-attendance/hotel-door-lock.html",
          subSub: [
            {
              name: "RFID Hotel Lock",
              link: "/sub-sub-category-pages/access-control-time-attendance/hotel-door-lock/sub-rfid-hotel-lock.html",
              img: "/images/sub-sub-categories/sub-rfid-hotel-lock.avif",
            },
            {
              name: "Smart Hotel Lock",
              link: "/sub-sub-category-pages/access-control-time-attendance/hotel-door-lock/sub-smart-hotel-lock.html",
              img: "/images/sub-sub-categories/sub-smart-hotel-lock.avif",
            },
          ],
        },
        {
          name: "Time Attendance Software",
          link: "/sub-category-pages/access-control-time-attendance/time-attendance-software.html",
          subSub: [
            {
              name: "Cloud Attendance Software",
              link: "/sub-sub-category-pages/access-control-time-attendance/time-attendance-software/sub-cloud-attendance-software.html",
              img: "/images/sub-sub-categories/sub-cloud-attendance-software.avif",
            },
            {
              name: "Desktop Attendance Software",
              link: "/sub-sub-category-pages/access-control-time-attendance/time-attendance-software/sub-desktop-attendance-software.html",
              img: "/images/sub-sub-categories/sub-desktop-attendance-software.avif",
            },
          ],
        },
      ],
    },

    fire: {
      title: "Fire Alarm System",
      link: "/category-pages/fire-alarm-system.html",
      sub: [
        {
          name: "Addressable Fire Alarm",
          link: "/sub-category-pages/fire-alarm-system/addressable-fire-alarm.html",
          subSub: [
            {
              name: "Addressable Fire Panel",
              link: "/sub-sub-category-pages/fire-alarm-system/addressable-fire-alarm/sub-addressable-fire-panel.html",
              img: "/images/sub-sub-categories/sub-addressable-fire-panel.avif",
            },
            {
              name: "Addressable Fire Detector",
              link: "/sub-sub-category-pages/fire-alarm-system/addressable-fire-alarm/sub-addressable-fire-detector.html",
              img: "/images/sub-sub-categories/sub-addressable-fire-detector.avif",
            },
          ],
        },
        {
          name: "Conventional Fire Alarm",
          link: "/sub-category-pages/fire-alarm-system/conventional-fire-alarm.html",
          subSub: [
            {
              name: "Conventional Fire Panel",
              link: "/sub-sub-category-pages/fire-alarm-system/conventional-fire-alarm/sub-conventional-fire-panel.html",
              img: "/images/sub-sub-categories/sub-conventional-fire-panel.avif",
            },
            {
              name: "Conventional Fire Detector",
              link: "/sub-sub-category-pages/fire-alarm-system/conventional-fire-alarm/sub-conventional-fire-detector.html",
              img: "/images/sub-sub-categories/sub-conventional-fire-detector.avif",
            },
          ],
        },
        {
          name: "Smoke Detector",
          link: "/sub-category-pages/fire-alarm-system/smoke-detector.html",
          subSub: [
            {
              name: "Addressable Smoke Detector",
              link: "/sub-sub-category-pages/fire-alarm-system/smoke-detector/sub-addressable-smoke-detector.html",
              img: "/images/sub-sub-categories/sub-addressable-smoke-detector.avif",
            },
            {
              name: "Conventional Smoke Detector",
              link: "/sub-sub-category-pages/fire-alarm-system/smoke-detector/sub-conventional-smoke-detector.html",
              img: "/images/sub-sub-categories/sub-conventional-smoke-detector.avif",
            },
            {
              name: "Wireless Smoke Detector",
              link: "/sub-sub-category-pages/fire-alarm-system/smoke-detector/sub-wireless-smoke-detector.html",
              img: "/images/sub-sub-categories/sub-wireless-smoke-detector.avif",
            },
          ],
        },
        {
          name: "Heat Detector",
          link: "/sub-category-pages/fire-alarm-system/heat-detector.html",
          subSub: [
            {
              name: "Fixed Temperature Heat Detector",
              link: "/sub-sub-category-pages/fire-alarm-system/heat-detector/sub-fixed-temperature-heat-detector.html",
              img: "/images/sub-sub-categories/sub-fixed-temperature-heat-detector.avif",
            },
            {
              name: "Rate Of Rise Heat Detector",
              link: "/sub-sub-category-pages/fire-alarm-system/heat-detector/sub-rate-of-rise-heat-detector.html",
              img: "/images/sub-sub-categories/sub-rate-of-rise-heat-detector.avif",
            },
          ],
        },
        {
          name: "Manual Call Point",
          link: "/sub-category-pages/fire-alarm-system/manual-call-point.html",
          subSub: [
            {
              name: "Addressable Manual Call Point",
              link: "/sub-sub-category-pages/fire-alarm-system/manual-call-point/sub-addressable-manual-call-point.html",
              img: "/images/sub-sub-categories/sub-addressable-manual-call-point.avif",
            },
            {
              name: "Conventional Manual Call Point",
              link: "/sub-sub-category-pages/fire-alarm-system/manual-call-point/sub-conventional-manual-call-point.html",
              img: "/images/sub-sub-categories/sub-conventional-manual-call-point.avif",
            },
          ],
        },
        {
          name: "Fire Alarm Bell",
          link: "/sub-category-pages/fire-alarm-system/fire-alarm-bell.html",
          subSub: [
            {
              name: "Indoor Fire Alarm Bell",
              link: "/sub-sub-category-pages/fire-alarm-system/fire-alarm-bell/sub-indoor-fire-alarm-bell.html",
              img: "/images/sub-sub-categories/sub-indoor-fire-alarm-bell.avif",
            },
            {
              name: "Outdoor Fire Alarm Bell",
              link: "/sub-sub-category-pages/fire-alarm-system/fire-alarm-bell/sub-outdoor-fire-alarm-bell.html",
              img: "/images/sub-sub-categories/sub-outdoor-fire-alarm-bell.avif",
            },
          ],
        },
        {
          name: "Fire Suppression System",
          link: "/sub-category-pages/fire-alarm-system/fire-suppression-system.html",
          subSub: [
            {
              name: "Gas Suppression System",
              link: "/sub-sub-category-pages/fire-alarm-system/fire-suppression-system/sub-gas-suppression-system.html",
              img: "/images/sub-sub-categories/sub-gas-suppression-system.avif",
            },
            {
              name: "Kitchen Fire Suppression",
              link: "/sub-sub-category-pages/fire-alarm-system/fire-suppression-system/sub-kitchen-fire-suppression.html",
              img: "/images/sub-sub-categories/sub-kitchen-fire-suppression.avif",
            },
          ],
        },
      ],
    },

    barrier: {
      title: "Turnstile Gate & Boom Barrier",
      link: "/category-pages/turnstile-gate-boom-barrier.html",
      sub: [
        {
          name: "Tripod Turnstile",
          link: "/sub-category-pages/turnstile-gate-boom-barrier/tripod-turnstile.html",
          subSub: [
            {
              name: "Manual Tripod Turnstile",
              link: "/sub-sub-category-pages/turnstile-gate-boom-barrier/tripod-turnstile/sub-manual-tripod-turnstile.html",
              img: "/images/sub-sub-categories/sub-manual-tripod-turnstile.avif",
            },
            {
              name: "Automatic Tripod Turnstile",
              link: "/sub-sub-category-pages/turnstile-gate-boom-barrier/tripod-turnstile/sub-automatic-tripod-turnstile.html",
              img: "/images/sub-sub-categories/sub-automatic-tripod-turnstile.avif",
            },
          ],
        },
        {
          name: "Flap Barrier",
          link: "/sub-category-pages/turnstile-gate-boom-barrier/flap-barrier.html",
          subSub: [
            {
              name: "Single Lane Flap Barrier",
              link: "/sub-sub-category-pages/turnstile-gate-boom-barrier/flap-barrier/sub-single-lane-flap-barrier.html",
              img: "/images/sub-sub-categories/sub-single-lane-flap-barrier.avif",
            },
            {
              name: "Double Lane Flap Barrier",
              link: "/sub-sub-category-pages/turnstile-gate-boom-barrier/flap-barrier/sub-double-lane-flap-barrier.html",
              img: "/images/sub-sub-categories/sub-double-lane-flap-barrier.avif",
            },
          ],
        },
        {
          name: "Swing Barrier",
          link: "/sub-category-pages/turnstile-gate-boom-barrier/swing-barrier.html",
          subSub: [
            {
              name: "Single Swing Barrier",
              link: "/sub-sub-category-pages/turnstile-gate-boom-barrier/swing-barrier/sub-single-swing-barrier.html",
              img: "/images/sub-sub-categories/sub-single-swing-barrier.avif",
            },
            {
              name: "Double Swing Barrier",
              link: "/sub-sub-category-pages/turnstile-gate-boom-barrier/swing-barrier/sub-double-swing-barrier.html",
              img: "/images/sub-sub-categories/sub-double-swing-barrier.avif",
            },
          ],
        },
        {
          name: "Full Height Turnstile",
          link: "/sub-category-pages/turnstile-gate-boom-barrier/full-height-turnstile.html",
          subSub: [
            {
              name: "Single Full Height Turnstile",
              link: "/sub-sub-category-pages/turnstile-gate-boom-barrier/full-height-turnstile/sub-single-full-height-turnstile.html",
              img: "/images/sub-sub-categories/sub-single-full-height-turnstile.avif",
            },
            {
              name: "Double Full Height Turnstile",
              link: "/sub-sub-category-pages/turnstile-gate-boom-barrier/full-height-turnstile/sub-double-full-height-turnstile.html",
              img: "/images/sub-sub-categories/sub-double-full-height-turnstile.avif",
            },
          ],
        },
        {
          name: "Boom Barrier Gate",
          link: "/sub-category-pages/turnstile-gate-boom-barrier/boom-barrier-gate.html",
          subSub: [
            {
              name: "Straight Arm Boom Barrier",
              link: "/sub-sub-category-pages/turnstile-gate-boom-barrier/boom-barrier-gate/sub-straight-arm-boom-barrier.html",
              img: "/images/sub-sub-categories/sub-straight-arm-boom-barrier.avif",
            },
            {
              name: "Folding Arm Boom Barrier",
              link: "/sub-sub-category-pages/turnstile-gate-boom-barrier/boom-barrier-gate/sub-folding-arm-boom-barrier.html",
              img: "/images/sub-sub-categories/sub-folding-arm-boom-barrier.avif",
            },
          ],
        },
        {
          name: "Parking Barrier",
          link: "/sub-category-pages/turnstile-gate-boom-barrier/parking-barrier.html",
          subSub: [
            {
              name: "RFID Parking Barrier",
              link: "/sub-sub-category-pages/turnstile-gate-boom-barrier/parking-barrier/sub-rfid-parking-barrier.html",
              img: "/images/sub-sub-categories/sub-rfid-parking-barrier.avif",
            },
            {
              name: "ANPR Parking Barrier",
              link: "/sub-sub-category-pages/turnstile-gate-boom-barrier/parking-barrier/sub-anpr-parking-barrier.html",
              img: "/images/sub-sub-categories/sub-anpr-parking-barrier.avif",
            },
          ],
        },
        {
          name: "Ticketing Gate System",
          link: "/sub-category-pages/turnstile-gate-boom-barrier/ticketing-gate-system.html",
          subSub: [
            {
              name: "QR Ticketing Gate",
              link: "/sub-sub-category-pages/turnstile-gate-boom-barrier/ticketing-gate-system/sub-qr-ticketing-gate.html",
              img: "/images/sub-sub-categories/sub-qr-ticketing-gate.avif",
            },
            {
              name: "RFID Ticketing Gate",
              link: "/sub-sub-category-pages/turnstile-gate-boom-barrier/ticketing-gate-system/sub-rfid-ticketing-gate.html",
              img: "/images/sub-sub-categories/sub-rfid-ticketing-gate.avif",
            },
          ],
        },
      ],
    },

    signage: {
      title: "LCD/LED Digital Signage",
      link: "/category-pages/lcd-led-digital-signage.html",
      sub: [
        {
          name: "Indoor LED Display",
          link: "/sub-category-pages/lcd-led-digital-signage/indoor-led-display.html",
          subSub: [
            {
              name: "P2 Indoor LED Display",
              link: "/sub-sub-category-pages/lcd-led-digital-signage/indoor-led-display/sub-p2-indoor-led-display.html",
              img: "/images/sub-sub-categories/sub-p2-indoor-led-display.avif",
            },
            {
              name: "P3 Indoor LED Display",
              link: "/sub-sub-category-pages/lcd-led-digital-signage/indoor-led-display/sub-p3-indoor-led-display.html",
              img: "/images/sub-sub-categories/sub-p3-indoor-led-display.avif",
            },
          ],
        },
        {
          name: "Outdoor LED Display",
          link: "/sub-category-pages/lcd-led-digital-signage/outdoor-led-display.html",
          subSub: [
            {
              name: "P4 Outdoor LED Display",
              link: "/sub-sub-category-pages/lcd-led-digital-signage/outdoor-led-display/sub-p4-outdoor-led-display.html",
              img: "/images/sub-sub-categories/sub-p4-outdoor-led-display.avif",
            },
            {
              name: "P5 Outdoor LED Display",
              link: "/sub-sub-category-pages/lcd-led-digital-signage/outdoor-led-display/sub-p5-outdoor-led-display.html",
              img: "/images/sub-sub-categories/sub-p5-outdoor-led-display.avif",
            },
          ],
        },
        {
          name: "Interactive Kiosk",
          link: "/sub-category-pages/lcd-led-digital-signage/interactive-kiosk.html",
          subSub: [
            {
              name: "Touch Kiosk",
              link: "/sub-sub-category-pages/lcd-led-digital-signage/interactive-kiosk/sub-touch-kiosk.html",
              img: "/images/sub-sub-categories/sub-touch-kiosk.avif",
            },
            {
              name: "Self Service Kiosk",
              link: "/sub-sub-category-pages/lcd-led-digital-signage/interactive-kiosk/sub-self-service-kiosk.html",
              img: "/images/sub-sub-categories/sub-self-service-kiosk.avif",
            },
          ],
        },
        {
          name: "Video Wall Display",
          link: "/sub-category-pages/lcd-led-digital-signage/video-wall-display.html",
          subSub: [
            {
              name: "LCD Video Wall",
              link: "/sub-sub-category-pages/lcd-led-digital-signage/video-wall-display/sub-lcd-video-wall.html",
              img: "/images/sub-sub-categories/sub-lcd-video-wall.avif",
            },
            {
              name: "LED Video Wall",
              link: "/sub-sub-category-pages/lcd-led-digital-signage/video-wall-display/sub-led-video-wall.html",
              img: "/images/sub-sub-categories/sub-led-video-wall.avif",
            },
          ],
        },
        {
          name: "Digital Signage Player",
          link: "/sub-category-pages/lcd-led-digital-signage/digital-signage-player.html",
          subSub: [
            {
              name: "Android Signage Player",
              link: "/sub-sub-category-pages/lcd-led-digital-signage/digital-signage-player/sub-android-signage-player.html",
              img: "/images/sub-sub-categories/sub-android-signage-player.avif",
            },
            {
              name: "Windows Signage Player",
              link: "/sub-sub-category-pages/lcd-led-digital-signage/digital-signage-player/sub-windows-signage-player.html",
              img: "/images/sub-sub-categories/sub-windows-signage-player.avif",
            },
          ],
        },
        {
          name: "Advertising Display",
          link: "/sub-category-pages/lcd-led-digital-signage/advertising-display.html",
          subSub: [
            {
              name: "Floor Standing Display",
              link: "/sub-sub-category-pages/lcd-led-digital-signage/advertising-display/sub-floor-standing-display.html",
              img: "/images/sub-sub-categories/sub-floor-standing-display.avif",
            },
            {
              name: "Wall Mounted Display",
              link: "/sub-sub-category-pages/lcd-led-digital-signage/advertising-display/sub-wall-mounted-display.html",
              img: "/images/sub-sub-categories/sub-wall-mounted-display.avif",
            },
          ],
        },
      ],
    },

    queue: {
      title: "Queue Management System",
      link: "/category-pages/queue-management-system.html",
      sub: [
        {
          name: "Token Machine",
          link: "/sub-category-pages/queue-management-system/token-machine.html",
          subSub: [
            {
              name: "Basic Token Machine",
              link: "/sub-sub-category-pages/queue-management-system/token-machine/sub-basic-token-machine.html",
              img: "/images/sub-sub-categories/sub-basic-token-machine.avif",
            },
            {
              name: "Touch Token Machine",
              link: "/sub-sub-category-pages/queue-management-system/token-machine/sub-touch-token-machine.html",
              img: "/images/sub-sub-categories/sub-touch-token-machine.avif",
            },
            {
              name: "Kiosk Token Machine",
              link: "/sub-sub-category-pages/queue-management-system/token-machine/sub-kiosk-token-machine.html",
              img: "/images/sub-sub-categories/sub-kiosk-token-machine.avif",
            },
          ],
        },
        {
          name: "Queue Display",
          link: "/sub-category-pages/queue-management-system/queue-display.html",
          subSub: [
            {
              name: "Counter Display",
              link: "/sub-sub-category-pages/queue-management-system/queue-display/sub-counter-display.html",
              img: "/images/sub-sub-categories/sub-counter-display.avif",
            },
            {
              name: "Main Queue Display",
              link: "/sub-sub-category-pages/queue-management-system/queue-display/sub-main-queue-display.html",
              img: "/images/sub-sub-categories/sub-main-queue-display.avif",
            },
          ],
        },
        {
          name: "Calling System",
          link: "/sub-category-pages/queue-management-system/calling-system.html",
          subSub: [
            {
              name: "Wireless Calling System",
              link: "/sub-sub-category-pages/queue-management-system/calling-system/sub-wireless-calling-system.html",
              img: "/images/sub-sub-categories/sub-wireless-calling-system.avif",
            },
            {
              name: "Software Calling System",
              link: "/sub-sub-category-pages/queue-management-system/calling-system/sub-software-calling-system.html",
              img: "/images/sub-sub-categories/sub-software-calling-system.avif",
            },
          ],
        },
        {
          name: "Counter Display",
          link: "/sub-category-pages/queue-management-system/counter-display.html",
          subSub: [
            {
              name: "LED Counter Display",
              link: "/sub-sub-category-pages/queue-management-system/counter-display/sub-led-counter-display.html",
              img: "/images/sub-sub-categories/sub-led-counter-display.avif",
            },
            {
              name: "LCD Counter Display",
              link: "/sub-sub-category-pages/queue-management-system/counter-display/sub-lcd-counter-display.html",
              img: "/images/sub-sub-categories/sub-lcd-counter-display.avif",
            },
          ],
        },
        {
          name: "Queue Software",
          link: "/sub-category-pages/queue-management-system/queue-software.html",
          subSub: [
            {
              name: "Cloud Queue Software",
              link: "/sub-sub-category-pages/queue-management-system/queue-software/sub-cloud-queue-software.html",
              img: "/images/sub-sub-categories/sub-cloud-queue-software.avif",
            },
            {
              name: "Local Queue Software",
              link: "/sub-sub-category-pages/queue-management-system/queue-software/sub-local-queue-software.html",
              img: "/images/sub-sub-categories/sub-local-queue-software.avif",
            },
          ],
        },
        {
          name: "Customer Feedback System",
          link: "/sub-category-pages/queue-management-system/customer-feedback-system.html",
          subSub: [
            {
              name: "Feedback Kiosk",
              link: "/sub-sub-category-pages/queue-management-system/customer-feedback-system/sub-feedback-kiosk.html",
              img: "/images/sub-sub-categories/sub-feedback-kiosk.avif",
            },
            {
              name: "Feedback Software",
              link: "/sub-sub-category-pages/queue-management-system/customer-feedback-system/sub-feedback-software.html",
              img: "/images/sub-sub-categories/sub-feedback-software.avif",
            },
          ],
        },
      ],
    },

    vehicle: {
      title: "Vehicle Control System",
      link: "/category-pages/vehicle-control-system.html",
      sub: [
        {
          name: "Parking Management System",
          link: "/sub-category-pages/vehicle-control-system/parking-management-system.html",
          subSub: [
            {
              name: "Ticket Parking System",
              link: "/sub-sub-category-pages/vehicle-control-system/parking-management-system/sub-ticket-parking-system.html",
              img: "/images/sub-sub-categories/sub-ticket-parking-system.avif",
            },
            {
              name: "RFID Parking System",
              link: "/sub-sub-category-pages/vehicle-control-system/parking-management-system/sub-rfid-parking-system.html",
              img: "/images/sub-sub-categories/sub-rfid-parking-system.avif",
            },
            {
              name: "ANPR Parking System",
              link: "/sub-sub-category-pages/vehicle-control-system/parking-management-system/sub-anpr-parking-system.html",
              img: "/images/sub-sub-categories/sub-anpr-parking-system.avif",
            },
          ],
        },
        {
          name: "Car Parking Guidance",
          link: "/sub-category-pages/vehicle-control-system/car-parking-guidance.html",
          subSub: [
            {
              name: "Indoor Parking Guidance",
              link: "/sub-sub-category-pages/vehicle-control-system/car-parking-guidance/sub-indoor-parking-guidance.html",
              img: "/images/sub-sub-categories/sub-indoor-parking-guidance.avif",
            },
            {
              name: "Outdoor Parking Guidance",
              link: "/sub-sub-category-pages/vehicle-control-system/car-parking-guidance/sub-outdoor-parking-guidance.html",
              img: "/images/sub-sub-categories/sub-outdoor-parking-guidance.avif",
            },
          ],
        },
        {
          name: "RFID Vehicle Access",
          link: "/sub-category-pages/vehicle-control-system/rfid-vehicle-access.html",
          subSub: [
            {
              name: "RFID Long Range Reader",
              link: "/sub-sub-category-pages/vehicle-control-system/rfid-vehicle-access/sub-rfid-long-range-reader.html",
              img: "/images/sub-sub-categories/sub-rfid-long-range-reader.avif",
            },
            {
              name: "RFID Vehicle Tag",
              link: "/sub-sub-category-pages/vehicle-control-system/rfid-vehicle-access/sub-rfid-vehicle-tag.html",
              img: "/images/sub-sub-categories/sub-rfid-vehicle-tag.avif",
            },
          ],
        },
        {
          name: "ANPR Parking System",
          link: "/sub-category-pages/vehicle-control-system/anpr-parking-system.html",
          subSub: [
            {
              name: "ANPR Entry System",
              link: "/sub-sub-category-pages/vehicle-control-system/anpr-parking-system/sub-anpr-entry-system.html",
              img: "/images/sub-sub-categories/sub-anpr-entry-system.avif",
            },
            {
              name: "ANPR Exit System",
              link: "/sub-sub-category-pages/vehicle-control-system/anpr-parking-system/sub-anpr-exit-system.html",
              img: "/images/sub-sub-categories/sub-anpr-exit-system.avif",
            },
          ],
        },
        {
          name: "Vehicle Loop Detector",
          link: "/sub-category-pages/vehicle-control-system/vehicle-loop-detector.html",
          subSub: [
            {
              name: "Single Channel Loop Detector",
              link: "/sub-sub-category-pages/vehicle-control-system/vehicle-loop-detector/sub-single-channel-loop-detector.html",
              img: "/images/sub-sub-categories/sub-single-channel-loop-detector.avif",
            },
            {
              name: "Dual Channel Loop Detector",
              link: "/sub-sub-category-pages/vehicle-control-system/vehicle-loop-detector/sub-dual-channel-loop-detector.html",
              img: "/images/sub-sub-categories/sub-dual-channel-loop-detector.avif",
            },
          ],
        },
        {
          name: "Parking Payment Kiosk",
          link: "/sub-category-pages/vehicle-control-system/parking-payment-kiosk.html",
          subSub: [
            {
              name: "Cash Payment Kiosk",
              link: "/sub-sub-category-pages/vehicle-control-system/parking-payment-kiosk/sub-cash-payment-kiosk.html",
              img: "/images/sub-sub-categories/sub-cash-payment-kiosk.avif",
            },
            {
              name: "Card Payment Kiosk",
              link: "/sub-sub-category-pages/vehicle-control-system/parking-payment-kiosk/sub-card-payment-kiosk.html",
              img: "/images/sub-sub-categories/sub-card-payment-kiosk.avif",
            },
          ],
        },
      ],
    },

    conference: {
      title: "Conference & PA System",
      link: "/category-pages/conference-pa-system.html",
      sub: [
        {
          name: "Conference Microphone",
          link: "/sub-category-pages/conference-pa-system/conference-microphone.html",
          subSub: [
            {
              name: "Wired Conference Microphone",
              link: "/sub-sub-category-pages/conference-pa-system/conference-microphone/sub-wired-conference-microphone.html",
              img: "/images/sub-sub-categories/sub-wired-conference-microphone.avif",
            },
            {
              name: "Wireless Conference Microphone",
              link: "/sub-sub-category-pages/conference-pa-system/conference-microphone/sub-wireless-conference-microphone.html",
              img: "/images/sub-sub-categories/sub-wireless-conference-microphone.avif",
            },
          ],
        },
        {
          name: "PA Speaker System",
          link: "/sub-category-pages/conference-pa-system/pa-speaker-system.html",
          subSub: [
            {
              name: "Wall Mount PA Speaker",
              link: "/sub-sub-category-pages/conference-pa-system/pa-speaker-system/sub-wall-mount-pa-speaker.html",
              img: "/images/sub-sub-categories/sub-wall-mount-pa-speaker.avif",
            },
            {
              name: "Ceiling PA Speaker",
              link: "/sub-sub-category-pages/conference-pa-system/pa-speaker-system/sub-ceiling-pa-speaker.html",
              img: "/images/sub-sub-categories/sub-ceiling-pa-speaker.avif",
            },
          ],
        },
        {
          name: "Amplifier System",
          link: "/sub-category-pages/conference-pa-system/amplifier-system.html",
          subSub: [
            {
              name: "Mixer Amplifier",
              link: "/sub-sub-category-pages/conference-pa-system/amplifier-system/sub-mixer-amplifier.html",
              img: "/images/sub-sub-categories/sub-mixer-amplifier.avif",
            },
            {
              name: "Power Amplifier",
              link: "/sub-sub-category-pages/conference-pa-system/amplifier-system/sub-power-amplifier.html",
              img: "/images/sub-sub-categories/sub-power-amplifier.avif",
            },
          ],
        },
        {
          name: "Wireless Microphone",
          link: "/sub-category-pages/conference-pa-system/wireless-microphone.html",
          subSub: [
            {
              name: "Handheld Wireless Microphone",
              link: "/sub-sub-category-pages/conference-pa-system/wireless-microphone/sub-handheld-wireless-microphone.html",
              img: "/images/sub-sub-categories/sub-handheld-wireless-microphone.avif",
            },
            {
              name: "Lapel Wireless Microphone",
              link: "/sub-sub-category-pages/conference-pa-system/wireless-microphone/sub-lapel-wireless-microphone.html",
              img: "/images/sub-sub-categories/sub-lapel-wireless-microphone.avif",
            },
          ],
        },
        {
          name: "Meeting Room Audio",
          link: "/sub-category-pages/conference-pa-system/meeting-room-audio.html",
          subSub: [
            {
              name: "Small Meeting Room Audio",
              link: "/sub-sub-category-pages/conference-pa-system/meeting-room-audio/sub-small-meeting-room-audio.html",
              img: "/images/sub-sub-categories/sub-small-meeting-room-audio.avif",
            },
            {
              name: "Large Meeting Room Audio",
              link: "/sub-sub-category-pages/conference-pa-system/meeting-room-audio/sub-large-meeting-room-audio.html",
              img: "/images/sub-sub-categories/sub-large-meeting-room-audio.avif",
            },
          ],
        },
        {
          name: "Public Announcement System",
          link: "/sub-category-pages/conference-pa-system/public-announcement-system.html",
          subSub: [
            {
              name: "Zone PA System",
              link: "/sub-sub-category-pages/conference-pa-system/public-announcement-system/sub-zone-pa-system.html",
              img: "/images/sub-sub-categories/sub-zone-pa-system.avif",
            },
            {
              name: "Emergency PA System",
              link: "/sub-sub-category-pages/conference-pa-system/public-announcement-system/sub-emergency-pa-system.html",
              img: "/images/sub-sub-categories/sub-emergency-pa-system.avif",
            },
          ],
        },
      ],
    },

    building: {
      title: "Building Automation Solutions",
      link: "/category-pages/building-automation-solutions.html",
      sub: [
        {
          name: "BMS System",
          link: "/sub-category-pages/building-automation-solutions/bms-system.html",
          subSub: [
            {
              name: "BMS Controller",
              link: "/sub-sub-category-pages/building-automation-solutions/bms-system/sub-bms-controller.html",
              img: "/images/sub-sub-categories/sub-bms-controller.avif",
            },
            {
              name: "BMS Monitoring Software",
              link: "/sub-sub-category-pages/building-automation-solutions/bms-system/sub-bms-monitoring-software.html",
              img: "/images/sub-sub-categories/sub-bms-monitoring-software.avif",
            },
          ],
        },
        {
          name: "Lighting Control",
          link: "/sub-category-pages/building-automation-solutions/lighting-control.html",
          subSub: [
            {
              name: "Dimming Control",
              link: "/sub-sub-category-pages/building-automation-solutions/lighting-control/sub-dimming-control.html",
              img: "/images/sub-sub-categories/sub-dimming-control.avif",
            },
            {
              name: "Motion Lighting Control",
              link: "/sub-sub-category-pages/building-automation-solutions/lighting-control/sub-motion-lighting-control.html",
              img: "/images/sub-sub-categories/sub-motion-lighting-control.avif",
            },
          ],
        },
        {
          name: "HVAC Control",
          link: "/sub-category-pages/building-automation-solutions/hvac-control.html",
          subSub: [
            {
              name: "Thermostat Control",
              link: "/sub-sub-category-pages/building-automation-solutions/hvac-control/sub-thermostat-control.html",
              img: "/images/sub-sub-categories/sub-thermostat-control.avif",
            },
            {
              name: "AHU Control",
              link: "/sub-sub-category-pages/building-automation-solutions/hvac-control/sub-ahu-control.html",
              img: "/images/sub-sub-categories/sub-ahu-control.avif",
            },
          ],
        },
        {
          name: "Energy Management",
          link: "/sub-category-pages/building-automation-solutions/energy-management.html",
          subSub: [
            {
              name: "Energy Meter",
              link: "/sub-sub-category-pages/building-automation-solutions/energy-management/sub-energy-meter.html",
              img: "/images/sub-sub-categories/sub-energy-meter.avif",
            },
            {
              name: "Energy Monitoring Software",
              link: "/sub-sub-category-pages/building-automation-solutions/energy-management/sub-energy-monitoring-software.html",
              img: "/images/sub-sub-categories/sub-energy-monitoring-software.avif",
            },
          ],
        },
        {
          name: "Smart Building Control",
          link: "/sub-category-pages/building-automation-solutions/smart-building-control.html",
          subSub: [
            {
              name: "Smart Building Controller",
              link: "/sub-sub-category-pages/building-automation-solutions/smart-building-control/sub-smart-building-controller.html",
              img: "/images/sub-sub-categories/sub-smart-building-controller.avif",
            },
            {
              name: "Smart Building Dashboard",
              link: "/sub-sub-category-pages/building-automation-solutions/smart-building-control/sub-smart-building-dashboard.html",
              img: "/images/sub-sub-categories/sub-smart-building-dashboard.avif",
            },
          ],
        },
        {
          name: "Central Monitoring System",
          link: "/sub-category-pages/building-automation-solutions/central-monitoring-system.html",
          subSub: [
            {
              name: "Central Monitoring Software",
              link: "/sub-sub-category-pages/building-automation-solutions/central-monitoring-system/sub-central-monitoring-software.html",
              img: "/images/sub-sub-categories/sub-central-monitoring-software.avif",
            },
            {
              name: "Monitoring Workstation",
              link: "/sub-sub-category-pages/building-automation-solutions/central-monitoring-system/sub-monitoring-workstation.html",
              img: "/images/sub-sub-categories/sub-monitoring-workstation.avif",
            },
          ],
        },
      ],
    },

    smart: {
      title: "Smart Home Solutions",
      link: "/category-pages/smart-home-solutions.html",
      sub: [
        {
          name: "Smart Door Lock",
          link: "/sub-category-pages/smart-home-solutions/smart-door-lock.html",
          subSub: [
            {
              name: "Fingerprint Smart Lock",
              link: "/sub-sub-category-pages/smart-home-solutions/smart-door-lock/sub-fingerprint-smart-lock.html",
              img: "/images/sub-sub-categories/sub-fingerprint-smart-lock.avif",
            },
            {
              name: "WiFi Smart Lock",
              link: "/sub-sub-category-pages/smart-home-solutions/smart-door-lock/sub-wifi-smart-lock.html",
              img: "/images/sub-sub-categories/sub-wifi-smart-lock.avif",
            },
            {
              name: "Card Smart Lock",
              link: "/sub-sub-category-pages/smart-home-solutions/smart-door-lock/sub-card-smart-lock.html",
              img: "/images/sub-sub-categories/sub-card-smart-lock.avif",
            },
          ],
        },
        {
          name: "Smart Switch",
          link: "/sub-category-pages/smart-home-solutions/smart-switch.html",
          subSub: [
            {
              name: "One Gang Smart Switch",
              link: "/sub-sub-category-pages/smart-home-solutions/smart-switch/sub-one-gang-smart-switch.html",
              img: "/images/sub-sub-categories/sub-one-gang-smart-switch.avif",
            },
            {
              name: "Two Gang Smart Switch",
              link: "/sub-sub-category-pages/smart-home-solutions/smart-switch/sub-two-gang-smart-switch.html",
              img: "/images/sub-sub-categories/sub-two-gang-smart-switch.avif",
            },
            {
              name: "Three Gang Smart Switch",
              link: "/sub-sub-category-pages/smart-home-solutions/smart-switch/sub-three-gang-smart-switch.html",
              img: "/images/sub-sub-categories/sub-three-gang-smart-switch.avif",
            },
          ],
        },
        {
          name: "Smart Curtain",
          link: "/sub-category-pages/smart-home-solutions/smart-curtain.html",
          subSub: [
            {
              name: "Smart Curtain Motor",
              link: "/sub-sub-category-pages/smart-home-solutions/smart-curtain/sub-smart-curtain-motor.html",
              img: "/images/sub-sub-categories/sub-smart-curtain-motor.avif",
            },
            {
              name: "Smart Curtain Track",
              link: "/sub-sub-category-pages/smart-home-solutions/smart-curtain/sub-smart-curtain-track.html",
              img: "/images/sub-sub-categories/sub-smart-curtain-track.avif",
            },
          ],
        },
        {
          name: "Smart Lighting",
          link: "/sub-category-pages/smart-home-solutions/smart-lighting.html",
          subSub: [
            {
              name: "Smart LED Bulb",
              link: "/sub-sub-category-pages/smart-home-solutions/smart-lighting/sub-smart-led-bulb.html",
              img: "/images/sub-sub-categories/sub-smart-led-bulb.avif",
            },
            {
              name: "Smart Strip Light",
              link: "/sub-sub-category-pages/smart-home-solutions/smart-lighting/sub-smart-strip-light.html",
              img: "/images/sub-sub-categories/sub-smart-strip-light.avif",
            },
          ],
        },
        {
          name: "Smart Security Sensor",
          link: "/sub-category-pages/smart-home-solutions/smart-security-sensor.html",
          subSub: [
            {
              name: "Smart Motion Sensor",
              link: "/sub-sub-category-pages/smart-home-solutions/smart-security-sensor/sub-smart-motion-sensor.html",
              img: "/images/sub-sub-categories/sub-smart-motion-sensor.avif",
            },
            {
              name: "Smart Door Sensor",
              link: "/sub-sub-category-pages/smart-home-solutions/smart-security-sensor/sub-smart-door-sensor.html",
              img: "/images/sub-sub-categories/sub-smart-door-sensor.avif",
            },
          ],
        },
        {
          name: "Home Automation Hub",
          link: "/sub-category-pages/smart-home-solutions/home-automation-hub.html",
          subSub: [
            {
              name: "WiFi Automation Hub",
              link: "/sub-sub-category-pages/smart-home-solutions/home-automation-hub/sub-wifi-automation-hub.html",
              img: "/images/sub-sub-categories/sub-wifi-automation-hub.avif",
            },
            {
              name: "Zigbee Automation Hub",
              link: "/sub-sub-category-pages/smart-home-solutions/home-automation-hub/sub-zigbee-automation-hub.html",
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
