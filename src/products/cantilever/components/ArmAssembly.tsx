import React from 'react';
import { CantileverPart as BasePart } from './CantileverPart';
import { useEditorStore } from '../stores/editorStore';
import type { RackType } from '../stores/configStore';
import { computeArmDividerPositions } from '../utils/armPositions';

interface ArmAssemblyProps {
  index: number;
  yPosFront: number;
  yPosBack: number;
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
  yPosFront,
  yPosBack,
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
  const isSelectedFront = selectedArm?.armIndex === index &&
    (selectedArm.columnIndex === columnIndex || selectedArm.columnIndex === undefined) &&
    (selectedArm.side === 'front' || selectedArm.side === undefined);
  const isSelectedBack = selectedArm?.armIndex === index &&
    (selectedArm.columnIndex === columnIndex || selectedArm.columnIndex === undefined) &&
    (selectedArm.side === 'back');

  const { singles, doubles } = computeArmDividerPositions(
    armSizeUnits,
    yPosFront,
    yPosBack,
    armStopY,
    offsets,
    armDividerCount
  );

  return (
    <group>
      {/* ARM - Single Face */}
      <BasePart
        id={armId}
        position={[offsets.arm.x, yPosFront, offsets.arm.z]}
        selectedMode={isSelectedFront}
      />

      {/* ARM STOP - Single Face */}
      {showArmStops && (
        <BasePart
          id={armStopId}
          position={[offsets.arm_stop.x, yPosFront + armStopY, -armStopLocalZ]}
          selectedMode={isSelectedFront}
        />
      )}

      {/* ARM DIVIDERS - Single Face */}
      {showArmDividers && singles.map((pos, i) => (
        <BasePart
          key={`divider-single-${i}`}
          id="arm_divider"
          position={[pos.x, pos.y, pos.z]}
          selectedMode={isSelectedFront}
        />
      ))}

      {/* Double Face */}
      {rackType === 'double' && (
        <>
          {/* ARM - Double Face */}
          <BasePart
            id={armId}
            position={[offsets.arm.double_x, yPosBack, offsets.arm.double_z]}
            rotation={[0, Math.PI, 0]}
            selectedMode={isSelectedBack}
          />

          {/* ARM STOP - Double Face */}
          {showArmStops && (
            <BasePart
              id={armStopId}
              position={[offsets.arm_stop.double_x, yPosBack + armStopY, doubleArmStopLocalZ]}
              rotation={[0, Math.PI, 0]}
              selectedMode={isSelectedBack}
            />
          )}

          {/* ARM DIVIDERS - Double Face */}
          {showArmDividers && doubles.map((pos, i) => (
            <BasePart
              key={`divider-double-${i}`}
              id="arm_divider"
              position={[pos.x, pos.y, pos.z]}
              rotation={[0, Math.PI, 0]}
              selectedMode={isSelectedBack}
            />
          ))}
        </>
      )}
    </group>
  );
};
