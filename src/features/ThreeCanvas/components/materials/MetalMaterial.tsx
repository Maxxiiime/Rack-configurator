import { applyProps } from "@react-three/fiber";
import { useEffect } from "react";
import { Group, Mesh, MeshStandardMaterial, Object3DEventMap } from "three";
const metalMaterial = new MeshStandardMaterial({
  metalness: 0.2,
  roughness: 0.3,
});

export const MetalMaterial = ({ scene, settings }: { scene: Group<Object3DEventMap> | undefined; settings?: { color: string } }) => {
  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child instanceof Mesh) {
          const clonedMaterial = metalMaterial.clone();
          child.material = clonedMaterial;
          if (settings) applyProps(child.material, settings);
          child.material.needsUpdate = true;
        }
      });
    }
  }, [scene, settings]);
  return null;
};
