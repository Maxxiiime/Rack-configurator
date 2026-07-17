import { Text, VStack, Box } from "@chakra-ui/react";
import { useEditorStore } from "../stores/editorStore";
import { SpacingSettings } from "./SpacingSettings";
import { ArmRowEditor } from "./ArmRowEditor";
import { hintBoxStyle, hintTextStyle } from "@/features/Sidepanel/styles";

/* ── Step2 ─────────────────────────────────────────────────────────── */

export function Step2() {
  const selectedArm = useEditorStore((s) => s.selectedArm);

  return (
    <VStack align="stretch" spacing={0} flex={1}>

      {/* ── Global Settings ───────────────────────────────────── */}
      <Box mb={4}>
        <SpacingSettings />
      </Box>

      {/* ── Dynamic: Selected Arm ─────────────────────────── */}
      {selectedArm !== null && <ArmRowEditor armIndex={selectedArm.armIndex} columnIndex={selectedArm.columnIndex} side={selectedArm.side} />}

      {/* ── No selection hint ─────────────────────────────────── */}
      {selectedArm === null && (
        <Box mt={2} {...hintBoxStyle}>
          <Text {...hintTextStyle}>
            Click on an arm to edit its position
          </Text>
        </Box>
      )}

    </VStack>
  );
}
