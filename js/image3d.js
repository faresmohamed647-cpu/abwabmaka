/**
 * 3D Interactive Card Tilt, Specular Glare, Parallax,
 * Modal Inspector with Live 3D Model WebGL Canvas & Dynamic Pricing Calculator
 * For Al-Itqan Metal Industries
 */

const THREE = typeof window !== 'undefined' && window.THREE ? window.THREE : null;

// Project Models and Catalog
const PROJECT_CATALOG = {
  projSmartGarageShutter: {
    id: 'projSmartGarageShutter',
    title: 'شتر كراج أوتوماتيكي مع لوفرات جانبية',
    category: 'شتر كراج ذكي معزول',
    city: 'الرياض',
    modelType: 'shutter',
    finish: 'titanium',
    img: 'images/garage_roller_shutter.jpg',
    specs: ['شرائح ألمنيوم وفولاذ معزولة بالفوم العازل', 'محرك إيطالي سريع وعزم فائق', 'لوفرات تكسية جانبية ديكورية عصرية', 'ريموت تحكم لاسلكي وتطبيق ذكي'],
  },
  projVillaRollingGate: {
    id: 'projVillaRollingGate',
    title: 'بوابات رولينج حديثة للفلل السكنية',
    category: 'أبواب أوتوماتيكية للفلل',
    city: 'الخبر',
    modelType: 'shutter',
    finish: 'titanium',
    img: 'images/villa_shutter_gate.jpg',
    specs: ['تصميم مودرن رمادي معدني متناسق مع الواجهات', 'حساسات كهروضوئية ضد الانغلاق على المركبات', 'مقاومة عالية للرطوبة وأشعة الشمس الحارقة', 'مفتاح طوارئ يدوي'],
  },
  projCommercialRollDoor: {
    id: 'projCommercialRollDoor',
    title: 'شتر واجهات ومحلات معزول',
    category: 'شتر أوتوماتيكي تجاري',
    city: 'جدة',
    modelType: 'shutter',
    finish: 'industrialSteel',
    img: 'images/commercial_shutter_clean.jpg',
    specs: ['عزل صوتي وحراري بنسبة تتجاوز 75%', 'أقفال أمان كهربائية أوتوماتيكية مدمجة', 'سرعة فتح وإغلاق هادئة', 'ضمان معتمد 10 سنوات'],
  },
  projYasminGate: {
    id: 'projYasminGate',
    title: 'بوابات حديدية وليزر CNC فاخرة',
    category: 'بوابات حديدية فاخرة',
    city: 'الرياض',
    modelType: 'palaceGate',
    finish: 'royalBlack',
    img: 'images/hero_luxury_gate.jpg',
    specs: ['فولاذ مشغول ومطروق يدوياً', 'دهان حراري كهرستاتيكي مقاوم للصدأ', 'ضمان هيكلي 10 سنوات', 'تطعيمات زخرفية ذهبية'],
  },
  projIndustrialSystems: {
    id: 'projIndustrialSystems',
    title: 'أنظمة وبوابات انزلاقية ثقيلة',
    category: 'صيانة وهياكل صناعية',
    city: 'الجبيل',
    modelType: 'industrialGate',
    finish: 'industrialSteel',
    img: 'images/auto_gate_industrial.jpg',
    specs: ['عوارض فولاذية ثقيلة مقاومة للاهتراء', 'محركات صناعية 3-Phase', 'عقود صيانة شاملة دورية', 'فحص واختبار ميكانيكي معتمد'],
  },
  projWindowShutterHero: {
    id: 'projWindowShutterHero',
    title: 'نوافذ شتر ألمنيوم للفلل',
    category: 'نوافذ شتر',
    city: 'الرياض',
    modelType: 'shutter',
    finish: 'bronze',
    img: 'images/window_shutter.jpg',
    specs: ['شتر نوافذ ألمنيوم بعزل حراري', 'صندوق شتر مدمج بإطار النافذة', 'تشغيل يدوي أو بمحرك أنبوبي', 'طلاء مقاوم لأشعة الشمس'],
  },
  projAmericanDoorHero: {
    id: 'projAmericanDoorHero',
    title: 'باب أمريكي فاخر بزجاج جانبي',
    category: 'أبواب أمريكي',
    city: 'جدة',
    modelType: 'pivotDoor',
    finish: 'royalBlack',
    img: 'images/american_door.jpg',
    specs: ['باب أمريكي بألواح غائرة وتصميم كلاسيكي', 'زجاج جانبي (سايدلايت) بإطار معدني', 'مقبض طولي فاخر وقفل إلكتروني', 'دهان حراري مقاوم للخدش والصدأ'],
  },
  projPatioDoorHero: {
    id: 'projPatioDoorHero',
    title: 'أبواب باريو زجاجية منزلقة',
    category: 'أبواب باريو',
    city: 'الخبر',
    modelType: 'pivotDoor',
    finish: 'titanium',
    img: 'images/patio_door.jpg',
    specs: ['نظام باريو منزلق متعدد الألواح', 'بروفايل ألمنيوم نحيف وإطلالة بانورامية', 'عزل صوتي وحراري للواجهات الزجاجية', 'فتحة واسعة بين الداخل والخارج'],
  },
  projTiltShutterHero: {
    id: 'projTiltShutterHero',
    title: 'نوافذ تيلت توب شتر',
    category: 'تيلت توب شتر',
    city: 'الرياض',
    modelType: 'shutter',
    finish: 'bronze',
    img: 'images/tilt_top_shutter.jpg',
    specs: ['نافذة تيلت آند تيرن مع شتر مدمج', 'فتحة علوية للتهوية مع بقاء التأمين', 'شتر ألمنيوم قابل للرفع الجزئي', 'إطار ألمنيوم أنثراسايت مقاوم للعوامل الجوية'],
  },
  projSwingDoorHero: {
    id: 'projSwingDoorHero',
    title: 'باب سوينج زجاجي حديث',
    category: 'أبواب سوينج',
    city: 'مكة المكرمة',
    modelType: 'pivotDoor',
    finish: 'royalBlack',
    img: 'images/swing_door.jpg',
    specs: ['باب سوينج بمفصلات مخفية وفتحة واسعة', 'زجاج سيكوريت بإطار ألمنيوم أسود', 'مقبض طولي حديث وتركيب محكم', 'مناسب لمداخل الفلل والمشاريع السكنية'],
  }
};

