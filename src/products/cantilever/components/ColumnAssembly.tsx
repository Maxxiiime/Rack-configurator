import { useState, useEffect } from 'react';
import { CantileverPart as BasePart } from './CantileverPart';
import { ArmAssembly } from './ArmAssembly';
import { Button3D } from '@/components/3d/Button3D';
import { useEditorStore } from '../stores/editorStore';
import { getPartSize, getPartData, offsets } from '../utils/shelfParts';
import { useRackConfigStore, RackType } from '../stores/configStore';
import { useArmPositions } from "../hooks/useArmPositions";
import { ArmLocalDimension } from './DimensionLines/ArmLocalDimension';

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


  const { armPositions: armPositionsFront } = useArmPositions(columnIndex, 'front');
  const { armPositions: armPositionsBack } = useArmPositions(columnIndex, 'back');
  const currentStep = useEditorStore((s) => s.currentStep);
  const selectedArm = useEditorStore((s) => s.selectedArm);
  const setSelectedArm = useEditorStore((s) => s.setSelectedArm);
  const showDimensions = useEditorStore((s) => s.showDimensions);
  const armYOverrides = useRackConfigStore((s) => s.armYOverrides);

  const hasOverrideFront = Object.keys(armYOverrides).some(k => k.startsWith(`${columnIndex}-front-`));
  const hasOverrideBack = Object.keys(armYOverrides).some(k => k.startsWith(`${columnIndex}-back-`));

  const isEditingThisFront = currentStep === 2 && selectedArm !== null && 
    (selectedArm.columnIndex === columnIndex || (selectedArm.columnIndex === undefined && columnIndex === 0)) && 
    (selectedArm.side === 'front' || selectedArm.side === undefined);
    
  const isEditingThisBack = currentStep === 2 && selectedArm !== null && 
    (selectedArm.columnIndex === columnIndex || (selectedArm.columnIndex === undefined && columnIndex === 0)) && 
    selectedArm.side === 'back';

  const shouldShowFrontDim = isEditingThisFront || (showDimensions && hasOverrideFront);
  const shouldShowBackDim = rackType === 'double' && (isEditingThisBack || (showDimensions && hasOverrideBack));

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
      {armPositionsFront.map((yPosFront, i) => {
        const yPosBack = armPositionsBack[i] ?? yPosFront;
        const isArmSelectedFront = selectedArm?.columnIndex === columnIndex && selectedArm?.armIndex === i && (selectedArm?.side === 'front' || selectedArm?.side === undefined);
        const isArmSelectedBack = selectedArm?.columnIndex === columnIndex && selectedArm?.armIndex === i && selectedArm?.side === 'back';

        return (
          <group key={`arm-group-${i}`}>
            <ArmAssembly
              index={i}
              yPosFront={yPosFront}
              yPosBack={yPosBack}
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
            {/* Edit button for front arm */}
            {currentStep === 2 && (selectedMode || isArmSelectedFront) && (() => {
              const buttonX = buttonDirection === 1 ? offsets.arm.x + 3 : offsets.arm.x - 3;
              return (
                <Button3D
                  type="ruler"
                  position={[buttonX, yPosFront + 1, offsets.arm.z - armSizeUnits - 0.2]}
                  normal={[0, 0, -1]}
                  onClick={() => setSelectedArm(isArmSelectedFront ? null : { columnIndex, armIndex: i, side: 'front' })}
                  isActive={isArmSelectedFront}
                />
              );
            })()}

      {/* Edit button for back arm (if double) */}
            {currentStep === 2 && rackType === 'double' && (selectedMode || isArmSelectedBack) && (() => {
              const buttonX = buttonDirection === 1 ? offsets.arm.double_x + 3 : offsets.arm.double_x - 3;
              return (
                <Button3D
                  type="ruler"
                  position={[buttonX, yPosBack + 1, offsets.arm.double_z + armSizeUnits + 0.2]}
                  normal={[0, 0, 1]}
                  onClick={() => setSelectedArm(isArmSelectedBack ? null : { columnIndex, armIndex: i, side: 'back' })}
                  isActive={isArmSelectedBack}
                />
              );
            })()}
          </group>
        );
      })}

      {/* Local dimensions when editing an arm or when showDimensions is active */}
      {(shouldShowFrontDim || shouldShowBackDim) && (
        <>
          {shouldShowFrontDim && (
            <ArmLocalDimension
              armPositions={armPositionsFront}
              columnHeightY={getPartSize(columnId) / 100}
              startY={offsets.bottom_bolt.y}
              zPos={offsets.arm.z - armSizeUnits}
              xPos={offsets.arm.x - 2}
            />
          )}
          {shouldShowBackDim && (
            <ArmLocalDimension
              armPositions={armPositionsBack}
              columnHeightY={getPartSize(columnId) / 100}
              startY={offsets.bottom_bolt.y}
              zPos={offsets.arm.double_z + armSizeUnits}
              xPos={offsets.arm.double_x + 2}
            />
          )}
        </>
      )}
    </group>
  );
};