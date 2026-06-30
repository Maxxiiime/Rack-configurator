import { useEffect } from "react";
import { Group, Mesh, MeshStandardMaterial, Object3DEventMap } from "three";
const selectedMaterial = new MeshStandardMaterial({
  transparent: true,
  opacity: 0.5,
  color: "#14af00",
  depthTest: true,
  depthWrite: false


});

export const SelectedMaterial = ({ scene, selectedMode }: { scene: Group<Object3DEventMap> | undefined; selectedMode: boolean | undefined }) => {
  useEffect(() => {
    if (!scene) return;

    if (selectedMode) {
      // Save originals and apply selected material
      const originals = new Map<Mesh, MeshStandardMaterial>();
      scene.traverse((child) => {
        if (child instanceof Mesh) {
          originals.set(child, child.material as MeshStandardMaterial);
          child.material = selectedMaterial;

        }
      });

      // Restore originals on cleanup (deselect, switch, unmount)
      return () => {
        originals.forEach((mat, mesh) => {
          mesh.material = mat;
          mesh.material.needsUpdate = true;
        });
      };
    }
  }, [scene, selectedMode]);
  return null;
};
