import React from "react";
import { Box } from "@chakra-ui/react";
import DimensionIcon from "@/assets/svgs/DimensionIcon";

interface ButtonProps {
    type: "dimension";
    onClick: () => void;
}



export default function Button(props: ButtonProps) {
    const { type, onClick } = props;
    const blueColor = "#2563eb";

    if (type !== "dimension") return null;

    return (
        <Box
            as="button"
            type="button"
            onClick={onClick}
            position="fixed"
            bottom="24px"
            left="24px"
            zIndex={999}
            w="3.25rem"
            h="3.25rem"
            border="none"
            borderRadius="33%"
            p={0}
            display="grid"
            placeItems="center"
            cursor="pointer"
            transition="all 140ms ease"
            bg="white"
            color={blueColor}
            boxShadow="0 0.5rem 1.25rem rgba(0, 0, 0, 0.25)"
            _hover={{
                bg: blueColor,
                color: "white",
            }}
        >
            <DimensionIcon style={{ width: "1.6rem", height: "1.6rem", display: "block" }} />
        </Box>
    );
}