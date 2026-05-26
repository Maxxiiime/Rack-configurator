import React from "react";
import { Html } from "@react-three/drei";
import { Box } from "@chakra-ui/react";

interface ButtonProps {
    type: "plus" | "delete";
    position: [number, number, number];
    onClick: () => void;
}

const PlusIcon = () => (
    <>
        <path
            d="M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        />
        <path
            d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a8,8,0,0,1-8,8H136v32a8,8,0,0,1-16,0V136H88a8,8,0,0,1,0-16h32V88a8,8,0,0,1,16,0v32h32A8,8,0,0,1,176,128Z"
            fill="currentColor"
        />
    </>
);

const DeleteIcon = () => (
    <path
        d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"
        fill="currentColor"
    />
);

export const Button: React.FC<ButtonProps> = ({ type, position, onClick }) => {
    const isPlus = type === "plus";
    const targetColor = isPlus ? "#16C700" : "#C70000";

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
                color={targetColor} 
                boxShadow="0 0.5rem 1.25rem rgba(0, 0, 0, 0.25)"

				_hover={{
                    bg: targetColor, 
                    color: "white", 
                }}
            >
                <Box
                    as="svg"
                    viewBox="0 0 256 256"
                    aria-hidden="true"
                    focusable="false"
                    w={isPlus ? "1.8rem" : "1.4rem"}
                    h={isPlus ? "1.8rem" : "1.4rem"}
                    display="block"
                    transition="transform 140ms ease"
                >
                    {isPlus ? <PlusIcon /> : <DeleteIcon />}
                </Box>
            </Box>
        </Html>
    );
};

export default Button;