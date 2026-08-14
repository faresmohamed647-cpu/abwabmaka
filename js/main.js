import { Gate3DVisualizer } from "./viewer3d.js";
import { init3DImageEffects, init3DImageModal } from "./image3d.js";

const setupMobileNavigation = () => {
  const navMenus = document.querySelectorAll(".nav-menu");

  navMenus.forEach((navMenu) => {
    const toggle = navMenu.parentElement?.querySelector(
      ".mobile-menu-toggle, .menu-toggle-btn",
    );
    if (!toggle) return;

    const setMenuState = (isOpen) => {
      navMenu.classList.toggle("open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.classList.toggle("active", isOpen);
    };

    toggle.addEventListener("click", () => {
      const shouldOpen = !navMenu.classList.contains("open");
      setMenuState(shouldOpen);
    });

    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenuState(false));
    });

    document.addEventListener("click", (event) => {
      if (!navMenu.classList.contains("open")) return;

      const clickedInsideNav = navMenu.contains(event.target);
      const clickedToggle = toggle.contains(event.target);

      if (!clickedInsideNav && !clickedToggle) {
        setMenuState(false);
      }
    });
  });
};

const setupHomeStudio = () => {
  const container = document.getElementById("gate3DCanvasContainer");
  if (!container) return;

  const visualizer = new Gate3DVisualizer("gate3DCanvasContainer");

  const syncButtonState = (button, isActive) => {
    if (!button) return;
    button.classList.toggle("active", Boolean(isActive));
  };

  const openCloseBtn = document.getElementById("btn3DOpenClose");
  if (openCloseBtn) {
    const label = openCloseBtn.querySelector(".btn-label");
    openCloseBtn.addEventListener("click", () => {
      const isOpen = visualizer.toggleGateAnimation();
      syncButtonState(openCloseBtn, isOpen);
      if (label) {
        label.textContent = isOpen ? "إغلاق البوابة 3D" : "فتح البوابة 3D";
      }
    });
  }

  const autoRotateBtn = document.getElementById("btn3DAutoRotate");
  if (autoRotateBtn) {
    autoRotateBtn.addEventListener("click", () => {
      const isEnabled = visualizer.toggleAutoRotate();
      syncButtonState(autoRotateBtn, isEnabled);
    });
  }

  const lightingBtn = document.getElementById("btn3DLighting");
  if (lightingBtn) {
    lightingBtn.addEventListener("click", () => {
      visualizer.cycleLightingMode();
      syncButtonState(lightingBtn, true);
      window.setTimeout(() => syncButtonState(lightingBtn, false), 220);
    });
  }

  const wireframeBtn = document.getElementById("btn3DWireframe");
  if (wireframeBtn) {
    wireframeBtn.addEventListener("click", () => {
      const isOn = visualizer.toggleWireframe();
      syncButtonState(wireframeBtn, isOn);
    });
  }

  const frontViewBtn = document.getElementById("btn3DFrontView");
  if (frontViewBtn) {
    frontViewBtn.addEventListener("click", () => visualizer.setFrontView());
  }

  const resetBtn = document.getElementById("btn3DResetCam");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => visualizer.resetCamera());
  }

  const zoomInBtn = document.getElementById("btn3DZoomIn");
  if (zoomInBtn) {
    zoomInBtn.addEventListener("click", () => visualizer.zoomIn());
  }

  const zoomOutBtn = document.getElementById("btn3DZoomOut");
  if (zoomOutBtn) {
    zoomOutBtn.addEventListener("click", () => visualizer.zoomOut());
  }

  document.querySelectorAll(".model-choice-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const modelName = button.dataset["3dModel"];
      if (!modelName) return;

      document
        .querySelectorAll(".model-choice-btn")
        .forEach((item) => item.classList.toggle("active", item === button));
      visualizer.loadModel(modelName);
    });
  });

  document.querySelectorAll(".finish-swatch-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const finish = button.dataset["3dFinish"];
      if (!finish) return;

      document
        .querySelectorAll(".finish-swatch-btn")
        .forEach((item) => item.classList.toggle("active", item === button));
      visualizer.setFinish(finish);
    });
  });
};

const setupProjectAnimations = () => {
  if (typeof init3DImageEffects === "function") {
    init3DImageEffects();
  }

  if (typeof init3DImageModal === "function") {
    init3DImageModal();
  }
};

const setupFaqAccordions = () => {
  const items = document.querySelectorAll(".accordion-item");
  if (!items.length) return;

  items.forEach((item) => {
    const trigger = item.querySelector(".accordion-trigger");
    if (!trigger) return;

    trigger.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      items.forEach((accordionItem) => {
        accordionItem.classList.remove("open");
      });

      if (!isOpen) {
        item.classList.add("open");
      }
    });
  });
};

document.addEventListener("DOMContentLoaded", () => {
  setupMobileNavigation();
  setupProjectAnimations();
  setupHomeStudio();
  setupFaqAccordions();
});
