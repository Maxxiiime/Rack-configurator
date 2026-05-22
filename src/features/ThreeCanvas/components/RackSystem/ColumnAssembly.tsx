import React from 'react';
import { BasePart } from './Parts';
import { useShelfParts } from '@/hooks/useShelfParts';
import { RackType } from '@/stores/rackStore';

interface ColumnAssemblyProps {
  columnId: string;
  legId: string;
  armId: string;
  rackType: RackType;
  position?: [number, number, number];
  isSelected?: boolean;
}

export const ColumnAssembly: React.FC<ColumnAssemblyProps> = ({
  columnId,
  legId,
  armId,
  rackType,
  position = [0, 0, 0],
  isSelected = false
}) => {
  const { getColumnHeight, sizes } = useShelfParts();

  const columnHeightUnits = getColumnHeight(columnId);
  const maxArmY = columnHeightUnits - sizes.arm.end_y;
  
  const armPositions: number[] = [];
  for (let y = sizes.arm.start_y; y <= maxArmY; y += 3) {
    armPositions.push(y);
  }

  return (
    <group position={position}>
      {/*COLUMN*/}
      <BasePart id={columnId} position={[sizes.column.x, 0, sizes.column.z]} isSelected={isSelected} />
      {/*LEGS*/}
      <BasePart
        id={legId}
        position={
          rackType === 'double'
            ? [sizes.leg.x, sizes.leg.y, sizes.leg.double_z]
            : [sizes.leg.x, sizes.leg.y, sizes.leg.z]
        }
        isSelected={isSelected}
      />
      {armPositions.map((yPos, i) => {
        return (
          <group key={`arm-${i}`}>
            {/*ARMS*/}
            <BasePart
              id={armId}
              position={[sizes.arm.x, yPos, sizes.arm.z]}
              isSelected={isSelected}
            />
            {rackType === 'double' && (
              <BasePart
                id={armId}
                position={[sizes.arm.double_x, yPos, sizes.arm.double_z]}
                rotation={[0, Math.PI, 0]} // Rotate 180 degrees for double face
                isSelected={isSelected}
              />
            )}
          </group>
        );
      })}
    </group>
  );
};
