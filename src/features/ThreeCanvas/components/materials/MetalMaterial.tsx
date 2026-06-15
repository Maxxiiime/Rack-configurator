import { applyProps } from "@react-three/fiber";
import { useEffect } from "react";
import { Group, Mesh, MeshStandardMaterial, Object3DEventMap } from "three";
const metalMaterial = new MeshStandardMaterial({
  metalness: 0.2,
  roughness: 0.5,
});

export const MetalMaterial = ({ scene, settings, boltSettings }: { scene: Group<Object3DEventMap> | undefined; settings?: { color: string }; boltSettings?: { color: string } }) => {
  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child instanceof Mesh) {
          const clonedMaterial = metalMaterial.clone();
          child.material = clonedMaterial;
          if (child.name.includes("Bolts") && boltSettings) {
            applyProps(child.material, boltSettings);
          } else if (settings) {
            applyProps(child.material, settings);
          }
          child.material.needsUpdate = true;
        }
      });
    }
  }, [scene, settings, boltSettings]);
  return null;
};
