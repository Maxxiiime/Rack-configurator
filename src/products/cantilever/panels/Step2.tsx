import { useState } from "react";
import { Text, VStack, Box } from "@chakra-ui/react";
import { useEditorStore } from "../stores/editorStore";
import { CollapsibleMenu } from "@/features/Sidepanel/components/CollapsibleMenu";
import { SpacingSettings } from "./SpacingSettings";
import { ArmRowEditor } from "./ArmRowEditor";

/* ── Step2 ─────────────────────────────────────────────────────────── */

export function Step2() {
  const [globalOpen, setGlobalOpen] = useState(true);

  const selectedArm = useEditorStore((s) => s.selectedArm);

  return (
    <VStack align="stretch" spacing={0} flex={1}>

      {/* ── Global Settings ───────────────────────────────────── */}
      <Box mb={4}>
        <CollapsibleMenu
          label="Global Settings"
          isOpen={globalOpen}
          onToggle={() => setGlobalOpen((v) => !v)}
        >
          <SpacingSettings />
        </CollapsibleMenu>
      </Box>

      {/* ── Dynamic: Selected Arm ─────────────────────────── */}
      {selectedArm !== null && <ArmRowEditor armIndex={selectedArm.armIndex} columnIndex={selectedArm.columnIndex} side={selectedArm.side} />}

      {/* ── No selection hint ─────────────────────────────────── */}
      {selectedArm === null && (
        <Box
          mt={2}
          p={3}
          borderRadius="lg"
          bg="orange.50"
          border="1px solid"
          borderColor="orange.200"
        >
          <Text fontSize="11px" color="orange.600" lineHeight="1.4">
            Click on an arm to edit its position
          </Text>
        </Box>
      )}

    </VStack>
  );
}
