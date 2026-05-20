import React from 'react';
import { BasePart } from './Parts';
import { useShelfParts } from '@/hooks/useShelfParts';
import { RackType } from '@/stores/rackStore';

interface ColumnAssemblyProps {
  columnId: string;
  legId: string;
  armId: string;
  rackType: RackType;
  numLevels: number;
  position?: [number, number, number];
}

export const ColumnAssembly: React.FC<ColumnAssemblyProps> = ({
  columnId,
  legId,
  armId,
  rackType,
  numLevels,
  position = [0, 0, 0]
}) => {
  const { getColumnHeight, sizes } = useShelfParts();

  const levels = Array.from({ length: numLevels });

  const columnHeightUnits = getColumnHeight(columnId);
  const availableHeight = columnHeightUnits - sizes.arm.start_y - sizes.arm.end_y;
  const dynamicSpacingY = numLevels > 1 ? availableHeight / (numLevels - 1) : 0;

  return (
    <group position={position}>
      {/*COLUMN*/}
      <BasePart id={columnId} position={[sizes.column.x, 0, sizes.column.z]} />
      {/*LEGS*/}
      <BasePart
        id={legId}
        position={
          rackType === 'double'
            ? [sizes.leg.x, sizes.leg.y, sizes.leg.double_z]
            : [sizes.leg.x, sizes.leg.y, sizes.leg.z]
        }
      />
      {levels.map((_, i) => {
        const yPos = sizes.arm.start_y + i * dynamicSpacingY;
        return (
          <group key={`arm-${i}`}>
            {/*ARMS*/}
            <BasePart
              id={armId}
              position={[sizes.arm.x, yPos, sizes.arm.z]}
            />
            {rackType === 'double' && (
              <BasePart
                id={armId}
                position={[sizes.arm.double_x, yPos, sizes.arm.double_z]}
                rotation={[0, Math.PI, 0]} // Rotate 180 degrees for double face
              />
            )}
          </group>
        );
      })}
    </group>
  );
};
