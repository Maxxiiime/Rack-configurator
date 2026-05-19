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

const BasePart: React.FC<PartProps> = ({ id, position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1] }) => {
  const { getPartData } = useShelfParts();
  const partData = getPartData(id);
  
  if (!partData) {
    console.warn(`Part with id ${id} not found.`);
    return null;
  }

  const { scene } = useGLTF(partData.path);
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  return (
    <primitive 
      object={clonedScene} 
      position={position} 
      rotation={rotation} 
      scale={scale} 
    />
  );
};

export const Column: React.FC<PartProps> = (props) => <BasePart {...props} />;
export const Arm: React.FC<PartProps> = (props) => <BasePart {...props} />;
export const Brace: React.FC<PartProps> = (props) => <BasePart {...props} />;
export const Leg: React.FC<PartProps> = (props) => <BasePart {...props} />;
