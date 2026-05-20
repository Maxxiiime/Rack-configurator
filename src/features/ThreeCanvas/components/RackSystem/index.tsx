import React, { useEffect, useMemo } from 'react';
import { useControls } from 'leva';
import { useRackStore, RackType } from '@/stores/rackStore';
import { ColumnAssembly } from './ColumnAssembly';
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

  const { getColumnsOptions, getArmsOptions, getBraceLength } = useShelfParts();

  // Setup Leva Controls with memoized options to prevent needless schema recreation
  const columnsOpts = useMemo(() => getColumnsOptions(), []);
  const armsOpts = useMemo(() => getArmsOptions(), []);

  const widthOpts = [750, 1000, 1250, 1500, 1750, 2000];
  const initialWidth = useMemo(() => Number(activeBraceId.split('_').pop() || 1000), []);

  const [, set] = useControls(() => ({
    Type: {
      value: rackType,
      options: { 'Single': 'single', 'Double': 'double' },
      onChange: (v) => {
        if (v !== rackType) {
          setRackType(v as RackType);
        }
      }
    },
    Levels: {
      value: numLevels,
      min: 1,
      max: 10,
      step: 1,
      onChange: (v) => {
        if (v !== numLevels) {
          setNumLevels(v);
        }
      }
    },
    Column: {
      value: activeColumnId,
      options: columnsOpts,
      onChange: (v) => {
        if (v !== activeColumnId) {
          setActiveColumn(v);
        }
      }
    },
    Arm: {
      value: activeArmId,
      options: armsOpts,
      onChange: (v) => {
        if (v !== activeArmId) {
          setActiveArm(v);
        }
      }
    },
    Width: {
      value: initialWidth,
      options: widthOpts,
      onChange: (v) => {
        const newBraceId = `x_braces_${v}`;
        if (newBraceId !== activeBraceId) {
          setActiveBrace(newBraceId);
        }
      }
    },
  }), [columnsOpts, armsOpts, initialWidth]);

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

  return (
    <group>
      {/* LEFT COLUMN */}
      <ColumnAssembly
        columnId={activeColumnId}
        legId={activeLegId}
        armId={activeArmId}
        rackType={rackType}
        numLevels={numLevels}
      />

      {/* RIGHT COLUMN ASSEMBLY */}
      <ColumnAssembly
        columnId={activeColumnId}
        legId={activeLegId}
        armId={activeArmId}
        rackType={rackType}
        numLevels={numLevels}
        position={[columnSpacing, 0, 0]}
      />

      {/* BRACE */}
      <BraceAssembly lengthKey={braceLengthKey} />
    </group>
  );
};

