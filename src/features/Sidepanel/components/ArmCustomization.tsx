import { useMemo, useState } from "react";
import { Box, Flex, Text, Slider, SliderTrack, SliderFilledTrack, SliderThumb, IconButton, Collapse } from "@chakra-ui/react";
import { Stepper } from "./Shared";
import { sectionBoxStyle, sliderTrackStyle, sliderThumbStyle } from "../styles";
import { useRackConfigStore } from "@/stores/cantilever/rackConfigStore";
import { useEditorStore } from "@/stores/cantilever/editorStore";
import { useShelfParts } from "@/hooks/useShelfParts";
import { getMaxAllowedSpacing, computeArmPositions } from "@/utils/armPositions";

export const ArmCustomization = () => {
  const armSpacing = useRackConfigStore(s => s.armSpacing);
  const setArmSpacing = useRackConfigStore(s => s.setArmSpacing);
  const armCount = useRackConfigStore(s => s.armCount);
  const setArmCount = useRackConfigStore(s => s.setArmCount);
  const armYOverrides = useRackConfigStore(s => s.armYOverrides);
  const setArmYOverride = useRackConfigStore(s => s.setArmYOverride);
  const removeArmYOverride = useRackConfigStore(s => s.removeArmYOverride);
  const clearArmYOverrides = useRackConfigStore(s => s.clearArmYOverrides);
  const columnId = useRackConfigStore(s => s.columnId);

  const selectedArmIndex = useEditorStore(s => s.selectedArmIndex);
  const setSelectedArmIndex = useEditorStore(s => s.setSelectedArmIndex);
  const { getColumnHeight, offsets } = useShelfParts();

  const columnHeightUnits = getColumnHeight(columnId);
  const startY = offsets.arm.start_y;

  const maxSpacing = getMaxAllowedSpacing(startY, columnHeightUnits, armCount);

  // Compute the base (auto) positions — used for display and as defaults
  const basePositions = useMemo(
    () => computeArmPositions(startY, columnHeightUnits, armSpacing, armCount),
    [startY, columnHeightUnits, armSpacing, armCount]
  );

  // Y constraints for manual override — snap to .45 pattern
  const globalMinY = startY;                          // e.g. 1.45
  const globalMaxY = columnHeightUnits - armSpacing;   // don't exceed column top

  const handleSpacingChange = (newSpacing: number) => {
    setArmSpacing(newSpacing);
  };

  /** Snap a value to the nearest n + 0.45 */
  const snapToGrid = (v: number): number => Math.round(v - 0.45) + 0.45;

  /** Get the Y bounds for a given arm index, clamped to its neighbors */
  const getArmBounds = (index: number): { min: number; max: number } => {
    const belowY = index > 0 ? getArmY(index - 1) : globalMinY - 1; // allow going down to globalMinY
    const aboveY = index < basePositions.length - 1 ? getArmY(index + 1) : globalMaxY + 1;
    // Must stay at least 1 unit (100mm) away from neighbors, and within global bounds
    const min = Math.max(globalMinY, snapToGrid(belowY + 2));
    const max = Math.min(globalMaxY, snapToGrid(aboveY - 2));
    return { min, max };
  };

  const handleYOverride = (index: number, mmValue: number) => {
    const unitValue = mmValue / 100;
    const snapped = snapToGrid(unitValue);
    const { min, max } = getArmBounds(index);
    const clamped = Math.max(min, Math.min(max, snapped));
    setArmYOverride(index, clamped);
  };

  const getArmY = (index: number): number => {
    return armYOverrides[index] ?? basePositions[index] ?? startY;
  };

  const hasAnyOverride = Object.keys(armYOverrides).length > 0;
  const [positionsOpen, setPositionsOpen] = useState(true);

  return (
    <Box {...sectionBoxStyle}>
      {/* Spacing */}
      <Box mb={4}>
        <Text fontSize="12px" fontWeight={500} color="gray.500" mb={1}>Spacing (mm)</Text>
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

      {/* Arm rows list */}
      <Box>
        <Flex
          align="center"
          justify="space-between"
          cursor="pointer"
          onClick={() => setPositionsOpen(!positionsOpen)}
          mb={2}
        >
          <Text fontSize="12px" fontWeight={500} color="gray.500">
            Arm Positions
          </Text>
          <Flex align="center" gap={2}>
            {hasAnyOverride && (
              <Text
                fontSize="10px"
                fontWeight={600}
                color="red.500"
                cursor="pointer"
                _hover={{ color: "red.700" }}
                onClick={(e) => {
                  e.stopPropagation();
                  clearArmYOverrides();
                }}
              >
                Reset all
              </Text>
            )}
            <Box
              as="span"
              display="flex"
              alignItems="center"
              justifyContent="center"
              w="16px"
              h="16px"
              borderRadius="full"
              bg="gray.100"
              transition="transform 0.2s ease"
              transform={positionsOpen ? "rotate(0deg)" : "rotate(-90deg)"}
            >
              <svg
                width="8"
                height="8"
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
        </Flex>

        <Collapse in={positionsOpen} animateOpacity>
          <Flex direction="column" gap="2px">
          {basePositions.map((_, index) => {
            const isSelected = selectedArmIndex === index;
            const isOverridden = armYOverrides[index] !== undefined;
            const currentY = getArmY(index);

            return (
              <Box key={index}>
                {/* Row button */}
                <Flex
                  align="center"
                  gap={2}
                  px={2}
                  py="6px"
                  borderRadius="md"
                  cursor="pointer"
                  bg={isSelected ? "gray.100" : "transparent"}
                  border="1.5px solid"
                  borderColor={isSelected ? "gray.300" : "transparent"}
                  _hover={{ bg: isSelected ? "gray.100" : "gray.50" }}
                  transition="all 0.12s ease"
                  onClick={() => setSelectedArmIndex(isSelected ? null : index)}
                >
                  {/* Index badge */}
                  <Flex
                    align="center"
                    justify="center"
                    w="20px"
                    h="20px"
                    borderRadius="full"
                    bg={isOverridden ? "orange.100" : "gray.100"}
                    flexShrink={0}
                  >
                    <Text
                      fontSize="10px"
                      fontWeight={700}
                      color={isOverridden ? "orange.600" : "gray.500"}
                    >
                      {index + 1}
                    </Text>
                  </Flex>

                  {/* Y value */}
                  <Text fontSize="12px" fontWeight={500} color="gray.700" flex={1}>
                    {Math.round(currentY * 100)} mm
                  </Text>

                  {/* Override indicator */}
                  {isOverridden && (
                    <Flex align="center" gap={1}>
                      <Box w="6px" h="6px" borderRadius="full" bg="orange.400" />
                      <IconButton
                        aria-label="Reset arm position"
                        icon={<Text fontSize="11px" lineHeight="1" userSelect="none">✕</Text>}
                        size="xs"
                        variant="ghost"
                        w="18px"
                        h="18px"
                        minW="18px"
                        color="gray.400"
                        _hover={{ color: "red.500", bg: "red.50" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          removeArmYOverride(index);
                          if (isSelected) setSelectedArmIndex(null);
                        }}
                      />
                    </Flex>
                  )}
                </Flex>

                {/* Y position editor — visible when selected */}
                {isSelected && (() => {
                  const bounds = getArmBounds(index);
                  return (
                    <Box px={2} py={2} ml="28px">
                      <Text fontSize="11px" fontWeight={500} color="gray.400" mb={1}>
                        Position Y (mm)
                      </Text>
                      <Flex align="center" gap={2}>
                        <Stepper
                          value={Math.round(currentY * 100)}
                          min={Math.round(bounds.min * 100)}
                          max={Math.round(bounds.max * 100)}
                          step={100}
                          onChange={(v) => handleYOverride(index, v)}
                        />
                        <Slider
                          flex={1}
                          min={Math.round(bounds.min * 100)}
                          max={Math.round(bounds.max * 100)}
                          step={100}
                          value={Math.round(currentY * 100)}
                          onChange={(v) => handleYOverride(index, v)}
                          focusThumbOnChange={false}
                        >
                          <SliderTrack {...sliderTrackStyle}>
                            <SliderFilledTrack bg="gray.800" />
                          </SliderTrack>
                          <SliderThumb {...sliderThumbStyle} borderColor="gray.800" />
                        </Slider>
                      </Flex>
                    </Box>
                  );
                })()}
              </Box>
            );
          })}
          </Flex>
        </Collapse>
      </Box>
    </Box>
  );
};
