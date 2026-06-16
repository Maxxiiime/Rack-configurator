import React, { useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Line, Html } from "@react-three/drei";
import * as THREE from "three";
import { getBoundingBoxPoints } from "@/utils/boundingBox";
import offsets from '@/data/shelving_offset.json';

interface DimensionLinesProps {
    rackGroupRef: React.RefObject<THREE.Group>;
}

export const DimensionLines: React.FC<DimensionLinesProps> = ({ rackGroupRef }) => {
    const [box, setBox] = useState<THREE.Box3 | null>(null);

    useFrame(() => {
        if (!rackGroupRef.current) return;
        const currentBox = getBoundingBoxPoints(rackGroupRef.current);

        if (rackGroupRef.current.parent) {
            const inv = new THREE.Matrix4().copy(rackGroupRef.current.parent.matrixWorld).invert();
            currentBox.applyMatrix4(inv);
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

    const min = box.min;
    const max = box.max;

    const lengthX = (max.x - min.x) / 10;
    const heightY = (max.y - min.y - offsets.bottom_bolt.y) / 10;
    const depthZ = (max.z - min.z) / 10;

    const offset = 0.8;
    const tickSize = 0.1;
    const mainColor = "#16a34a";
    const helperColor = "#16a34a";

    // Style CSS réutilisable pour les étiquettes HTML
    const labelStyle: React.CSSProperties = {
        background: "white",
        color: mainColor,
        padding: "4px 8px",
        borderRadius: "6px",
        fontFamily: "sans-serif",
        fontSize: "14px",
        fontWeight: "bold",
        whiteSpace: "nowrap",
        boxShadow: "0px 2px 4px rgba(0,0,0,0.1)", // Légère ombre pour détacher l'étiquette
        userSelect: "none"
    };

    // ----------------------------------------------------
    // 1. LONGUEUR (X Axis)
    // ----------------------------------------------------
    const startY = min.y + offsets.bottom_bolt.y;

    const xDimZ = min.z - offset;
    const xMainLine: [number, number, number][] = [[min.x, startY, xDimZ], [max.x, startY, xDimZ]];
    const xExtLeft: [number, number, number][] = [[min.x, startY, min.z], [min.x, startY, xDimZ]];
    const xExtRight: [number, number, number][] = [[max.x, startY, min.z], [max.x, startY, xDimZ]];
    const xTickLeft: [number, number, number][] = [[min.x - tickSize, startY, xDimZ - tickSize], [min.x + tickSize, startY, xDimZ + tickSize]];
    const xTickRight: [number, number, number][] = [[max.x - tickSize, startY, xDimZ - tickSize], [max.x + tickSize, startY, xDimZ + tickSize]];
    const xLabelPos: [number, number, number] = [(min.x + max.x) / 2, startY + 0.3, xDimZ];

    // ----------------------------------------------------
    // 2. HAUTEUR (Y Axis)
    // ----------------------------------------------------
    const yDimX = min.x - offset;
    const yMainLine: [number, number, number][] = [[yDimX, startY, min.z], [yDimX, max.y, min.z]];
    const yExtBottom: [number, number, number][] = [[min.x, startY, min.z], [yDimX, startY, min.z]];
    const yExtTop: [number, number, number][] = [[min.x, max.y, min.z], [yDimX, max.y, min.z]];
    const yTickBottom: [number, number, number][] = [[yDimX - tickSize, startY - tickSize, min.z], [yDimX + tickSize, startY + tickSize, min.z]];
    const yTickTop: [number, number, number][] = [[yDimX - tickSize, max.y - tickSize, min.z], [yDimX + tickSize, max.y + tickSize, min.z]];
    const yLabelPos: [number, number, number] = [yDimX, (startY + max.y) / 2, min.z + 0.3];

    // ----------------------------------------------------
    // 3. PROFONDEUR (Z Axis)
    // ----------------------------------------------------
    const zDimX = max.x + offset;
    const zMainLine: [number, number, number][] = [[zDimX, startY, min.z], [zDimX, startY, max.z]];
    const zExtFront: [number, number, number][] = [[max.x, startY, min.z], [zDimX, startY, min.z]];
    const zExtBack: [number, number, number][] = [[max.x, startY, max.z], [zDimX, startY, max.z]];
    const zTickFront: [number, number, number][] = [[zDimX - tickSize, startY, min.z - tickSize], [zDimX + tickSize, startY, min.z + tickSize]];
    const zTickBack: [number, number, number][] = [[zDimX - tickSize, startY, max.z - tickSize], [zDimX + tickSize, startY, max.z + tickSize]];
    const zLabelPos: [number, number, number] = [zDimX + 0.3, startY, (min.z + max.z) / 2];

    return (
        <group>
            {/* 1. LONGUEUR (X) */}
            <Line points={xMainLine} color={mainColor} lineWidth={2} />
            <Line points={xExtLeft} color={helperColor} lineWidth={1} dashed dashSize={0.2} gapSize={0.1} />
            <Line points={xExtRight} color={helperColor} lineWidth={1} dashed dashSize={0.2} gapSize={0.1} />
            <Line points={xTickLeft} color={mainColor} lineWidth={2} />
            <Line points={xTickRight} color={mainColor} lineWidth={2} />
            <Html position={xLabelPos} center zIndexRange={[100, 0]}>
                <div style={labelStyle}>
                    {`${(lengthX * 1000).toFixed(0)} mm`}
                </div>
            </Html>

            {/* 2. HAUTEUR (Y) */}
            <Line points={yMainLine} color={mainColor} lineWidth={2} />
            <Line points={yExtBottom} color={helperColor} lineWidth={1} dashed dashSize={0.2} gapSize={0.1} />
            <Line points={yExtTop} color={helperColor} lineWidth={1} dashed dashSize={0.2} gapSize={0.1} />
            <Line points={yTickBottom} color={mainColor} lineWidth={2} />
            <Line points={yTickTop} color={mainColor} lineWidth={2} />
            <Html position={yLabelPos} center zIndexRange={[100, 0]}>
                <div style={labelStyle}>
                    {`${(heightY * 1000).toFixed(0)} mm`}
                </div>
            </Html>

            {/* 3. PROFONDEUR (Z) */}
            <Line points={zMainLine} color={mainColor} lineWidth={2} />
            <Line points={zExtFront} color={helperColor} lineWidth={1} dashed dashSize={0.2} gapSize={0.1} />
            <Line points={zExtBack} color={helperColor} lineWidth={1} dashed dashSize={0.2} gapSize={0.1} />
            <Line points={zTickFront} color={mainColor} lineWidth={2} />
            <Line points={zTickBack} color={mainColor} lineWidth={2} />
            <Html position={zLabelPos} center zIndexRange={[100, 0]}>
                <div style={labelStyle}>
                    {`${(depthZ * 1000).toFixed(0)} mm`}
                </div>
            </Html>
        </group>
    );
};