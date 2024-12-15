import * as THREE from 'three';
import type { Node, NodeShape, NodeSize, BiomeType } from '@/types/nodes';
import { MaterialFactory } from '@/generators/MaterialFactory';
import type { NodeParameters, MaterialParameters } from '@/types/parameters';

export class NodeGenerator {
  public static generateNode(
    shape: NodeShape,
    size: NodeSize,
    biome: BiomeType,
    params?: NodeParameters
  ): Node {
    const materialParams: MaterialParameters | undefined = params?.material;
    const material = MaterialFactory.createMaterialForBiome(biome, materialParams);

    return {
      shape,
      size,
      material,
      userData: {}
    };
  }

  public static createMesh(node: Node): THREE.Mesh {
    const geometry = this.createGeometry(node.shape, node.size);
    const mesh = new THREE.Mesh(geometry, node.material);
    
    // Center the mesh vertically
    mesh.position.y = node.size.height / 2;
    
    return mesh;
  }

  private static createGeometry(shape: NodeShape, size: NodeSize): THREE.BufferGeometry {
    switch (shape) {
      case 'cube':
        return new THREE.BoxGeometry(size.width, size.height, size.depth);
      
      case 'cylinder':
        return new THREE.CylinderGeometry(
          size.width / 2,
          size.width / 2,
          size.height,
          32
        );
      
      case 'sphere': {
        const radius = Math.min(size.width, size.height, size.depth) / 2;
        return new THREE.SphereGeometry(radius, 32, 32);
      }
      
      case 'cone':
        return new THREE.ConeGeometry(
          size.width / 2,
          size.height,
          32
        );
      
      case 'torus': {
        const torusRadius = size.width / 2;
        const tubeRadius = size.height / 4;
        return new THREE.TorusGeometry(
          torusRadius,
          tubeRadius,
          16,
          32
        );
      }
      
      default: {
        const exhaustiveCheck: never = shape;
        throw new Error(`Unsupported shape: ${exhaustiveCheck}`);
      }
    }
  }
}