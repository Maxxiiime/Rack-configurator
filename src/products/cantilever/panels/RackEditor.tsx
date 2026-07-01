import { useMemo } from "react";
import { Box, Flex, Text, Select } from "@chakra-ui/react";
import { sectionBoxStyle, selectStyle } from "@/features/Sidepanel/styles";
import { CollapsibleMenu } from "@/features/Sidepanel/components/CollapsibleMenu";
import { useRackConfigStore } from "../stores/configStore";
import { useRackSectionsStore } from "../stores/sectionsStore";
import { useShelfParts } from "../hooks/useShelfParts";

interface RackEditorProps {
  rackId: string;
}

export const RackEditor = ({ rackId }: RackEditorProps) => {
  const braceId = useRackConfigStore((s) => s.braceId);
  const sectionWidthOverrides = useRackConfigStore((s) => s.sectionWidthOverrides);
  const setSectionWidthOverride = useRackConfigStore((s) => s.setSectionWidthOverride);
  const removeSectionWidthOverride = useRackConfigStore((s) => s.removeSectionWidthOverride);

  const sectionIds = useRackSectionsStore((s) => s.sectionIds);

  const { getPartSize } = useShelfParts();
  const defaultWidth = getPartSize(braceId) || 1000;

  const rackIndex = sectionIds.indexOf(rackId);
  const currentWidth = sectionWidthOverrides[rackId] ?? defaultWidth;
  const isOverridden = sectionWidthOverrides[rackId] !== undefined;

  const widthOpts = useMemo(
    () => [750, 1000, 1250, 1500, 1750, 2000].map((v) => ({ label: String(v), value: v })),
    []
  );

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
        <Box {...sectionBoxStyle}>
          <Flex align="center" justify="space-between" mb={2}>
            <Text fontSize="12px" fontWeight={500} color="gray.500">
              Width (mm)
            </Text>
            {isOverridden && (
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
      </CollapsibleMenu>
    </Box>
  );
};
