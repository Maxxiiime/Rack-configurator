import { BasePart } from './Parts';
import { ArmAssembly } from './ArmAssembly';
import { useShelfParts } from '@/hooks/useShelfParts';
import { useRackConfigStore, RackType } from '@/stores/cantilever/rackConfigStore';
import { useArmPositions } from "@/hooks/useArmPositions";

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
  const { getPartSize, getPartData, offsets } = useShelfParts();


  const showArmStops = useRackConfigStore((s) => s.showArmStops);

  const armSizeUnits = getPartSize(armId) / 100;
  const armStopLocalZ = armSizeUnits + offsets.arm_stop.z;
  const doubleArmStopLocalZ = armSizeUnits - offsets.arm_stop.double_z;
  const armStopY = getPartData(armId)?.arm_stop_y ?? 0;
  const armStopId = getPartData(armId)?.arm_stop_id ?? 'arm_stop';


  const { armPositions } = useArmPositions();

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
          armStopId={armStopId}
        />
      ))}
    </group>
  );
};