import { Box, Flex, Text, Select } from "@chakra-ui/react";
import { sectionBoxStyle, baseLabelStyle, flexSpaceBetweenStyle, resetButtonStyle, selectStyle } from "@/features/Sidepanel/styles";
import { CollapsibleMenu } from "@/features/Sidepanel/components/CollapsibleMenu";
import { useRackConfigStore } from "../stores/configStore";
import { useRackSectionsStore } from "../stores/sectionsStore";
import { getPartSize, columnOptions, widthOptions } from "../utils/shelfParts";

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



  if (rackIndex < 0) return null;

  return (
    <Box mb={4}>
      <CollapsibleMenu
        label={`Rack ${rackIndex + 1}`}
        isOpen
        onToggle={() => { }}
        withTopBorder
        accentColor="red.600"
      >
        <Box {...sectionBoxStyle} mb={4}>
          <Flex {...flexSpaceBetweenStyle}>
            <Text {...baseLabelStyle}>
              Width (mm)
            </Text>
            {isWidthOverridden && (
              <Text
                {...resetButtonStyle}
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
            {widthOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Select>
        </Box>

        <Box {...sectionBoxStyle}>
          <Flex {...flexSpaceBetweenStyle}>
            <Text {...baseLabelStyle}>
              Height (mm)
            </Text>
            {isHeightOverridden && (
              <Text
                {...resetButtonStyle}
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
            {columnOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Select>
        </Box>
      </CollapsibleMenu>
    </Box>
  );
};
