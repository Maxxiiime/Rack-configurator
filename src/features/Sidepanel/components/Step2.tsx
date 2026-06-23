import { useState } from "react";
import { Text, VStack, Box, Button, Flex, Collapse } from "@chakra-ui/react";
import { sectionLabelStyle } from "../styles";
import { DimensionsCustomization } from "./DimensionsCustomization";
import { ArmCustomization } from "./ArmCustomization";

interface Step2Props {
  onBack: () => void;
}

/* ── Collapsible section header ────────────────────────────────────── */

interface CollapsibleSectionProps {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  withTopBorder?: boolean;
}

function CollapsibleSection({
  label,
  isOpen,
  onToggle,
  children,
  withTopBorder = false,
}: CollapsibleSectionProps) {
  return (
    <Box
      borderTop={withTopBorder ? "1px solid" : undefined}
      borderColor={withTopBorder ? "rgba(0,0,0,0.08)" : undefined}
      pt={withTopBorder ? 4 : 0}
    >
      {/* Header row */}
      <Flex
        align="center"
        justify="space-between"
        cursor="pointer"
        onClick={onToggle}
        mb={isOpen ? 3 : 0}
        py={1}
        px={1}
        borderRadius="md"
        _hover={{ bg: "gray.50" }}
        transition="background 0.15s ease"
        userSelect="none"
      >
        <Text {...sectionLabelStyle} mb={0}>
          {label}
        </Text>

        {/* Chevron icon */}
        <Box
          as="span"
          display="flex"
          alignItems="center"
          justifyContent="center"
          w="18px"
          h="18px"
          borderRadius="full"
          bg="gray.100"
          transition="transform 0.2s ease"
          transform={isOpen ? "rotate(0deg)" : "rotate(-90deg)"}
          flexShrink={0}
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 3.5L5 6.5L8 3.5"
              stroke="#718096"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Box>
      </Flex>

      {/* Collapsible content */}
      <Collapse in={isOpen} animateOpacity>
        <Box pb={2}>{children}</Box>
      </Collapse>
    </Box>
  );
}

/* ── Step2 ─────────────────────────────────────────────────────────── */

export function Step2({ onBack }: Step2Props) {
  const [dimensionsOpen, setDimensionsOpen] = useState(true);
  const [armsOpen, setArmsOpen] = useState(true);

  return (
    <VStack align="stretch" spacing={0} flex={1}>

      {/* ── Custom Dimensions ─────────────────────────────────── */}
      <Box mb={4}>
        <CollapsibleSection
          label="Custom Dimensions"
          isOpen={dimensionsOpen}
          onToggle={() => setDimensionsOpen((v) => !v)}
        >
          <DimensionsCustomization />
        </CollapsibleSection>
      </Box>

      {/* ── Custom Arms ───────────────────────────────────────── */}
      <Box mb={4}>
        <CollapsibleSection
          label="Custom Arms"
          isOpen={armsOpen}
          onToggle={() => setArmsOpen((v) => !v)}
          withTopBorder
        >
          <ArmCustomization />
        </CollapsibleSection>
      </Box>

      {/* ── Back button ───────────────────────────────────────── */}
      <Box pt={5} borderTop="1px solid" borderColor="rgba(0,0,0,0.08)" mt={4}>
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

