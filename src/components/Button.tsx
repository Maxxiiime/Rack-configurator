import { Box } from "@chakra-ui/react";
import DimensionIcon from "@/assets/svgs/DimensionIcon";
import WeightIcon from "@/assets/svgs/WeightIcon";

interface ButtonProps {
    type: "dimension" | "weight";
    onClick: () => void;
}



export default function Button(props: ButtonProps) {
    const { type, onClick } = props;
    const blueColor = "#2563eb";

    if (type !== "dimension" && type !== "weight") return null;

    const bottomPos = type === "dimension" ? "24px" : "90px";

    return (
        <Box
            as="button"
            type="button"
            onClick={onClick}
            position="fixed"
            bottom={bottomPos}
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
            {type === "dimension" ? (
                <DimensionIcon style={{ width: "1.9rem", height: "1.9rem", display: "block" }} />
            ) : (
                <WeightIcon style={{ width: "2rem", height: "2rem", display: "block" }} />
            )}
        </Box>
    );
}