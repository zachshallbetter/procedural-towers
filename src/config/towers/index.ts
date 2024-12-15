import { BiomeType, TowerConfig } from '@/types/nodes';

// Core Tower Types
const coreTowers: Record<BiomeType, TowerConfig[]> = {
  forest: [{
    name: 'Ancient Ruin',
    description: 'Weathered stone tower reclaimed by nature',
    biome: 'forest',
    baseShape: 'cube',
    heightRange: { min: 4, max: 8 },
    sizeVariation: { width: 0.3, height: 0.2, depth: 0.3 },
    decorationDensity: 1.5,
    stackPattern: 'random',
    materialProperties: {
      roughness: 0.9,
      metalness: 0.05,
      opacity: 1.0
    }
  }, {
    name: 'Overgrown Spire',
    description: 'Tall tower with vegetation growing through cracks',
    biome: 'forest',
    baseShape: 'cylinder',
    heightRange: { min: 10, max: 15 },
    sizeVariation: { width: 0.2, height: 0.3, depth: 0.2 },
    decorationDensity: 2.0,
    stackPattern: 'alternating',
    materialProperties: {
      roughness: 0.8,
      metalness: 0.1
    }
  }],
  desert: [{
    name: 'Sandstone Pillar',
    description: 'Wind-carved tower of ancient sandstone',
    biome: 'desert',
    baseShape: 'cube',
    heightRange: { min: 6, max: 12 },
    sizeVariation: { width: 0.15, height: 0.2, depth: 0.15 },
    decorationDensity: 0.5,
    stackPattern: 'alternating',
    materialProperties: {
      roughness: 0.95,
      metalness: 0.02
    }
  }, {
    name: 'Desert Temple',
    description: 'Sacred structure with geometric patterns',
    biome: 'desert',
    baseShape: 'cylinder',
    heightRange: { min: 8, max: 14 },
    sizeVariation: { width: 0.25, height: 0.2, depth: 0.25 },
    decorationDensity: 0.8,
    stackPattern: 'spiral',
    materialProperties: {
      roughness: 0.7,
      metalness: 0.1
    }
  }],
  ocean: [{
    name: 'Coral Spire',
    description: 'Living tower of coral and sea life',
    biome: 'ocean',
    baseShape: 'cylinder',
    heightRange: { min: 5, max: 10 },
    sizeVariation: { width: 0.25, height: 0.2, depth: 0.25 },
    decorationDensity: 1.8,
    stackPattern: 'random',
    materialProperties: {
      roughness: 0.4,
      metalness: 0.3,
      opacity: 0.9
    }
  }, {
    name: 'Sunken Ruin',
    description: 'Ancient structure claimed by the sea',
    biome: 'ocean',
    baseShape: 'cube',
    heightRange: { min: 4, max: 8 },
    sizeVariation: { width: 0.3, height: 0.25, depth: 0.3 },
    decorationDensity: 1.5,
    stackPattern: 'alternating',
    materialProperties: {
      roughness: 0.8,
      metalness: 0.1,
      opacity: 0.95
    }
  }]
};

// Unique Tower Types
const uniqueTowers: Record<BiomeType, TowerConfig[]> = {
  forest: [{
    name: 'Hanging Gardens',
    description: 'Terraced tower with cascading vegetation',
    biome: 'forest',
    baseShape: 'cube',
    heightRange: { min: 8, max: 12 },
    sizeVariation: { width: 0.4, height: 0.2, depth: 0.4 },
    decorationDensity: 2.5,
    stackPattern: 'alternating',
    materialProperties: {
      roughness: 0.85,
      metalness: 0.05
    }
  }],
  desert: [{
    name: 'Mirage Tower',
    description: 'Shimmering structure with ethereal properties',
    biome: 'desert',
    baseShape: 'torus',
    heightRange: { min: 7, max: 14 },
    sizeVariation: { width: 0.3, height: 0.3, depth: 0.3 },
    decorationDensity: 0.6,
    stackPattern: 'spiral',
    materialProperties: {
      roughness: 0.2,
      metalness: 0.8,
      opacity: 0.7
    }
  }],
  ocean: [{
    name: 'Crystal Grotto',
    description: 'Crystalline formation with bioluminescent elements',
    biome: 'ocean',
    baseShape: 'sphere',
    heightRange: { min: 6, max: 10 },
    sizeVariation: { width: 0.35, height: 0.35, depth: 0.35 },
    decorationDensity: 1.2,
    stackPattern: 'random',
    materialProperties: {
      roughness: 0.3,
      metalness: 0.6,
      opacity: 0.8
    }
  }]
};

// Combine all tower types
export const towerConfigs: Record<BiomeType, TowerConfig[]> = {
  forest: [...coreTowers.forest, ...uniqueTowers.forest],
  desert: [...coreTowers.desert, ...uniqueTowers.desert],
  ocean: [...coreTowers.ocean, ...uniqueTowers.ocean]
}; 