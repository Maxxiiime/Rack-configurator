import {
  Box, Flex, Text,
  Slider, SliderTrack, SliderFilledTrack, SliderThumb,
} from "@chakra-ui/react";
import { sectionBoxStyle, sliderTrackStyle, sliderThumbStyle } from "@/features/Sidepanel/styles";
import { CollapsibleMenu } from "@/features/Sidepanel/components/CollapsibleMenu";
import { Stepper } from "@/components/ui/Shared";
import { useRackConfigStore } from "../stores/configStore";
import { useArmPositions } from "../hooks/useArmPositions";

interface ArmRowEditorProps {
  armIndex: number;
  columnIndex?: number;
}

export const ArmRowEditor = ({ armIndex, columnIndex }: ArmRowEditorProps) => {

  const armSpacing = useRackConfigStore((s) => s.armSpacing);
  const armYOverrides = useRackConfigStore((s) => s.armYOverrides);
  const setArmYOverride = useRackConfigStore((s) => s.setArmYOverride);
  const removeArmYOverride = useRackConfigStore((s) => s.removeArmYOverride);

  const { basePositions, startY, columnHeightUnits } = useArmPositions();

  // ── Arm Y helpers ──
  const globalMinY = startY;
  const globalMaxY = columnHeightUnits - armSpacing;

  const snapToGrid = (v: number): number => Math.round(v - 0.45) + 0.45;

  const getArmY = (index: number): number => {
    if (columnIndex !== undefined) {
      return armYOverrides[`${columnIndex}-${index}`] ?? armYOverrides[`row-${index}`] ?? basePositions[index] ?? startY;
    }
    return armYOverrides[`row-${index}`] ?? basePositions[index] ?? startY;
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
    setArmYOverride(index, clamped, columnIndex);
  };

  // Guard: index out of range
  if (armIndex >= basePositions.length) return null;

  const currentY = getArmY(armIndex);
  const bounds = getArmBounds(armIndex);
  const isOverridden = columnIndex !== undefined 
    ? armYOverrides[`${columnIndex}-${armIndex}`] !== undefined 
    : armYOverrides[`row-${armIndex}`] !== undefined;

  return (
    <Box mb={4}>
      <CollapsibleMenu
        label={columnIndex !== undefined ? `Arm ${armIndex + 1} (Col ${columnIndex + 1})` : `Arm Row ${armIndex + 1}`}
        isOpen
        onToggle={() => { }}
        withTopBorder
        accentColor="orange.400"
      >
        <Box {...sectionBoxStyle}>
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
                onClick={() => removeArmYOverride(armIndex, columnIndex)}
              >
                Reset
              </Text>
            )}
          </Flex>
          <Flex align="center" gap={2}>
            <Stepper
              value={Math.round(currentY * 100)}
              min={Math.round(bounds.min * 100)}
              max={Math.round(bounds.max * 100)}
              step={100}
              onChange={(v: number) => handleYOverride(armIndex, v)}
            />
            <Box flex={1} minW={0} px={2}>
              <Slider
                min={Math.round(bounds.min * 100)}
                max={Math.round(bounds.max * 100)}
                step={100}
                value={Math.round(currentY * 100)}
                onChange={(v: number) => handleYOverride(armIndex, v)}
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
