/**
 * phone-3d-showcase.ts
 * Modern Premium Smartphone Mockup on Matte Black Geometric Stone Podium Block
 * Built with Three.js & TypeScript
 * 
 * Features:
 * - Minimalist studio environment with sophisticated dark charcoal gray lighting
 * - Sleek matte black geometric stone podium block
 * - Photorealistic smartphone chassis with titanium / dark chrome trim
 * - Dynamic Canvas-based screen texture mapping with real-time Admin CRUD updates
 * - Interactive cursor-driven 3D perspective tilt & smooth floating animation
 */

import * as THREE from 'three';

export interface Phone3DConfig {
  containerId: string;
  canvasId: string;
  initialScreenTitle?: string;
  initialScreenSubtitle?: string;
  initialScreenBg?: string;
  initialScreenImage?: string | null;
}

export class Phone3DShowcase {
  private container: HTMLElement;
  private canvas: HTMLCanvasElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  
  private phoneGroup: THREE.Group;
  private screenMesh: THREE.Mesh;
  private screenTexture: THREE.CanvasTexture;
  private screenCanvas: HTMLCanvasElement;
  private screenCtx: CanvasRenderingContext2D;
  
  private podiumMesh: THREE.Mesh;
  private shadowPlane: THREE.Mesh;
  
  private targetRotationX: number = 0;
  private targetRotationY: number = 0;
  private currentRotationX: number = 0;
  private currentRotationY: number = 0;
  private isAutoRotating: boolean = false;
  private autoRotateAngle: number = 0;
  private clock: THREE.Clock;
  private animationFrameId: number | null = null;

  constructor(config: Phone3DConfig) {
    const cont = document.getElementById(config.containerId);
    const canv = document.getElementById(config.canvasId) as HTMLCanvasElement;
    
    if (!cont || !canv) {
      throw new Error(`Container #${config.containerId} or Canvas #${config.canvasId} not found.`);
    }

    this.container = cont;
    this.canvas = canv;
    this.clock = new THREE.Clock();

    // 1. Initialize Scene, Camera, Renderer
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0e1116);
    this.scene.fog = new THREE.FogExp2(0x0e1116, 0.14);

    const width = this.container.clientWidth || 800;
    const height = this.container.clientHeight || 600;

    this.camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    this.camera.position.set(0, 0.35, 4.2);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 2. Setup Lighting matching the architectural studio prompt
    this.setupLighting();

    // 3. Build Stone Podium & Floor Shadow
    this.buildPodium();

    // 4. Build Smartphone Chassis & Dynamic Screen Texture
    this.buildScreenCanvas(config);
    this.buildSmartphone();

    // 5. Attach Mouse / Touch Event Listeners for 3D Perspective Tilt
    this.initEventListeners();

