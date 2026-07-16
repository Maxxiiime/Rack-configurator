import {
  Box,
  Text,
  VStack,
  Select,
  Checkbox,
} from "@chakra-ui/react";
import { useRackConfigStore, RackType } from "../stores/configStore";
import { useEditorStore } from "../stores/editorStore";
import { columnOptions, widthOptions, getPartSize, findPartId } from "../utils/shelfParts";
import {
  sectionBoxStyle,
  sectionLabelStyle,
  selectStyle,
} from "@/features/Sidepanel/styles";
import { PillGroup, Row } from "@/components/ui/Shared";
import { RackEditor } from "./RackEditor";

export function Step1() {
  const rackType = useRackConfigStore((s) => s.rackType);
  const columnId = useRackConfigStore((s) => s.columnId);
  const braceId = useRackConfigStore((s) => s.braceId);
  const removeFirstColumn = useRackConfigStore((s) => s.removeFirstColumn);
  const removeLastColumn = useRackConfigStore((s) => s.removeLastColumn);

  const setRackType = useRackConfigStore((s) => s.setRackType);
  const setColumnId = useRackConfigStore((s) => s.setColumnId);
  const setBraceId = useRackConfigStore((s) => s.setBraceId);
  const toggleRemoveFirstColumn = useRackConfigStore((s) => s.toggleRemoveFirstColumn);
  const toggleRemoveLastColumn = useRackConfigStore((s) => s.toggleRemoveLastColumn);

  const selectedRackId = useEditorStore((s) => s.selectedRackId);

  const currentWidth = getPartSize(braceId) || 1000;

  return (
    <VStack align="stretch" spacing={0} flex={1}>

      {/* ── Type ──────────────────────────────────────────────── */}
      <Box mb={6}>
        <Row label="Type">
          <PillGroup<RackType>
            options={[
              { label: "Single", value: "single" },
              { label: "Double", value: "double" },
            ]}
            value={rackType}
            onChange={setRackType}
          />
        </Row>
      </Box>

      {/* ── Dimensions ────────────────────────────────────────── */}
      <Box {...sectionBoxStyle}>
        <Text {...sectionLabelStyle}>Dimensions</Text>
        <VStack align="stretch" spacing={4}>
          <Row label="Height (mm)">
            <Select {...selectStyle} value={columnId} onChange={(e) => setColumnId(e.target.value)}>
              {columnOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </Select>
          </Row>

          <Row label="Width (mm)">
            <Select
              {...selectStyle}
              value={currentWidth}
              onChange={(e) => {
                const v = Number(e.target.value);
                const newBraceId = findPartId("x_brace", v);
                if (newBraceId) setBraceId(newBraceId);
              }}
            >
              {widthOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </Select>
          </Row>

        </VStack>
      </Box>

      {/* ── Remove Columns ────────────────────────────────────── */}
      <Box borderTop="1px solid" borderColor="rgba(0,0,0,0.08)" pt={5} mt={2}>
        <Text {...sectionLabelStyle}>Columns</Text>
        <VStack align="flex-start" spacing={3}>
          <Checkbox
            isChecked={removeFirstColumn}
            onChange={toggleRemoveFirstColumn}
            size="md"
            colorScheme="gray"
          >
            <Text fontSize="12px" fontWeight={500} color="gray.600">
              Remove first column
            </Text>
          </Checkbox>
          <Checkbox
            isChecked={removeLastColumn}
            onChange={toggleRemoveLastColumn}
            size="md"
            colorScheme="gray"
          >
            <Text fontSize="12px" fontWeight={500} color="gray.600">
              Remove last column
            </Text>
          </Checkbox>
        </VStack>
      </Box>

      {/* ── Dynamic: Selected Rack ────────────────────────────── */}
      {selectedRackId && <RackEditor rackId={selectedRackId} />}

      {/* ── Rack editing hint ─────────────────────────────────── */}
      {!selectedRackId && (
        <Box
          mt={4}
          p={3}
          borderRadius="lg"
          bg="orange.50"
          border="1px solid"
          borderColor="orange.200"
        >
          <Text fontSize="11px" color="orange.600" lineHeight="1.4">
            Click on a rack to edit its dimensions individually.
          </Text>
        </Box>
      )}

    </VStack>
  );
}
