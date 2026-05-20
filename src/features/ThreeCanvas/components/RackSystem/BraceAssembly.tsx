import React from 'react';
import { Brace } from './Parts';
import { useShelfParts } from '@/hooks/useShelfParts';
import { useRackStore } from '@/stores/rackStore';

interface BraceAssemblyProps {
  lengthKey: string;
}

export const BraceAssembly: React.FC<BraceAssemblyProps> = ({ lengthKey }) => {
  const { getOffsets, getColumnHeight } = useShelfParts();
  const activeColumnId = useRackStore((state) => state.activeColumnId);
  const offsets = getOffsets();

  const hBraceId = `h_braces_${lengthKey}`;
  const xBraceId = `x_braces_${lengthKey}`;

  // Read offsets from sizes
  const hX = offsets.h_brace_x_offset;
  const hZ = offsets.h_brace_z_offset;
  
  const xX = offsets.x_brace_x_offset;
  const xY = offsets.x_brace_y_offset;
  const xZ = offsets.x_brace_z_offset;

  const columnHeight = getColumnHeight(activeColumnId) -2;

  return (
    <group>
      <Brace id={hBraceId} position={[hX, columnHeight - 12, hZ]} />
      <Brace id={xBraceId} position={[xX, columnHeight - 12, xZ]} />
      <Brace id={hBraceId} position={[hX, columnHeight, hZ]} />
    </group>
  );
};
