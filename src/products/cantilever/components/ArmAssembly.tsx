import React from 'react';
import { CantileverPart as BasePart } from './CantileverPart';
import { useEditorStore } from '../stores/editorStore';
import type { RackType } from '../stores/configStore';
import { computeArmDividerPositions } from '../utils/armPositions';

interface ArmAssemblyProps {
  index: number;
  yPos: number;
  armId: string;
  rackType: RackType;
  offsets: Record<string, any>;
  armStopY: number;
  armStopLocalZ: number;
  doubleArmStopLocalZ: number;
  showArmStops: boolean;
  showArmDividers: boolean;
  armStopId: string;
  columnIndex: number;
  armSizeUnits: number;
}

export const ArmAssembly: React.FC<ArmAssemblyProps> = ({
  index,
  yPos,
  armId,
  rackType,
  offsets,
  armStopY,
  armStopLocalZ,
  doubleArmStopLocalZ,
  showArmStops,
  showArmDividers,
  armStopId,
  columnIndex,
  armSizeUnits,
}) => {
  const selectedArm = useEditorStore((s) => s.selectedArm);
  const isSelected = selectedArm?.armIndex === index &&
    (selectedArm.columnIndex === columnIndex || selectedArm.columnIndex === undefined);

  const { single: singleDivider, double: doubleDivider } = computeArmDividerPositions(
    armSizeUnits, 
    yPos, 
    armStopY, 
    offsets
  );

  return (
    <group>
      {/* ARM - Single Face */}
      <BasePart
        id={armId}
        position={[offsets.arm.x, yPos, offsets.arm.z]}
        selectedMode={isSelected}
      />

      {/* ARM STOP - Single Face */}
      {showArmStops && (
        <BasePart
          id={armStopId}
          position={[offsets.arm_stop.x, yPos + armStopY, -armStopLocalZ]}
          selectedMode={isSelected}
        />
      )}

      {/* ARM DIVIDER - Single Face */}
      {showArmDividers && (
        <BasePart
          id="arm_divider"
          position={[singleDivider.x, singleDivider.y, singleDivider.z]}
          selectedMode={isSelected}
        />
      )}

      {/* Double Face */}
      {rackType === 'double' && (
        <>
          {/* ARM - Double Face */}
          <BasePart
            id={armId}
            position={[offsets.arm.double_x, yPos, offsets.arm.double_z]}
            rotation={[0, Math.PI, 0]}
            selectedMode={isSelected}
          />

          {/* ARM STOP - Double Face */}
          {showArmStops && (
            <BasePart
              id={armStopId}
              position={[offsets.arm_stop.double_x, yPos + armStopY, doubleArmStopLocalZ]}
              rotation={[0, Math.PI, 0]}
              selectedMode={isSelected}
            />
          )}

          {/* ARM DIVIDER - Double Face */}
          {showArmDividers && (
            <BasePart
              id="arm_divider"
              position={[doubleDivider.x, doubleDivider.y, doubleDivider.z]}
              rotation={[0, Math.PI, 0]}
              selectedMode={isSelected}
            />
          )}
        </>
      )}
    </group>
  );
};
