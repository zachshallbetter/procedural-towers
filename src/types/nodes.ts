import * as THREE from 'three';

export type BiomeType = 'forest' | 'desert' | 'ocean';

export type NodeShape = 'cube' | 'cylinder' | 'sphere' | 'cone' | 'torus';

export interface NodeSize {
  width: number;
  height: number;
  depth: number;
}

export interface Node {
  shape: NodeShape;
  size: NodeSize;
  position?: THREE.Vector3;
  rotation?: THREE.Euler;
  material?: THREE.Material;
  userData?: Record<string, any>;
}

export interface NodeDecoration {
  type: string;
  position: THREE.Vector3;
  scale: number;
  rotation?: THREE.Euler;
  material?: THREE.Material;
  userData?: Record<string, any>;
}

// Tower type definitions
export interface TowerConfig {
  name: string;
  description: string;
  biome: BiomeType;
  baseShape: NodeShape;
  heightRange: {
    min: number;
    max: number;
  };
  sizeVariation: {
    width: number;
    height: number;
    depth: number;
  };
  decorationDensity: number;
  stackPattern: StackPattern;
  materialProperties?: {
    roughness?: number;
    metalness?: number;
    opacity?: number;
  };
}

export type StackPattern = 'alternating' | 'clustered' | 'spiral' | 'random';

export interface TowerState {
  currentHeight: number;
  totalHeight: number;
  nodes: Node[];
  decorations: NodeDecoration[];
  biome: BiomeType;
  stackPattern: StackPattern;
}
