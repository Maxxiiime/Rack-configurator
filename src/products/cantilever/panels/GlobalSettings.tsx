import {
  Box, Flex, Text, VStack, Checkbox,
  Slider, SliderTrack, SliderFilledTrack, SliderThumb,
} from "@chakra-ui/react";
import { sectionBoxStyle, sliderTrackStyle, sliderThumbStyle } from "@/features/Sidepanel/styles";
import { Stepper } from "@/components/ui/Shared";
import { useRackConfigStore } from "../stores/configStore";
import { useShelfParts } from "../hooks/useShelfParts";
import { getMaxAllowedSpacing } from "../utils/armPositions";

export const GlobalSettings = () => {
  const armSpacing = useRackConfigStore((s) => s.armSpacing);
  const setArmSpacing = useRackConfigStore((s) => s.setArmSpacing);
  const armCount = useRackConfigStore((s) => s.armCount);
  const columnId = useRackConfigStore((s) => s.columnId);
  const removeFirstColumn = useRackConfigStore((s) => s.removeFirstColumn);
  const removeLastColumn = useRackConfigStore((s) => s.removeLastColumn);
  const toggleRemoveFirstColumn = useRackConfigStore((s) => s.toggleRemoveFirstColumn);
  const toggleRemoveLastColumn = useRackConfigStore((s) => s.toggleRemoveLastColumn);

  const { getColumnHeight, offsets } = useShelfParts();
  const columnHeightUnits = getColumnHeight(columnId);
  const startY = offsets.arm.start_y;
  const maxSpacing = getMaxAllowedSpacing(startY, columnHeightUnits, armCount);

  const handleSpacingChange = (newSpacing: number) => setArmSpacing(newSpacing);

  return (
    <Box {...sectionBoxStyle}>
      {/* Spacing */}
      <Box mb={4}>
        <Text fontSize="12px" fontWeight={500} color="gray.500" mb={1}>
          Arms spacing (mm)
        </Text>
        <Flex align="center" gap={2} minW={0} overflow="hidden">
          <Stepper
            value={armSpacing * 100}
            min={200}
            max={maxSpacing * 100}
            step={100}
            onChange={(v) => handleSpacingChange(v / 100)}
          />
          <Box flex={1} minW={0} pr={2}>
            <Slider
              min={2}
              max={maxSpacing}
              step={1}
              value={armSpacing}
              onChange={handleSpacingChange}
              focusThumbOnChange={false}
            >
              <SliderTrack {...sliderTrackStyle}>
                <SliderFilledTrack bg="gray.800" />
              </SliderTrack>
              <SliderThumb {...sliderThumbStyle} />
            </Slider>
          </Box>
        </Flex>
      </Box>

      {/* Remove columns */}
      <Box>
        <Text fontSize="12px" fontWeight={500} color="gray.500" mb={2}>
          Remove columns
        </Text>
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
    </Box>
  );
};
