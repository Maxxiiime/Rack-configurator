import React, { useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Line, Html } from "@react-three/drei";
import * as THREE from "three";
import { getBoundingBoxPoints } from "@/utils/boundingBox";
import offsets from '@/data/shelving_offset.json';
import { useRackConfigStore } from '@/stores/cantilever/rackConfigStore';
import { useRackSectionsStore } from '@/stores/cantilever/rackSectionsStore';
import { useShelfParts } from '@/hooks/useShelfParts';
import { useRackPositions } from '@/hooks/useRackPositions';
import { computeArmPositions, applyArmYOverrides } from '@/utils/armPositions';
import { baseLabelStyle } from '../DimensionsLines/style';

const WEIGHT_CONFIG = {
    offset: 1.2,
    tickSize: 0.1,
    colors: {
        main: "#ea580c",
        helper: "#ea580c",
        detail: "#f97316"
    }
};

const labelStyle: React.CSSProperties = {
    ...baseLabelStyle,
    color: WEIGHT_CONFIG.colors.main,
    padding: "4px 8px",
    fontSize: "14px",
};

const detailLabelStyle: React.CSSProperties = {
    ...baseLabelStyle,
    color: WEIGHT_CONFIG.colors.main,
    padding: "2px 6px",
    fontSize: "12px",
    borderRadius: "4px",
};

interface WeightInfoProps {
    rackGroupRef: React.RefObject<THREE.Group>;
}

export const WeightInfo: React.FC<WeightInfoProps> = ({ rackGroupRef }) => {
    const [box, setBox] = useState<THREE.Box3 | null>(null);
    const invMatrix = useMemo(() => new THREE.Matrix4(), []);

    const armSpacing = useRackConfigStore((s) => s.armSpacing);
    const armCount = useRackConfigStore((s) => s.armCount);
    const armYOverrides = useRackConfigStore((s) => s.armYOverrides);
    const columnId = useRackConfigStore((s) => s.columnId);
    const armId = useRackConfigStore((s) => s.armId);
    const removeFirstColumn = useRackConfigStore((s) => s.removeFirstColumn);
    const removeLastColumn = useRackConfigStore((s) => s.removeLastColumn);
    const rackIds = useRackSectionsStore((s) => s.rackIds);

    const { getColumnHeight, getColumnMaxWeightForArm, getPartData } = useShelfParts();
    const { columnPositionsX } = useRackPositions();

    const columnHeightUnits = getColumnHeight(columnId);

    const armPositions = useMemo(() => {
        const base = computeArmPositions(offsets.arm.start_y, columnHeightUnits, armSpacing, armCount);
        return [...applyArmYOverrides(base, armYOverrides)].sort((a, b) => a - b);
    }, [columnHeightUnits, armSpacing, armCount, armYOverrides]);

    useFrame(() => {
        if (!rackGroupRef.current) return;
        const currentBox = getBoundingBoxPoints(rackGroupRef.current);
        if (rackGroupRef.current.parent) {
            invMatrix.copy(rackGroupRef.current.parent.matrixWorld).invert();
            currentBox.applyMatrix4(invMatrix);
        }
        if (
            !box ||
            Math.abs(currentBox.min.x - box.min.x) > 0.001 ||
            Math.abs(currentBox.max.x - box.max.x) > 0.001 ||
            Math.abs(currentBox.min.y - box.min.y) > 0.001 ||
            Math.abs(currentBox.max.y - box.max.y) > 0.001 ||
            Math.abs(currentBox.min.z - box.min.z) > 0.001 ||
            Math.abs(currentBox.max.z - box.max.z) > 0.001
        ) {
            setBox(currentBox.clone());
        }
    });

    if (!box) return null;

    const { min, max } = box;

    // Compute weights
    const columnMaxWeight = getColumnMaxWeightForArm(columnId, armId);
    const displayMaxWeight = columnMaxWeight === Infinity ? 0 : columnMaxWeight;

    const armData = getPartData(armId);
    const armMaxWeight = armData?.max_weight ?? 0;
    const topY = max.y + 0.5;

    return (
        <group>
            {/* Total Weight Label on Top between columns (per section) */}
            {rackIds.map((rackId, index) => {
                const startX = columnPositionsX[index];
                const endX = columnPositionsX[index + 1];

                if (removeLastColumn && index === 0) return null;
                if (removeFirstColumn && index === rackIds.length - 1) return null;

                const midX = (startX + endX) / 2;

                return (
                    <Html key={`weight-section-${rackId}`} position={[midX, topY, (min.z + max.z) / 2]} center zIndexRange={[100, 0]}>
                        <div style={labelStyle}>{`${displayMaxWeight} kg`}</div>
                    </Html>
                );
            })}

            {/* Arm Level Labels */}
            {armPositions.map((yPos, index) => {
                const actualY = yPos + 1.3;
                const rightX = max.x + WEIGHT_CONFIG.offset;
                return (
                    <group key={`weight-arm-${index}`}>
                        <Line points={[[max.x, actualY, min.z], [rightX, actualY, min.z]]} color={WEIGHT_CONFIG.colors.main} lineWidth={1} dashed dashSize={0.15} gapSize={0.1} />
                        <Html position={[rightX + 0.3, actualY, min.z]} center zIndexRange={[100, 0]}>
                            <div style={detailLabelStyle}>{`${armMaxWeight} kg`}</div>
                        </Html>
                    </group>
                );
            })}
        </group>
    );
};
