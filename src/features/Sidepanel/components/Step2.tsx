import { useState } from "react";
import { Text, VStack, Box, Button } from "@chakra-ui/react";
import { useEditorStore } from "@/stores/cantilever/editorStore";
import { CollapsibleMenu } from "./CollapsibleMenu";
import { GlobalSettings } from "./GlobalSettings";
import { RackEditor } from "./RackEditor";
import { ArmRowEditor } from "./ArmRowEditor";
import RulerIcon from "@/assets/svgs/RulerIcon";

interface Step2Props {
  onBack: () => void;
}

/* ── Step2 ─────────────────────────────────────────────────────────── */

export function Step2({ onBack }: Step2Props) {
  const [globalOpen, setGlobalOpen] = useState(true);

  const selectedRackId = useEditorStore((s) => s.selectedRackId);
  const selectedArmIndex = useEditorStore((s) => s.selectedArmIndex);
  const setCurrentStep = useEditorStore((s) => s.setCurrentStep);

  const hasSelection = selectedRackId !== null || selectedArmIndex !== null;

  return (
    <VStack align="stretch" spacing={0} flex={1}>

      {/* ── Global Settings ───────────────────────────────────── */}
      <Box mb={4}>
        <CollapsibleMenu
          label="Global Settings"
          isOpen={globalOpen}
          onToggle={() => setGlobalOpen((v) => !v)}
        >
          <GlobalSettings />
        </  CollapsibleMenu>
      </Box>

      {/* ── Dynamic: Selected Rack ────────────────────────────── */}
      {selectedRackId && <RackEditor rackId={selectedRackId} />}

      {/* ── Dynamic: Selected Arm Row ─────────────────────────── */}
      {selectedArmIndex !== null && <ArmRowEditor armIndex={selectedArmIndex} />}

      {/* ── No selection hint ─────────────────────────────────── */}
      {!hasSelection && (
        <Box
          mb={4}
          p={3}
          borderRadius="lg"
          bg="orange.50"
          border="1px solid"
          borderColor="orange.200"
        >
          <Text fontSize="11px" color="orange.600" lineHeight="1.4">
            Click on{' '}
            <Box
              as="span"
              display="inline-block"
              w="18px"
              h="18px"
              color="orange.500"
              verticalAlign="middle"
              mx={1}
            >
              <RulerIcon width="100%" height="100%" />
            </Box>{' '}
            to edit a specific rack or arm row.
          </Text>
        </Box>
      )}

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
          onClick={() => setCurrentStep(3)}
        >
          Finish
        </Button>
      </Box>

    </VStack>
  );
}
