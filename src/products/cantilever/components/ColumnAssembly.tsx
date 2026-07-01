import { useState, useEffect } from 'react';
import { CantileverPart as BasePart } from './CantileverPart';
import { ArmAssembly } from './ArmAssembly';
import { Button3D } from '@/components/3d/Button3D';
import { useEditorStore } from '../stores/editorStore';
import { useShelfParts } from '../hooks/useShelfParts';
import { useRackConfigStore, RackType } from '../stores/configStore';
import { useArmPositions } from "../hooks/useArmPositions";

interface ColumnAssemblyProps {
  columnId: string;
  legId: string;
  armId: string;
  rackType: RackType;
  position?: [number, number, number];
  selectedMode?: boolean;
  columnIndex: number;
  iconDirection?: 1 | -1;
}

export const ColumnAssembly: React.FC<ColumnAssemblyProps> = ({
  columnId,
  legId,
  armId,
  rackType,
  position = [0, 0, 0],
  selectedMode = false,
  columnIndex,
  iconDirection = 1,
}) => {
  const { getPartSize, getPartData, offsets } = useShelfParts();

  const [buttonDirection, setButtonDirection] = useState<1 | -1>(iconDirection);
  useEffect(() => {
    if (selectedMode) {
      setButtonDirection(iconDirection);
    }
  }, [selectedMode, iconDirection]);

  const showArmStops = useRackConfigStore((s) => s.showArmStops);
  const showArmDividers = useRackConfigStore((s) => s.showArmDividers);
  const armDividerCount = useRackConfigStore((s) => s.armDividerCount);

  const armSizeUnits = getPartSize(armId) / 100;
  const armStopLocalZ = armSizeUnits + offsets.arm_stop.z;
  const doubleArmStopLocalZ = armSizeUnits - offsets.arm_stop.double_z;
  const armStopY = getPartData(armId)?.arm_stop_y ?? 0;
  const armStopId = getPartData(armId)?.arm_stop_id ?? 'arm_stop';


  const { armPositions } = useArmPositions(columnIndex);
  const currentStep = useEditorStore((s) => s.currentStep);
  const selectedArm = useEditorStore((s) => s.selectedArm);
  const setSelectedArm = useEditorStore((s) => s.setSelectedArm);

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
      {armPositions.map((yPos, i) => {
        const isArmSelected = selectedArm?.columnIndex === columnIndex && selectedArm?.armIndex === i;

        return (
          <group key={`arm-group-${i}`}>
            <ArmAssembly
              index={i}
              yPos={yPos}
              armId={armId}
              rackType={rackType}
              offsets={offsets}
              armStopY={armStopY}
              armStopLocalZ={armStopLocalZ}
              doubleArmStopLocalZ={doubleArmStopLocalZ}
              showArmStops={showArmStops}
              showArmDividers={showArmDividers}
              armDividerCount={armDividerCount}
              armStopId={armStopId}
              columnIndex={columnIndex}
              armSizeUnits={armSizeUnits}
            />
            {/* Edit button for this specific arm */}
            {currentStep === 2 && (selectedMode || isArmSelected) && (() => {
              const buttonX = buttonDirection === 1 ? offsets.arm.x + 3 : offsets.arm.x - 3;

              return (
                <Button3D
                  type="ruler"
                  position={[buttonX, yPos + 1, offsets.arm.z + 2]}
                  onClick={() => setSelectedArm(isArmSelected ? null : { columnIndex, armIndex: i })}
                  isActive={isArmSelected}
                />
              );
            })()}
          </group>
        );
      })}
    </group>
  );
};