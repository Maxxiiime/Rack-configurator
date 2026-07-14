import React from "react";
import { Line, Html } from "@react-three/drei";
import { DIM_CONFIG, detailLabelStyle } from './style';

interface ArmLocalDimensionProps {
    armPositions: number[];
    columnHeightY: number; // Max Y (local)
    startY: number; // Min Y (local, e.g. offsets.bottom_bolt.y)
    zPos: number; // The Z position for the line
    xPos: number; // The X position for the line
    tickSize?: number;
}

const formatDim = (valueInUnits: number) => {
    const rawMm = valueInUnits * 100;
    return (Math.round(rawMm / 5) * 5).toFixed(0);
};

export const ArmLocalDimension: React.FC<ArmLocalDimensionProps> = ({
    armPositions,
    columnHeightY,
    startY,
    zPos,
    xPos,
    tickSize = DIM_CONFIG.tickSize
}) => {
    // Create an array of all relevant heights: base start -> foot height -> arms (adjusted for elevation offset) -> column top
    const breakpoints = Array.from(new Set([
        startY,
        2,
        ...armPositions.map(y => y + 1.3),
        columnHeightY
    ])).sort((a, b) => a - b);

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
                gapMm: formatDim(gap),
                index: i,
            });
        }
    }

    return (
        <group>
            {armSegments.map((seg) => (
                <group key={`local-arm-seg-${seg.index}`}>
                    <Line points={[[xPos, seg.from, zPos], [xPos, seg.to, zPos]]} color={DIM_CONFIG.colors.main} lineWidth={2} />
                    <Line points={[[xPos - tickSize, seg.from, zPos], [xPos + tickSize, seg.from, zPos]]} color={DIM_CONFIG.colors.main} lineWidth={2} />
                    <Line points={[[xPos - tickSize, seg.to, zPos], [xPos + tickSize, seg.to, zPos]]} color={DIM_CONFIG.colors.main} lineWidth={2} />
                    {/* Add dashed extension lines towards the column to make it clear what is being measured */}
                    <Line points={[[0, seg.from, zPos], [xPos, seg.from, zPos]]} color={DIM_CONFIG.colors.main} lineWidth={1} dashed dashSize={0.15} gapSize={0.1} />
                    <Line points={[[0, seg.to, zPos], [xPos, seg.to, zPos]]} color={DIM_CONFIG.colors.main} lineWidth={1} dashed dashSize={0.15} gapSize={0.1} />
                    <Html position={[xPos - 0.4, seg.midY, zPos]} center zIndexRange={[100, 0]}>
                        <div style={detailLabelStyle}>{`${seg.gapMm} mm`}</div>
                    </Html>
                </group>
            ))}
        </group>
    );
};
