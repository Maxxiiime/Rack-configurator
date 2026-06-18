import React, { useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Line, Html } from "@react-three/drei";
import * as THREE from "three";
import { getBoundingBoxPoints } from "@/utils/boundingBox";
import offsets from '@/data/shelving_offset.json';
import { useRackConfigStore } from '@/stores/cantilever/rackConfigStore';
import { useShelfParts } from '@/hooks/useShelfParts';
import { computeArmPositions, applyArmYOverrides } from '@/utils/armPositions';
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
    // State to store the bounding box boundaries of the rack structure
    const [box, setBox] = useState<THREE.Box3 | null>(null);

    // Memoize the matrix to prevent high garbage collection overhead during the 60fps useFrame loop
    const invMatrix = useMemo(() => new THREE.Matrix4(), []);

    // Retrieve rack configuration states from the global store
    const armSpacing = useRackConfigStore((s) => s.armSpacing);
    const armCount = useRackConfigStore((s) => s.armCount);
    const armYOverrides = useRackConfigStore((s) => s.armYOverrides);
    const columnId = useRackConfigStore((s) => s.columnId);
    const { getColumnHeight } = useShelfParts();

    const columnHeightUnits = getColumnHeight(columnId);

    // Calculate and sort the absolute Y positions of each arm from bottom to top
    const armPositions = useMemo(() => {
        const base = computeArmPositions(offsets.arm.start_y, columnHeightUnits, armSpacing, armCount);
        return [...applyArmYOverrides(base, armYOverrides)].sort((a, b) => a - b);
    }, [columnHeightUnits, armSpacing, armCount, armYOverrides]);

    // Continuously update the bounding box to react to user configuration changes or animations
    useFrame(() => {
        if (!rackGroupRef.current) return;
        const currentBox = getBoundingBoxPoints(rackGroupRef.current);

        // Convert the bounding box world coordinates to the parent's local coordinate space
        if (rackGroupRef.current.parent) {
            invMatrix.copy(rackGroupRef.current.parent.matrixWorld).invert();
            currentBox.applyMatrix4(invMatrix);
        }

        // Performance optimization: Only trigger a React state update if the bounding box has changed 
        // significantly (tolerance of 1mm) to avoid useless re-renders.
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

    // Suspend rendering until the initial bounding box is calculated
    if (!box) return null;

    const { min, max } = box;

    // Base starting elevation for vertical measurements (accounting for bottom offset like bolts/feet)
    const startY = min.y + offsets.bottom_bolt.y;

    // Calculate overall dimensions in real-world millimeters
    const lengthX = ((max.x - min.x) * 100).toFixed(0);
    const heightY = ((max.y - min.y - offsets.bottom_bolt.y) * 100).toFixed(0);
    const depthZ = ((max.z - min.z) * 100).toFixed(0);

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
    const yData = {
        mainLine: [[yDimX, startY, min.z], [yDimX, max.y, min.z]] as [number, number, number][],
        ext1: [[min.x, startY, min.z], [yDimX, startY, min.z]] as [number, number, number][],
        ext2: [[min.x, max.y, min.z], [yDimX, max.y, min.z]] as [number, number, number][],
        tick1: [[yDimX - DIM_CONFIG.tickSize, startY - DIM_CONFIG.tickSize, min.z], [yDimX + DIM_CONFIG.tickSize, startY + DIM_CONFIG.tickSize, min.z]] as [number, number, number][],
        tick2: [[yDimX - DIM_CONFIG.tickSize, max.y - DIM_CONFIG.tickSize, min.z], [yDimX + DIM_CONFIG.tickSize, max.y + DIM_CONFIG.tickSize, min.z]] as [number, number, number][],
        labelPos: [yDimX, (startY + max.y) / 2, min.z + 0.3] as [number, number, number],
        value: `${heightY} mm`
    };

    // --- Z Axis (Depth) Coordinate Setup ---
    const zDimX = max.x + DIM_CONFIG.offset;
    const zData = {
        mainLine: [[zDimX, startY, min.z], [zDimX, startY, max.z]] as [number, number, number][],
        ext1: [[max.x, startY, min.z], [zDimX, startY, min.z]] as [number, number, number][],
        ext2: [[max.x, startY, max.z], [zDimX, startY, max.z]] as [number, number, number][],
        tick1: [[zDimX - DIM_CONFIG.tickSize, startY, min.z - DIM_CONFIG.tickSize], [zDimX + DIM_CONFIG.tickSize, startY, min.z + DIM_CONFIG.tickSize]] as [number, number, number][],
        tick2: [[zDimX - DIM_CONFIG.tickSize, startY, max.z - DIM_CONFIG.tickSize], [zDimX + DIM_CONFIG.tickSize, startY, max.z + DIM_CONFIG.tickSize]] as [number, number, number][],
        labelPos: [zDimX + 0.3, startY, (min.z + max.z) / 2] as [number, number, number],
        value: `${depthZ} mm`
    };

    // --- Vertical Detailing (Arm Spacing Breakdown) ---
    const detailX = min.x - DIM_CONFIG.offset;

    // Create an array of all relevant heights: base start -> arms (adjusted for elevation offset) -> column top
    const breakpoints = [startY, ...armPositions.map(y => y + 1.3), max.y];

    // Generate segments between consecutive breakpoints to display interval gaps
    const armSegments = [];
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
                gapMm: (gap * 100).toFixed(0),
                index: i,
            });
        }
    }

    return (
        <group>
            {/* Global Outward Dimensions */}
            <DimensionLine {...xData} />
            <DimensionLine {...yData} />
            <DimensionLine {...zData} />

            {/* Detailed Inner Dimensions for Arm Intervals */}
            {armSegments.map((seg) => (
                <group key={`arm-seg-${seg.index}`}>
                    <Line points={[[detailX, seg.from, min.z], [detailX, seg.to, min.z]]} color={DIM_CONFIG.colors.main} lineWidth={2} />
                    <Line points={[[detailX - DIM_CONFIG.tickSize, seg.from, min.z], [detailX + DIM_CONFIG.tickSize, seg.from, min.z]]} color={DIM_CONFIG.colors.main} lineWidth={2} />
                    <Line points={[[detailX - DIM_CONFIG.tickSize, seg.to, min.z], [detailX + DIM_CONFIG.tickSize, seg.to, min.z]]} color={DIM_CONFIG.colors.main} lineWidth={2} />
                    <Line points={[[min.x, seg.from, min.z], [detailX, seg.from, min.z]]} color={DIM_CONFIG.colors.main} lineWidth={1} dashed dashSize={0.15} gapSize={0.1} />
                    <Line points={[[min.x, seg.to, min.z], [detailX, seg.to, min.z]]} color={DIM_CONFIG.colors.main} lineWidth={1} dashed dashSize={0.15} gapSize={0.1} />
                    <Html position={[detailX - 0.3, seg.midY, min.z]} center zIndexRange={[100, 0]}>
                        <div style={detailLabelStyle}>{`${seg.gapMm} mm`}</div>
                    </Html>
                </group>
            ))}
        </group>
    );
};