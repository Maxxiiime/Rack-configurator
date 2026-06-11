import React from 'react';
import { BasePart } from './Parts';
import { useShelfParts } from '@/hooks/useShelfParts';
import braceLayouts from '@/data/brace_layouts.json';
import type { BraceElement } from '@/types/shelving';

const typedLayouts = braceLayouts as Record<string, BraceElement[]>;

interface BraceAssemblyProps {
  braceSize: number;
  columnId: string;
}

export const BraceAssembly: React.FC<BraceAssemblyProps> = ({ braceSize, columnId }) => {
  const { findPartId, getPartSize, offsets } = useShelfParts();

  const hBraceId = findPartId('h_brace', braceSize) ?? '';
  const xBraceId = findPartId('x_brace', braceSize) ?? '';

  // Lookup layout from column size
  const columnSizeMm = getPartSize(columnId);
  const layout: BraceElement[] = typedLayouts[String(columnSizeMm)] ?? [];

  return (
    <group>
      {layout.map((element, i) => {
        const y = element.y_position;
        const isHBrace = element.type === 'h_brace';
        const id = isHBrace ? hBraceId : xBraceId;
        const position: [number, number, number] = isHBrace
          ? [offsets.brace.h_x, y, offsets.brace.h_z]
          : [offsets.brace.x_x, y, offsets.brace.x_z];

        return <BasePart key={`${element.type}-${i}`} id={id} position={position} />;
      })}
    </group>
  );
};
