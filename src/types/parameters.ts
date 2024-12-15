import { BiomeType, NodeShape, StackPattern } from './nodes';

export interface MaterialParameters {
  roughness?: number;
  metalness?: number;
  opacity?: number;
  envMapIntensity?: number;
}

export interface NodeParameters {
  shape: NodeShape;
  size: {
    min: {
      width: number;
      height: number;
      depth: number;
    };
    max: {
      width: number;
      height: number;
      depth: number;
    };
  };
  material?: MaterialParameters;
}

export interface TowerParameters {
  height: {
    min: number;
    max: number;
  };
  stackPattern: StackPattern;
  decorationDensity: number;
}

export interface AnimationParameters {
  enabled: boolean;
  speed: number;
  windStrength: number;
}

export interface SceneParameters {
  currentBiome: BiomeType;
  node: NodeParameters;
  tower: TowerParameters;
  animation: AnimationParameters;
  material: MaterialParameters;
} 