import React from 'react';
import { BasePart } from './Parts';
import { useShelfParts } from '@/hooks/useShelfParts';
import { useRackStore } from '@/stores/rackStore';

interface BraceAssemblyProps {
  braceSize: number;
}

export const BraceAssembly: React.FC<BraceAssemblyProps> = ({ braceSize }) => {
  const { getOffsets, getColumnHeight, getDimensions, findPartId } = useShelfParts();
  const activeColumnId = useRackStore((state) => state.activeColumnId);
  const offsets = getOffsets();

  const hBraceId = findPartId('h_brace', braceSize) ?? '';
  const xBraceId = findPartId('x_brace', braceSize) ?? '';

  const hX = offsets.h_brace_x;
  const hZ = offsets.h_brace_z;

  const xX = offsets.x_brace_x;
  const xZ = offsets.x_brace_z;

  const braceHeight = getDimensions().brace_height;
  const columnHeight = getColumnHeight(activeColumnId) - offsets.top_brace;

  return (
    <group>
      <BasePart id={hBraceId} position={[hX, columnHeight - braceHeight, hZ]} />
      <BasePart id={xBraceId} position={[xX, columnHeight - braceHeight, xZ]} />
      <BasePart id={hBraceId} position={[hX, columnHeight, hZ]} />
    </group>
  );
};
