import {
  Box, Flex, Text, Checkbox,
  Slider, SliderTrack, SliderFilledTrack, SliderThumb,
} from "@chakra-ui/react";
import { sliderTrackStyle, sliderThumbStyle } from "@/features/Sidepanel/styles";
import { CollapsibleMenu } from "@/features/Sidepanel/components/CollapsibleMenu";
import { Stepper } from "@/components/ui/Shared";
import { useRackConfigStore } from "../stores/configStore";
import { useEditorStore } from "../stores/editorStore";
import { useArmPositions } from "../hooks/useArmPositions";
import offsets from "../data/offsets.json";

interface ArmRowEditorProps {
  armIndex: number;
  columnIndex?: number;
  side?: 'front' | 'back';
}

export const ArmRowEditor = ({ armIndex, columnIndex, side }: ArmRowEditorProps) => {

  const armSpacing = useRackConfigStore((s) => s.armSpacing);
  const armYOverrides = useRackConfigStore((s) => s.armYOverrides);
  const setArmYOverride = useRackConfigStore((s) => s.setArmYOverride);
  const removeArmYOverride = useRackConfigStore((s) => s.removeArmYOverride);
  const setSelectedArm = useEditorStore((s) => s.setSelectedArm);

  const isEditingRow = columnIndex === undefined;
  const activeSide = side ?? 'front';
  const { basePositions, startY, columnHeightUnits } = useArmPositions(columnIndex, activeSide);

  // ── Toggle between individual arm and row editing ──
  const handleToggleEditRow = () => {
    if (isEditingRow) {
      // Switch back to individual — but we lost columnIndex, so just deselect
      setSelectedArm(null);
    } else {
      // Switch to row editing: remove columnIndex
      setSelectedArm({ armIndex, side: activeSide });
    }
  };

  // ── Arm Y helpers ──
  const globalMinY = startY;
  const globalMaxY = columnHeightUnits - armSpacing;

  const snapToGrid = (v: number): number => Math.round(v - 0.45) + 0.45;

  const getArmY = (index: number): number => {
    if (columnIndex !== undefined) {
      return armYOverrides[`${columnIndex}-${activeSide}-${index}`] ?? armYOverrides[`row-${activeSide}-${index}`] ?? basePositions[index] ?? startY;
    }
    return armYOverrides[`row-${activeSide}-${index}`] ?? basePositions[index] ?? startY;
  };

  const getArmBounds = (index: number): { min: number; max: number } => {
    const belowY = index > 0 ? getArmY(index - 1) : globalMinY - 1;
    const aboveY = index < basePositions.length - 1 ? getArmY(index + 1) : globalMaxY + 1;
    const min = Math.max(globalMinY, snapToGrid(belowY + 2));
    const max = Math.min(globalMaxY, snapToGrid(aboveY - 2));
    return { min, max };
  };

  const handleYOverride = (index: number, mmValue: number) => {
    const unitValue = mmValue / 100;
    const snapped = snapToGrid(unitValue);
    const { min, max } = getArmBounds(index);
    const clamped = Math.max(min, Math.min(max, snapped));
    setArmYOverride(index, clamped, columnIndex, activeSide);
  };

  // Guard: index out of range
  if (armIndex >= basePositions.length) return null;

  const currentY = getArmY(armIndex);
  const bounds = getArmBounds(armIndex);
  const isOverridden = columnIndex !== undefined
    ? armYOverrides[`${columnIndex}-${activeSide}-${armIndex}`] !== undefined
    : armYOverrides[`row-${activeSide}-${armIndex}`] !== undefined;

  const displayOffset = offsets.arm.start_y_display * 100;

  const label = isEditingRow
    ? `Arm Row ${armIndex + 1} - ${activeSide}`
    : `Arm ${armIndex + 1} (Col ${columnIndex! + 1}) - ${activeSide}`;

  return (
    <Box mb={4}>
      <CollapsibleMenu
        label={label}
        isOpen
        onToggle={() => { }}
        withTopBorder
        accentColor="orange.400"
      >
        {/* ── Edit Row toggle ──────────────────────────────── */}
        <Box mb={3}>
          <Checkbox
            isChecked={isEditingRow}
            onChange={handleToggleEditRow}
            size="md"
            colorScheme="gray"
          >
            <Text fontSize="12px" fontWeight={500} color="gray.600">
              Edit row
            </Text>
          </Checkbox>
        </Box>

        <Box>
          <Flex align="center" justify="space-between" mb={2}>
            <Text fontSize="12px" fontWeight={500} color="gray.500">
              Position Y (mm)
            </Text>
            {isOverridden && (
              <Text
                fontSize="10px"
                fontWeight={600}
                color="red.500"
                cursor="pointer"
                _hover={{ color: "red.700" }}
                onClick={() => removeArmYOverride(armIndex, columnIndex, activeSide)}
              >
                Reset
              </Text>
            )}
          </Flex>
          <Flex align="center" gap={2}>
            <Stepper
              value={Math.round(currentY * 100) - displayOffset}
              min={Math.round(bounds.min * 100) - displayOffset}
              max={Math.round(bounds.max * 100) - displayOffset}
              step={100}
              onChange={(v: number) => handleYOverride(armIndex, v + displayOffset)}
            />
            <Box flex={1} minW={0} px={2}>
              <Slider
                min={Math.round(bounds.min * 100) - displayOffset}
                max={Math.round(bounds.max * 100) - displayOffset}
                step={100}
                value={Math.round(currentY * 100) - displayOffset}
                onChange={(v: number) => handleYOverride(armIndex, v + displayOffset)}
                focusThumbOnChange={false}
              >
                <SliderTrack {...sliderTrackStyle}>
                  <SliderFilledTrack bg="gray.800" />
                </SliderTrack>
                <SliderThumb {...sliderThumbStyle} borderColor="gray.800" />
              </Slider>
            </Box>
          </Flex>
        </Box>
      </CollapsibleMenu>
    </Box>
  );
};
