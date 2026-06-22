import { Text, VStack, Box, Button } from "@chakra-ui/react";
import { sectionLabelStyle } from "../styles";
import { DimensionsCustomization } from "./DimensionsCustomization";
import { ArmCustomization } from "./ArmCustomization";

interface Step2Props {
  onBack: () => void;
}

export function Step2({ onBack }: Step2Props) {
  return (
    <VStack align="stretch" spacing={0} flex={1}>

      {/* ── Custom Dimensions ─────────────────────────────────── */}
      <Box mb={6}>
        <Text {...sectionLabelStyle}>Custom Dimensions</Text>
        <DimensionsCustomization />
      </Box>

      {/* ── Custom Arms ───────────────────────────────────────── */}
      <Box mb={4} borderTop="1px solid" borderColor="rgba(0,0,0,0.08)" pt={5}>
        <Text {...sectionLabelStyle}>Custom Arms</Text>
        <ArmCustomization />
      </Box>

      {/* ── Back button ───────────────────────────────────────── */}
      <Box pt={5} borderTop="1px solid" borderColor="rgba(0,0,0,0.08)" mt={6}>
        <Button
          w="full"
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          fontSize="12px"
          fontWeight={600}
          color="gray.700"
          borderRadius="lg"
          _hover={{ bg: "gray.50", borderColor: "gray.300" }}
          _active={{ bg: "gray.100" }}
          onClick={onBack}
        >
          Back
        </Button>
      </Box>

      {/* ── Finish button ───────────────────────────────────────── */}
      <Box pt={4}>
        <Button
          w="full"
          bg="gray.900"
          color="white"
          fontSize="12px"
          fontWeight={600}
          borderRadius="lg"
          _hover={{ bg: "gray.700" }}
          _active={{ bg: "gray.800" }}
        >
          Finish
        </Button>
      </Box>

    </VStack>
  );
}
