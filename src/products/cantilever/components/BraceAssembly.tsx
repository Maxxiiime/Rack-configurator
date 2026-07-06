import React from 'react';
import { CantileverPart as BasePart } from './CantileverPart';
import { useShelfParts } from '../hooks/useShelfParts';
import braceLayouts from '../data/brace_layouts.json';
import type { BraceElement } from '../types';

const typedLayouts = braceLayouts as Record<string, BraceElement[]>;

interface BraceAssemblyProps {
  braceSize: number;
  columnId: string;
  hasXBrace: boolean;
  selectedMode?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  removeLeftColumn?: boolean;
  removeRightColumn?: boolean;
}

export const BraceAssembly: React.FC<BraceAssemblyProps> = ({ braceSize, columnId, hasXBrace, selectedMode, isFirst = false, isLast = false, removeLeftColumn = false, removeRightColumn = false }) => {
  const { findPartId, getPartSize, offsets } = useShelfParts();

  const hBraceId = findPartId('h_brace', braceSize) ?? '';
  const xBraceId = findPartId('x_brace', braceSize) ?? '';

  // Lookup layout from column size
  const columnSizeMm = getPartSize(columnId);
  const layout: BraceElement[] = typedLayouts[String(columnSizeMm)] ?? [];

  return (
    <group>
      {layout.map((element, i) => {
        const isHBrace = element.type === 'h_brace';
        if (!hasXBrace && !isHBrace) return null;

        const y = element.y_position;
        const id = isHBrace ? hBraceId : xBraceId;
        const position: [number, number, number] = isHBrace
          ? [offsets.brace.h_x, y, offsets.brace.h_z]
          : [offsets.brace.x_x, y, offsets.brace.x_z];

        return (
          <group key={`${element.type}-${i}`}>
            <BasePart id={id} position={position} selectedMode={selectedMode} />

            {isHBrace && (() => {
              const braceSizeUnits = braceSize / 100;
              const gap = braceSizeUnits + offsets.brace_bolt.last_x;
              return (
                <>
                  {isFirst && !removeLeftColumn && (
                    <BasePart
                      id="bolts"
                      rotation={[0, Math.PI, 0]}
                      position={[offsets.brace_bolt.first_x, y, offsets.brace_bolt.z]}
                      selectedMode={selectedMode}
                    />
                  )}
                  {isLast && !removeRightColumn && (
                    <BasePart
                      id="bolts"
                      position={[gap, y, offsets.brace_bolt.z]}
                      selectedMode={selectedMode}
                    />
                  )}
                </>
              );
            })()}
          </group>
        );
      })}
    </group>
  );
};
