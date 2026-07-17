import React from 'react';
import { CantileverPart as BasePart } from './CantileverPart';
import { useEditorStore } from '../stores/editorStore';
import { useHoverStore } from '@/stores/hoverStore';
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
  const currentStep = useEditorStore((s) => s.currentStep);
  const setSelectedArm = useEditorStore((s) => s.setSelectedArm);

  const hoveredId = useHoverStore((s) => s.hoveredId);
  const setHoveredId = useHoverStore((s) => s.setHoveredId);

  const frontHoverId = `arm-${columnIndex}-${index}-front`;
  const backHoverId = `arm-${columnIndex}-${index}-back`;
  const isHoveredFront = currentStep === 2 && hoveredId === frontHoverId;
  const isHoveredBack = currentStep === 2 && hoveredId === backHoverId;

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

  const isStrictlySelectedFront = selectedArm?.columnIndex === columnIndex && selectedArm?.armIndex === index && (selectedArm?.side === 'front' || selectedArm?.side === undefined);
  const isStrictlySelectedBack = selectedArm?.columnIndex === columnIndex && selectedArm?.armIndex === index && selectedArm?.side === 'back';

  const handlePointerOverFront = (e: any) => {
    if (currentStep === 2) {
      e.stopPropagation();
      document.body.style.cursor = 'pointer';
      setHoveredId(frontHoverId);
    }
  };

  const handlePointerOverBack = (e: any) => {
    if (currentStep === 2) {
      e.stopPropagation();
      document.body.style.cursor = 'pointer';
      setHoveredId(backHoverId);
    }
  };

  const handlePointerOut = () => {
    if (currentStep === 2) {
      document.body.style.cursor = 'auto';
      setHoveredId(null);
    }
  };

  const handleFrontClick = (e: any) => {
    if (currentStep === 2) {
      e.stopPropagation();
      setSelectedArm(isStrictlySelectedFront ? null : { columnIndex, armIndex: index, side: 'front' });
    }
  };

  const handleBackClick = (e: any) => {
    if (currentStep === 2) {
      e.stopPropagation();
      setSelectedArm(isStrictlySelectedBack ? null : { columnIndex, armIndex: index, side: 'back' });
    }
  };

  return (
    <group>
      {/* Front face group */}
      <group
        onClick={handleFrontClick}
        onPointerOver={handlePointerOverFront}
        onPointerOut={handlePointerOut}
      >
        {/* ARM - Single Face */}
        <BasePart
          id={armId}
          position={[offsets.arm.x, yPosFront, offsets.arm.z]}
          selectedMode={isSelectedFront}
          hoveredMode={isHoveredFront}
        />

        {/* ARM STOP - Single Face */}
        {showArmStops && (
          <BasePart
            id={armStopId}
            position={[offsets.arm_stop.x, yPosFront + armStopY, -armStopLocalZ]}
            selectedMode={isSelectedFront}
            hoveredMode={isHoveredFront}
          />
        )}

        {/* ARM DIVIDERS - Single Face */}
        {showArmDividers && singles.map((pos, i) => (
          <BasePart
            key={`divider-single-${i}`}
            id="arm_divider"
            position={[pos.x, pos.y, pos.z]}
            selectedMode={isSelectedFront}
            hoveredMode={isHoveredFront}
          />
        ))}
      </group>

      {/* Double Face */}
      {rackType === 'double' && (
        <group
          onClick={handleBackClick}
          onPointerOver={handlePointerOverBack}
          onPointerOut={handlePointerOut}
        >
          {/* ARM - Double Face */}
          <BasePart
            id={armId}
            position={[offsets.arm.double_x, yPosBack, offsets.arm.double_z]}
            rotation={[0, Math.PI, 0]}
            selectedMode={isSelectedBack}
            hoveredMode={isHoveredBack}
          />

          {/* ARM STOP - Double Face */}
          {showArmStops && (
            <BasePart
              id={armStopId}
              position={[offsets.arm_stop.double_x, yPosBack + armStopY, doubleArmStopLocalZ]}
              rotation={[0, Math.PI, 0]}
              selectedMode={isSelectedBack}
              hoveredMode={isHoveredBack}
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
              hoveredMode={isHoveredBack}
            />
          ))}
        </group>
      )}
    </group>
  );
};

