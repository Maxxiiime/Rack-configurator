import { useMemo } from "react";
import { Box, Flex, Text, IconButton, Select, Checkbox, VStack } from "@chakra-ui/react";
import { sectionBoxStyle, selectStyle } from "../styles";
import { useRackConfigStore } from "@/stores/cantilever/rackConfigStore";
import { useRackSectionsStore } from "@/stores/cantilever/rackSectionsStore";
import { useEditorStore } from "@/stores/cantilever/editorStore";
import { useShelfParts } from "@/hooks/useShelfParts";

export const DimensionsCustomization = () => {
  const braceId = useRackConfigStore(s => s.braceId);
  const sectionWidthOverrides = useRackConfigStore(s => s.sectionWidthOverrides);
  const setSectionWidthOverride = useRackConfigStore(s => s.setSectionWidthOverride);
  const removeSectionWidthOverride = useRackConfigStore(s => s.removeSectionWidthOverride);
  const clearSectionWidthOverrides = useRackConfigStore(s => s.clearSectionWidthOverrides);
  const removeFirstColumn = useRackConfigStore((s) => s.removeFirstColumn);
  const removeLastColumn = useRackConfigStore((s) => s.removeLastColumn);
  const toggleRemoveFirstColumn = useRackConfigStore((s) => s.toggleRemoveFirstColumn);
  const toggleRemoveLastColumn = useRackConfigStore((s) => s.toggleRemoveLastColumn);

  const rackIds = useRackSectionsStore(s => s.rackIds);

  const selectedRackId = useEditorStore(s => s.selectedRackId);
  const setSelectedRackId = useEditorStore(s => s.setSelectedRackId);

  const { getPartSize } = useShelfParts();

  const defaultWidth = getPartSize(braceId) || 1000;

  const widthOpts = useMemo(
    () => [750, 1000, 1250, 1500, 1750, 2000].map((v) => ({ label: String(v), value: v })),
    []
  );

  const getSectionWidth = (id: string): number => {
    return sectionWidthOverrides[id] ?? defaultWidth;
  };

  const handleWidthOverride = (id: string, width: number) => {
    setSectionWidthOverride(id, width);
  };

  const hasAnyOverride = Object.keys(sectionWidthOverrides).length > 0;

  return (
    <Box {...sectionBoxStyle}>
      <Text fontSize="12px" fontWeight={500} color="gray.500" mb={1}>Column widths</Text>
      <Flex align="center" justify="space-between" mb={2}>
        {hasAnyOverride && (
          <Text
            fontSize="10px"
            fontWeight={600}
            color="red.500"
            cursor="pointer"
            _hover={{ color: "red.700" }}
            onClick={clearSectionWidthOverrides}
          >
            Reset all
          </Text>
        )}
      </Flex>

      <Flex direction="column" gap="2px">
        {rackIds.map((rackId, index) => {
          const isSelected = selectedRackId === rackId;
          const isOverridden = sectionWidthOverrides[rackId] !== undefined;
          const currentWidth = getSectionWidth(rackId);

          return (
            <Box key={rackId}>
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
                onClick={() => setSelectedRackId(isSelected ? null : rackId)}
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

                {/* Width value */}
                <Text fontSize="12px" fontWeight={500} color="gray.700" flex={1}>
                  {currentWidth} mm
                </Text>

                {/* Override indicator */}
                {isOverridden && (
                  <Flex align="center" gap={1}>
                    <Box w="6px" h="6px" borderRadius="full" bg="orange.400" />
                    <IconButton
                      aria-label="Reset width override"
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
                        removeSectionWidthOverride(rackId);
                        if (isSelected) setSelectedRackId(null);
                      }}
                    />
                  </Flex>
                )}
              </Flex>

              {/* Width editor — visible when selected */}
              {isSelected && (
                <Box px={2} py={2} ml="28px">
                  <Text fontSize="11px" fontWeight={500} color="gray.400" mb={1}>
                    Width (mm)
                  </Text>
                  <Select
                    {...selectStyle}
                    value={currentWidth}
                    onChange={(e) => handleWidthOverride(rackId, Number(e.target.value))}
                  >
                    {widthOpts.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </Select>
                </Box>
              )}
            </Box>
          );
        })}
      </Flex>
      <Text fontSize="12px" fontWeight={500} color="gray.500" mb={1} borderTop="1px solid" borderColor="rgba(0,0,0,0.08)" pt={3} mt={4}>Remove columns</Text>

      <Box pt={3}>
        <VStack align="flex-start" spacing={3}>
          <Checkbox
            isChecked={removeFirstColumn}
            onChange={toggleRemoveFirstColumn}
            size="md"
            colorScheme="gray"
          >
            <Text fontSize="12px" fontWeight={500} color="gray.600">Remove first column</Text>
          </Checkbox>
          <Checkbox
            isChecked={removeLastColumn}
            onChange={toggleRemoveLastColumn}
            size="md"
            colorScheme="gray"
          >
            <Text fontSize="12px" fontWeight={500} color="gray.600">Remove last column</Text>
          </Checkbox>
        </VStack>
      </Box>
    </Box>
  );
};
