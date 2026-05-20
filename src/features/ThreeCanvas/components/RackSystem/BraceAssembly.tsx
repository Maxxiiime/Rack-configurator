import React from 'react';
import { Brace } from './Parts';
import { useShelfParts } from '@/hooks/useShelfParts';
import { useRackStore } from '@/stores/rackStore';

interface BraceAssemblyProps {
  lengthKey: string;
}

export const BraceAssembly: React.FC<BraceAssemblyProps> = ({ lengthKey }) => {
  const { getOffsets, getColumnHeight, getDimensions } = useShelfParts();
  const activeColumnId = useRackStore((state) => state.activeColumnId);
  const offsets = getOffsets();

  const hBraceId = `h_braces_${lengthKey}`;
  const xBraceId = `x_braces_${lengthKey}`;

  // Read offsets from sizes
  const hX = offsets.h_brace_x;
  const hZ = offsets.h_brace_z;

  const xX = offsets.x_brace_x;
  const xZ = offsets.x_brace_z;

  const braceHeight = getDimensions().brace_height;
  const columnHeight = getColumnHeight(activeColumnId) - offsets.top_brace;

  return (
    <group>
      <Brace id={hBraceId} position={[hX, columnHeight - braceHeight, hZ]} />
      <Brace id={xBraceId} position={[xX, columnHeight - braceHeight, xZ]} />
      <Brace id={hBraceId} position={[hX, columnHeight, hZ]} />
    </group>
  );
};
