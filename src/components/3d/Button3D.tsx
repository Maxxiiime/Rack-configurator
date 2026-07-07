import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { Box } from "@chakra-ui/react";
import DimensionIcon from "@/assets/svgs/DimensionIcon";
import PlusIcon from "@/assets/svgs/PlusIcon";
import DeleteIcon from "@/assets/svgs/DeleteIcon";
import RulerIcon from "@/assets/svgs/RulerIcon";

interface Button3DProps {
    type: "plus" | "delete" | "dimension" | "ruler";
    position: [number, number, number];
    onClick: () => void;
    isActive?: boolean;
    normal?: [number, number, number];
    scale?: number;
}

const ICON_CONFIG = {
    plus: {
        component: <PlusIcon />,
        color: "#16C700",
        activeColor: "#16C700",
        size: "1.8rem",
    },
    delete: {
        component: <DeleteIcon />,
        color: "#FF0000",
        activeColor: "#FF0000",
        size: "1.6rem",
    },
    dimension: {
        component: <DimensionIcon width="100%" height="100%" />,
        color: "#0066CC",
        activeColor: "#0066CC",
        size: "1.6rem",
    },
    ruler: {
        component: <RulerIcon width="100%" height="100%" />,
        color: "#F59E0B",
        activeColor: "#F59E0B",
        size: "1.6rem",
    },
};

export const Button3D: React.FC<Button3DProps> = ({ type, position, normal, onClick, isActive = false, scale = 1 }) => {
    // Récupère les configurations liées au type
    const { component, color, activeColor, size } = ICON_CONFIG[type];

    const buttonRef = useRef<HTMLButtonElement>(null);
    const vec = useMemo(() => new THREE.Vector3(...position), [position]);
    const normalVec = useMemo(() => normal ? new THREE.Vector3(...normal).normalize() : null, [normal]);

    useFrame(({ camera }) => {
        if (!buttonRef.current || !normalVec) return;
        const camToBtn = new THREE.Vector3().subVectors(vec, camera.position).normalize();
        const dot = camToBtn.dot(normalVec);

        // When dot > 0, camera is behind the button's normal
        const factor = Math.max(0, Math.min((dot + 0.1) / 0.5, 1));

        if (factor > 0) {
            // Interpolate from 255 (white) to 235 (light gray)
            const v = Math.round(255 - factor * 20);
            buttonRef.current.style.setProperty('--btn-bg', `rgb(${v}, ${v}, ${v})`);
        } else {
            buttonRef.current.style.removeProperty('--btn-bg');
        }
    });

    return (
        <Html position={position} center transform={false} zIndexRange={[1000, 0]}>
            <Box
                ref={buttonRef}
                as="button"
                type="button"
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                    event.stopPropagation();
                    onClick();
                }}
                role="group"
                w="3.25rem"
                h="3.25rem"
                border="none"
                borderRadius="33%"
                p={0}
                display="grid"
                placeItems="center"
                cursor="pointer"
                transition="all 140ms ease"
                outline="none"
                pointerEvents="auto"
                transform={`scale(${scale})`}
                bg={isActive ? activeColor : "var(--btn-bg, white)"}
                color={isActive ? "white" : color}
                boxShadow={isActive
                    ? `0 0.5rem 1.25rem rgba(0, 0, 0, 0.35), 0 0 0 3px ${activeColor}40`
                    : "0 0.5rem 1.25rem rgba(0, 0, 0, 0.25)"
                }
                _hover={{
                    bg: isActive ? activeColor : color,
                    color: "white",
                }}
            >
                <Box
                    aria-hidden="true"
                    w={size}
                    h={size}
                    display="block"
                    transition="transform 140ms ease"
                >
                    {component}
                </Box>
            </Box>
        </Html>
    );
};