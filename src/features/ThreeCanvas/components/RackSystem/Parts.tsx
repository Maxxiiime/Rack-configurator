import { useGLTF } from '@react-three/drei';
import React, { useMemo } from 'react';
import partsData from '@/data/shelving_parts.json';
import { useShelfParts } from '@/hooks/useShelfParts';
import { MetalMaterial } from '../materials/MetalMaterial';
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
}

export const BasePart: React.FC<PartProps> = ({ id, position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1] }) => {
  const { getPartData } = useShelfParts();
  const { getMetalMaterial } = useMaterial();
  
  const partData = getPartData(id);
  const isArm = partData?.category === 'arm';
  const isXBrace = partData?.category === 'x_brace';
  const materialName = isArm ? 'Red' : isXBrace ? 'Grey' : 'Blue';
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
    >
      <MetalMaterial scene={clonedScene} settings={getMetalMaterial(materialName)?.settings} boltSettings={getMetalMaterial('Grey')?.settings}/>
    </primitive>
  );
};
