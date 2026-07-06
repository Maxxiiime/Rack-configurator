import React from 'react';
import { useGLTF } from '@react-three/drei';
import { BasePart } from '@/components/3d/BasePart';
import { getPartData } from '../utils/shelfParts';
import partsData from '../data/parts.json';

// Preload all cantilever models
partsData.forEach((part: any) => {
  useGLTF.preload(part.path);
});

interface CantileverPartProps {
  id: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  selectedMode?: boolean;
}

export const CantileverPart: React.FC<CantileverPartProps> = ({ id, ...props }) => {
  const data = getPartData(id);

  if (!data) {
    console.warn(`CantileverPart with id ${id} not found.`);
    return null;
  }
  
  let materialName = 'Blue';
  if (data.category === 'arm') materialName = 'Red';
  else if (data.category === 'arm_divider' || data.category === 'x_brace' || data.category === 'arm_stop') materialName = 'Grey';

  return <BasePart path={data.path} materialName={materialName} {...props} />;
};
