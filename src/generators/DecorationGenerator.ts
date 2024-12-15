import * as THREE from 'three';
import { BiomeType, Node } from '@/types/nodes';
import { MaterialFactory } from './MaterialFactory';

interface Decoration {
  type: string;
  position: THREE.Vector3;
  scale: number;
  rotation?: THREE.Euler;
  color?: number;
}

export class DecorationGenerator {
  private static readonly decorationTypes = {
    forest: ['vine', 'moss', 'leaf', 'branch', 'mushroom'],
    desert: ['cactus', 'rock', 'moss', 'tumbleweed', 'crystal'],
    ocean: ['coral', 'seaweed', 'barnacle', 'shell', 'anemone']
  };

  private static readonly decorationGeometries: Map<string, THREE.BufferGeometry> = new Map();
  private static readonly decorationMaterials: Map<string, THREE.Material> = new Map();

  private static initGeometry(type: string): THREE.BufferGeometry {
    if (this.decorationGeometries.has(type)) {
      return this.decorationGeometries.get(type)!;
    }

    let geometry: THREE.BufferGeometry;

    switch (type) {
      case 'vine':
        geometry = new THREE.CylinderGeometry(0.02, 0.02, 1, 4);
        geometry.translate(0, -0.5, 0);
        break;
      case 'moss':
        geometry = new THREE.SphereGeometry(0.15, 8, 8);
        geometry.scale(1, 0.3, 1);
        break;
      case 'leaf':
        geometry = new THREE.CircleGeometry(0.2, 5);
        break;
      case 'branch':
        geometry = new THREE.CylinderGeometry(0.05, 0.03, 1, 5);
        geometry.rotateZ(Math.PI / 4);
        break;
      case 'mushroom': {
        // Create combined geometry for mushroom
        const capGeometry = new THREE.SphereGeometry(0.2, 8, 8);
        capGeometry.scale(1, 0.5, 1);
        capGeometry.translate(0, 0.2, 0);
        const stemGeometry = new THREE.CylinderGeometry(0.05, 0.08, 0.4, 8);
        
        // Combine geometries by merging their attributes
        const positions = new Float32Array([
          ...capGeometry.attributes.position.array,
          ...stemGeometry.attributes.position.array
        ]);
        const normals = new Float32Array([
          ...capGeometry.attributes.normal.array,
          ...stemGeometry.attributes.normal.array
        ]);
        
        geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
        break;
      }
      case 'cactus':
        geometry = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 8);
        geometry.translate(0, 0.4, 0);
        break;
      case 'rock':
        geometry = new THREE.IcosahedronGeometry(0.2, 0);
        geometry.scale(1, 0.7, 1);
        break;
      case 'crystal':
        geometry = new THREE.ConeGeometry(0.15, 0.4, 6);
        break;
      case 'coral': {
        // Create combined geometry for coral
        const baseGeometry = new THREE.CylinderGeometry(0.05, 0.1, 0.5, 8);
        const branchesGeometry = new THREE.SphereGeometry(0.2, 8, 4);
        branchesGeometry.scale(1, 1.5, 1);
        branchesGeometry.translate(0, 0.25, 0);
        
        // Combine geometries by merging their attributes
        const positions = new Float32Array([
          ...baseGeometry.attributes.position.array,
          ...branchesGeometry.attributes.position.array
        ]);
        const normals = new Float32Array([
          ...baseGeometry.attributes.normal.array,
          ...branchesGeometry.attributes.normal.array
        ]);
        
        geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
        break;
      }
      case 'seaweed':
        geometry = new THREE.PlaneGeometry(0.2, 0.8);
        geometry.translate(0, 0.4, 0);
        break;
      case 'barnacle':
        geometry = new THREE.ConeGeometry(0.1, 0.15, 8);
        break;
      case 'shell':
        geometry = new THREE.TorusGeometry(0.15, 0.05, 8, 12, Math.PI);
        break;
      case 'anemone':
        geometry = new THREE.CylinderGeometry(0.15, 0.1, 0.3, 16);
        geometry.translate(0, 0.15, 0);
        break;
      default:
        geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    }

    this.decorationGeometries.set(type, geometry);
    return geometry;
  }

  private static getMaterial(type: string, biome: BiomeType): THREE.Material {
    const key = `${type}-${biome}`;
    if (this.decorationMaterials.has(key)) {
      return this.decorationMaterials.get(key)!.clone();
    }

    let material: THREE.Material;
    const baseMaterial = MaterialFactory.createMaterialForBiome(biome);

    switch (type) {
      case 'vine':
      case 'leaf':
      case 'seaweed':
        material = new THREE.MeshStandardMaterial({
          color: 0x2d5a27,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.9
        });
        break;
      case 'crystal':
        material = new THREE.MeshPhysicalMaterial({
          color: 0xb19cd9,
          metalness: 0.9,
          roughness: 0.2,
          transparent: true,
          opacity: 0.8
        });
        break;
      case 'coral':
        material = new THREE.MeshStandardMaterial({
          color: 0xff7f50,
          roughness: 0.7,
          metalness: 0.2
        });
        break;
      default:
        material = baseMaterial;
    }

    this.decorationMaterials.set(key, material);
    return material.clone();
  }

  static generateDecorations(node: Node, biome: BiomeType): Decoration[] {
    const decorations: Decoration[] = [];
    const availableTypes = this.decorationTypes[biome];
    const count = Math.floor(Math.random() * 3) + 1;

    for (let i = 0; i < count; i++) {
      const type = availableTypes[Math.floor(Math.random() * availableTypes.length)];
      const position = this.calculateDecorationPosition(node, type);
      const scale = 0.8 + Math.random() * 0.4;
      
      decorations.push({
        type,
        position,
        scale,
        rotation: new THREE.Euler(
          (Math.random() - 0.5) * 0.5,
          Math.random() * Math.PI * 2,
          (Math.random() - 0.5) * 0.5
        )
      });
    }

    return decorations;
  }

  private static calculateDecorationPosition(node: Node, type: string): THREE.Vector3 {
    const { width, height, depth } = node.size;

    let x = (Math.random() - 0.5) * width;
    let y = (Math.random() - 0.5) * height;
    let z = (Math.random() - 0.5) * depth;

    // Adjust position based on decoration type
    switch (type) {
      case 'vine':
      case 'seaweed':
        y = height * 0.3; // Hang from upper part
        break;
      case 'moss':
      case 'mushroom':
        y = -height * 0.4; // Grow near bottom
        break;
      case 'crystal':
      case 'rock':
        y = -height * 0.3; // Place near bottom
        break;
    }

    return new THREE.Vector3(x, y, z);
  }

  static createDecorationMesh(decoration: Decoration): THREE.Mesh {
    const geometry = this.initGeometry(decoration.type);
    const material = this.getMaterial(decoration.type, 'forest'); // Default to forest
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(decoration.position);
    mesh.scale.setScalar(decoration.scale);
    
    if (decoration.rotation) {
      mesh.rotation.copy(decoration.rotation);
    }

    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData.type = decoration.type;

    return mesh;
  }

  static clearCache(): void {
    this.decorationGeometries.clear();
    this.decorationMaterials.clear();
  }
} 