import { useGLTF } from '@react-three/drei';
import React, { useMemo } from 'react';
import { MetalMaterial } from './materials/MetalMaterial';
import { SelectedMaterial } from './materials/SelectedMaterial';
import { useMaterial } from '@/hooks/useMaterial';

interface PartProps {
  path: string;
  materialName?: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  selectedMode?: boolean;
  onClick?: (e: any) => void;
  onPointerOver?: (e: any) => void;
  onPointerOut?: (e: any) => void;
}

export const BasePart: React.FC<PartProps> = ({ path, materialName = 'Blue', position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1], selectedMode, ...restProps }) => {
  const { getMetalMaterial } = useMaterial();

  const gltf = useGLTF(path) as any;
  const scene = gltf.scene;
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  return (
    <primitive
      object={clonedScene}
      position={position}
      rotation={rotation}
      scale={scale}
      {...restProps}
    >
      <MetalMaterial scene={clonedScene} settings={getMetalMaterial(materialName)?.settings} boltSettings={getMetalMaterial('Grey')?.settings} />
      <SelectedMaterial scene={clonedScene} selectedMode={selectedMode} />
    </primitive>
  );
};