    // 6. Start Render Loop
    this.render();
  }

  private setupLighting(): void {
    // Soft Ambient Studio Fill
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.55);
    this.scene.add(ambientLight);

    // Main Architectural Directional Side Light (Soft Cast Shadows)
    const sideLight = new THREE.DirectionalLight(0xfff5eb, 1.9);
    sideLight.position.set(3.8, 4.5, 3.2);
    sideLight.castShadow = true;
    sideLight.shadow.mapSize.width = 2048;
    sideLight.shadow.mapSize.height = 2048;
    sideLight.shadow.camera.near = 0.5;
    sideLight.shadow.camera.far = 15;
    sideLight.shadow.bias = -0.001;
    this.scene.add(sideLight);

    // Cool Architectural Rim Light from Opposite Side
    const rimLight = new THREE.DirectionalLight(0x7da4d6, 0.95);
    rimLight.position.set(-4.2, 2.8, -2.2);
    this.scene.add(rimLight);

    // Subtle Front Center Highlight
    const frontFill = new THREE.PointLight(0xffffff, 0.45, 12);
    frontFill.position.set(0, 1.2, 3.5);
    this.scene.add(frontFill);
  }

  private buildPodium(): void {
    // Sleek Matte Black Geometric Stone Podium Block
    const podiumGeo = new THREE.BoxGeometry(2.35, 0.42, 1.75);
    const podiumMat = new THREE.MeshStandardMaterial({
      color: 0x16181d,
      roughness: 0.88,
      metalness: 0.12
    });

    this.podiumMesh = new THREE.Mesh(podiumGeo, podiumMat);
    this.podiumMesh.position.set(0, -0.68, 0);
    this.podiumMesh.receiveShadow = true;
    this.podiumMesh.castShadow = true;
    this.scene.add(this.podiumMesh);

    // Beveled accent base plate
    const basePlateGeo = new THREE.BoxGeometry(2.5, 0.08, 1.9);
    const basePlateMat = new THREE.MeshStandardMaterial({
      color: 0x101216,
      roughness: 0.92,
      metalness: 0.08
    });
    const basePlate = new THREE.Mesh(basePlateGeo, basePlateMat);
    basePlate.position.set(0, -0.92, 0);
    basePlate.receiveShadow = true;
    this.scene.add(basePlate);

    // Floor Shadow Plane
    const shadowGeo = new THREE.PlaneGeometry(8, 8);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.45 });
    this.shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    this.shadowPlane.rotation.x = -Math.PI / 2;
    this.shadowPlane.position.y = -0.97;
    this.shadowPlane.receiveShadow = true;
    this.scene.add(this.shadowPlane);
  }

  private buildScreenCanvas(config: Phone3DConfig): void {
    this.screenCanvas = document.createElement('canvas');
    this.screenCanvas.width = 720;
    this.screenCanvas.height = 1560;
    this.screenCtx = this.screenCanvas.getContext('2d')!;

    this.updateScreenTexture(
      config.initialScreenTitle || 'Creamy Tiramitsu 10k',
      config.initialScreenSubtitle || 'Feed & Poster Produk Haltea',
      config.initialScreenBg || '#1D4ED8',
      config.initialScreenImage || null
    );

    this.screenTexture = new THREE.CanvasTexture(this.screenCanvas);
    this.screenTexture.generateMipmaps = true;
    this.screenTexture.minFilter = THREE.LinearMipmapLinearFilter;
  }

  public updateScreenTexture(title: string, subtitle: string, bg: string, imgUrl: string | null = null): void {
    const ctx = this.screenCtx;
    const w = this.screenCanvas.width;
    const h = this.screenCanvas.height;

    // Background Fill
    ctx.fillStyle = bg || '#1D4ED8';
    ctx.fillRect(0, 0, w, h);

    if (imgUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        ctx.drawImage(img, 0, 0, w, h);
        this.renderScreenUIOverlay(title, subtitle);
        if (this.screenTexture) this.screenTexture.needsUpdate = true;
      };
      img.src = imgUrl;
    } else {
      // Abstract Studio Design Pattern for Screen
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, bg || '#1D4ED8');
      grad.addColorStop(1, '#090B10');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Geometric Graphic Accents
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 220, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 340, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      this.renderScreenUIOverlay(title, subtitle);
      if (this.screenTexture) this.screenTexture.needsUpdate = true;
    }
  }

  private renderScreenUIOverlay(title: string, subtitle: string): void {
    const ctx = this.screenCtx;
    const w = this.screenCanvas.width;
    const h = this.screenCanvas.height;

    // Top Status Bar
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 36px Inter, sans-serif';
    ctx.fillText('10:09', 60, 85);

    // Battery & Wifi icons
    ctx.fillText('5G ●●● 100%', w - 240, 85);

    // Instagram Header Bar
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.fillRect(0, 120, w, 110);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 38px Inter, sans-serif';
    ctx.fillText('@halteaindonesia', 60, 190);

    ctx.fillStyle = '#38BDF8';
    ctx.font = 'bold 30px Inter, sans-serif';
    ctx.fillText('✓ Verified', 440, 190);

    // Center Card Information Box
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.roundRect ? ctx.roundRect(50, h - 420, w - 100, 260, 32) : ctx.fillRect(50, h - 420, w - 100, 260);
    ctx.fill();

    ctx.fillStyle = '#F59E0B';
    ctx.font = 'bold 28px "JetBrains Mono", monospace';
    ctx.fillText('PORTFOLIO KARYA DIGITAL', 90, h - 350);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'extrabold 48px Outfit, sans-serif';
    ctx.fillText(title.length > 22 ? title.slice(0, 20) + '...' : title, 90, h - 280);

    ctx.fillStyle = '#D1D5DB';
    ctx.font = '32px Inter, sans-serif';
    ctx.fillText(subtitle, 90, h - 215);

    // Bottom Home Indicator Bar
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(w / 2 - 130, h - 45, 260, 12, 6) : ctx.fillRect(w / 2 - 130, h - 45, 260, 12);
    ctx.fill();
  }

  private buildSmartphone(): void {
    this.phoneGroup = new THREE.Group();

    const phoneW = 1.08;
    const phoneH = 2.24;
    const phoneD = 0.10;

    // 1. Titanium / Dark Chrome Metallic Outer Chassis
    const chassisGeo = new THREE.BoxGeometry(phoneW, phoneH, phoneD);
    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0x22262e,
      metalness: 0.85,
      roughness: 0.25
    });
    const chassisMesh = new THREE.Mesh(chassisGeo, chassisMat);
    chassisMesh.castShadow = true;
    this.phoneGroup.add(chassisMesh);

    // 2. Bezel Border Trim
    const bezelGeo = new THREE.PlaneGeometry(phoneW - 0.04, phoneH - 0.04);
    const bezelMat = new THREE.MeshBasicMaterial({ color: 0x050608 });
    const bezelMesh = new THREE.Mesh(bezelGeo, bezelMat);
    bezelMesh.position.set(0, 0, phoneD / 2 + 0.001);
    this.phoneGroup.add(bezelMesh);

    // 3. Dynamic Display Screen
    const screenGeo = new THREE.PlaneGeometry(phoneW - 0.09, phoneH - 0.09);
    const screenMat = new THREE.MeshBasicMaterial({
      map: this.screenTexture
    });
    this.screenMesh = new THREE.Mesh(screenGeo, screenMat);
    this.screenMesh.position.set(0, 0, phoneD / 2 + 0.003);
    this.phoneGroup.add(this.screenMesh);

    // 4. Punch-hole Selfie Camera / Dynamic Island
    const islandGeo = new THREE.PlaneGeometry(0.18, 0.04);
    const islandMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const islandMesh = new THREE.Mesh(islandGeo, islandMat);
    islandMesh.position.set(0, (phoneH / 2) - 0.12, phoneD / 2 + 0.005);
    this.phoneGroup.add(islandMesh);

    // Standing Vertically on Podium
    this.phoneGroup.position.set(0, 0.52, 0);
    this.scene.add(this.phoneGroup);
  }

  private initEventListeners(): void {
    // Mouse Move Tilt within Container
    this.container.addEventListener('mousemove', (e: MouseEvent) => {
      const rect = this.container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      this.targetRotationY = (x - 0.5) * 0.75;
      this.targetRotationX = (y - 0.5) * 0.45;
    });

    this.container.addEventListener('mouseleave', () => {
      this.targetRotationX = 0;
      this.targetRotationY = 0;
    });

    // Touch Support for Mobile
    this.container.addEventListener('touchmove', (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = this.container.getBoundingClientRect();
        const x = (e.touches[0].clientX - rect.left) / rect.width;
        const y = (e.touches[0].clientY - rect.top) / rect.height;

        this.targetRotationY = (x - 0.5) * 0.75;
        this.targetRotationX = (y - 0.5) * 0.45;
      }
    }, { passive: true });

    // Window Resize
    window.addEventListener('resize', () => {
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      if (w > 0 && h > 0) {
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);
      }
    });
  }

  public trigger360Rotate(): void {
    this.isAutoRotating = true;
    this.autoRotateAngle = 0;
  }

  private render = (): void => {
    this.animationFrameId = requestAnimationFrame(this.render);

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    if (this.phoneGroup) {
      if (this.isAutoRotating) {
        this.autoRotateAngle += delta * 4.2;
        this.phoneGroup.rotation.y = this.autoRotateAngle;
        if (this.autoRotateAngle >= Math.PI * 2) {
          this.isAutoRotating = false;
          this.phoneGroup.rotation.y = 0;
        }
      } else {
        // Damped Smooth Interpolation
        this.currentRotationX += (this.targetRotationX - this.currentRotationX) * 0.08;
        this.currentRotationY += (this.targetRotationY - this.currentRotationY) * 0.08;

        this.phoneGroup.rotation.x = this.currentRotationX;
        this.phoneGroup.rotation.y = this.currentRotationY;
      }

      // Subtle living floating levitation
      this.phoneGroup.position.y = 0.52 + Math.sin(elapsedTime * 1.8) * 0.025;
    }

    this.renderer.render(this.scene, this.camera);
  };

  public destroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.renderer.dispose();
  }
}
