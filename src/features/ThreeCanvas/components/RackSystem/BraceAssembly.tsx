import React from 'react';
import { BasePart } from './Parts';
import { useShelfParts } from '@/hooks/useShelfParts';

interface BraceAssemblyProps {
  braceSize: number;
  columnId: string;
}

export const BraceAssembly: React.FC<BraceAssemblyProps> = ({ braceSize, columnId }) => {
  const { getColumnHeight, findPartId, sizes } = useShelfParts();

  const hBraceId = findPartId('h_brace', braceSize) ?? '';
  const xBraceId = findPartId('x_brace', braceSize) ?? '';

  const columnHeight = getColumnHeight(columnId) - sizes.brace.top_offset;
  const numLevels = Math.floor(columnHeight / sizes.brace.height);

  return (
    <group>
      <BasePart id={hBraceId} position={[sizes.brace.h_x, columnHeight, sizes.brace.h_z]} />
      {Array.from({ length: numLevels }).map((_, i) => {
        const y = columnHeight - (i + 1) * sizes.brace.height;
        return (
          <group key={i}>
            <BasePart id={hBraceId} position={[sizes.brace.h_x, y, sizes.brace.h_z]} />
            {i === 0 && (
              <BasePart id={xBraceId} position={[sizes.brace.x_x, y, sizes.brace.x_z]} />
            )}
          </group>
        );
      })}
    </group>
  );
};
