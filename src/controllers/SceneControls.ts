import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class SceneControls {
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private domElement: HTMLElement;

  constructor(camera: THREE.PerspectiveCamera, domElement: HTMLElement) {
    this.camera = camera;
    this.domElement = domElement;
    this.controls = new OrbitControls(camera, domElement);
    this.setupControls();
    this.setupEventListeners();
  }

  private setupControls(): void {
    // Basic setup
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;

    // Distance limits
    this.controls.minDistance = 2;
    this.controls.maxDistance = 50;

    // Angle limits
    this.controls.minPolarAngle = 0;
    this.controls.maxPolarAngle = Math.PI * 0.85;

    // Enable all control types
    this.controls.enableZoom = true;
    this.controls.enableRotate = true;
    this.controls.enablePan = true;

    // Configure speeds
    this.controls.zoomSpeed = 1.0;
    this.controls.rotateSpeed = 1.0;
    this.controls.panSpeed = 1.0;

    // Use proper screen space panning
    this.controls.screenSpacePanning = true;

    // Configure mouse buttons using THREE.MOUSE enum
    this.controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.PAN
    };

    // Configure touch gestures
    this.controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN
    };

    // Set initial target and position
    this.controls.target.set(0, 5, 0);
    this.camera.position.set(15, 10, 15);
  }

  private setupEventListeners(): void {
    // Handle mouse wheel for faster zooming when holding shift
    this.domElement.addEventListener('wheel', (event) => {
      if (event.shiftKey) {
        this.controls.zoomSpeed = 2.0;
      } else {
        this.controls.zoomSpeed = 1.0;
      }
    }, { passive: true });

    // Prevent context menu on right click
    this.domElement.addEventListener('contextmenu', (event) => {
      event.preventDefault();
    });

    // Handle keyboard shortcuts
    window.addEventListener('keydown', (event) => {
      switch (event.code) {
        case 'KeyR':
          this.resetCamera();
          break;
        case 'KeyT':
          this.controls.autoRotate = !this.controls.autoRotate;
          break;
      }
    });
  }

  public update(): void {
    this.controls.update();
  }

  public resetCamera(): void {
    this.camera.position.set(15, 10, 15);
    this.controls.target.set(0, 5, 0);
    this.controls.update();
  }

  public focusOnObject(object: THREE.Object3D): void {
    const boundingBox = new THREE.Box3().setFromObject(object);
    const center = boundingBox.getCenter(new THREE.Vector3());
    const size = boundingBox.getSize(new THREE.Vector3());
    
    // Calculate ideal camera position
    const distance = Math.max(size.x, size.y, size.z) * 2;
    const direction = this.camera.position.clone().sub(center).normalize();
    
    // Set new target and position
    this.controls.target.copy(center);
    this.camera.position.copy(center.clone().add(direction.multiplyScalar(distance)));
    this.controls.update();
  }

  public handleWindowResize(width: number, height: number): void {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  public dispose(): void {
    this.controls.dispose();
  }
} 