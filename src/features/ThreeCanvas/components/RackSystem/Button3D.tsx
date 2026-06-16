import React from "react";
import { Html } from "@react-three/drei";
import { Box } from "@chakra-ui/react";
import DimensionIcon from "@/assets/svgs/DimensionIcon";
import PlusIcon from "@/assets/svgs/PlusIcon";
import DeleteIcon from "@/assets/svgs/DeleteIcon";

interface Button3DProps {
    type: "plus" | "delete" | "dimension";
    position: [number, number, number];
    onClick: () => void;
}

const ICON_CONFIG = {
    plus: {
        component: <PlusIcon />,
        color: "#16C700",
        size: "1.8rem",
    },
    delete: {
        component: <DeleteIcon />,
        color: "#FF0000",
        size: "1.6rem",
    },
    dimension: {
        component: <DimensionIcon width="100%" height="100%" />,
        color: "#0066CC",
        size: "1.6rem",
    },
};

export const Button3D: React.FC<Button3DProps> = ({ type, position, onClick }) => {
    // Récupère les configurations liées au type
    const { component, color, size } = ICON_CONFIG[type];

    return (
        <Html position={position} center transform={false} zIndexRange={[20, 0]}>
            <Box
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
                bg="white"
                color={color}
                boxShadow="0 0.5rem 1.25rem rgba(0, 0, 0, 0.25)"
                _hover={{
                    bg: color,
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