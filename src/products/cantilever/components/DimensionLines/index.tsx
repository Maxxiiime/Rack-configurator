import React, { useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Line, Html } from "@react-three/drei";
import * as THREE from "three";
import { getBoundingBoxPoints } from "@/utils/boundingBox";
import offsets from '../../data/offsets.json';
import { useArmPositions } from "../../hooks/useArmPositions";
import { useRackConfigStore } from '../../stores/configStore';
import { getPartSize } from '../../utils/shelfParts';
import { useRackPositions } from "../../hooks/useRackPositions";
import { useEditorStore } from '../../stores/editorStore';
import { DIM_CONFIG, labelStyle, detailLabelStyle } from './style';

interface DimensionLineProps {
    mainLine: [number, number, number][];
    ext1: [number, number, number][];
    ext2: [number, number, number][];
    tick1: [number, number, number][];
    tick2: [number, number, number][];
    labelPos: [number, number, number];
    value: string;
}

/**
 * Reusable sub-component to render a standard dimension line.
 * Includes the main parallel line, perpendicular extension lines, tick marks, and a centered HTML label.
 */
const DimensionLine: React.FC<DimensionLineProps> = ({ mainLine, ext1, ext2, tick1, tick2, labelPos, value }) => (
    <group>
        <Line points={mainLine} color={DIM_CONFIG.colors.main} lineWidth={2} />
        <Line points={ext1} color={DIM_CONFIG.colors.helper} lineWidth={1} dashed dashSize={0.2} gapSize={0.1} />
        <Line points={ext2} color={DIM_CONFIG.colors.helper} lineWidth={1} dashed dashSize={0.2} gapSize={0.1} />
        <Line points={tick1} color={DIM_CONFIG.colors.main} lineWidth={2} />
        <Line points={tick2} color={DIM_CONFIG.colors.main} lineWidth={2} />
        <Html position={labelPos} center zIndexRange={[100, 0]}>
            <div style={labelStyle}>{value}</div>
        </Html>
    </group>
);

interface DimensionLinesProps {
    rackGroupRef: React.RefObject<THREE.Group>;
}

