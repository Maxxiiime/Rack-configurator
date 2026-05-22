import { useEffect } from "react";
import { Group, Mesh, MeshStandardMaterial, Object3DEventMap } from "three";
const selectedMaterial = new MeshStandardMaterial({
  transparent: true,
  opacity: 0.8,
  color: '#9BFF61',
});

export const SelectedMaterial = ({ scene, selected }: { scene: Group<Object3DEventMap> | undefined; selected: boolean | undefined }) => {
  useEffect(() => {
    if (scene && selected) {
      scene.traverse((child) => {
        if (child instanceof Mesh) {
          child.material = selectedMaterial;
          child.material.depthTest = false;
          child.material.depthWrite = false;
          child.material.needsUpdate = true;
        }
      });
    }
  }, [scene, selected]);
  return null;
};