let activeModal3DScene = null;
let activeModal3DVisualizer = null;

/**
 * 3D Interactive Card Tilt Effect
 */
function init3DImageEffects() {
  const cards = document.querySelectorAll(
    '.project-item-card'
  );

  cards.forEach((card) => {
    if (card.dataset.tilt3dInit) return;
    card.dataset.tilt3dInit = 'true';
    card.classList.add('card-3d-tilt-parent');

    let glare = card.querySelector('.card-3d-glare');
    if (!glare) {
      glare = document.createElement('div');
      glare.className = 'card-3d-glare';
      card.appendChild(glare);
    }

    let bounds;
    let isHovering = false;

    const onMouseEnter = () => {
      isHovering = true;
      bounds = card.getBoundingClientRect();
      card.style.transition = 'transform 0.1s ease-out, box-shadow 0.25s ease-out';
      glare.style.opacity = '1';
    };

    const onMouseMove = (e) => {
      if (!isHovering) return;
      if (!bounds) bounds = card.getBoundingClientRect();

      const mouseX = e.clientX - bounds.left;
      const mouseY = e.clientY - bounds.top;

      const halfWidth = bounds.width / 2;
      const halfHeight = bounds.height / 2;

      const maxTilt = 8;
      const rotateX = ((mouseY - halfHeight) / halfHeight) * -maxTilt;
      const rotateY = ((mouseX - halfWidth) / halfWidth) * maxTilt;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;

      const glarePercentX = (mouseX / bounds.width) * 100;
      const glarePercentY = (mouseY / bounds.height) * 100;
      glare.style.background = `radial-gradient(circle at ${glarePercentX}% ${glarePercentY}%, rgba(255,255,255,0.24) 0%, rgba(212,175,55,0.14) 35%, rgba(0,0,0,0) 70%)`;
    };

    const onMouseLeave = () => {
      isHovering = false;
      card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease';
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      glare.style.opacity = '0';
    };

    card.addEventListener('mouseenter', onMouseEnter);
    card.addEventListener('mousemove', onMouseMove);
    card.addEventListener('mouseleave', onMouseLeave);
  });
}

/**
 * Embedded Modal 3D WebGL Scene Visualizer for Specific Project
 */
class ModalProject3DVisualizer {
  constructor(canvasContainer, projectData) {
    this.container = canvasContainer;
    this.projectData = projectData;
    this.modelType = projectData.modelType || 'palaceGate';
    this.finish = projectData.finish || 'royalBlack';

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.modelGroup = null;
    this.animId = null;
    this.isOpen = false;
    this.gateProgress = 0;
    this.autoRotate = true;
    this.isWireframe = false;

    this.isDragging = false;
    this.prevMouse = { x: 0, y: 0 };
    this.rotation = { x: 0.12, y: -0.3 };
    this.targetRotation = { x: 0.12, y: -0.3 };
    this.distance = 6.4;
    this.targetDistance = 6.4;

    this.leftWing = null;
    this.rightWing = null;
    this.pivotDoorWing = null;
    this.shutterSlats = [];

    this.materials = {};
    this.init();
  }

  init() {
    if (!THREE) return;
    this.container.innerHTML = '';
    const rect = this.container.getBoundingClientRect();
    const width = rect.width || 640;
    const height = rect.height || 420;

    // 1. Scene setup with bright luminous studio daylight
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf1f5f9);
    this.scene.fog = new THREE.FogExp2(0xf1f5f9, 0.015);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    this.updateCamera();

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.domElement.style.touchAction = 'none';
    this.container.appendChild(this.renderer.domElement);

