import { useGLTF } from '@react-three/drei';
import React, { useMemo } from 'react';
import partsData from '@/data/shelving_parts.json';
import { useShelfParts } from '@/hooks/useShelfParts';

// Preload all models
partsData.forEach((part) => {
  useGLTF.preload(part.path);
});

interface PartProps {
  id: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

export const BasePart: React.FC<PartProps> = ({ id, position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1] }) => {
  const { getPartData } = useShelfParts();

  const partData = getPartData(id);
  const fallbackPath = '/model/columns/Kolommen_2M.glb';

  const { scene } = useGLTF(partData?.path ?? fallbackPath);
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
    />
  );
};
