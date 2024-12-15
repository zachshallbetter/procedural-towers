import { SceneParameters } from '@/types/parameters';

export const defaultParameters: SceneParameters = {
  currentBiome: 'forest',
  node: {
    shape: 'cube',
    size: {
      min: {
        width: 1,
        height: 1,
        depth: 1
      },
      max: {
        width: 2,
        height: 2,
        depth: 2
      }
    }
  },
  tower: {
    height: {
      min: 5,
      max: 10
    },
    stackPattern: 'alternating',
    decorationDensity: 1.0
  },
  animation: {
    enabled: true,
    speed: 1.0,
    windStrength: 1.0
  },
  material: {
    roughness: 0.7,
    metalness: 0.1,
    opacity: 1.0,
    envMapIntensity: 1.0
  }
};