export const DimensionLines: React.FC<DimensionLinesProps> = ({ rackGroupRef }) => {
    const [box, setBox] = useState<THREE.Box3 | null>(null);
    const invMatrix = useMemo(() => new THREE.Matrix4(), []);

    const { armPositions } = useArmPositions();
    const { columnPositionsX } = useRackPositions();
    const currentStep = useEditorStore((s) => s.currentStep);
    const selectedArm = useEditorStore((s) => s.selectedArm);

    // Arm divider config for Z-axis detail
    const showArmDividers = useRackConfigStore((s) => s.showArmDividers);
    const armDividerCount = useRackConfigStore((s) => s.armDividerCount);
    const armId = useRackConfigStore((s) => s.armId);
    const rackType = useRackConfigStore((s) => s.rackType);
    const armYOverrides = useRackConfigStore((s) => s.armYOverrides);
    const armSizeUnits = getPartSize(armId) / 100;

    // Continuously update the bounding box to react to user configuration changes or animations
    useFrame(() => {
        if (!rackGroupRef.current) return;
        const currentBox = getBoundingBoxPoints(rackGroupRef.current);

        // Convert the bounding box world coordinates to the parent's local coordinate space
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

    // Base starting elevation for vertical measurements (accounting for bottom offset like bolts/feet)
    const startY = min.y + offsets.bottom_bolt.y;

    // Helper to format dimensions in mm, rounded to nearest 5mm to hide 3D model inaccuracies
    const formatDim = (valueInUnits: number) => {
        const rawMm = valueInUnits * 100;
        return (Math.round(rawMm / 5) * 5).toFixed(0);
    };

    // Calculate overall dimensions in real-world millimeters
    const lengthX = formatDim(max.x - min.x);
    const heightY = formatDim(max.y - min.y - offsets.bottom_bolt.y);
    const depthZ = formatDim(max.z - min.z);

    // Determine if we need to shift the global Y dimensions
    const isLeftmostModified = 
        Object.keys(armYOverrides).some(k => k.startsWith(`0-`)) || 
        (currentStep === 2 && selectedArm !== null && selectedArm.columnIndex === 0);

    let rightmostUnmodifiedIndex = columnPositionsX.length - 1;
    for (let i = columnPositionsX.length - 1; i >= 0; i--) {
        const isModified = Object.keys(armYOverrides).some(k => k.startsWith(`${i}-`)) || 
                           (currentStep === 2 && selectedArm !== null && selectedArm.columnIndex === i);
        if (!isModified) {
            rightmostUnmodifiedIndex = i;
            break;
        }
    }

    let globalYDetailX = min.x - DIM_CONFIG.offset;
    let detailExtensionStartX = min.x;
    let labelXOffset = -0.3;

    if (isLeftmostModified && rightmostUnmodifiedIndex !== 0) {
        const targetX = columnPositionsX[rightmostUnmodifiedIndex];
        globalYDetailX = targetX + DIM_CONFIG.offset + 0.5;
        detailExtensionStartX = targetX;
        labelXOffset = 0.3;
    }

    // --- X Axis (Length) Coordinate Setup ---
    const xDimZ = min.z - DIM_CONFIG.offset;
    const xData = {
        mainLine: [[min.x, startY, xDimZ], [max.x, startY, xDimZ]] as [number, number, number][],
        ext1: [[min.x, startY, min.z], [min.x, startY, xDimZ]] as [number, number, number][],
        ext2: [[max.x, startY, min.z], [max.x, startY, xDimZ]] as [number, number, number][],
        tick1: [[min.x - DIM_CONFIG.tickSize, startY, xDimZ - DIM_CONFIG.tickSize], [min.x + DIM_CONFIG.tickSize, startY, xDimZ + DIM_CONFIG.tickSize]] as [number, number, number][],
        tick2: [[max.x - DIM_CONFIG.tickSize, startY, xDimZ - DIM_CONFIG.tickSize], [max.x + DIM_CONFIG.tickSize, startY, xDimZ + DIM_CONFIG.tickSize]] as [number, number, number][],
        labelPos: [(min.x + max.x) / 2, startY + 0.3, xDimZ] as [number, number, number],
        value: `${lengthX} mm`
    };

    // --- Y Axis (Height) Coordinate Setup ---
    const yDimX = min.x - DIM_CONFIG.totalOffset;

    const createYData = (zPos: number) => ({
        mainLine: [[yDimX, startY, zPos], [yDimX, max.y, zPos]] as [number, number, number][],
        ext1: [[min.x, startY, zPos], [yDimX, startY, zPos]] as [number, number, number][],
        ext2: [[min.x, max.y, zPos], [yDimX, max.y, zPos]] as [number, number, number][],
        tick1: [[yDimX - DIM_CONFIG.tickSize, startY - DIM_CONFIG.tickSize, zPos], [yDimX + DIM_CONFIG.tickSize, startY + DIM_CONFIG.tickSize, zPos]] as [number, number, number][],
        tick2: [[yDimX - DIM_CONFIG.tickSize, max.y - DIM_CONFIG.tickSize, zPos], [yDimX + DIM_CONFIG.tickSize, max.y + DIM_CONFIG.tickSize, zPos]] as [number, number, number][],
        labelPos: [yDimX, (startY + max.y) / 2, zPos + 0.3] as [number, number, number],
        value: `${heightY} mm`
    });

    const yDataMinZ = createYData(min.z);
    const yDataMaxZ = rackType === 'double' ? createYData(max.z) : null;

    // --- Z Axis (Depth) Coordinate Setup ---
    // Elevate Z dimensions to the first arm level for better readability
    const zDimY = armPositions.length > 0 ? armPositions[0] + 1.3 : startY;
    
    // Arm depth calculation (subtracting 250mm column depth)
    const armDepthMm = rackType === 'double' ? (parseInt(depthZ) - 250) / 2 : parseInt(depthZ) - 250;
    const armZEnd = rackType === 'double' ? min.z + ((max.z - min.z) - 2.5) / 2 : max.z - 2.5;
    
    const zDimX_arm = max.x + DIM_CONFIG.offset;
    const zDimX_global = max.x + DIM_CONFIG.offset + 1.5;

    const armDepthData = {
        mainLine: [[zDimX_arm, startY, min.z], [zDimX_arm, startY, armZEnd]] as [number, number, number][],
        ext1: [[max.x, startY, min.z], [zDimX_arm, startY, min.z]] as [number, number, number][],
        ext2: [[max.x, startY, armZEnd], [zDimX_arm, startY, armZEnd]] as [number, number, number][],
        tick1: [[zDimX_arm - DIM_CONFIG.tickSize, startY, min.z - DIM_CONFIG.tickSize], [zDimX_arm + DIM_CONFIG.tickSize, startY, min.z + DIM_CONFIG.tickSize]] as [number, number, number][],
        tick2: [[zDimX_arm - DIM_CONFIG.tickSize, startY, armZEnd - DIM_CONFIG.tickSize], [zDimX_arm + DIM_CONFIG.tickSize, startY, armZEnd + DIM_CONFIG.tickSize]] as [number, number, number][],
        labelPos: [zDimX_arm + 0.3, startY, (min.z + armZEnd) / 2] as [number, number, number],
        value: `${armDepthMm} mm`
    };

    const columnZStart = armZEnd;
    const columnZEnd = armZEnd + 2.5;

    const columnDepthData = {
        mainLine: [[zDimX_arm, startY, columnZStart], [zDimX_arm, startY, columnZEnd]] as [number, number, number][],
        ext1: [[max.x, startY, columnZStart], [zDimX_arm, startY, columnZStart]] as [number, number, number][],
        ext2: [[max.x, startY, columnZEnd], [zDimX_arm, startY, columnZEnd]] as [number, number, number][],
        tick1: [[zDimX_arm - DIM_CONFIG.tickSize, startY, columnZStart - DIM_CONFIG.tickSize], [zDimX_arm + DIM_CONFIG.tickSize, startY, columnZStart + DIM_CONFIG.tickSize]] as [number, number, number][],
        tick2: [[zDimX_arm - DIM_CONFIG.tickSize, startY, columnZEnd - DIM_CONFIG.tickSize], [zDimX_arm + DIM_CONFIG.tickSize, startY, columnZEnd + DIM_CONFIG.tickSize]] as [number, number, number][],
        labelPos: [zDimX_arm + 0.3, startY, (columnZStart + columnZEnd) / 2] as [number, number, number],
        value: `250 mm`
    };

    const zData = {
        mainLine: [[zDimX_global, startY, min.z], [zDimX_global, startY, max.z]] as [number, number, number][],
        ext1: [[max.x, startY, min.z], [zDimX_global, startY, min.z]] as [number, number, number][],
        ext2: [[max.x, startY, max.z], [zDimX_global, startY, max.z]] as [number, number, number][],
        tick1: [[zDimX_global - DIM_CONFIG.tickSize, startY, min.z - DIM_CONFIG.tickSize], [zDimX_global + DIM_CONFIG.tickSize, startY, min.z + DIM_CONFIG.tickSize]] as [number, number, number][],
        tick2: [[zDimX_global - DIM_CONFIG.tickSize, startY, max.z - DIM_CONFIG.tickSize], [zDimX_global + DIM_CONFIG.tickSize, startY, max.z + DIM_CONFIG.tickSize]] as [number, number, number][],
        labelPos: [zDimX_global + 0.3, startY, (min.z + max.z) / 2] as [number, number, number],
        value: `${depthZ} mm`
    };

    // --- Z Axis Detail (Column depth + Arm Divider Spacing) ---
    const zDetailX = max.x + DIM_CONFIG.totalOffset;

    // Compute Z breakpoints when arm dividers are present
    const zDividerSegments: { from: number; to: number; midZ: number; gapMm: string; index: number }[] = [];
    if (showArmDividers && armDividerCount >= 1 && armSizeUnits > 0) {
        // Compute the Z positions of each divider using the same fraction logic as computeArmDividerPositions
        const dividerZPositions: number[] = [];
        for (let i = 0; i < armDividerCount; i++) {
            const fraction = (i + 1) / (armDividerCount + 1);
            const dividerZ = 0.25 + offsets.arm.z - armSizeUnits * fraction + offsets.arm_divider.z;
            dividerZPositions.push(dividerZ);
        }

        // Sort dividers from max.z (nearest column) toward min.z (arm tip)
        dividerZPositions.sort((a, b) => b - a);

        // The arm attachment Z position (where the arm meets the column)
        const armStartZ = -2;
        // The arm tip Z position (end of arm, toward negative Z)
        const armEndZ = -2 - armSizeUnits;

        // Build breakpoints: arm start (at column) -> each divider -> arm tip
        const zBreakpoints = [armStartZ, ...dividerZPositions, armEndZ];

        for (let i = 0; i < zBreakpoints.length - 1; i++) {
            const from = zBreakpoints[i];   // higher Z (closer to column back)
            const to = zBreakpoints[i + 1]; // lower Z (further out)
            const gap = Math.abs(from - to);

            if (gap >= 0.05) {
                zDividerSegments.push({
                    from,
                    to,
                    midZ: (from + to) / 2,
                    gapMm: formatDim(gap),
                    index: i,
                });
            }
        }
    }

    // --- Vertical Detailing (Arm Spacing Breakdown) ---
    const detailX = globalYDetailX;

    // Create an array of all relevant heights: base start -> foot height -> arms (adjusted for elevation offset) -> column top
    const breakpoints = Array.from(new Set([
        startY,
        2,
        ...armPositions.map(y => y + 1.3),
        max.y
    ])).sort((a, b) => a - b);

    // Generate segments between consecutive breakpoints to display interval gaps
    const armSegments: { from: number; to: number; midY: number; gapMm: string; index: number }[] = [];
    for (let i = 0; i < breakpoints.length - 1; i++) {
        const from = breakpoints[i];
        const to = breakpoints[i + 1];
        const gap = to - from;

        // Filter out excessively small gaps (e.g., overlapping elements)
        if (gap >= 0.05) {
            armSegments.push({
                from,
                to,
                midY: (from + to) / 2,
                gapMm: formatDim(gap),
                index: i,
            });
        }
    }

    const zPositions = rackType === 'double' ? [min.z, max.z] : [min.z];

    return (
        <group>
            {/* Global Outward Dimensions */}
            <DimensionLine {...xData} />
            <DimensionLine {...yDataMinZ} />
            {yDataMaxZ && <DimensionLine {...yDataMaxZ} />}
            <DimensionLine {...zData} />
            <DimensionLine {...armDepthData} />
            <DimensionLine {...columnDepthData} />

            {/* Detailed Inner Dimensions for Arm Intervals (Y axis) */}
            {zPositions.map(zPos => (
                <group key={`arm-intervals-${zPos}`}>
                    {armSegments.map((seg) => (
                        <group key={`arm-seg-${seg.index}-${zPos}`}>
                            <Line points={[[detailX, seg.from, zPos], [detailX, seg.to, zPos]]} color={DIM_CONFIG.colors.main} lineWidth={2} />
                            <Line points={[[detailX - DIM_CONFIG.tickSize, seg.from, zPos], [detailX + DIM_CONFIG.tickSize, seg.from, zPos]]} color={DIM_CONFIG.colors.main} lineWidth={2} />
                            <Line points={[[detailX - DIM_CONFIG.tickSize, seg.to, zPos], [detailX + DIM_CONFIG.tickSize, seg.to, zPos]]} color={DIM_CONFIG.colors.main} lineWidth={2} />
                            <Line points={[[detailExtensionStartX, seg.from, zPos], [detailX, seg.from, zPos]]} color={DIM_CONFIG.colors.main} lineWidth={1} dashed dashSize={0.15} gapSize={0.1} />
                            <Line points={[[detailExtensionStartX, seg.to, zPos], [detailX, seg.to, zPos]]} color={DIM_CONFIG.colors.main} lineWidth={1} dashed dashSize={0.15} gapSize={0.1} />
                            <Html position={[detailX + labelXOffset, seg.midY, zPos]} center zIndexRange={[100, 0]}>
                                <div style={detailLabelStyle}>{`${seg.gapMm} mm`}</div>
                            </Html>
                        </group>
                    ))}
                </group>
            ))}

            {/* Detailed Inner Dimensions for Arm Divider Spacing (Z axis) */}
            {zDividerSegments.map((seg) => (
                <group key={`z-seg-${seg.index}`}>
                    {/* Vertical segment line along Z */}
                    <Line points={[[zDetailX, zDimY, seg.from], [zDetailX, zDimY, seg.to]]} color={DIM_CONFIG.colors.main} lineWidth={2} />
                    {/* Tick marks at each breakpoint */}
                    <Line points={[[zDetailX - DIM_CONFIG.tickSize, zDimY, seg.from], [zDetailX + DIM_CONFIG.tickSize, zDimY, seg.from]]} color={DIM_CONFIG.colors.main} lineWidth={2} />
                    <Line points={[[zDetailX - DIM_CONFIG.tickSize, zDimY, seg.to], [zDetailX + DIM_CONFIG.tickSize, zDimY, seg.to]]} color={DIM_CONFIG.colors.main} lineWidth={2} />
                    {/* Extension dashes from bounding box to detail line */}
                    <Line points={[[max.x, zDimY, seg.from], [zDetailX, zDimY, seg.from]]} color={DIM_CONFIG.colors.main} lineWidth={1} dashed dashSize={0.15} gapSize={0.1} />
                    <Line points={[[max.x, zDimY, seg.to], [zDetailX, zDimY, seg.to]]} color={DIM_CONFIG.colors.main} lineWidth={1} dashed dashSize={0.15} gapSize={0.1} />
                    {/* Label */}
                    <Html position={[zDetailX + 0.3, zDimY, seg.midZ]} center zIndexRange={[100, 0]}>
                        <div style={detailLabelStyle}>{`${seg.gapMm} mm`}</div>
                    </Html>
                </group>
            ))}
        </group>
    );
};