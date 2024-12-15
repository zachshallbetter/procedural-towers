import * as THREE from 'three';
import { ParameterController } from './controllers/ParameterController';
import { NodeGenerator } from './generators/NodeGenerator';
import { DecorationGenerator } from './generators/DecorationGenerator';
import { MaterialFactory } from './generators/MaterialFactory';
import { SceneControls } from './controllers/SceneControls';
import type { BiomeType } from './types/nodes';

export class ProceduralScene {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private sceneControls: SceneControls;
  private parameterController: ParameterController;
  private currentTower: THREE.Group;
  private previousBiome: BiomeType;
  private biomeTransitionFactor: number = 0;

  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x111111);
    
    // Enhanced camera setup
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    // Enhanced renderer setup
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      logarithmicDepthBuffer: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    document.body.appendChild(this.renderer.domElement);

    // Initialize scene controls
    this.sceneControls = new SceneControls(this.camera, this.renderer.domElement);

    // Enhanced lighting
    this.setupLighting();

    // Enhanced grid helper
    const gridHelper = new THREE.GridHelper(20, 20);
    gridHelper.material.opacity = 0.2;
    gridHelper.material.transparent = true;
    this.scene.add(gridHelper);

    // Initialize parameter controller
    this.parameterController = new ParameterController(() => this.updateScene());
    this.currentTower = new THREE.Group();
    this.scene.add(this.currentTower);

    // Store initial biome
    this.previousBiome = this.parameterController.getParameters().currentBiome;

    // Generate initial tower
    this.generateTower();

    // Start animation loop
    this.animate();

    // Setup window resize handler
    window.addEventListener('resize', () => {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.sceneControls.handleWindowResize(window.innerWidth, window.innerHeight);
    });

    // Setup keyboard handler for tower generation
    window.addEventListener('keydown', (event) => {
      if (event.code === 'Space') {
        this.generateTower();
      } else if (event.code === 'KeyF') {
        this.sceneControls.focusOnObject(this.currentTower);
      }
    });
  }

  private setupLighting(): void {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(directionalLight);

    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.5);
    this.scene.add(hemisphereLight);
  }

  private animate(): void {
    requestAnimationFrame(() => this.animate());
    
    
    // Update controls
    this.sceneControls.update();
    
    // Render scene
    this.renderer.render(this.scene, this.camera);
  }

  private generateTower() {
    // Clear existing tower
    while (this.currentTower.children.length) {
      this.currentTower.remove(this.currentTower.children[0]);
    }

    const params = this.parameterController.getParameters();
    const towerHeight = Math.floor(
      params.tower.height.min +
        Math.random() * (params.tower.height.max - params.tower.height.min)
    );

    let currentHeight = 0;

    // Create object pool for decorations
    const decorationPool: THREE.Mesh[] = [];
    const getDecoration = (type: string): THREE.Mesh | undefined => {
      return decorationPool.find(d => !d.visible && d.userData.type === type);
    };

    for (let i = 0; i < towerHeight; i++) {
      const tierProgress = i / towerHeight;
      const scaleFactor = 1 - (tierProgress * 0.3);
      
      const size = {
        width: this.randomInRange(params.node.size.min.width, params.node.size.max.width) * scaleFactor,
        height: this.randomInRange(params.node.size.min.height, params.node.size.max.height) * scaleFactor,
        depth: this.randomInRange(params.node.size.min.depth, params.node.size.max.depth) * scaleFactor
      };

      // Handle material transitions
      let material: THREE.Material;
      if (this.biomeTransitionFactor > 0) {
        material = MaterialFactory.blendMaterials(
          this.previousBiome,
          params.currentBiome,
          this.biomeTransitionFactor
        );
      } else {
        material = MaterialFactory.createMaterialForBiome(params.currentBiome);
      }

      const node = NodeGenerator.generateNode(
        params.node.shape,
        size,
        params.currentBiome
      );
      node.material = material;

      const nodeMesh = NodeGenerator.createMesh(node);
      nodeMesh.position.y = currentHeight + (size.height / 2);
      nodeMesh.castShadow = true;
      nodeMesh.receiveShadow = true;

      // Add decorations with object pooling
      const decorations = DecorationGenerator.generateDecorations(node, params.currentBiome);
      decorations.forEach(decoration => {
        let decorationMesh = getDecoration(decoration.type);
        
        if (!decorationMesh) {
          decorationMesh = DecorationGenerator.createDecorationMesh(decoration);
          decorationPool.push(decorationMesh);
        }

        decorationMesh.visible = true;
        decorationMesh.position.copy(decoration.position);
        decorationMesh.scale.setScalar(decoration.scale);

        // Apply tier-specific adjustments
        if (tierProgress < 0.3) {
          decorationMesh.position.y -= size.height * 0.2;
          decorationMesh.scale.multiplyScalar(1.2);
        } else if (tierProgress > 0.7) {
          decorationMesh.position.y += size.height * 0.1;
          decorationMesh.scale.multiplyScalar(0.8);
        }

        // Apply biome-specific rules
        switch (params.currentBiome) {
          case 'forest':
            if (decoration.type === 'vine' && tierProgress > 0.5) {
              decorationMesh.scale.y *= 1.5;
              decorationMesh.position.y -= size.height * 0.1;
            }
            break;
          case 'ocean':
            if (decoration.type === 'coral' && tierProgress > 0.6) {
              decorationMesh.scale.y *= 1.3;
              decorationMesh.position.y += size.height * 0.1;
            }
            break;
          case 'desert':
            if (decoration.type === 'moss' && tierProgress < 0.4) {
              decorationMesh.scale.multiplyScalar(1.4);
            }
            break;
        }

        nodeMesh.add(decorationMesh);
      });

      // Apply stack pattern with tier variations
      switch (params.tower.stackPattern) {
        case 'alternating':
          const rotationAmount = Math.PI / 4 * (1 + tierProgress * 0.5);
          nodeMesh.rotation.y = i % 2 ? rotationAmount : -rotationAmount;
          break;
        case 'clustered':
          const angle = i * Math.PI / 4;
          const radius = 0.5 * (1 + tierProgress * 0.5);
          nodeMesh.position.x = Math.cos(angle) * radius;
          nodeMesh.position.z = Math.sin(angle) * radius;
          nodeMesh.rotation.x = (Math.random() - 0.5) * 0.1 * tierProgress;
          nodeMesh.rotation.z = (Math.random() - 0.5) * 0.1 * tierProgress;
          break;
      }

      // Add frustum culling
      nodeMesh.frustumCulled = true;

      this.currentTower.add(nodeMesh);
      currentHeight += size.height;
    }

    // Ensure tower sits on the ground plane
    this.currentTower.position.set(0, 0, 0);
    this.currentTower.rotation.set(0, 0, 0);

    // Clear unused decorations from pool
    decorationPool.forEach(decoration => {
      if (!decoration.parent) {
        decoration.visible = false;
      }
    });
  }

  private randomInRange(min: number, max: number): number {
    return min + Math.random() * (max - min);
  }

  private updateScene() {
    this.generateTower();
  }
}

// Create the scene when the page loads
new ProceduralScene();