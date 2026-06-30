import { useGLTF } from '@react-three/drei';
import React, { useMemo } from 'react';
import partsData from '@/data/shelving_parts.json';
import { MetalMaterial } from './materials/MetalMaterial';
import { SelectedMaterial } from './materials/SelectedMaterial';
import { useMaterial } from '@/hooks/useMaterial';

// Preload all models
partsData.forEach((part) => {
  useGLTF.preload(part.path);
});

interface PartProps {
  id: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  selectedMode?: boolean;
}

export const BasePart: React.FC<PartProps> = ({ id, position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1], selectedMode }) => {
  const { getMetalMaterial } = useMaterial();

  const partData = partsData.find((p: any) => p.shelving_system_id === id);
  let materialName = 'Blue';
  if (partData?.category === 'arm' || partData?.category === 'arm_stop') {
    materialName = 'Red';
  } else if (partData?.category === 'arm_divider') {
    materialName = 'Grey';
  }

  const fallbackPath = '/model/columns/Kolommen_2M.glb';

  const gltf = useGLTF(partData?.path ?? fallbackPath) as any;
  const scene = gltf.scene;
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  if (!partData) {
    console.warn(`Part with id ${id} not found.`);
    return null;
  }



  return (
    <primitive
      object={clonedScene}
      position={position}
      rotation={rotation}
      scale={scale}
    >
      <MetalMaterial scene={clonedScene} settings={getMetalMaterial(materialName)?.settings} boltSettings={getMetalMaterial('Grey')?.settings} />
      <SelectedMaterial scene={clonedScene} selectedMode={selectedMode} />
    </primitive>
  );
};
