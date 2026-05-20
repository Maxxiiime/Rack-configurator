import React, { useEffect } from 'react';
import { useControls } from 'leva';
import { useRackStore, RackType } from '@/stores/rackStore';
import { Column, Arm, Leg } from './Parts';
import { BraceAssembly } from './BraceAssembly';
import { useShelfParts } from '@/hooks/useShelfParts';

export const RackSystem: React.FC = () => {
  const { 
    rackType, 
    numLevels, 
    activeColumnId, 
    activeArmId, 
    activeBraceId, 
    activeLegId,
    setRackType,
    setNumLevels,
    setActiveColumn,
    setActiveArm,
    setActiveBrace
  } = useRackStore();

  const { getColumnsOptions, getArmsOptions, getBraceLength, getColumnHeight, getOffsets } = useShelfParts();

  // Setup Leva Controls
  const columnsOpts = getColumnsOptions();
  const armsOpts = getArmsOptions();
  
  const widthOpts = [750, 1000, 1250, 1500, 1750, 2000];
  const initialWidth = Number(activeBraceId.split('_').pop() || 1000);

  const [controls, set] = useControls(() => ({
    Type: { value: rackType, options: { 'Single': 'single', 'Double': 'double' } },
    Levels: { value: numLevels, min: 1, max: 10, step: 1 },
    Column: { value: activeColumnId, options: columnsOpts },
    Arm: { value: activeArmId, options: armsOpts },
    Width: { value: initialWidth, options: widthOpts },
  }));

  // Sync Leva -> Zustand
  useEffect(() => {
    if (controls.Type !== rackType) setRackType(controls.Type as RackType);
    if (controls.Levels !== numLevels) setNumLevels(controls.Levels);
    if (controls.Column !== activeColumnId) setActiveColumn(controls.Column);
    if (controls.Arm !== activeArmId) setActiveArm(controls.Arm);
    const newBraceId = `x_braces_${controls.Width}`;
    if (newBraceId !== activeBraceId) setActiveBrace(newBraceId);
  }, [controls, rackType, numLevels, activeColumnId, activeArmId, activeBraceId, setRackType, setNumLevels, setActiveColumn, setActiveArm, setActiveBrace]);

  // Sync Zustand -> Leva (if changed externally)
  useEffect(() => {
    set({
      Type: rackType,
      Levels: numLevels,
      Column: activeColumnId,
      Arm: activeArmId,
      Width: Number(activeBraceId.split('_').pop() || 1000),
    });
  }, [rackType, numLevels, activeColumnId, activeArmId, activeBraceId, set]);

  // Derived values for placement
  const braceIdParts = activeBraceId.split('_');
  const braceLengthKey = braceIdParts[braceIdParts.length - 1];

  const columnSpacing = getBraceLength(braceLengthKey);
  const offsets = getOffsets();
  
  const levels = Array.from({ length: numLevels });
  
  const offsetArmBottom = offsets.arm_start_y;
  const offsetArmTop = offsets.arm_end_y;
  const columnHeightUnits = getColumnHeight(activeColumnId);
  const availableHeight = columnHeightUnits - offsetArmBottom - offsetArmTop;
  const dynamicSpacingY = numLevels > 1 ? availableHeight / (numLevels - 1) : 0;

  return (
    <group>
      {/* LEFT COLUMN */}
      <group>
        <Column id={activeColumnId} position={[offsets.column_x, 0, offsets.column_z]} />
        <Leg 
          id={activeLegId} 
          position={
            rackType === 'double' 
              ? [offsets.leg_x, offsets.leg_y, offsets.double_leg_z_offset]
              : [offsets.leg_x, offsets.leg_y, offsets.leg_z]
          } 
        />
        {levels.map((_, i) => {
          const yPos = offsetArmBottom + i * dynamicSpacingY;
          return (
          <group key={`left-arm-${i}`}>
            <Arm 
              id={activeArmId} 
              position={[offsets.arm_x_offset, yPos, offsets.arm_z_offset]} 
            />
            {rackType === 'double' && (
              <Arm 
                id={activeArmId} 
                position={[offsets.double_arm_x_offset, yPos, offsets.double_arm_z_offset]} 
                rotation={[0, Math.PI, 0]} // Rotate 180 degrees for double face
              />
            )}
          </group>
        )})}
      </group>

      {/* RIGHT COLUMN ASSEMBLY */}
      <group position={[columnSpacing, 0, 0]}>
        <Column id={activeColumnId} position={[offsets.column_x, 0, offsets.column_z]} />
        <Leg 
          id={activeLegId} 
          position={
            rackType === 'double' 
              ? [offsets.leg_x, offsets.leg_y, offsets.double_leg_z_offset]
              : [offsets.leg_x, offsets.leg_y, offsets.leg_z]
          } 
        />
        {levels.map((_, i) => {
          const yPos = offsetArmBottom + i * dynamicSpacingY;
          return (
          <group key={`right-arm-${i}`}>
            <Arm 
              id={activeArmId} 
              position={[offsets.arm_x_offset, yPos, offsets.arm_z_offset]} 
            />
            {rackType === 'double' && (
              <Arm 
                id={activeArmId} 
                position={[offsets.double_arm_x_offset, yPos, offsets.double_arm_z_offset]} 
                rotation={[0, Math.PI, 0]} // Rotate 180 degrees for double face
              />
            )}
          </group>
        )})}
      </group>

      {/* BRACE */}
      <BraceAssembly lengthKey={braceLengthKey} />
    </group>
  );
};
