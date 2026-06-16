import React from 'react';
import { BasePart } from './Parts';
import { useShelfParts } from '@/hooks/useShelfParts';
import { useRackConfigStore, RackType } from '@/stores/cantilever/rackConfigStore';
import { useEditorStore } from '@/stores/cantilever/editorStore';
import { computeArmPositions, applyArmYOverrides } from '@/utils/armPositions';

interface ColumnAssemblyProps {
  columnId: string;
  legId: string;
  armId: string;
  rackType: RackType;
  position?: [number, number, number];
}

export const ColumnAssembly: React.FC<ColumnAssemblyProps> = ({
  columnId,
  legId,
  armId,
  rackType,
  position = [0, 0, 0],
}) => {
  const { getColumnHeight, offsets } = useShelfParts();
  const armSpacing = useRackConfigStore((s) => s.armSpacing);
  const armCount = useRackConfigStore((s) => s.armCount);
  const armYOverrides = useRackConfigStore((s) => s.armYOverrides);
  const selectedArmIndex = useEditorStore((s) => s.selectedArmIndex);

  const columnHeightUnits = getColumnHeight(columnId);
  const basePositions = computeArmPositions(
    offsets.arm.start_y,
    columnHeightUnits,
    armSpacing,
    armCount
  );
  const armPositions = applyArmYOverrides(basePositions, armYOverrides);

  return (
    <group position={position}>
      {/*COLUMN*/}
      <BasePart id={columnId} position={[offsets.column.x, 0, offsets.column.z]} />
      {/*LEGS*/}
      <BasePart
        id={legId}
        position={
          rackType === 'double'
            ? [offsets.leg.x, offsets.leg.y, offsets.leg.double_z]
            : [offsets.leg.x, offsets.leg.y, offsets.leg.z]
        }
      />
      {armPositions.map((yPos, i) => {
        const isSelected = selectedArmIndex === i;
        return (
          <group key={`arm-${i}`}>
            {/*ARMS*/}
            <BasePart
              id={armId}
              position={[offsets.arm.x, yPos, offsets.arm.z]}
              selectedMode={isSelected}
            />
            {rackType === 'double' && (
              <BasePart
                id={armId}
                position={[offsets.arm.double_x, yPos, offsets.arm.double_z]}
                rotation={[0, Math.PI, 0]} // Rotate 180 degrees for double face
                selectedMode={isSelected}
              />
            )}
          </group>
        );
      })}


    </group>
  );
};
