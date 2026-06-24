import React from 'react';
import { BasePart } from './Parts';
import { useEditorStore } from '@/stores/cantilever/editorStore';
import type { RackType } from '@/stores/cantilever/rackConfigStore';

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
  armStopId: string;
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
  armStopId,
}) => {
  const isSelected = useEditorStore((s) => s.selectedArmIndex === index);

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
        </>
      )}
    </group>
  );
};
