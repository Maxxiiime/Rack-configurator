import React, { useMemo } from 'react';
import { BasePart } from './Parts';
import { ArmAssembly } from './ArmAssembly';
import { useShelfParts } from '@/hooks/useShelfParts';
import { useRackConfigStore, RackType } from '@/stores/cantilever/rackConfigStore';
import { computeArmPositions, applyArmYOverrides } from '@/utils/armPositions';

interface ColumnAssemblyProps {
  columnId: string;
  legId: string;
  armId: string;
  rackType: RackType;
  position?: [number, number, number];
  selectedMode?: boolean;
}

export const ColumnAssembly: React.FC<ColumnAssemblyProps> = ({
  columnId,
  legId,
  armId,
  rackType,
  position = [0, 0, 0],
  selectedMode = false,
}) => {
  const { getColumnHeight, getPartSize, getPartData, offsets } = useShelfParts();

  const armSpacing = useRackConfigStore((s) => s.armSpacing);
  const armCount = useRackConfigStore((s) => s.armCount);
  const armYOverrides = useRackConfigStore((s) => s.armYOverrides);
  const showArmStops = useRackConfigStore((s) => s.showArmStops);

  const columnHeightUnits = getColumnHeight(columnId);
  const armSizeUnits = getPartSize(armId) / 100;
  const armStopLocalZ = armSizeUnits + offsets.arm_stop.z;
  const doubleArmStopLocalZ = armSizeUnits - offsets.arm_stop.double_z;
  const armStopY = getPartData(armId)?.arm_stop_y ?? 0;


  const armPositions = useMemo(() => {
    const basePositions = computeArmPositions(
      offsets.arm.start_y,
      columnHeightUnits,
      armSpacing,
      armCount
    );
    return applyArmYOverrides(basePositions, armYOverrides);
  }, [offsets.arm.start_y, columnHeightUnits, armSpacing, armCount, armYOverrides]);

  return (
    <group position={position}>
      {/* COLUMN */}
      <BasePart id={columnId} position={[offsets.column.x, 0, offsets.column.z]} selectedMode={selectedMode} />

      {/* LEGS */}
      <BasePart
        id={legId}
        position={
          rackType === 'double'
            ? [offsets.leg.x, offsets.leg.y, offsets.leg.double_z]
            : [offsets.leg.x, offsets.leg.y, offsets.leg.z]
        }
        selectedMode={selectedMode}
      />

      {/* ARMS */}
      {armPositions.map((yPos, i) => (
        <ArmAssembly
          key={`arm-${i}`}
          index={i}
          yPos={yPos}
          armId={armId}
          rackType={rackType}
          offsets={offsets}
          armStopY={armStopY}
          armStopLocalZ={armStopLocalZ}
          doubleArmStopLocalZ={doubleArmStopLocalZ}
          showArmStops={showArmStops}
        />
      ))}
    </group>
  );
};