    // 4. Lights
    const ambient = new THREE.AmbientLight(0xffffff, 1.4);
    this.scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xfffaed, 3.2);
    sun.position.set(6, 10, 7);
    sun.castShadow = true;
    this.scene.add(sun);

    const fill = new THREE.DirectionalLight(0xbad7f5, 1.6);
    fill.position.set(-6, 5, -4);
    this.scene.add(fill);

    const rim = new THREE.SpotLight(0xd4af37, 5.5, 20, Math.PI / 3.8, 0.4);
    rim.position.set(0, 7, -5);
    rim.target.position.set(0, 1.5, 0);
    this.scene.add(rim);
    this.scene.add(rim.target);

    // 5. Stage floor
    const stageGeo = new THREE.CylinderGeometry(4.8, 5.0, 0.3, 48);
    const stageMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.22, metalness: 0.1 });
    const stage = new THREE.Mesh(stageGeo, stageMat);
    stage.position.y = -0.15;
    stage.receiveShadow = true;
    this.scene.add(stage);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(4.82, 0.035, 16, 48),
      new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.16, metalness: 0.96 })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.005;
    this.scene.add(ring);

    const grid = new THREE.GridHelper(9, 18, 0xd4af37, 0xcbd5e1);
    grid.position.y = 0.01;
    this.scene.add(grid);

    // 6. Materials & Build
    this.initMaterials();
    this.buildModel();

    // 7. Events
    this.bindEvents();

    // 8. Loop
    this.render = this.render.bind(this);
    this.render();
  }

  initMaterials() {
    const finishes = {
      royalBlack: { main: 0x22262c, gold: 0xd4af37, rough: 0.28, metal: 0.88 },
      bronze: { main: 0x5c422f, gold: 0xf2c468, rough: 0.24, metal: 0.92 },
      titanium: { main: 0x55606d, gold: 0xd6e5f5, rough: 0.2, metal: 0.96 },
      industrialSteel: { main: 0x3e4854, gold: 0xf59e0b, rough: 0.35, metal: 0.92 },
      forest: { main: 0x263a32, gold: 0xdfbb69, rough: 0.3, metal: 0.84 }
    };
    const c = finishes[this.finish] || finishes.royalBlack;

    this.materials.ironMain = new THREE.MeshStandardMaterial({
      color: c.main,
      roughness: c.rough,
      metalness: c.metal,
      wireframe: this.isWireframe
    });

    this.materials.goldAccent = new THREE.MeshStandardMaterial({
      color: c.gold,
      roughness: 0.18,
      metalness: 0.96,
      wireframe: this.isWireframe
    });

    this.materials.pillarStone = new THREE.MeshStandardMaterial({
      color: 0x48525e,
      roughness: 0.65,
      metalness: 0.1,
      wireframe: this.isWireframe
    });
  }

  buildModel() {
    if (this.modelGroup) this.scene.remove(this.modelGroup);
    this.modelGroup = new THREE.Group();

    if (this.modelType === 'shutter') {
      this.buildShutter(this.modelGroup);
    } else if (this.modelType === 'pivotDoor') {
      this.buildPivotDoor(this.modelGroup);
    } else if (this.modelType === 'laserCutGate') {
      this.buildLaserCutGate(this.modelGroup);
    } else if (this.modelType === 'industrialGate') {
      this.buildIndustrialGate(this.modelGroup);
    } else {
      this.buildPalaceGate(this.modelGroup);
    }

    this.scene.add(this.modelGroup);
  }

  buildPalaceGate(group) {
    const pillarW = 0.5;
    const pillarH = 3.4;
    const gateH = 3.0;
    const wingW = 1.6;
    const halfSpan = wingW + 0.05;

    [-halfSpan - pillarW / 2, halfSpan + pillarW / 2].forEach(x => {
      const p = new THREE.Mesh(new THREE.BoxGeometry(pillarW, pillarH, pillarW), this.materials.pillarStone);
      p.position.set(x, pillarH / 2, 0);
      p.castShadow = true;
      group.add(p);

      const cap = new THREE.Mesh(new THREE.ConeGeometry(0.32, 0.4, 4), this.materials.goldAccent);
      cap.rotation.y = Math.PI / 4;
      cap.position.set(x, pillarH + 0.15, 0);
      cap.castShadow = true;
      group.add(cap);
    });

    // Left & Right Wings
    this.leftWing = new THREE.Group();
    this.leftWing.position.set(-halfSpan, 0, 0);
    this.buildWingMesh(this.leftWing, wingW, gateH, false);
    group.add(this.leftWing);

    this.rightWing = new THREE.Group();
    this.rightWing.position.set(halfSpan, 0, 0);
    this.buildWingMesh(this.rightWing, wingW, gateH, true);
    group.add(this.rightWing);
  }

  buildWingMesh(wingGroup, w, h, isRight) {
    const sign = isRight ? -1 : 1;
    const sub = new THREE.Group();
    sub.position.set(sign * (w / 2), 0, 0);

    // Frame
    const top = new THREE.Mesh(new THREE.BoxGeometry(w, 0.08, 0.08), this.materials.ironMain);
    top.position.set(0, h, 0);
    sub.add(top);

    const btm = new THREE.Mesh(new THREE.BoxGeometry(w, 0.08, 0.08), this.materials.ironMain);
    btm.position.set(0, 0.12, 0);
    sub.add(btm);

    [-w / 2 + 0.04, w / 2 - 0.04].forEach(x => {
      const stile = new THREE.Mesh(new THREE.BoxGeometry(0.08, h - 0.12, 0.08), this.materials.ironMain);
      stile.position.set(x, (h + 0.12) / 2, 0);
      sub.add(stile);
    });

    // Pickets & Finials
    const count = 7;
    const sp = (w - 0.16) / (count + 1);
    for (let i = 1; i <= count; i++) {
      const px = -w / 2 + 0.08 + i * sp;
      const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, h - 0.2, 10), this.materials.ironMain);
      bar.position.set(px, (h + 0.12) / 2, 0);
      sub.add(bar);

      const spear = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.2, 4), this.materials.goldAccent);
      spear.rotation.y = Math.PI / 4;
      spear.position.set(px, h + 0.1, 0);
      sub.add(spear);
    }

    // Lower Plate
    const plate = new THREE.Mesh(new THREE.BoxGeometry(w - 0.16, h * 0.35, 0.02), this.materials.ironMain);
    plate.position.set(0, h * 0.2, 0);
    sub.add(plate);

    // Gold Rosette
    const ros = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.04, 20), this.materials.goldAccent);
    ros.rotation.x = Math.PI / 2;
    ros.position.set(0, h * 0.68, 0.02);
    sub.add(ros);

    wingGroup.add(sub);
  }

  buildLaserCutGate(group) {
    const pillarW = 0.45;
    const pillarH = 3.2;
    const gateH = 2.8;
    const wingW = 1.7;
    const halfSpan = wingW + 0.04;

    [-halfSpan - pillarW / 2, halfSpan + pillarW / 2].forEach(x => {
      const p = new THREE.Mesh(new THREE.BoxGeometry(pillarW, pillarH, pillarW), this.materials.pillarStone);
      p.position.set(x, pillarH / 2, 0);
      p.castShadow = true;
      group.add(p);

      const cap = new THREE.Mesh(new THREE.BoxGeometry(pillarW + 0.08, 0.12, pillarW + 0.08), this.materials.goldAccent);
      cap.position.set(x, pillarH + 0.06, 0);
      group.add(cap);
    });

    this.leftWing = new THREE.Group();
    this.leftWing.position.set(-halfSpan, 0, 0);
    this.buildLaserCutWing(this.leftWing, wingW, gateH, false);
    group.add(this.leftWing);

    this.rightWing = new THREE.Group();
    this.rightWing.position.set(halfSpan, 0, 0);
    this.buildLaserCutWing(this.rightWing, wingW, gateH, true);
    group.add(this.rightWing);
  }

  buildLaserCutWing(wingGroup, w, h, isRight) {
    const sign = isRight ? -1 : 1;
    const sub = new THREE.Group();
    sub.position.set(sign * (w / 2), 0, 0);

    // Sturdy perimeter frame
    const frameMesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.06), this.materials.ironMain);
    frameMesh.position.set(0, h / 2 + 0.1, 0);
    sub.add(frameMesh);

    // Laser Cut Geometric Pattern Plate
    const innerW = w - 0.18;
    const innerH = h - 0.22;
    const patternMat = this.materials.goldAccent;

    // Pattern segments
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 3; col++) {
        const seg = new THREE.Mesh(
          new THREE.BoxGeometry(innerW / 3.4, innerH / 5.6, 0.02),
          patternMat
        );
        const px = -innerW / 2 + (col + 0.5) * (innerW / 3);
        const py = 0.2 + (row + 0.5) * (innerH / 5);
        seg.position.set(px, py, 0.035);
        sub.add(seg);
      }
    }

    // Modern Gold Vertical Pull Bar
    const pullBar = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.4, 16), this.materials.goldAccent);
    const handleX = sign > 0 ? (w / 2 - 0.12) : (-w / 2 + 0.12);
    pullBar.position.set(handleX, h / 2, 0.07);
    sub.add(pullBar);

    wingGroup.add(sub);
  }

  buildIndustrialGate(group) {
    const w = 4.2;
    const h = 3.0;

    // Heavy Industrial Steel Post on one side & Stop Post on other
    const postL = new THREE.Mesh(new THREE.BoxGeometry(0.25, h + 0.6, 0.25), this.materials.ironMain);
    postL.position.set(-w / 2 - 0.2, (h + 0.6) / 2, 0);
    group.add(postL);

    const postR = new THREE.Mesh(new THREE.BoxGeometry(0.25, h + 0.6, 0.25), this.materials.ironMain);
    postR.position.set(w / 2 + 0.2, (h + 0.6) / 2, 0);
    group.add(postR);

    // Floor Track
    const track = new THREE.Mesh(new THREE.BoxGeometry(w * 1.8, 0.06, 0.14), this.materials.ironMain);
    track.position.set(0, 0.03, 0);
    group.add(track);

    // Industrial Sliding Wing
    this.industrialSlidingWing = new THREE.Group();
    this.industrialSlidingWing.position.set(0, 0, 0);

    // Heavy Truss Frame
    const trussTop = new THREE.Mesh(new THREE.BoxGeometry(w, 0.12, 0.1), this.materials.ironMain);
    trussTop.position.set(0, h, 0);
    this.industrialSlidingWing.add(trussTop);

    const trussBtm = new THREE.Mesh(new THREE.BoxGeometry(w, 0.15, 0.1), this.materials.ironMain);
    trussBtm.position.set(0, 0.15, 0);
    this.industrialSlidingWing.add(trussBtm);

    // Vertical heavy beams
    const numBeams = 9;
    const beamSpacing = (w - 0.2) / (numBeams - 1);
    for (let i = 0; i < numBeams; i++) {
      const bx = -w / 2 + 0.1 + i * beamSpacing;
      const beam = new THREE.Mesh(new THREE.BoxGeometry(0.08, h - 0.25, 0.08), this.materials.ironMain);
      beam.position.set(bx, (h + 0.15) / 2, 0);
      this.industrialSlidingWing.add(beam);
    }

    // Safety yellow/black hazard striping accent
    const hazardBar = new THREE.Mesh(new THREE.BoxGeometry(w - 0.1, 0.2, 0.04), this.materials.goldAccent);
    hazardBar.position.set(0, h * 0.4, 0.06);
    this.industrialSlidingWing.add(hazardBar);

    // Industrial Heavy Steel Wheels
    [-w / 2 + 0.4, w / 2 - 0.4].forEach(wx => {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.08, 16), this.materials.goldAccent);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(wx, 0.09, 0);
      this.industrialSlidingWing.add(wheel);
    });

    group.add(this.industrialSlidingWing);
  }

  buildPivotDoor(group) {
    const w = 2.2;
    const h = 3.4;

    // Frame
    const fL = new THREE.Mesh(new THREE.BoxGeometry(0.12, h + 0.2, 0.35), this.materials.pillarStone);
    fL.position.set(-w / 2 - 0.06, h / 2, 0);
    group.add(fL);

    const fR = new THREE.Mesh(new THREE.BoxGeometry(0.12, h + 0.2, 0.35), this.materials.pillarStone);
    fR.position.set(w / 2 + 0.06, h / 2, 0);
    group.add(fR);

    const fT = new THREE.Mesh(new THREE.BoxGeometry(w + 0.24, 0.12, 0.35), this.materials.pillarStone);
    fT.position.set(0, h + 0.06, 0);
    group.add(fT);

    // Door Leaf
    this.pivotDoorWing = new THREE.Group();
    const pivotX = -w / 2 + 0.35;
    this.pivotDoorWing.position.set(pivotX, 0, 0);

    const leaf = new THREE.Mesh(new THREE.BoxGeometry(w - 0.04, h - 0.04, 0.12), this.materials.ironMain);
    leaf.position.set(w / 2 - 0.35, h / 2, 0);
    leaf.castShadow = true;
    this.pivotDoorWing.add(leaf);

    // Gold Long Pull Handle
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 1.8, 16), this.materials.goldAccent);
    handle.position.set(w - 0.65, h / 2, 0.09);
    this.pivotDoorWing.add(handle);

    // Smart Digital Lock keypad
    const lock = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.24, 0.04), this.materials.goldAccent);
    lock.position.set(w - 0.65, h / 2 - 0.2, 0.08);
    this.pivotDoorWing.add(lock);

    group.add(this.pivotDoorWing);
  }

  buildShutter(group) {
    const w = 3.6;
    const h = 3.2;

    // Top Hood Box
    const hood = new THREE.Mesh(new THREE.BoxGeometry(w + 0.2, 0.45, 0.45), this.materials.ironMain);
    hood.position.set(0, h + 0.22, 0);
    hood.castShadow = true;
    group.add(hood);

    // Guide Rails
    [-w / 2, w / 2].forEach(x => {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.08, h, 0.15), this.materials.ironMain);
      rail.position.set(x, h / 2, 0);
      group.add(rail);
    });

    // Slats
    this.shutterSlats = [];
    const slatCount = 28;
    const slatH = h / slatCount;
    for (let i = 0; i < slatCount; i++) {
      const slat = new THREE.Mesh(new THREE.BoxGeometry(w - 0.08, slatH * 0.95, 0.04), this.materials.ironMain);
      slat.position.set(0, i * slatH + slatH / 2, 0);
      slat.userData.baseY = slat.position.y;
      slat.userData.index = i;
      this.shutterSlats.push(slat);
      group.add(slat);
    }
  }

  toggleOpen() {
    this.isOpen = !this.isOpen;
    return this.isOpen;
  }

  toggleWireframe() {
    this.isWireframe = !this.isWireframe;
    this.initMaterials();
    this.buildModel();
    return this.isWireframe;
  }

  setFinish(fKey) {
    this.finish = fKey;
    this.initMaterials();
    this.buildModel();
  }

  resetView() {
    this.targetRotation.x = 0.12;
    this.targetRotation.y = -0.3;
    this.targetDistance = 6.4;
  }

  updateCamera() {
    const x = this.distance * Math.sin(this.rotation.y) * Math.cos(this.rotation.x);
    const y = 1.6 + this.distance * Math.sin(this.rotation.x);
    const z = this.distance * Math.cos(this.rotation.y) * Math.cos(this.rotation.x);
    this.camera.position.set(x, y, z);
    this.camera.lookAt(0, 1.6, 0);
  }

  bindEvents() {
    const el = this.renderer.domElement;

    const onStart = (cx, cy) => {
      this.isDragging = true;
      this.autoRotate = false;
      this.prevMouse = { x: cx, y: cy };
    };

    const onMove = (cx, cy) => {
      if (!this.isDragging) return;
      const dx = cx - this.prevMouse.x;
      const dy = cy - this.prevMouse.y;
      this.targetRotation.y += dx * 0.008;
      this.targetRotation.x = Math.max(-0.2, Math.min(0.85, this.targetRotation.x + dy * 0.008));
      this.prevMouse = { x: cx, y: cy };
    };

    const onEnd = () => {
      this.isDragging = false;
    };

    el.addEventListener('mousedown', e => onStart(e.clientX, e.clientY));
    window.addEventListener('mousemove', e => { if (this.isDragging) onMove(e.clientX, e.clientY); });
    window.addEventListener('mouseup', onEnd);

    el.addEventListener('touchstart', e => {
      if (e.touches.length === 1) onStart(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    el.addEventListener('touchmove', e => {
      if (e.touches.length === 1) onMove(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    el.addEventListener('touchend', onEnd);

    el.addEventListener('wheel', e => {
      e.preventDefault();
      this.targetDistance = Math.max(3.6, Math.min(9.5, this.targetDistance + e.deltaY * 0.004));
    }, { passive: false });
  }

  render() {
    this.animId = requestAnimationFrame(this.render);

    // Auto rotate slowly if not dragging
    if (this.autoRotate) {
      this.targetRotation.y += 0.003;
    }

    // Smooth lerp
    this.rotation.x += (this.targetRotation.x - this.rotation.x) * 0.1;
    this.rotation.y += (this.targetRotation.y - this.rotation.y) * 0.1;
    this.distance += (this.targetDistance - this.distance) * 0.1;
    this.updateCamera();

    // Animate open/close
    const targetProg = this.isOpen ? 1 : 0;
    this.gateProgress += (targetProg - this.gateProgress) * 0.06;

    if (this.leftWing && this.rightWing) {
      const openAngle = Math.PI * 0.55 * this.gateProgress;
      this.leftWing.rotation.y = -openAngle;
      this.rightWing.rotation.y = openAngle;
    }

    if (this.pivotDoorWing) {
      this.pivotDoorWing.rotation.y = -Math.PI * 0.5 * this.gateProgress;
    }

    if (this.industrialSlidingWing) {
      this.industrialSlidingWing.position.x = -2.8 * this.gateProgress;
    }

    if (this.shutterSlats && this.shutterSlats.length > 0) {
      const topY = 3.2;
      this.shutterSlats.forEach(slat => {
        const targetY = slat.userData.baseY + (topY - slat.userData.baseY) * this.gateProgress;
        slat.position.y += (targetY - slat.position.y) * 0.1;
        slat.scale.y = Math.max(0.05, 1 - this.gateProgress * 0.95);
      });
    }

    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    if (this.animId) cancelAnimationFrame(this.animId);
    if (this.renderer && this.renderer.domElement) {
      this.renderer.domElement.remove();
    }
  }
}

/**
 * 3D Lightbox & Project Inspector Modal
 */
function init3DImageModal() {
  let modal = document.getElementById('image3DModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'image3DModal';
    modal.className = 'image-3d-modal-overlay';
    modal.innerHTML = `
      <div class="image-3d-modal-container" id="modalContainer">
        <!-- Modal Top Bar -->
        <div class="modal-top-bar">
          <div class="modal-title-group">
            <span class="modal-category-badge" id="modalCategoryTag">بوابات حديدية فاخرة</span>
            <h2 id="modalProjectTitle" class="modal-project-title">بوابة قصر الياسمين</h2>
          </div>
          <button class="image-3d-modal-close" id="close3DModalBtn" aria-label="إغلاق">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Main Visual Stage (Canvas or Image 3D Tilt) -->
        <div class="modal-visual-body">
          <div class="modal-stage-container" id="modalStageContainer">
            <!-- WebGL 3D Canvas Container -->
            <div id="modal3DCanvasWrapper" class="modal-canvas-wrapper active"></div>

            <!-- Image Fallback / 3D Tilt View -->
            <div id="modalImageViewWrapper" class="modal-image-wrapper">
              <img id="modalFallbackImg" src="" alt="مشروع أبواب مكة" />
            </div>

            <!-- 3D Mini Floating Controls Inside Stage -->
            <div class="modal-stage-floating-tools">
              <button class="stage-mini-btn" id="modalToggleOpenBtn" title="فتح / إغلاق النموذج">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/></svg>
                <span>فتح / إغلاق</span>
              </button>
              <button class="stage-mini-btn" id="modalToggleWireBtn" title="النمط الهندسي Wireframe">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                <span>الهيكل الهندسي</span>
              </button>
              <button class="stage-mini-btn" id="modalResetCameraBtn" title="إعادة ضبط الكاميرا">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                <span>إعادة ضبط</span>
              </button>
            </div>

            <!-- 3D Rotation Touch/Mouse Hint -->
            <div class="modal-stage-hint">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3"/></svg>
              <span>اسحب للتدوير 360° | حرك العجلة أو باعد بإصبعين للتكبير</span>
            </div>
          </div>

          <!-- Bottom Control Bar -->
          <div class="modal-view-mode-bar">
            <div class="view-mode-toggles">
              <button class="btn-mode-tab active" id="btnMode3DModel">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                منظور 3D تفاعلي (WebGL)
              </button>
              <button class="btn-mode-tab" id="btnMode3DImage">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                معاينة الصورة الواقعية
              </button>
            </div>

            <!-- Direct Quote Button Linking to quote.html -->
            <a href="quote.html" class="btn-modal-direct-quote" id="btnModalDirectQuote">
              <span>طلب تسعير لهذا المشروع ←</span>
            </a>
          </div>
        </div>

      </div>
    `;
    document.body.appendChild(modal);

    // Bind Modal Controls
    bindModalElements(modal);
  }

  // Bind clickable projects and images
  bindClickableCards();
}

let currentProjectData = PROJECT_CATALOG.projYasminGate;

function bindModalElements(modal) {
  const closeBtn = document.getElementById('close3DModalBtn');
  const btnMode3D = document.getElementById('btnMode3DModel');
  const btnModeImg = document.getElementById('btnMode3DImage');
  const canvasWrapper = document.getElementById('modal3DCanvasWrapper');
  const imageWrapper = document.getElementById('modalImageViewWrapper');

  const btnToggleOpen = document.getElementById('modalToggleOpenBtn');
  const btnToggleWire = document.getElementById('modalToggleWireBtn');
  const btnResetCam = document.getElementById('modalResetCameraBtn');

  // Close modal
  const closeModal = () => {
    modal.classList.remove('active');
    if (activeModal3DVisualizer) {
      activeModal3DVisualizer.destroy();
      activeModal3DVisualizer = null;
    }
  };

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Switch View Mode: 3D WebGL Model vs 2D/3D Parallax Image
  btnMode3D.addEventListener('click', () => {
    btnMode3D.classList.add('active');
    btnModeImg.classList.remove('active');
    canvasWrapper.classList.add('active');
    imageWrapper.classList.remove('active');
    if (!activeModal3DVisualizer && currentProjectData) {
      activeModal3DVisualizer = new ModalProject3DVisualizer(canvasWrapper, currentProjectData);
    }
  });

  btnModeImg.addEventListener('click', () => {
    btnModeImg.classList.add('active');
    btnMode3D.classList.remove('active');
    canvasWrapper.classList.remove('active');
    imageWrapper.classList.add('active');
  });

  // Mini Controls in 3D Canvas Stage
  btnToggleOpen.addEventListener('click', () => {
    if (activeModal3DVisualizer) {
      const open = activeModal3DVisualizer.toggleOpen();
      btnToggleOpen.classList.toggle('active', open);
    }
  });

  btnToggleWire.addEventListener('click', () => {
    if (activeModal3DVisualizer) {
      const wire = activeModal3DVisualizer.toggleWireframe();
      btnToggleWire.classList.toggle('active', wire);
    }
  });

  btnResetCam.addEventListener('click', () => {
    if (activeModal3DVisualizer) {
      activeModal3DVisualizer.resetView();
    }
  });
}

function bindClickableCards() {
  const projectCards = document.querySelectorAll('.project-item-card');

  projectCards.forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
      // If clicking inside a standard link (like quote link or whatsapp), let default link navigation work
      const closestLink = e.target.closest('a');
      if (closestLink && !closestLink.classList.contains('open-modal-trigger') && !closestLink.classList.contains('btn-project-3d')) {
        return;
      }
      e.preventDefault();

      const cardId = card.id;
      let pData = PROJECT_CATALOG[cardId];

      if (!pData) {
        // Fallback detect from title / image
        const titleEl = card.querySelector('.project-title-text, .portfolio-card-title, h3');
        const imgEl = card.querySelector('img');
        const catEl = card.querySelector('.project-category-tag, .num-badge');

        const title = titleEl ? titleEl.textContent.trim() : 'بوابة معدنية معمارية';
        const img = imgEl ? imgEl.src : 'images/hero_luxury_gate.jpg';
        const category = catEl ? catEl.textContent.trim() : 'صناعات معدنية';

        let modelType = 'palaceGate';
        if (title.includes('أوتوماتيك') || category.includes('أوتوماتيك') || title.includes('باب') || title.includes('سوينج') || title.includes('أمريكي') || title.includes('باريو') || category.includes('سوينج') || category.includes('أمريكي') || category.includes('باريو')) modelType = 'pivotDoor';
        if (title.includes('شتر') || category.includes('شتر') || title.includes('تيلت') || category.includes('تيلت')) modelType = 'shutter';

        pData = {
          id: cardId || 'projDefault',
          title,
          category,
          city: 'الرياض',
          modelType,
          finish: 'royalBlack',
          img,
          basePricePerMeter: 1800,
          defaultWidth: 4.0,
          defaultHeight: 3.0
        };
      }

      openProject3DModal(pData);
    });
  });
}

function openProject3DModal(projectData) {
  currentProjectData = projectData;

  const modal = document.getElementById('image3DModal');
  if (!modal) return;

  const modalTitle = document.getElementById('modalProjectTitle');
  const modalCategory = document.getElementById('modalCategoryTag');
  const fallbackImg = document.getElementById('modalFallbackImg');
  const canvasWrapper = document.getElementById('modal3DCanvasWrapper');
  const imageWrapper = document.getElementById('modalImageViewWrapper');
  const btnMode3D = document.getElementById('btnMode3DModel');
  const btnModeImg = document.getElementById('btnMode3DImage');
  const btnDirectQuote = document.getElementById('btnModalDirectQuote');

  if (modalTitle) modalTitle.textContent = projectData.title;
  if (modalCategory) modalCategory.textContent = projectData.category;
  if (fallbackImg) fallbackImg.src = projectData.img;
  if (btnDirectQuote) {
    btnDirectQuote.href = `quote.html?project=${encodeURIComponent(projectData.id || '')}`;
  }

  // Default to 3D WebGL mode
  if (btnMode3D) btnMode3D.classList.add('active');
  if (btnModeImg) btnModeImg.classList.remove('active');
  if (canvasWrapper) canvasWrapper.classList.add('active');
  if (imageWrapper) imageWrapper.classList.remove('active');

  modal.classList.add('active');

  // Init Three.js 3D Visualizer
  if (activeModal3DVisualizer) activeModal3DVisualizer.destroy();
  activeModal3DVisualizer = new ModalProject3DVisualizer(canvasWrapper, projectData);
}

/**
 * Toast Notification Helper
 */
function showGlobalToast(msg) {
  let toast = document.getElementById('siteToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'siteToast';
    toast.className = 'site-toast-popup';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

/**
 * Animated Stat Counters
 */
function initAnimatedCounters() {
  const statNumbers = document.querySelectorAll('.stat-card-number');
  if (statNumbers.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          if (el.dataset.animated) return;
          el.dataset.animated = 'true';

          const text = el.textContent.trim();
          const targetNum = parseInt(text.replace(/[^0-9]/g, ''), 10);
          const hasPlus = text.includes('+');

          if (isNaN(targetNum)) return;

          let startTimestamp = null;
          const duration = 1800;

          const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = Math.floor(easeProgress * targetNum);

            el.textContent = `${hasPlus ? '+' : ''}${currentVal}`;

            if (progress < 1) {
              window.requestAnimationFrame(step);
            } else {
              el.textContent = `${hasPlus ? '+' : ''}${targetNum}`;
            }
          };

          window.requestAnimationFrame(step);
        }
      });
    },
    { threshold: 0.2 }
  );

  statNumbers.forEach((num) => observer.observe(num));
}

if (typeof window !== 'undefined') {
  window.init3DImageEffects = init3DImageEffects;
  window.init3DImageModal = init3DImageModal;
  window.openProject3DModal = openProject3DModal;
  window.showGlobalToast = showGlobalToast;
  window.initAnimatedCounters = initAnimatedCounters;
}
