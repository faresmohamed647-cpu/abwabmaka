function initAllSiteScript() {
  initVipFloatingWidget();
  setupMobileNavigation();
  setupSmoothScroll();
  initHeroParallax();
  setupProjectFilters();
  setupUploadBox();
  initQuoteFormPrefill();
  initGeneralContactForm();
  setupProjectAnimations();
  setupHomeStudio();
  setupFaqAccordions();
  if (typeof window !== 'undefined' && window.init3DImageEffects) window.init3DImageEffects();
  if (typeof window !== 'undefined' && window.init3DImageModal) window.init3DImageModal();
  if (typeof window !== 'undefined' && window.initAnimatedCounters) window.initAnimatedCounters();
  setupScrollRevealAnimations();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAllSiteScript);
} else {
  initAllSiteScript();
}

function setupMobileNavigation() {
  document.querySelectorAll('.nav-menu').forEach((navMenu) => {
    const headerInner = navMenu.closest('.header-inner');
    const toggle = headerInner?.querySelector('.mobile-menu-toggle, .menu-toggle-btn');
    if (!toggle) return;

    if (!navMenu.querySelector('.mobile-nav-drawer-head')) {
      const head = document.createElement('div');
      head.className = 'mobile-nav-drawer-head';
      head.innerHTML = `
        <div class="mobile-nav-brand">الإتقان للصناعات المعدنية</div>
        <div class="mobile-nav-label">أقسام الموقع الرئيسي</div>
      `;
      navMenu.insertBefore(head, navMenu.firstChild);
    }

    const setMenuState = (isOpen) => {
      navMenu.classList.toggle('open', isOpen);
      toggle.classList.toggle('active', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      document.body.classList.toggle('nav-menu-open', isOpen);
    };

    const handleToggle = (event) => {
      event.preventDefault();
      event.stopPropagation();
      const isOpen = navMenu.classList.contains('open');
      setMenuState(!isOpen);
    };

    toggle.addEventListener('click', handleToggle);
    toggle.addEventListener('touchstart', handleToggle, { passive: false });

    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setMenuState(false));
    });

    document.addEventListener('click', (event) => {
      if (!navMenu.classList.contains('open')) return;
      if (!navMenu.contains(event.target) && !toggle.contains(event.target)) {
        setMenuState(false);
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 992) setMenuState(false);
    });
  });
}

function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      event.preventDefault();
      const headerOffset = 80;
      const offsetPosition =
        targetElement.getBoundingClientRect().top + window.pageYOffset - headerOffset;

      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      document.body.classList.remove('nav-menu-open');
      document.querySelectorAll('.nav-menu.open').forEach((menu) => menu.classList.remove('open'));
    });
  });
}

