import * as THREE from 'three';

/**
 * 3D Interactive Gate & Door Studio Visualizer
 * Built for Al-Itqan Metal Industries
 */
export class Gate3DVisualizer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.currentModelGroup = null;
    this.animationFrameId = null;
    
    // State
    this.currentModelType = 'palaceGate'; // 'palaceGate', 'pivotDoor', 'shutter'
    this.isOpen = false;
    this.lightingMode = 'day'; // 'day', 'night', 'blueprint'
    this.isWireframe = false;
    this.autoRotate = true;
    this.currentFinish = 'royalBlack'; // 'royalBlack', 'bronze', 'titanium', 'forest'

    // Interactive Drag / Orbit
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.initialPinchDistance = null;
    this.defaultRotation = { x: 0.15, y: -0.35 };
    this.defaultDistance = 6.8;
    this.targetRotation = { x: 0.15, y: -0.35 };
    this.currentRotation = { x: 0.15, y: -0.35 };
    this.targetDistance = 6.8;
    this.currentDistance = 6.8;

    // Hinged Objects for animation
    this.leftWing = null;
    this.rightWing = null;
    this.pivotDoorWing = null;
    this.shutterSlats = [];
    this.gateAnimProgress = 0; // 0 = closed, 1 = open

    // Materials map
    this.materials = {};

    this.init();
  }

  init() {
    // 1. Scene setup with bright luminous luxury architectural studio background
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf1f5f9);
    this.scene.fog = new THREE.FogExp2(0xf1f5f9, 0.012);

    // 2. Camera setup
    const rect = this.container.getBoundingClientRect();
    const aspect = (rect.width || 800) / (rect.height || 500);
    this.camera = new THREE.PerspectiveCamera(42, aspect, 0.1, 100);
    this.updateCameraPosition();

    // 3. Renderer setup
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    this.renderer.setSize(rect.width || 800, rect.height || 500);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15; // Natural luminous studio exposure

    // Clear old canvas if any
    const oldCanvas = this.container.querySelector('canvas');
    if (oldCanvas) oldCanvas.remove();
    this.container.appendChild(this.renderer.domElement);

    // Ensure touch action is none so mobile gestures don't trigger native scroll
    this.renderer.domElement.style.touchAction = 'none';

    // 4. Lights & Environment
    this.setupLighting();

    // 5. Build Floor & Architectural Stage
    this.buildStage();

    // 6. Init Materials & Models
    this.initMaterials();
    this.loadModel(this.currentModelType);

    // 7. Event Listeners
    this.bindEvents();

    // 8. Start Render Loop
    this.animate = this.animate.bind(this);
    this.animate();
  }

  setupLighting() {
    // Ambient Light (Bright crisp architectural studio daylight)
    this.ambientLight = new THREE.AmbientLight(0xffffff, 1.45);
    this.scene.add(this.ambientLight);

    // Main Key Light (Warm, crisp architectural sunlight)
    this.keyLight = new THREE.DirectionalLight(0xfffaed, 3.4);
    this.keyLight.position.set(7, 11, 8);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.width = 2048;
    this.keyLight.shadow.mapSize.height = 2048;
    this.keyLight.shadow.camera.near = 0.5;
    this.keyLight.shadow.camera.far = 30;
    this.keyLight.shadow.camera.left = -6;
    this.keyLight.shadow.camera.right = 6;
    this.keyLight.shadow.camera.top = 6;
    this.keyLight.shadow.camera.bottom = -6;
    this.keyLight.shadow.bias = -0.0004;
    this.scene.add(this.keyLight);

    // Fill Light (Soft sky reflection)
    this.fillLight = new THREE.DirectionalLight(0xbad7f5, 1.8);
    this.fillLight.position.set(-7, 6, -4);
    this.scene.add(this.fillLight);

    // Overhead Studio Softbox
    this.topLight = new THREE.DirectionalLight(0xffffff, 1.8);
    this.topLight.position.set(0, 12, 2);
    this.scene.add(this.topLight);

    // Golden Rim / Architectural Specular Highlight
    this.rimLight = new THREE.SpotLight(0xd4af37, 6.0, 22, Math.PI / 3.8, 0.4, 1);
    this.rimLight.position.set(0, 8, -5);
    this.rimLight.target.position.set(0, 1.5, 0);
    this.scene.add(this.rimLight);
    this.scene.add(this.rimLight.target);

    // Ground Uplights
    this.upLight1 = new THREE.PointLight(0xffdf9e, 2.2, 9);
    this.upLight1.position.set(-2.6, 0.25, 1.8);
    this.scene.add(this.upLight1);

    this.upLight2 = new THREE.PointLight(0xffdf9e, 2.2, 9);
    this.upLight2.position.set(2.6, 0.25, 1.8);
    this.scene.add(this.upLight2);
  }

  buildStage() {
    // Stage Pedestal (Bright luxury architectural porcelain / concrete floor)
    const stageGeo = new THREE.CylinderGeometry(5.2, 5.4, 0.35, 64);
    const stageMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.22,
      metalness: 0.12,
    });
    this.stageMesh = new THREE.Mesh(stageGeo, stageMat);
    this.stageMesh.position.y = -0.175;
    this.stageMesh.receiveShadow = true;
    this.scene.add(this.stageMesh);

    // Polished Brass accent ring around the stage
    const ringGeo = new THREE.TorusGeometry(5.22, 0.04, 16, 64);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.16,
      metalness: 0.96,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = 0.005;
    this.scene.add(ringMesh);

    // Ambient ground grid for engineering precision
    const gridHelper = new THREE.GridHelper(10, 20, 0xd4af37, 0xcbd5e1);
    gridHelper.position.y = 0.01;
    this.scene.add(gridHelper);
  }

  initMaterials() {
    // Luminous, high-contrast luxury architectural finishes configuration
    const finishColors = {
      royalBlack: { main: 0x22262c, gold: 0xebb85a, rough: 0.28, metal: 0.88 },
      bronze: { main: 0x5c422f, gold: 0xf2c468, rough: 0.24, metal: 0.92 },
      titanium: { main: 0x55606d, gold: 0xd6e5f5, rough: 0.2, metal: 0.96 },
      forest: { main: 0x263a32, gold: 0xdfbb69, rough: 0.3, metal: 0.84 },
    };

    const cfg = finishColors[this.currentFinish] || finishColors.royalBlack;

    this.materials.ironMain = new THREE.MeshStandardMaterial({
      color: cfg.main,
      roughness: cfg.rough,
      metalness: cfg.metal,
      wireframe: this.isWireframe,
    });

    this.materials.goldAccent = new THREE.MeshStandardMaterial({
      color: cfg.gold,
      roughness: 0.18,
      metalness: 0.96,
      wireframe: this.isWireframe,
    });

    this.materials.pillarStone = new THREE.MeshStandardMaterial({
      color: 0x48525e,
      roughness: 0.65,
      metalness: 0.1,
      wireframe: this.isWireframe,
    });

    this.materials.glass = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.4,
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.9,
      ior: 1.5,
    });

    this.materials.ledLight = new THREE.MeshBasicMaterial({
      color: 0xfff0c8,
    });
  }

  updateMaterials() {
    this.initMaterials();
    if (!this.currentModelGroup) return;

    this.currentModelGroup.traverse((child) => {
      if (child.isMesh) {
        if (child.userData.role === 'gold') {
          child.material = this.materials.goldAccent;
        } else if (child.userData.role === 'stone') {
          child.material = this.materials.pillarStone;
        } else if (child.userData.role === 'glass') {
          child.material = this.materials.glass;
        } else if (child.userData.role === 'led') {
          child.material = this.materials.ledLight;
        } else {
          child.material = this.materials.ironMain;
        }
      }
    });
  }

  setFinish(finishKey) {
    this.currentFinish = finishKey;
    this.updateMaterials();
  }

  cycleLightingMode() {
    if (this.lightingMode === 'day') {
      this.setLightingMode('night');
    } else if (this.lightingMode === 'night') {
      this.setLightingMode('blueprint');
    } else {
      this.setLightingMode('day');
    }
    return this.lightingMode;
  }

  setLightingMode(mode) {
    this.lightingMode = mode;
    if (mode === 'night') {
      this.scene.background.setHex(0x161d26);
      this.scene.fog.color.setHex(0x161d26);
      this.ambientLight.intensity = 0.7;
      this.ambientLight.color.setHex(0xffffff);
      this.keyLight.intensity = 1.3;
      this.keyLight.color.setHex(0x94b4d6);
      this.fillLight.intensity = 0.7;
      this.fillLight.color.setHex(0x5c799a);
      if (this.topLight) this.topLight.intensity = 0.8;
      this.rimLight.intensity = 7.5;
      this.rimLight.color.setHex(0xf5cb6c);
      this.upLight1.intensity = 4.5;
      this.upLight1.color.setHex(0xffcc66);
      this.upLight2.intensity = 4.5;
      this.upLight2.color.setHex(0xffcc66);
    } else if (mode === 'blueprint') {
      this.scene.background.setHex(0x0f233a);
      this.scene.fog.color.setHex(0x0f233a);
      this.ambientLight.intensity = 0.9;
      this.ambientLight.color.setHex(0x3882c7);
      this.keyLight.intensity = 2.4;
      this.keyLight.color.setHex(0x00e5ff);
      this.fillLight.intensity = 1.4;
      this.fillLight.color.setHex(0x0077b6);
      if (this.topLight) this.topLight.intensity = 1.2;
      this.rimLight.intensity = 6.0;
      this.rimLight.color.setHex(0x38bdf8);
      this.upLight1.intensity = 3.5;
      this.upLight1.color.setHex(0x00f0ff);
      this.upLight2.intensity = 3.5;
      this.upLight2.color.setHex(0x00f0ff);
    } else {
      // Day (Bright Realistic Architectural Studio Daylight)
      this.lightingMode = 'day';
      this.scene.background.setHex(0xf1f5f9);
      this.scene.fog.color.setHex(0xf1f5f9);
      this.ambientLight.intensity = 1.45;
      this.ambientLight.color.setHex(0xffffff);
      this.keyLight.intensity = 3.4;
      this.keyLight.color.setHex(0xfffaed);
      this.fillLight.intensity = 1.8;
      this.fillLight.color.setHex(0xbad7f5);
      if (this.topLight) this.topLight.intensity = 1.8;
      this.rimLight.intensity = 6.0;
      this.rimLight.color.setHex(0xd4af37);
      this.upLight1.intensity = 2.2;
      this.upLight1.color.setHex(0xffdf9e);
      this.upLight2.intensity = 2.2;
      this.upLight2.color.setHex(0xffdf9e);
    }
  }

  toggleNightMode() {
    return this.cycleLightingMode();
  }

  toggleWireframe() {
    this.isWireframe = !this.isWireframe;
    this.updateMaterials();
    return this.isWireframe;
  }

  toggleAutoRotate() {
    this.autoRotate = !this.autoRotate;
    return this.autoRotate;
  }

  toggleGateAnimation() {
    this.isOpen = !this.isOpen;
    return this.isOpen;
  }

  // Camera Presets & Smooth Controls
  resetCamera() {
    this.targetRotation.x = this.defaultRotation.x;
    this.targetRotation.y = this.defaultRotation.y;
    this.targetDistance = this.defaultDistance;
  }

  setFrontView() {
    this.targetRotation.x = 0.02;
    this.targetRotation.y = 0.0;
    this.targetDistance = 6.2;
  }

  setSideView() {
    this.targetRotation.x = 0.08;
    this.targetRotation.y = Math.PI / 2;
    this.targetDistance = 6.4;
  }

  setTopView() {
    this.targetRotation.x = 0.82;
    this.targetRotation.y = 0.0;
    this.targetDistance = 7.4;
  }

  zoomIn(step = 0.8) {
    this.targetDistance = Math.max(3.5, this.targetDistance - step);
  }

  zoomOut(step = 0.8) {
    this.targetDistance = Math.min(10.5, this.targetDistance + step);
  }

  rotateBy(deltaX = 0, deltaY = 0) {
    this.targetRotation.y += deltaY;
    this.targetRotation.x = Math.max(-0.2, Math.min(0.85, this.targetRotation.x + deltaX));
  }

  loadModel(modelType) {
    this.currentModelType = modelType;
    this.isOpen = false;
    this.gateAnimProgress = 0;
    this.shutterSlats = [];

    if (this.currentModelGroup) {
      this.scene.remove(this.currentModelGroup);
      this.currentModelGroup = null;
    }

    const group = new THREE.Group();

    if (modelType === 'palaceGate') {
      this.buildPalaceGate(group);
    } else if (modelType === 'pivotDoor') {
      this.buildPivotDoor(group);
    } else if (modelType === 'shutter') {
      this.buildIndustrialShutter(group);
    }

    this.currentModelGroup = group;
    this.scene.add(group);
    this.updateMaterials();
  }

  /* =========================================================================
     3D MODEL 1: LUXURY PALACE WROUGHT IRON GATE (بوابة القصور الفاخرة)
     ========================================================================= */
  buildPalaceGate(group) {
    const pillarWidth = 0.55;
    const pillarHeight = 3.6;
    const gateHeight = 3.1;
    const wingWidth = 1.65;
    const halfSpan = wingWidth + 0.05;

    // 1. Left & Right Stone Architectural Pillars with Moldings
    [-halfSpan - pillarWidth / 2, halfSpan + pillarWidth / 2].forEach((xPos, idx) => {
      const pillarGroup = new THREE.Group();
      pillarGroup.position.set(xPos, 0, 0);

      // Base Plinth
      const baseGeo = new THREE.BoxGeometry(0.7, 0.35, 0.7);
      const baseMesh = new THREE.Mesh(baseGeo, this.materials.pillarStone);
      baseMesh.position.y = 0.175;
      baseMesh.castShadow = true;
      baseMesh.receiveShadow = true;
      baseMesh.userData.role = 'stone';
      pillarGroup.add(baseMesh);

      // Main Column Shaft
      const shaftGeo = new THREE.BoxGeometry(pillarWidth, pillarHeight - 0.7, pillarWidth);
      const shaftMesh = new THREE.Mesh(shaftGeo, this.materials.pillarStone);
      shaftMesh.position.y = (pillarHeight - 0.7) / 2 + 0.35;
      shaftMesh.castShadow = true;
      shaftMesh.receiveShadow = true;
      shaftMesh.userData.role = 'stone';
      pillarGroup.add(shaftMesh);

      // Capital / Top Cap
      const capGeo = new THREE.BoxGeometry(0.68, 0.25, 0.68);
      const capMesh = new THREE.Mesh(capGeo, this.materials.pillarStone);
      capMesh.position.y = pillarHeight - 0.22;
      capMesh.castShadow = true;
      capMesh.userData.role = 'stone';
      pillarGroup.add(capMesh);

      // Gold Pyramid Cap Finial
      const pyrGeo = new THREE.ConeGeometry(0.35, 0.45, 4);
      const pyrMesh = new THREE.Mesh(pyrGeo, this.materials.goldAccent);
      pyrMesh.rotation.y = Math.PI / 4;
      pyrMesh.position.y = pillarHeight + 0.15;
      pyrMesh.castShadow = true;
      pyrMesh.userData.role = 'gold';
      pillarGroup.add(pyrMesh);

      // Lamp fixture on pillar
      const lampGeo = new THREE.CylinderGeometry(0.12, 0.16, 0.35, 8);
      const lampMesh = new THREE.Mesh(lampGeo, this.materials.goldAccent);
      lampMesh.position.set(0, pillarHeight - 0.6, 0.32);
      lampMesh.userData.role = 'gold';
      pillarGroup.add(lampMesh);

      group.add(pillarGroup);
    });

    // 2. Left Wing (Hinged at left pillar)
    this.leftWing = new THREE.Group();
    this.leftWing.position.set(-halfSpan, 0, 0);
    this.buildGateWing(this.leftWing, wingWidth, gateHeight, false);
    group.add(this.leftWing);

    // 3. Right Wing (Hinged at right pillar)
    this.rightWing = new THREE.Group();
    this.rightWing.position.set(halfSpan, 0, 0);
    this.buildGateWing(this.rightWing, wingWidth, gateHeight, true);
    group.add(this.rightWing);
  }

  buildGateWing(wingGroup, width, height, isRightWing) {
    const sign = isRightWing ? -1 : 1;
    const subGroup = new THREE.Group();
    // Offset so local origin is the hinge axis
    subGroup.position.set(sign * (width / 2), 0, 0);

    const frameThick = 0.08;
    const frameDepth = 0.08;

    // Outer Perimeter Rectangles
    // Top Bar
    const topBar = new THREE.Mesh(new THREE.BoxGeometry(width, frameThick, frameDepth), this.materials.ironMain);
    topBar.position.set(0, height, 0);
    topBar.castShadow = true;
    subGroup.add(topBar);

    // Bottom Bar
    const btmBar = new THREE.Mesh(new THREE.BoxGeometry(width, frameThick, frameDepth), this.materials.ironMain);
    btmBar.position.set(0, 0.15, 0);
    btmBar.castShadow = true;
    subGroup.add(btmBar);

    // Middle Rail
    const midBar = new THREE.Mesh(new THREE.BoxGeometry(width, frameThick * 0.8, frameDepth), this.materials.ironMain);
    midBar.position.set(0, height * 0.45, 0);
    midBar.castShadow = true;
    subGroup.add(midBar);

    // Left & Right Vertical Frame Stiles
    [-width / 2 + frameThick / 2, width / 2 - frameThick / 2].forEach(x => {
      const stile = new THREE.Mesh(new THREE.BoxGeometry(frameThick, height - 0.15, frameDepth), this.materials.ironMain);
      stile.position.set(x, (height + 0.15) / 2, 0);
      stile.castShadow = true;
      subGroup.add(stile);
    });

    // Vertical Iron Pickets & Spear Finials
    const picketCount = 9;
    const spacing = (width - frameThick * 2) / (picketCount + 1);
    for (let i = 1; i <= picketCount; i++) {
      const px = -width / 2 + frameThick + i * spacing;
      
      // Vertical Bar
      const picket = new THREE.Mesh(
        new THREE.CylinderGeometry(0.016, 0.016, height - 0.2, 12),
        this.materials.ironMain
      );
      picket.position.set(px, (height + 0.15) / 2, 0);
      picket.castShadow = true;
      subGroup.add(picket);

      // Gold Spear Head Finial at top
      const spear = new THREE.Mesh(
        new THREE.ConeGeometry(0.042, 0.22, 4),
        this.materials.goldAccent
      );
      spear.rotation.y = Math.PI / 4;
      spear.position.set(px, height + 0.12, 0);
      spear.castShadow = true;
      spear.userData.role = 'gold';
      subGroup.add(spear);
    }

    // Lower Decorative Laser-cut Plate (Geometric Mashrabiya pattern)
    const lowerPlate = new THREE.Mesh(
      new THREE.BoxGeometry(width - frameThick * 2, height * 0.38, 0.02),
      this.materials.ironMain
    );
    lowerPlate.position.set(0, height * 0.22, 0);
    lowerPlate.castShadow = true;
    subGroup.add(lowerPlate);

    // Gold Arabic Floral Rosette / Medallion in center
    const medallionGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.04, 24);
    const medallion = new THREE.Mesh(medallionGeo, this.materials.goldAccent);
    medallion.rotation.x = Math.PI / 2;
    medallion.position.set(0, height * 0.72, 0.025);
    medallion.castShadow = true;
    medallion.userData.role = 'gold';
    subGroup.add(medallion);

    // Decorative Scroll Rings
    [-0.35, 0.35].forEach(sx => {
      const scrollRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.14, 0.015, 12, 24),
        this.materials.goldAccent
      );
      scrollRing.position.set(sx, height * 0.72, 0);
      scrollRing.userData.role = 'gold';
      subGroup.add(scrollRing);
    });

    // Hinges on outer edge
    const hingeX = -sign * (width / 2);
    [0.4, height * 0.5, height - 0.3].forEach(hy => {
      const hinge = new THREE.Mesh(
        new THREE.CylinderGeometry(0.035, 0.035, 0.14, 16),
        this.materials.goldAccent
      );
      hinge.position.set(hingeX, hy, 0);
      hinge.userData.role = 'gold';
      subGroup.add(hinge);
    });

    wingGroup.add(subGroup);
  }

  /* =========================================================================
     3D MODEL 2: MODERN ARCHITECTURAL PIVOT VILLA DOOR (باب فيلا محوري)
     ========================================================================= */
  buildPivotDoor(group) {
    const doorWidth = 2.4;
    const doorHeight = 3.6;
    const doorThick = 0.14;
    const frameThick = 0.12;

    // Outer Minimalist Architectural Portal Frame
    const frameLeft = new THREE.Mesh(new THREE.BoxGeometry(frameThick, doorHeight + 0.3, 0.4), this.materials.pillarStone);
    frameLeft.position.set(-doorWidth / 2 - frameThick / 2, doorHeight / 2, 0);
    frameLeft.castShadow = true;
    frameLeft.userData.role = 'stone';
    group.add(frameLeft);

    const frameRight = new THREE.Mesh(new THREE.BoxGeometry(frameThick, doorHeight + 0.3, 0.4), this.materials.pillarStone);
    frameRight.position.set(doorWidth / 2 + frameThick / 2, doorHeight / 2, 0);
    frameRight.castShadow = true;
    frameRight.userData.role = 'stone';
    group.add(frameRight);

    const frameTop = new THREE.Mesh(new THREE.BoxGeometry(doorWidth + frameThick * 2, frameThick, 0.4), this.materials.pillarStone);
    frameTop.position.set(0, doorHeight + frameThick / 2, 0);
    frameTop.castShadow = true;
    frameTop.userData.role = 'stone';
    group.add(frameTop);

    // Pivot Wing (Hinged at 25% from right side)
    this.pivotDoorWing = new THREE.Group();
    const pivotOffsetX = doorWidth * 0.32;
    this.pivotDoorWing.position.set(pivotOffsetX, 0, 0);

    const panelGroup = new THREE.Group();
    panelGroup.position.set(-pivotOffsetX, 0, 0);

    // Main Heavy Dark Titanium Door Leaf
    const leafGeo = new THREE.BoxGeometry(doorWidth, doorHeight, doorThick);
    const leafMesh = new THREE.Mesh(leafGeo, this.materials.ironMain);
    leafMesh.position.set(0, doorHeight / 2, 0);
    leafMesh.castShadow = true;
    leafMesh.receiveShadow = true;
    panelGroup.add(leafMesh);

    // Horizontal Laser Fluting / Grooves
    for (let y = 0.5; y < doorHeight; y += 0.4) {
      const groove = new THREE.Mesh(
        new THREE.BoxGeometry(doorWidth - 0.1, 0.015, doorThick + 0.01),
        this.materials.goldAccent
      );
      groove.position.set(0, y, 0);
      groove.userData.role = 'gold';
      panelGroup.add(groove);
    }

    // Vertical Warm Ambient LED Strip
    const ledStrip = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, doorHeight - 0.2, doorThick + 0.02),
      this.materials.ledLight
    );
    ledStrip.position.set(-doorWidth * 0.25, doorHeight / 2, 0);
    ledStrip.userData.role = 'led';
    panelGroup.add(ledStrip);

    // Full-height Luxury Vertical Pull Handle (Brushed Gold)
    const handleBar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 2.0, 24),
      this.materials.goldAccent
    );
    handleBar.position.set(-doorWidth * 0.36, doorHeight * 0.45, doorThick / 2 + 0.07);
    handleBar.castShadow = true;
    handleBar.userData.role = 'gold';
    panelGroup.add(handleBar);

    // Handle Mount Stems
    [doorHeight * 0.45 - 0.8, doorHeight * 0.45 + 0.8].forEach(my => {
      const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.018, 0.018, 0.07, 16),
        this.materials.goldAccent
      );
      stem.rotation.x = Math.PI / 2;
      stem.position.set(-doorWidth * 0.36, my, doorThick / 2 + 0.035);
      stem.userData.role = 'gold';
      panelGroup.add(stem);
    });

    // Top & Bottom Heavy Pivot Hinges
    [0.02, doorHeight - 0.02].forEach(py => {
      const hinge = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.045, 0.08, 24),
        this.materials.goldAccent
      );
      hinge.position.set(pivotOffsetX, py, 0);
      hinge.userData.role = 'gold';
      panelGroup.add(hinge);
    });

    this.pivotDoorWing.add(panelGroup);
    group.add(this.pivotDoorWing);
  }

  /* =========================================================================
     3D MODEL 3: INDUSTRIAL ROLLER SHUTTER (أنظمة الشتر الأوتوماتيكية)
     ========================================================================= */
  buildIndustrialShutter(group) {
    const width = 3.2;
    const height = 3.4;
    const boxHeight = 0.55;

    // Top Motor Hood / Shutter Drum Box
    const hoodGeo = new THREE.BoxGeometry(width + 0.3, boxHeight, 0.5);
    const hoodMesh = new THREE.Mesh(hoodGeo, this.materials.ironMain);
    hoodMesh.position.set(0, height + boxHeight / 2, 0);
    hoodMesh.castShadow = true;
    group.add(hoodMesh);

    // Gold Al-Itqan Badge on Top Hood
    const badge = new THREE.Mesh(
      new THREE.BoxGeometry(1.0, 0.16, 0.52),
      this.materials.goldAccent
    );
    badge.position.set(0, height + boxHeight / 2, 0);
    badge.userData.role = 'gold';
    group.add(badge);

    // Left & Right Side Guide Rails (مجاري الشتر الجانبية)
    [-width / 2 - 0.06, width / 2 + 0.06].forEach(rx => {
      const rail = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, height + 0.1, 0.2),
        this.materials.ironMain
      );
      rail.position.set(rx, height / 2, 0);
      rail.castShadow = true;
      group.add(rail);
    });

    // Horizontal Segmented Slats
    const slatHeight = 0.11;
    const slatCount = Math.floor(height / slatHeight);
    this.shutterSlats = [];

    for (let i = 0; i < slatCount; i++) {
      const slatMesh = new THREE.Mesh(
        new THREE.BoxGeometry(width, slatHeight - 0.008, 0.04),
        this.materials.ironMain
      );
      const originalY = height - (i + 0.5) * slatHeight;
      slatMesh.position.set(0, originalY, 0);
      slatMesh.castShadow = true;
      slatMesh.userData.originalY = originalY;
      slatMesh.userData.index = i;
      this.shutterSlats.push(slatMesh);
      group.add(slatMesh);
    }

    // Heavy Bottom Extrusion with Rubber Seal
    const btmExtrusion = new THREE.Mesh(
      new THREE.BoxGeometry(width, 0.14, 0.06),
      this.materials.goldAccent
    );
    btmExtrusion.position.set(0, 0.07, 0);
    btmExtrusion.userData.role = 'gold';
    btmExtrusion.userData.originalY = 0.07;
    this.shutterSlats.push(btmExtrusion);
    group.add(btmExtrusion);
  }

  updateCameraPosition() {
    const x = this.currentDistance * Math.sin(this.currentRotation.y) * Math.cos(this.currentRotation.x);
    const y = this.currentDistance * Math.sin(this.currentRotation.x) + 1.6;
    const z = this.currentDistance * Math.cos(this.currentRotation.y) * Math.cos(this.currentRotation.x);
    this.camera.position.set(x, y, z);
    this.camera.lookAt(0, 1.6, 0);
  }

  bindEvents() {
    const el = this.renderer.domElement;

    // Mouse / Touch Drag Orbit and Multi-Touch Pinch to Zoom
    const onPointerDown = (e) => {
      if (e.touches && e.touches.length === 2) {
        // Pinch start
        this.isDragging = false;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        this.initialPinchDistance = Math.hypot(dx, dy);
        return;
      }

      this.isDragging = true;
      this.initialPinchDistance = null;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      this.previousMousePosition = { x: clientX, y: clientY };
    };

    const onPointerMove = (e) => {
      // Handle 2-finger pinch zoom on mobile/tablet
      if (e.touches && e.touches.length === 2) {
        if (e.cancelable) e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const currentDistance = Math.hypot(dx, dy);

        if (this.initialPinchDistance) {
          const delta = (this.initialPinchDistance - currentDistance) * 0.015;
          this.targetDistance += delta;
          this.targetDistance = Math.max(3.2, Math.min(10.5, this.targetDistance));
        }
        this.initialPinchDistance = currentDistance;
        return;
      }

      if (!this.isDragging) return;
      if (e.cancelable && e.touches) e.preventDefault();

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - this.previousMousePosition.x;
      const deltaY = clientY - this.previousMousePosition.y;

      const sensitivity = e.touches ? 0.009 : 0.007;
      this.targetRotation.y -= deltaX * sensitivity;
      this.targetRotation.x += deltaY * sensitivity;
      this.targetRotation.x = Math.max(-0.25, Math.min(0.88, this.targetRotation.x));

      this.previousMousePosition = { x: clientX, y: clientY };
    };

    const onPointerUp = (e) => {
      if (e.touches && e.touches.length === 1) {
        // One finger still down
        this.isDragging = true;
        this.initialPinchDistance = null;
        this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else {
        this.isDragging = false;
        this.initialPinchDistance = null;
      }
    };

    // Mouse Listeners
    el.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    // Touch Listeners with non-passive handling to smoothly lock 3D canvas control
    el.addEventListener('touchstart', onPointerDown, { passive: true });
    el.addEventListener('touchmove', onPointerMove, { passive: false });
    window.addEventListener('touchend', onPointerUp, { passive: true });
    window.addEventListener('touchcancel', onPointerUp, { passive: true });

    // Zoom on wheel
    el.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.targetDistance += e.deltaY * 0.005;
      this.targetDistance = Math.max(3.2, Math.min(10.5, this.targetDistance));
    }, { passive: false });

    // Resize Handler
    const handleResize = () => {
      if (!this.container || !this.renderer || !this.camera) return;
      const rect = this.container.getBoundingClientRect();
      this.camera.aspect = (rect.width || 800) / (rect.height || 500);
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(rect.width || 800, rect.height || 500);
    };

    window.addEventListener('resize', handleResize);
    
    // Also observe container size changes (e.g., orientation change or responsive layout shifts)
    if (window.ResizeObserver) {
      const ro = new ResizeObserver(() => handleResize());
      ro.observe(this.container);
    }
  }

  animate() {
    this.animationFrameId = requestAnimationFrame(this.animate);

    // Auto rotate slowly if enabled and not interacting
    if (this.autoRotate && !this.isDragging) {
      this.targetRotation.y += 0.0025;
    }

    // Smooth Damping for Camera Rotation & Zoom
    this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * 0.08;
    this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * 0.08;
    this.currentDistance += (this.targetDistance - this.currentDistance) * 0.08;
    this.updateCameraPosition();

    // 3D Gate Open / Close Interpolation Animation
    const targetProgress = this.isOpen ? 1 : 0;
    this.gateAnimProgress += (targetProgress - this.gateAnimProgress) * 0.06;

    if (this.currentModelType === 'palaceGate' && this.leftWing && this.rightWing) {
      const openAngle = (Math.PI * 0.55) * this.gateAnimProgress;
      this.leftWing.rotation.y = openAngle;
      this.rightWing.rotation.y = -openAngle;
    } else if (this.currentModelType === 'pivotDoor' && this.pivotDoorWing) {
      const openAngle = (Math.PI * 0.5) * this.gateAnimProgress;
      this.pivotDoorWing.rotation.y = -openAngle;
    } else if (this.currentModelType === 'shutter' && this.shutterSlats.length > 0) {
      const maxLift = 2.8;
      const lift = maxLift * this.gateAnimProgress;
      this.shutterSlats.forEach((slat, idx) => {
        const origY = slat.userData.originalY;
        // As it lifts, slats bundle up into top hood
        const newY = Math.min(3.4, origY + lift);
        slat.position.y = newY;
        if (newY >= 3.35) {
          slat.scale.set(0.001, 0.001, 0.001); // rolled in
        } else {
          slat.scale.set(1, 1, 1);
        }
      });
    }

    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}
