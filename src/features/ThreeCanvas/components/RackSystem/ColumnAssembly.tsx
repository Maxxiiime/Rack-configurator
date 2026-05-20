import React from 'react';
import { Column, Arm, Leg } from './Parts';
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
  const { getColumnHeight, getOffsets } = useShelfParts();
  
  const offsets = getOffsets();
  const levels = Array.from({ length: numLevels });
  
  const offsetArmBottom = offsets.arm_start_y;
  const offsetArmTop = offsets.arm_end_y;
  const columnHeightUnits = getColumnHeight(columnId);
  const availableHeight = columnHeightUnits - offsetArmBottom - offsetArmTop;
  const dynamicSpacingY = numLevels > 1 ? availableHeight / (numLevels - 1) : 0;

  return (
    <group position={position}>
      <Column id={columnId} position={[offsets.column_x, 0, offsets.column_z]} />
      <Leg 
        id={legId} 
        position={
          rackType === 'double' 
            ? [offsets.leg_x, offsets.leg_y, offsets.double_leg_z]
            : [offsets.leg_x, offsets.leg_y, offsets.leg_z]
        } 
      />
      {levels.map((_, i) => {
        const yPos = offsetArmBottom + i * dynamicSpacingY;
        return (
          <group key={`arm-${i}`}>
            <Arm 
              id={armId} 
              position={[offsets.arm_x, yPos, offsets.arm_z]} 
            />
            {rackType === 'double' && (
              <Arm 
                id={armId} 
                position={[offsets.double_arm_x, yPos, offsets.double_arm_z]} 
                rotation={[0, Math.PI, 0]} // Rotate 180 degrees for double face
              />
            )}
          </group>
        );
      })}
    </group>
  );
};
