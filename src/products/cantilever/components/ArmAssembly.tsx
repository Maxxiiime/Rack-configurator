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
  armDividerCount: number;
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
  armDividerCount,
  armStopId,
  columnIndex,
  armSizeUnits,
}) => {
  const selectedArm = useEditorStore((s) => s.selectedArm);
  const isSelected = selectedArm?.armIndex === index &&
    (selectedArm.columnIndex === columnIndex || selectedArm.columnIndex === undefined);

  const { singles, doubles } = computeArmDividerPositions(
    armSizeUnits,
    yPos,
    armStopY,
    offsets,
    armDividerCount
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

      {/* ARM DIVIDERS - Single Face */}
      {showArmDividers && singles.map((pos, i) => (
        <BasePart
          key={`divider-single-${i}`}
          id="arm_divider"
          position={[pos.x, pos.y, pos.z]}
          selectedMode={isSelected}
        />
      ))}

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

          {/* ARM DIVIDERS - Double Face */}
          {showArmDividers && doubles.map((pos, i) => (
            <BasePart
              key={`divider-double-${i}`}
              id="arm_divider"
              position={[pos.x, pos.y, pos.z]}
              rotation={[0, Math.PI, 0]}
              selectedMode={isSelected}
            />
          ))}
        </>
      )}
    </group>
  );
};
