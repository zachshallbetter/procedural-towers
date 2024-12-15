import * as dat from 'dat.gui';
import { defaultParameters } from '@/config/parameters';
import { towerConfigs } from '@/config/towers';
import type { SceneParameters } from '@/types/parameters';
import type { BiomeType, TowerConfig } from '@/types/nodes';

// Extended type declarations for dat.GUI internals
interface DatController extends dat.GUIController {
  title(tooltip: string): this;
  name(name: string): this;
  onChange(fn: (value: unknown) => void): this;
  listen(): this;
  updateDisplay(): this;
}

interface DatFolder extends Omit<dat.GUI, '__controllers' | '__folders'> {
  __controllers: DatController[];
  __folders: Record<string, DatFolder>;
}

export class ParameterController {
  private readonly gui: dat.GUI;
  private parameters: SceneParameters;
  private currentTowerConfig: TowerConfig;
  private readonly onParameterChange: () => void;
  private readonly towerFolder: dat.GUI;
  private readonly materialFolder: dat.GUI;

  constructor(onParameterChange: () => void) {
    this.parameters = structuredClone(defaultParameters);
    this.onParameterChange = onParameterChange;
    this.currentTowerConfig = towerConfigs[this.parameters.currentBiome][0];
    this.gui = new dat.GUI({ width: 320 });
    
    // Initialize folders
    this.towerFolder = this.gui.addFolder('Tower Generator');
    const advancedFolder = this.gui.addFolder('Advanced Settings');
    this.materialFolder = advancedFolder.addFolder('Material Properties');
    
    this.setupGUI();
  }

  private setupGUI(): void {
    this.setupMainControls();
    this.setupAdvancedControls();
  }

  private setupMainControls(): void {
    // Biome selection
    this.towerFolder.add(this.parameters, 'currentBiome', {
      'Forest 🌲': 'forest',
      'Desert 🏜️': 'desert',
      'Ocean 🌊': 'ocean'
    })
    .name('Environment')
    .onChange((biome: BiomeType) => {
      this.updateTowerList(biome);
      this.onParameterChange();
    });

    // Tower selection will be added dynamically
    this.updateTowerList(this.parameters.currentBiome);
    this.towerFolder.open();

    // Quick Actions
    const quickActions = {
      regenerate: () => this.onParameterChange(),
      resetSettings: () => this.resetToDefaults()
    };
    this.towerFolder.add(quickActions, 'regenerate')
      .name('🎲 Generate New Tower');
    this.towerFolder.add(quickActions, 'resetSettings')
      .name('↺ Reset Settings');
  }

  private setupAdvancedControls(): void {
    // Get the advanced folder directly from __folders
    const advancedFolder = (this.gui as unknown as DatFolder).__folders['Advanced Settings'];
    
    // Size controls
    const sizeFolder = advancedFolder.addFolder('Size Adjustments');
    sizeFolder.add(this.parameters.tower.height, 'min', 1, 20, 1)
      .name('Min Height')
      .onChange(this.onParameterChange);
    sizeFolder.add(this.parameters.tower.height, 'max', 1, 20, 1)
      .name('Max Height')
      .onChange(this.onParameterChange);
    
    // Pattern controls
    const patternFolder = advancedFolder.addFolder('Pattern Settings');
    patternFolder.add(this.parameters.tower, 'stackPattern', {
      'Alternating Layers': 'alternating',
      'Clustered Groups': 'clustered',
      'Spiral Formation': 'spiral',
      'Random Placement': 'random'
    })
    .name('Stack Pattern')
    .onChange(this.onParameterChange);
    
    patternFolder.add(this.parameters.tower, 'decorationDensity', 0, 2, 0.1)
      .name('Decoration Amount')
      .onChange(this.onParameterChange);

    // Material controls
    this.setupMaterialControls();

    // Animation controls
    this.setupAnimationControls(advancedFolder);
  }

  private setupMaterialControls(): void {
    this.materialFolder.add(this.parameters.material, 'roughness', 0, 1, 0.05)
      .name('Surface Roughness')
      .onChange(this.onParameterChange);
    this.materialFolder.add(this.parameters.material, 'metalness', 0, 1, 0.05)
      .name('Metallic Effect')
      .onChange(this.onParameterChange);
    this.materialFolder.add(this.parameters.material, 'opacity', 0, 1, 0.05)
      .name('Transparency')
      .onChange(this.onParameterChange);
  }

  private setupAnimationControls(parentFolder: dat.GUI): void {
    const animationFolder = parentFolder.addFolder('Animation Settings');
    animationFolder.add(this.parameters.animation, 'enabled')
      .name('Enable Animations')
      .onChange(this.onParameterChange);
    animationFolder.add(this.parameters.animation, 'speed', 0.1, 2, 0.1)
      .name('Animation Speed')
      .onChange(this.onParameterChange);
    animationFolder.add(this.parameters.animation, 'windStrength', 0, 1, 0.1)
      .name('Wind Effect')
      .onChange(this.onParameterChange);
  }

  private updateTowerList(biome: BiomeType): void {
    const towers = towerConfigs[biome];
    
    // Remove old tower selection if it exists
    const towerFolderDat = this.towerFolder as unknown as DatFolder;
    const oldController = towerFolderDat.__controllers.find(
      c => c.property === 'currentTower'
    );
    if (oldController) {
      this.towerFolder.remove(oldController as dat.GUIController);
    }

    // Create tower selection object with descriptions
    const towerOptions: Record<string, string> = {};
    towers.forEach(tower => {
      towerOptions[`${tower.name} - ${tower.description}`] = tower.name;
    });

    // Add new tower selection with descriptions
    const towerSelect = {
      currentTower: `${towers[0].name} - ${towers[0].description}`
    };

    this.towerFolder.add(towerSelect, 'currentTower', towerOptions)
      .name('Tower Type')
      .onChange((selection: string) => {
        const towerName = selection.split(' - ')[0];
        const newTower = towers.find(t => t.name === towerName);
        if (newTower) {
          this.currentTowerConfig = newTower;
          this.applyTowerConfig();
          this.onParameterChange();
        }
      });
  }

  private applyTowerConfig(): void {
    // Apply tower configuration to parameters
    this.parameters.node.shape = this.currentTowerConfig.baseShape;
    this.parameters.tower.height = this.currentTowerConfig.heightRange;
    this.parameters.tower.stackPattern = this.currentTowerConfig.stackPattern;
    this.parameters.tower.decorationDensity = this.currentTowerConfig.decorationDensity;

    if (this.currentTowerConfig.materialProperties) {
      Object.assign(this.parameters.material, this.currentTowerConfig.materialProperties);
      this.updateMaterialControllers();
    }
  }

  private updateMaterialControllers(): void {
    const materialFolderDat = this.materialFolder as unknown as DatFolder;
    materialFolderDat.__controllers.forEach(controller => {
      controller.updateDisplay();
    });
  }

  private resetToDefaults(): void {
    this.parameters = structuredClone(defaultParameters);
    this.currentTowerConfig = towerConfigs[this.parameters.currentBiome][0];
    this.gui.updateDisplay();
    this.onParameterChange();
  }

  public getCurrentTowerConfig(): TowerConfig {
    return this.currentTowerConfig;
  }

  public getParameters(): SceneParameters {
    return this.parameters;
  }

  public destroy(): void {
    this.gui.destroy();
  }
}