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
  hintBoxStyle,
  baseLabelStyle,
  hintTextStyle,
  checkboxStyle,
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
      <Box borderBottom="1px solid" borderColor="rgba(0,0,0,0.08)" pb={6} mb={6}>
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
      <Box borderBottom="1px solid" borderColor="rgba(0,0,0,0.08)" pb={6} mb={6}>
        <VStack align="stretch" spacing={5}>
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
      <Box pb={6} mb={6}>
        <VStack align="flex-start" spacing={3}>
          <Checkbox
            isChecked={removeFirstColumn}
            onChange={toggleRemoveFirstColumn}
            {...checkboxStyle}
          >
            <Text {...baseLabelStyle}>
              Remove first column
            </Text>
          </Checkbox>
          <Checkbox
            isChecked={removeLastColumn}
            onChange={toggleRemoveLastColumn}
            {...checkboxStyle}
          >
            <Text {...baseLabelStyle}>
              Remove last column
            </Text>
          </Checkbox>
        </VStack>
      </Box>

      {/* ── Dynamic: Selected Rack ────────────────────────────── */}
      {selectedRackId && <RackEditor rackId={selectedRackId} />}

      {/* ── Rack editing hint ─────────────────────────────────── */}
      {!selectedRackId && (
        <Box mt={4} {...hintBoxStyle}>
          <Text {...hintTextStyle}>
            Click on a rack to edit its dimensions individually.
          </Text>
        </Box>
      )}

    </VStack>
  );
}