function initHeroParallax() {
  const hero = document.getElementById('heroSection');
  const heroBg = document.getElementById('heroBgLayer');
  const badge1 = document.getElementById('heroBadge1');
  const badge2 = document.getElementById('heroBadge2');
  const heroContent = document.querySelector('.home-hero-content');

  if (!hero || !heroBg) return;

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let mouseX = 0;
  let mouseY = 0;
  let isHovering = false;
  let autoTime = 0;

  window.addEventListener('mousemove', (event) => {
    const heroRect = hero.getBoundingClientRect();
    if (event.clientY >= heroRect.top - 100 && event.clientY <= heroRect.bottom + 100) {
      isHovering = true;
      const x = (event.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const y =
        (event.clientY - (heroRect.top + heroRect.height / 2)) / (heroRect.height / 2);
      targetX = x * 32;
      targetY = y * 22;
    } else {
      isHovering = false;
    }
  });

  window.addEventListener('mouseleave', () => {
    isHovering = false;
  });

  const renderParallax = () => {
    autoTime += 0.015;
    const ambientX = Math.sin(autoTime * 0.7) * 8;
    const ambientY = Math.cos(autoTime * 0.5) * 6;

    if (isHovering) {
      mouseX += (targetX - mouseX) * 0.08;
      mouseY += (targetY - mouseY) * 0.08;
    } else {
      mouseX += (ambientX - mouseX) * 0.04;
      mouseY += (ambientY - mouseY) * 0.04;
    }

    currentX += (mouseX - currentX) * 0.1;
    currentY += (mouseY - currentY) * 0.1;

    heroBg.style.transform = `scale(1.08) translate(${currentX * -0.6}px, ${currentY * -0.6}px)`;

    if (badge1) {
      badge1.style.transform = `translate(${currentX * 1.3}px, ${currentY * 1.3 + Math.sin(autoTime) * 4}px)`;
    }

    if (badge2) {
      badge2.style.transform = `translate(${currentX * -1.2}px, ${currentY * -1.2 + Math.cos(autoTime) * 4}px)`;
    }

    if (heroContent) {
      const rotX = (currentY * -0.15).toFixed(2);
      const rotY = (currentX * 0.15).toFixed(2);
      heroContent.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translate(${currentX * 0.25}px, ${currentY * 0.25}px)`;
    }

    requestAnimationFrame(renderParallax);
  };

  requestAnimationFrame(renderParallax);
}

function setupProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-tab-btn');
  const projectCards = document.querySelectorAll('.project-item-card');
  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((item) => item.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');
      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        card.style.display = filterVal === 'all' || category === filterVal ? 'block' : 'none';
      });
    });
  });
}

function setupUploadBox() {
  const dropBox = document.getElementById('uploadDashedBox');
  const fileInput = document.getElementById('fileInput');
  if (!dropBox || !fileInput) return;

  ['dragenter', 'dragover'].forEach((eventName) => {
    dropBox.addEventListener(
      eventName,
      (event) => {
        event.preventDefault();
        event.stopPropagation();
        dropBox.style.borderColor = 'var(--color-accent-gold)';
        dropBox.style.backgroundColor = '#eae2d2';
      },
      false,
    );
  });

  ['dragleave', 'drop'].forEach((eventName) => {
    dropBox.addEventListener(
      eventName,
      (event) => {
        event.preventDefault();
        event.stopPropagation();
        dropBox.style.borderColor = '#d8cebf';
        dropBox.style.backgroundColor = '#f7f4ef';
      },
      false,
    );
  });

  dropBox.addEventListener('drop', (event) => {
    const files = event.dataTransfer?.files;
    if (files?.length) {
      fileInput.files = files;
      showToastNotification(`تم اختيار ${files.length} ملف بنجاح: ${files[0].name}`);
    }
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files?.length) {
      showToastNotification(`تم اختيار ${fileInput.files.length} ملف بنجاح: ${fileInput.files[0].name}`);
    }
  });
}

function initQuoteFormPrefill() {
  const form = document.getElementById('quoteRequestForm');
  if (!form) return;

  const urlParams = new URLSearchParams(window.location.search);
  const serviceParam = urlParams.get('service');
  const modelParam = urlParams.get('model');
  const projectTypeSelect = document.getElementById('projectType');
  const projectDescTextarea = document.getElementById('projectDesc');

  if (serviceParam && projectTypeSelect) {
    const serviceMap = {
      gates: 'gates',
      doors: 'doors',
      windows: 'windows',
      autodoors: 'autodoors',
      shutters: 'shutters',
      maintenance: 'maintenance',
    };
    if (serviceMap[serviceParam]) projectTypeSelect.value = serviceMap[serviceParam];
  }

  if (modelParam && projectTypeSelect) {
    const modelPresets = {
      palaceGate: {
        type: 'gates',
        desc: 'طلب استشارة وتصميم لبوابة قصور ملكية حديد مشغول مخصصة مع محركات أوتوماتيكية.',
      },
      pivotDoor: {
        type: 'autodoors',
        desc: 'طلب تنفيذ باب فيلا محوري معاصر بتشطيب تيتانيوم وإضاءة محيطية مخفية.',
      },
      shutter: {
        type: 'shutters',
        desc: 'طلب تركيب شتر حماية أوتوماتيكي معزول مع محرك أنبوبي ذكي.',
      },
    };

    const preset = modelPresets[modelParam];
    if (preset) {
      projectTypeSelect.value = preset.type;
      if (projectDescTextarea && !projectDescTextarea.value) {
        projectDescTextarea.value = preset.desc;
      }
    }
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    showToastNotification('تم استلام طلبكم بنجاح! سيتواصل معكم مهندس مختص خلال 24 ساعة.');
    form.reset();
  });
}

function initGeneralContactForm() {
  const form = document.getElementById('generalContactForm');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    showToastNotification('شكراً لتواصلكم! تم استلام رسالتكم وسيقوم فريق خدمة العملاء بالرد خلال ساعتين.');
    form.reset();
  });
}

function setupProjectAnimations() {
  try {
    if (typeof window !== 'undefined' && typeof window.init3DImageEffects === 'function') {
      window.init3DImageEffects();
    }
  } catch (e) {
    console.warn('init3DImageEffects fallback:', e);
  }
  try {
    if (typeof window !== 'undefined' && typeof window.init3DImageModal === 'function') {
      window.init3DImageModal();
    }
  } catch (e) {
    console.warn('init3DImageModal fallback:', e);
  }
}

function setupHomeStudio() {
  const container = document.getElementById('gate3DCanvasContainer');
  if (!container) return;

  // --- State ---
  let activeModel = 'palaceGate';
  let activeFinish = 'royalBlack';
  let isGateOpen = false;
  let lightingMode = 'day'; // 'day' | 'night'
  let cadMode = false;
  let effectsActive = true;
  
  // Three.js WebGL 3D Visualizer Instance
  let visualizer = null;
  if (typeof window !== 'undefined' && typeof window.Gate3DVisualizer === 'function') {
    try {
      visualizer = new window.Gate3DVisualizer('gate3DCanvasContainer');
    } catch (e) {
      console.warn('Gate3DVisualizer init warning:', e);
    }
  }

  // 360 Orbit Drag State
  let rotY = -15;
  let rotX = 5;
  let isDragging = false;
  let previousPointerPos = { x: 0, y: 0 };
  let orbitAnimRAF = null;

  // --- Finish CSS filter overlays & metallic shines ---
  const FINISH_FILTERS = {
    royalBlack: 'brightness(1.05) contrast(1.15) saturate(1.0)',
    bronze:     'sepia(0.75) saturate(2.4) hue-rotate(-22deg) brightness(0.95) contrast(1.2)',
    titanium:   'grayscale(0.9) contrast(1.3) brightness(1.2)',
    forest:     'sepia(0.65) saturate(2.5) hue-rotate(85deg) brightness(0.9) contrast(1.15)'
  };

  // --- Pricing per model (SAR per m²) ---
  const PRICE_PER_SQM = {
    palaceGate: 1800,
    pivotDoor:  2200,
    shutter:    1200
  };

  // --- Elements ---
  const lightingOverlay = document.getElementById('lightingOverlay');
  const cadGrid         = document.getElementById('blueprintCadGrid');
  const cadWidthText    = document.getElementById('cadWidthText');
  const cadHeightText   = document.getElementById('cadHeightText');
  const viewport        = document.getElementById('studioStageViewport');
  const objectViewport  = document.getElementById('studio3DObjectViewport');

  const btnOpenClose    = document.getElementById('btn3DOpenClose');
  const btnAutoRotate   = document.getElementById('btn3DAutoRotate');
  const btnLighting     = document.getElementById('btn3DLighting');
  const btnCad          = document.getElementById('btn3DWireframe');
  const btnReset        = document.getElementById('btn3DResetCam');

  const widthSlider     = document.getElementById('inputWidthRange');
  const heightSlider    = document.getElementById('inputHeightRange');
  const widthValLabel   = document.getElementById('sliderWidthVal');
  const heightValLabel  = document.getElementById('sliderHeightVal');
  const priceText       = document.getElementById('estimatedPriceText');
  const statusText      = document.getElementById('studioStageStatusText');
  const btnOpenCloseText = document.getElementById('btnOpenCloseText');
  const btnLightingText  = document.getElementById('btnLightingText');

  // --- Helper: sync button active state ---
  const syncBtn = (btn, isActive) => {
    if (btn) btn.classList.toggle('active', Boolean(isActive));
  };

  // --- Helper: update viewport 360 transform ---
  const update3DTransform = () => {
    if (!objectViewport) return;
    objectViewport.style.transform = `rotateY(${rotY}deg) rotateX(${rotX}deg)`;
  };

  // --- Helper: update 3D physical dimension scaling (Width & Height) ---
  const update3DDimensionsScale = () => {
    if (!widthSlider || !heightSlider) return;
    const w = parseFloat(widthSlider.value) || 4.0;
    const h = parseFloat(heightSlider.value) || 3.0;

    const scaleX = (w / 4.0).toFixed(2);
    const scaleY = (h / 3.0).toFixed(2);

    const activeContainer = document.querySelector('.model-3d-container.active-model');
    if (activeContainer) {
      activeContainer.style.transform = `scale(${scaleX}, ${scaleY})`;
    }
  };

  // --- Helper: update price & labels ---
  const updatePrice = () => {
    if (!priceText || !widthSlider || !heightSlider) return;
    const w = parseFloat(widthSlider.value);
    const h = parseFloat(heightSlider.value);
    const rate = PRICE_PER_SQM[activeModel] || 1800;
    const price = Math.round(w * h * rate);
    
    priceText.textContent = price.toLocaleString('ar-SA') + ' ر.س';
    if (widthValLabel) widthValLabel.textContent = w.toFixed(2) + ' م';
    if (heightValLabel) heightValLabel.textContent = h.toFixed(2) + ' م';
    if (cadWidthText) cadWidthText.textContent = 'العرض: ' + w.toFixed(2) + ' م';
    if (cadHeightText) cadHeightText.textContent = 'الارتفاع: ' + h.toFixed(2) + ' م';

    update3DDimensionsScale();
  };

  // --- Helper: update spec details ---
  const updateSpecDetails = (modelType) => {
    const titleEl    = document.getElementById('spec3DTitle');
    const materialEl = document.getElementById('spec3DMaterial');
    const motorEl    = document.getElementById('spec3DMotor');
    const ratingEl   = document.getElementById('spec3DRating');

    const specs = {
      palaceGate: {
        title: 'بوابة القصور الملكية (Luxury Palace Gate 3D)',
        material: 'فولاذ مقسى 6 مم + تطعيمات برونز ذهبي كهرستاتيكي',
        motor: 'نظام محركات أوتوماتيكية إيطالية هيدروليكية 24V',
        rating: 'معيار مقاومة الرياح والطقس: IP68 عالي التحمل'
      },
      pivotDoor: {
        title: 'باب فيلا محوري معاصر (Modern Pivot Door 3D)',
        material: 'ألمنيوم فائق مع تكسية تيتانيوم + زجاج مقسى 140 مم',
        motor: 'محور دوران ألماني مخفي FritsJurgens سعة 500 كجم',
        rating: 'عزل حراري وصوتي مزدوج + مقاومة رياح حتى 160 كم/س'
      },
      shutter: {
        title: 'شتر كراج أوتوماتيكي (Smart Garage Shutter 3D)',
        material: 'شرائح ألمنيوم مزدوجة الجدار محقونة بالفوم العازل',
        motor: 'محرك فرنسي أنبوبي (Somfy) مع ريموت وتطبيق جوال',
        rating: 'عزل حراري وصوتي فائق مع قفل أوتوماتيكي ضد الاقتحام'
      }
    };
    const spec = specs[modelType];
    if (!spec) return;
    if (titleEl) titleEl.textContent = spec.title;
    if (materialEl) materialEl.textContent = spec.material;
    if (motorEl) motorEl.textContent = spec.motor;
    if (ratingEl) ratingEl.textContent = spec.rating;
  };

  // --- Helper: update 3D procedural object model ---
  const update3DStageModel = () => {
    const stagePalaceGate = document.getElementById('stagePalaceGate');
    const stagePivotDoor  = document.getElementById('stagePivotDoor');
    const stageShutter    = document.getElementById('stageShutter');

    if (stagePalaceGate) stagePalaceGate.classList.toggle('active-model', activeModel === 'palaceGate');
    if (stagePivotDoor) stagePivotDoor.classList.toggle('active-model', activeModel === 'pivotDoor');
    if (stageShutter) stageShutter.classList.toggle('active-model', activeModel === 'shutter');

    if (objectViewport) {
      objectViewport.style.filter = FINISH_FILTERS[activeFinish] || FINISH_FILTERS.royalBlack;
    }

    if (visualizer) {
      visualizer.loadModel(activeModel);
      visualizer.setFinish(activeFinish);
    }

    update3DDimensionsScale();
  };

  // --- Helper: update quote link ---
  const updateStudioQuoteLink = () => {
    const btn = document.getElementById('studioQuoteBtn');
    if (btn) {
      const w = widthSlider ? widthSlider.value : '4';
      const h = heightSlider ? heightSlider.value : '3';
      btn.href = 'quote.html?model=' + activeModel + '&finish=' + activeFinish + '&w=' + w + '&h=' + h;
    }
  };

  // --- Helpers: Arabic Names ---
  const getModelNameArabic = (m) => {
    return { palaceGate: 'بوابة القصور الفاخرة 3D', pivotDoor: 'باب محوري معاصر 3D', shutter: 'شتر حماية أوتوماتيكي 3D' }[m] || m;
  };
  const getFinishNameArabic = (f) => {
    return { royalBlack: 'أسود وذهبي', bronze: 'برونز عتيق', titanium: 'تيتانيوم رمادي', forest: 'أخضر زيتي' }[f] || f;
  };

  // --- Gate Open/Close Motion Animation ---
  const toggleGateOpen = () => {
    isGateOpen = !isGateOpen;

    if (viewport) {
      viewport.classList.toggle('gate-open', isGateOpen);
    }

    if (visualizer) {
      visualizer.toggleGateAnimation();
    }

    syncBtn(btnOpenClose, isGateOpen);
    if (btnOpenCloseText) {
      if (activeModel === 'shutter') {
        btnOpenCloseText.textContent = isGateOpen ? 'إنزال الشتر 3D' : 'رفع الشتر 3D';
      } else if (activeModel === 'pivotDoor') {
        btnOpenCloseText.textContent = isGateOpen ? 'إغلاق الباب 3D' : 'فتح الباب 3D';
      } else {
        btnOpenCloseText.textContent = isGateOpen ? 'إغلاق البوابة 3D' : 'محاكاة فتح البوابة 3D';
      }
    }

    if (btnOpenClose) {
      btnOpenClose.style.transform = 'scale(1.12)';
      setTimeout(() => { btnOpenClose.style.transform = 'none'; }, 200);
    }

    showToastNotification(isGateOpen ? 'تم تشغيل الحركة التفاعلية ثلاثية الأبعاد 3D' : 'تم تشغيل حركة الإغلاق 3D');
  };

  // --- Lighting Toggle ---
  const toggleLighting = () => {
    lightingMode = lightingMode === 'day' ? 'night' : 'day';
    if (lightingOverlay) {
      lightingOverlay.className = 'lighting-mode-overlay' + (lightingMode === 'night' ? ' night' : '');
    }

    if (visualizer) {
      visualizer.cycleLightingMode();
    }

    syncBtn(btnLighting, lightingMode === 'night');
    if (btnLightingText) {
      btnLightingText.textContent = lightingMode === 'night' ? 'إضاءة ليلية ذهبية' : 'إضاءة نهارية';
    }
    if (statusText) {
      statusText.textContent = lightingMode === 'night' ? 'وضع الإضاءة الليلية الذهبية 3D' : 'معاينة 3D تفاعلية حية';
    }
    showToastNotification(lightingMode === 'night' ? 'تم تفعيل وضع الإضاءة الليلية الذهبية 3D' : 'تم تفعيل وضع الإضاءة النهارية');
  };

  // --- CAD Blueprint Toggle ---
  const toggleCad = () => {
    cadMode = !cadMode;
    if (cadGrid) cadGrid.classList.toggle('active', cadMode);

    if (visualizer) {
      visualizer.toggleWireframe();
    }

    syncBtn(btnCad, cadMode);
    if (statusText) {
      statusText.textContent = cadMode ? 'مخطط أبعاد CAD الهندسية Wireframe' : 'معاينة 3D تفاعلية حية';
    }
    showToastNotification(cadMode ? 'تم عرض أبعاد المخطط الهندسي CAD Wireframe' : 'تم إخفاء المخطط الهندسي');
  };

  // --- 360° Interactive Orbit Drag Engine & Auto-Rotate Loop ---
  const init3DOrbitControls = () => {
    if (!container) return;

    const onPointerDown = (e) => {
      isDragging = true;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      previousPointerPos = { x: clientX, y: clientY };
      container.style.cursor = 'grabbing';
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - previousPointerPos.x;
      const deltaY = clientY - previousPointerPos.y;

      rotY += deltaX * 0.65;
      rotX = Math.max(-28, Math.min(38, rotX - deltaY * 0.45));

      previousPointerPos = { x: clientX, y: clientY };
      update3DTransform();
    };

    const onPointerUp = () => {
      isDragging = false;
      container.style.cursor = 'grab';
    };

    container.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    container.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // Continuous 360° Orbit Animation Loop
    const runOrbitLoop = () => {
      if (effectsActive && !isDragging) {
        rotY += 0.35;
        update3DTransform();
      }
      orbitAnimRAF = requestAnimationFrame(runOrbitLoop);
    };

    runOrbitLoop();
  };

  // --- Reset All ---
  const resetAll = () => {
    isGateOpen = false;
    lightingMode = 'day';
    cadMode = false;
    effectsActive = true;
    rotY = -15;
    rotX = 5;

    if (viewport) viewport.classList.remove('gate-open');
    if (lightingOverlay) lightingOverlay.className = 'lighting-mode-overlay';
    if (cadGrid) cadGrid.classList.remove('active');
    
    syncBtn(btnOpenClose, false);
    syncBtn(btnLighting, false);
    syncBtn(btnCad, false);
    syncBtn(btnAutoRotate, true);
    
    if (btnOpenCloseText) btnOpenCloseText.textContent = 'محاكاة فتح البوابة 3D';
    if (btnLightingText) btnLightingText.textContent = 'إضاءة نهارية';
    if (statusText) statusText.textContent = 'معاينة 3D تفاعلية حية';
    
    if (widthSlider) widthSlider.value = "4.00";
    if (heightSlider) heightSlider.value = "3.00";

    if (visualizer) {
      visualizer.resetCamera();
      visualizer.loadModel('palaceGate');
      visualizer.setFinish('royalBlack');
    }

    update3DTransform();
    update3DStageModel();
    updatePrice();
    showToastNotification('تمت إعادة ضبط الاستوديو ثلاثي الأبعاد 3D بنجاح');
  };

  // --- BIND ALL EVENT LISTENERS ---

  if (btnOpenClose) btnOpenClose.addEventListener('click', toggleGateOpen);
  if (btnLighting) btnLighting.addEventListener('click', toggleLighting);
  if (btnCad) btnCad.addEventListener('click', toggleCad);
  if (btnReset) btnReset.addEventListener('click', resetAll);

  if (btnAutoRotate) {
    btnAutoRotate.addEventListener('click', () => {
      effectsActive = !effectsActive;
      if (visualizer) visualizer.toggleAutoRotate();
      syncBtn(btnAutoRotate, effectsActive);
      showToastNotification(effectsActive ? 'تم تفعيل التفاعل 360°' : 'تم إيقاف التفاعل');
    });
  }

  // Model selection buttons
  document.querySelectorAll('[data-3d-model]').forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const modelName = button.getAttribute('data-3d-model');
      if (!modelName) return;

      document.querySelectorAll('[data-3d-model]').forEach((b) => b.classList.toggle('active', b === button));
      activeModel = modelName;
      isGateOpen = false;

      if (viewport) viewport.classList.remove('gate-open');
      syncBtn(btnOpenClose, false);

      if (btnOpenCloseText) {
        if (activeModel === 'shutter') btnOpenCloseText.textContent = 'رفع الشتر 3D';
        else if (activeModel === 'pivotDoor') btnOpenCloseText.textContent = 'فتح الباب 3D';
        else btnOpenCloseText.textContent = 'محاكاة فتح البوابة 3D';
      }

      button.style.transform = 'scale(0.96)';
      setTimeout(() => { button.style.transform = 'none'; }, 150);

      update3DStageModel();
      updateSpecDetails(modelName);
      updatePrice();
      updateStudioQuoteLink();
      showToastNotification('تم تحميل مجسم 3D: ' + getModelNameArabic(modelName));
    });
  });

  // Finish swatch color buttons
  document.querySelectorAll('[data-3d-finish]').forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const finish = button.getAttribute('data-3d-finish');
      if (!finish) return;

      document.querySelectorAll('[data-3d-finish]').forEach((b) => b.classList.toggle('active', b === button));
      activeFinish = finish;

      button.style.transform = 'scale(1.15)';
      setTimeout(() => { button.style.transform = 'none'; }, 200);

      update3DStageModel();
      updateStudioQuoteLink();
      showToastNotification('تم تطبيق خامة والطلاء 3D: ' + getFinishNameArabic(finish));
    });
  });

  // Dimension sliders with real time physical 3D model scaling
  if (widthSlider) {
    widthSlider.addEventListener('input', () => {
      updatePrice();
      updateStudioQuoteLink();
    });
  }
  if (heightSlider) {
    heightSlider.addEventListener('input', () => {
      updatePrice();
      updateStudioQuoteLink();
    });
  }

  // Initial Sync & 360 Drag Controls
  update3DTransform();
  update3DStageModel();
  updatePrice();
  updateStudioQuoteLink();
  init3DOrbitControls();
}

function setupFaqAccordions() {
  const items = document.querySelectorAll('.accordion-item, .faq-item');
  if (!items.length) return;

  items.forEach((item) => {
    const trigger = item.querySelector('.accordion-trigger, .faq-question');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      items.forEach((accordionItem) => accordionItem.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

function setupScrollRevealAnimations() {
  const studioSection = document.getElementById('studio3DSection');
  if (studioSection) {
    const studioIntro = studioSection.querySelector('.container > div:first-child');
    const canvas = studioSection.querySelector('.studio-3d-canvas-wrapper');
    const sidebar = studioSection.querySelector('.studio-3d-sidebar');

    if (studioIntro && !studioIntro.classList.contains('reveal-on-scroll')) {
      studioIntro.classList.add('reveal-on-scroll');
    }
    if (canvas && !canvas.classList.contains('reveal-zoom')) {
      canvas.classList.add('reveal-zoom');
    }
    if (sidebar && !sidebar.classList.contains('reveal-right')) {
      sidebar.classList.add('reveal-right');
    }
  }

  const elementsToReveal = document.querySelectorAll(
    'section:not(.studio-3d-section), .portfolio-card, .feature-card-item, .service-card, .project-item-card, .vision-cta-card, .spec-item, .faq-item, .contact-card, .about-hero-box, .stat-card-clean, .accordion-item',
  );

  elementsToReveal.forEach((element, index) => {
    if (
      element.classList.contains('reveal-on-scroll') ||
      element.classList.contains('reveal-zoom') ||
      element.classList.contains('reveal-left') ||
      element.classList.contains('reveal-right')
    ) {
      return;
    }

    element.classList.add('reveal-on-scroll');
    element.style.transitionDelay = `${(index % 4) * 0.12}s`;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
  );

  document
    .querySelectorAll('.reveal-on-scroll, .reveal-zoom, .reveal-left, .reveal-right')
    .forEach((element) => observer.observe(element));
}

function getModelNameArabic(modelType) {
  if (modelType === 'palaceGate') return 'بوابة القصور الملكية';
  if (modelType === 'pivotDoor') return 'باب فيلا محوري معاصر';
  if (modelType === 'shutter') return 'شتر حماية أوتوماتيكي';
  return 'النموذج المحدد';
}

function updateSpecDetails(modelType) {
  const titleEl = document.getElementById('spec3DTitle');
  const materialEl = document.getElementById('spec3DMaterial');
  const motorEl = document.getElementById('spec3DMotor');
  const ratingEl = document.getElementById('spec3DRating');
  if (!titleEl) return;

  const specs = {
    palaceGate: {
      title: 'بوابة القصور الملكية (Luxury Palace Gate)',
      material: 'فولاذ مقسى 6 مم + تطعيمات برونز ذهبي كهرستاتيكي',
      motor: 'نظام محركات أوتوماتيكية إيطالية هيدروليكية 24V',
      rating: 'معيار مقاومة الرياح والطقس: IP68 عالي التحمل',
    },
    pivotDoor: {
      title: 'باب فيلا محوري معاصر (Modern Architectural Pivot Door)',
      material: 'ألواح تيتانيوم مصمتة عازلة للصوت والحرارة 140 مم',
      motor: 'محور دوران ألماني مخفي مع إغلاق هيدروليكي ذكي',
      rating: 'إضاءة محيطية LED مدمجة + مقبض نحاسي بطول 2 متر',
    },
    shutter: {
      title: 'شتر حماية أوتوماتيكي معزول (Industrial Roller Shutter)',
      material: 'شرائح ألمنيوم مبثوق مزدوجة محقونة بالفوم العازل',
      motor: 'محرك فرنسي أنبوبي (Somfy) مع بطارية طوارئ UPS',
      rating: 'عزل حراري وصوتي فائق مع قفل أوتوماتيكي ضد الاقتحام',
    },
  };

  const spec = specs[modelType];
  if (!spec) return;

  titleEl.textContent = spec.title;
  if (materialEl) materialEl.textContent = spec.material;
  if (motorEl) motorEl.textContent = spec.motor;
  if (ratingEl) ratingEl.textContent = spec.rating;
}

function showToastNotification(message) {
  let toast = document.getElementById('siteToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'siteToast';
    toast.className = 'site-toast-popup';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 3500);
}

function initVipFloatingWidget() {
  if (document.getElementById('vipFloatingWidget')) return;

  const widget = document.createElement('div');
  widget.id = 'vipFloatingWidget';
  widget.className = 'vip-speed-dial-widget';
  widget.innerHTML = `
    <!-- Expanded Social Menu Drawer -->
    <div class="vip-speed-dial-menu" id="vipSpeedDialMenu">
      <a href="tel:+966553925444" class="vip-dial-item dial-phone" title="اتصل الآن مباشر 0553925444">
        <span class="dial-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg></span>
        <span class="dial-text">اتصل الآن: 0553925444</span>
      </a>
      <a href="https://wa.me/966553925444" target="_blank" rel="noopener noreferrer" class="vip-dial-item dial-wa" title="مراسلة سريعة عبر الواتساب">
        <span class="dial-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg></span>
        <span class="dial-text">واتساب مباشر</span>
      </a>
      <a href="https://www.snapchat.com/add/sysbur" target="_blank" rel="noopener noreferrer" class="vip-dial-item dial-snap" title="تابعنا على سناب شات">
        <span class="dial-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.007 2c-3.766 0-6.19 2.532-6.19 5.86 0 .972.26 2.016.71 2.97.125.267.075.404-.188.583-.695.474-1.57.854-2.122 1.34-.413.364-.537.81-.137 1.252.443.49 1.246.685 1.93.91.246.082.387.214.33.486-.2.964-.993 4.14-1.28 4.723-.19.387-.04.757.37.757.265 0 .618-.117 1.05-.333 1.385-.694 2.378-1.026 3.033-1.026.335 0 .67.086 1.042.274 1.135.576 2.33.782 3.47.782 1.14 0 2.335-.206 3.47-.782.373-.188.708-.274 1.043-.274.655 0 1.648.332 3.033 1.026.432.216.785.333 1.05.333.41 0 .56-.37.37-.757-.287-.583-1.08-3.76-1.28-4.723-.057-.272.084-.404.33-.486.684-.225 1.487-.42 1.93-.91.4-.442.276-.888-.137-1.252-.552-.486-1.427-.866-2.122-1.34-.263-.179-.313-.316-.188-.583.45-.954.71-1.998.71-2.97C18.197 4.532 15.773 2 12.007 2z"/></svg></span>
        <span class="dial-text">سناب شات</span>
      </a>
      <a href="https://www.tiktok.com/@user9753979848595?_r=1&_t=ZS-98sqWTDZ6r1" target="_blank" rel="noopener noreferrer" class="vip-dial-item dial-tiktok" title="تابعنا على تيك توك">
        <span class="dial-icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .56.05.82.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68a6.34 6.34 0 0 0 10.86 4.47V11.8a8.27 8.27 0 0 0 5.73 2.26V10.6a4.84 4.84 0 0 1-3.77-1.5 4.81 4.81 0 0 1-1.03-2.41z"/></svg></span>
        <span class="dial-text">تيك توك</span>
      </a>
      <a href="https://web.facebook.com/abw.amyrh.76342" target="_blank" rel="noopener noreferrer" class="vip-dial-item dial-fb" title="تابعنا على فيسبوك">
        <span class="dial-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></span>
        <span class="dial-text">فيسبوك</span>
      </a>
    </div>

    <!-- Main Trigger Button -->
    <button class="vip-speed-dial-trigger" id="vipSpeedDialTrigger" aria-label="تواصل معنا">
      <div class="trigger-icon-default">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
      </div>
      <div class="trigger-icon-close">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </div>
      <span class="trigger-label">تواصل معنا</span>
    </button>
  `;

  document.body.appendChild(widget);

  const trigger = document.getElementById('vipSpeedDialTrigger');
  const menu = document.getElementById('vipSpeedDialMenu');

  if (trigger && menu) {
    const toggleMenu = (e) => {
      e.stopPropagation();
      widget.classList.toggle('open');
    };

    trigger.addEventListener('click', toggleMenu);

    document.addEventListener('click', (e) => {
      if (!widget.contains(e.target)) {
        widget.classList.remove('open');
      }
    });
  }
}

function initAnimatedCounters() {
  const counterElements = document.querySelectorAll('.stat-number, .stat-item strong, .metric-value, .stat-value, [data-counter-target]');
  if (!counterElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        obs.unobserve(el);

        const rawText = el.textContent.trim();
        const match = rawText.match(/[\d,.]+/);
        if (!match) return;

        const numStr = match[0].replace(/,/g, '');
        const targetValue = parseFloat(numStr);
        if (isNaN(targetValue)) return;

        const prefix = rawText.substring(0, rawText.indexOf(match[0]));
        const suffix = rawText.substring(rawText.indexOf(match[0]) + match[0].length);

        const duration = 1800;
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
          const elapsedTime = currentTime - startTime;
          const progress = Math.min(elapsedTime / duration, 1);
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          const currentValue = Math.floor(targetValue * easeProgress);

          el.textContent = prefix + currentValue.toLocaleString('ar-EG') + suffix;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            el.textContent = prefix + targetValue.toLocaleString('ar-EG') + suffix;
          }
        };

        requestAnimationFrame(updateCounter);
      }
    });
  }, { threshold: 0.15 });

  counterElements.forEach(el => observer.observe(el));
}

if (typeof window !== 'undefined') {
  window.initAnimatedCounters = initAnimatedCounters;
}
