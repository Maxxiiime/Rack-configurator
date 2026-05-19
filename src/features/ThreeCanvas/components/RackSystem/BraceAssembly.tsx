import React from 'react';
import { Brace } from './Parts';
import { useShelfParts } from '@/hooks/useShelfParts';

interface BraceAssemblyProps {
  lengthKey: string;
}

export const BraceAssembly: React.FC<BraceAssemblyProps> = ({ lengthKey }) => {
  const { getOffsets } = useShelfParts();
  const offsets = getOffsets();

  const hBraceId = `h_braces_${lengthKey}`;
  const xBraceId = `x_braces_${lengthKey}`;

  // Read offsets from sizes
  const hX = offsets.h_brace_x_offset;
  const hYDefault = offsets.h_brace_y_offset;
  const hZ = offsets.h_brace_z_offset;
  
  const xX = offsets.x_brace_x_offset;
  const xY = offsets.x_brace_y_offset;
  const xZ = offsets.x_brace_z_offset;

  // Position based on a standard bay: 
  // Lower H-brace near base, X-brace in middle, Upper H-brace on top
  const lowerHY = hYDefault - 8; // e.g., 2
  const upperHY = hYDefault + 8; // e.g., 18

  return (
    <group>
      <Brace id={hBraceId} position={[hX, xY, hZ]} />
      <Brace id={xBraceId} position={[xX, xY, xZ]} />
      <Brace id={hBraceId} position={[hX, xY+12, hZ]} />
    </group>
  );
};
