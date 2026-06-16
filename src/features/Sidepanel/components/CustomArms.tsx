import { Box, Flex, Text, Slider, SliderTrack, SliderFilledTrack, SliderThumb } from "@chakra-ui/react";
import { Stepper } from "./Shared";
import { sectionBoxStyle, sliderTrackStyle, sliderThumbStyle } from "../styles";
import { useRackStore } from "@/stores/rackStore";
import { useShelfParts } from "@/hooks/useShelfParts";
import { getMaxArmCount, getMaxAllowedSpacing } from "@/utils/armPositions";

export const CustomArms = () => {
  const { armSpacing, setArmSpacing, armCount, setArmCount, columnId } = useRackStore();
  const { getColumnHeight, offsets } = useShelfParts();

  const columnHeightUnits = getColumnHeight(columnId);
  const startY = offsets.arm.start_y;

  const currentMaxArms = getMaxArmCount(startY, columnHeightUnits, armSpacing);
  const actualArmCount = Math.min(armCount, currentMaxArms);

  const maxSpacing = getMaxAllowedSpacing(startY, columnHeightUnits, actualArmCount);

  const handleSpacingChange = (newSpacing: number) => {
    if (armCount > actualArmCount) {
      setArmCount(actualArmCount);
    }
    setArmSpacing(newSpacing);
  };

  return (
    <Box {...sectionBoxStyle}>
      {/* Spacing */}
      <Box>
        <Text fontSize="12px" fontWeight={500} color="gray.500" mb={1}>Spacing (mm)</Text>
        <Flex align="center" gap={2}>
          <Stepper
            value={armSpacing * 100}
            min={200}
            max={maxSpacing * 100}
            step={100}
            onChange={(v) => handleSpacingChange(v / 100)}
          />
          <Slider
            flex={1}
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
        </Flex>
      </Box>
    </Box>
  );
};
