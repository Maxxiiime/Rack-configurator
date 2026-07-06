import { useMemo } from "react";
import { Box, Flex, Text, Select } from "@chakra-ui/react";
import { sectionBoxStyle, selectStyle } from "@/features/Sidepanel/styles";
import { CollapsibleMenu } from "@/features/Sidepanel/components/CollapsibleMenu";
import { useRackConfigStore } from "../stores/configStore";
import { useRackSectionsStore } from "../stores/sectionsStore";
import { getPartSize, getColumnsOptions } from "../utils/shelfParts";

interface RackEditorProps {
  rackId: string;
}

export const RackEditor = ({ rackId }: RackEditorProps) => {
  const braceId = useRackConfigStore((s) => s.braceId);
  const sectionWidthOverrides = useRackConfigStore((s) => s.sectionWidthOverrides);
  const setSectionWidthOverride = useRackConfigStore((s) => s.setSectionWidthOverride);
  const removeSectionWidthOverride = useRackConfigStore((s) => s.removeSectionWidthOverride);

  const columnId = useRackConfigStore((s) => s.columnId);
  const sectionHeightOverrides = useRackConfigStore((s) => s.sectionHeightOverrides);
  const setSectionHeightOverride = useRackConfigStore((s) => s.setSectionHeightOverride);
  const removeSectionHeightOverride = useRackConfigStore((s) => s.removeSectionHeightOverride);

  const sectionIds = useRackSectionsStore((s) => s.sectionIds);

  const defaultWidth = getPartSize(braceId) || 1000;

  const rackIndex = sectionIds.indexOf(rackId);
  const currentWidth = sectionWidthOverrides[rackId] ?? defaultWidth;
  const isWidthOverridden = sectionWidthOverrides[rackId] !== undefined;

  const currentHeightId = sectionHeightOverrides[rackId] ?? columnId;
  const isHeightOverridden = sectionHeightOverrides[rackId] !== undefined;

  const widthOpts = useMemo(
    () => [750, 1000, 1250, 1500, 1750, 2000].map((v) => ({ label: String(v), value: v })),
    []
  );

  const columnOpts = useMemo(() => {
    const raw = getColumnsOptions();
    return Object.entries(raw).map(([label, value]) => ({
      label: label.replace("Column ", ""),
      value,
    }));
  }, [getColumnsOptions]);

  if (rackIndex < 0) return null;

  return (
    <Box mb={4}>
      <CollapsibleMenu
        label={`Rack ${rackIndex + 1}`}
        isOpen
        onToggle={() => { }}
        withTopBorder
        accentColor="orange.400"
      >
        <Box {...sectionBoxStyle} mb={4}>
          <Flex align="center" justify="space-between" mb={2}>
            <Text fontSize="12px" fontWeight={500} color="gray.500">
              Width (mm)
            </Text>
            {isWidthOverridden && (
              <Text
                fontSize="10px"
                fontWeight={600}
                color="red.500"
                cursor="pointer"
                _hover={{ color: "red.700" }}
                onClick={() => removeSectionWidthOverride(rackId)}
              >
                Reset
              </Text>
            )}
          </Flex>
          <Select
            {...selectStyle}
            value={currentWidth}
            onChange={(e) => setSectionWidthOverride(rackId, Number(e.target.value))}
          >
            {widthOpts.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Select>
        </Box>

        <Box {...sectionBoxStyle}>
          <Flex align="center" justify="space-between" mb={2}>
            <Text fontSize="12px" fontWeight={500} color="gray.500">
              Height (mm)
            </Text>
            {isHeightOverridden && (
              <Text
                fontSize="10px"
                fontWeight={600}
                color="red.500"
                cursor="pointer"
                _hover={{ color: "red.700" }}
                onClick={() => removeSectionHeightOverride(rackId)}
              >
                Reset
              </Text>
            )}
          </Flex>
          <Select
            {...selectStyle}
            value={currentHeightId}
            onChange={(e) => setSectionHeightOverride(rackId, e.target.value)}
          >
            {columnOpts.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Select>
        </Box>
      </CollapsibleMenu>
    </Box>
  );
};
