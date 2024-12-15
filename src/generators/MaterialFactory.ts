import * as THREE from 'three';
import { BiomeType } from '@/types/nodes';
import { MaterialParameters } from '@/types/parameters';

export class MaterialFactory {
  private static readonly biomeColors: Record<BiomeType, number> = {
    forest: 0x228b22,  // Forest green
    desert: 0xdeb887,  // Sand color
    ocean: 0x4682b4    // Ocean blue
  };

  private static readonly biomeMaterials: Map<BiomeType, THREE.Material> = new Map();
  private static readonly transitionMaterials: Map<string, THREE.Material> = new Map();

  static createMaterialForBiome(biome: BiomeType, params?: MaterialParameters): THREE.Material {
    // Check cache first
    if (this.biomeMaterials.has(biome)) {
      return this.biomeMaterials.get(biome)!.clone();
    }

    const color = this.biomeColors[biome];
    const material = new THREE.MeshStandardMaterial({
      color,
      roughness: params?.roughness ?? 0.7,
      metalness: params?.metalness ?? 0.1,
      envMapIntensity: 1.0
    });

    // Add biome-specific properties
    switch (biome) {
      case 'forest':
        material.roughness = 0.8;
        material.metalness = 0.1;
        break;
      case 'desert':
        material.roughness = 0.9;
        material.metalness = 0.05;
        break;
      case 'ocean':
        material.roughness = 0.4;
        material.metalness = 0.3;
        break;
    }

    this.biomeMaterials.set(biome, material);
    return material.clone();
  }

  static createRandomVariation(baseMaterial: THREE.Material): THREE.Material {
    const material = (baseMaterial as THREE.MeshStandardMaterial).clone();
    const color = new THREE.Color(material.color.getHex());
    
    const { h, s, l } = { h: 0, s: 0, l: 0 };
    color.getHSL({ h, s, l });
    
    const saturation = s * (0.9 + Math.random() * 0.2);
    const lightness = l * (0.9 + Math.random() * 0.2);
    
    material.color.setHSL(h, saturation, lightness);
    return material;
  }

  static blendMaterials(fromBiome: BiomeType, toBiome: BiomeType, factor: number): THREE.Material {
    const key = `${fromBiome}-${toBiome}-${factor.toFixed(2)}`;
    
    // Check cache first
    if (this.transitionMaterials.has(key)) {
      return this.transitionMaterials.get(key)!.clone();
    }

    const fromMaterial = this.createMaterialForBiome(fromBiome) as THREE.MeshStandardMaterial;
    const toMaterial = this.createMaterialForBiome(toBiome) as THREE.MeshStandardMaterial;

    const blendedMaterial = new THREE.MeshStandardMaterial();
    
    // Blend colors
    const fromColor = new THREE.Color(fromMaterial.color.getHex());
    const toColor = new THREE.Color(toMaterial.color.getHex());
    blendedMaterial.color.lerpColors(fromColor, toColor, factor);

    // Blend material properties
    blendedMaterial.roughness = THREE.MathUtils.lerp(
      fromMaterial.roughness,
      toMaterial.roughness,
      factor
    );
    blendedMaterial.metalness = THREE.MathUtils.lerp(
      fromMaterial.metalness,
      toMaterial.metalness,
      factor
    );

    // Cache the result
    if (this.transitionMaterials.size > 100) {
      // Clear cache if it gets too large
      this.transitionMaterials.clear();
    }
    this.transitionMaterials.set(key, blendedMaterial);

    return blendedMaterial.clone();
  }

  static clearCache(): void {
    this.biomeMaterials.clear();
    this.transitionMaterials.clear();
  }
} 