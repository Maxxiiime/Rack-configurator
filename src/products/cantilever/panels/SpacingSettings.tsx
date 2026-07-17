import { useMemo, useRef, useEffect } from "react";
import {
  Box, Flex, Text, Select, Checkbox,
  Slider, SliderTrack, SliderFilledTrack, SliderThumb,
} from "@chakra-ui/react";
import { selectStyle, sliderTrackStyle, sliderThumbStyle, baseLabelStyle, checkboxStyle } from "@/features/Sidepanel/styles";
import { Stepper, Row } from "@/components/ui/Shared";
import { useRackConfigStore } from "../stores/configStore";
import { armsOptions, getColumnHeight, offsets } from "../utils/shelfParts";
import { getMaxArmCount, getMaxAllowedSpacing } from "../utils/armPositions";

export const SpacingSettings = () => {
  const columnId = useRackConfigStore((s) => s.columnId);
  const armId = useRackConfigStore((s) => s.armId);
  const armSpacing = useRackConfigStore((s) => s.armSpacing);
  const armCount = useRackConfigStore((s) => s.armCount);
  const showArmStops = useRackConfigStore((s) => s.showArmStops);
  const showArmDividers = useRackConfigStore((s) => s.showArmDividers);
  const armDividerCount = useRackConfigStore((s) => s.armDividerCount);

  const setArmId = useRackConfigStore((s) => s.setArmId);
  const setArmCount = useRackConfigStore((s) => s.setArmCount);
  const setArmSpacing = useRackConfigStore((s) => s.setArmSpacing);
  const toggleShowArmStops = useRackConfigStore((s) => s.toggleShowArmStops);
  const toggleShowArmDividers = useRackConfigStore((s) => s.toggleShowArmDividers);
  const setArmDividerCount = useRackConfigStore((s) => s.setArmDividerCount);

  /* ── Arm count constraints ─────────────────────────────────── */
  const columnHeightUnits = getColumnHeight(columnId);
  const absoluteMaxArms = useMemo(
    () => getMaxArmCount(offsets.arm.start_y, columnHeightUnits, 2),
    [columnHeightUnits, offsets.arm.start_y]
  );
  const currentMaxArms = useMemo(
    () => Math.min(
      getMaxArmCount(offsets.arm.start_y, columnHeightUnits, armSpacing),
      absoluteMaxArms
    ),
    [columnHeightUnits, armSpacing, offsets.arm.start_y, absoluteMaxArms]
  );
  const actualArmCount = Math.min(armCount, currentMaxArms);

  /* ── Auto-update arms when column or arm type changes ──────── */
  const prevRef = useRef({ columnId, armId });
  useEffect(() => {
    if (prevRef.current.columnId !== columnId || prevRef.current.armId !== armId || armCount === 99) {
      prevRef.current = { columnId, armId };
      // Default to spacing of 5 (500mm)
      const defaultSpacing = 5;
      const initialArmCount = getMaxArmCount(offsets.arm.start_y, columnHeightUnits, defaultSpacing);
      setArmCount(initialArmCount);
      setArmSpacing(defaultSpacing);
    }
  }, [columnId, armId, armCount, absoluteMaxArms, columnHeightUnits, offsets.arm.start_y, setArmCount, setArmSpacing]);

  const handleArmCountChange = (newCount: number) => {
    setArmCount(newCount);
    setArmSpacing(getMaxAllowedSpacing(offsets.arm.start_y, columnHeightUnits, newCount));
  };

  /* ── Spacing constraints ──────────────────────────────────── */
  const maxSpacing = getMaxAllowedSpacing(offsets.arm.start_y, columnHeightUnits, armCount);
  const handleSpacingChange = (newSpacing: number) => setArmSpacing(newSpacing);

  return (
    <Box pt={3} mb={3}>

      {/* ── Arm Length ──────────────────────────────────────── */}
      <Box borderBottom="1px solid" borderColor="rgba(0,0,0,0.08)" pb={6} mb={6}>
        <Row label="Arms Length (mm)">
          <Select {...selectStyle} value={armId} onChange={(e) => setArmId(e.target.value)}>
            {armsOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Select>
        </Row>
      </Box>

      {/* ── Arm Count ──────────────────────────────────────── */}
      <Box mt={4}>
        <Text {...baseLabelStyle} mb={1}>Count</Text>
        <Flex align="center" gap={2}>
          <Stepper
            value={actualArmCount}
            min={1}
            max={absoluteMaxArms}
            onChange={handleArmCountChange}
          />
          <Slider
            flex={1}
            min={1}
            max={absoluteMaxArms}
            step={1}
            value={actualArmCount}
            onChange={handleArmCountChange}
            focusThumbOnChange={false}
          >
            <SliderTrack {...sliderTrackStyle}>
              <SliderFilledTrack bg="gray.800" />
            </SliderTrack>
            <SliderThumb {...sliderThumbStyle} />
          </Slider>
        </Flex>
      </Box>

      {/* ── Arm Spacing ────────────────────────────────────── */}
      <Box mt={6} borderBottom="1px solid" borderColor="rgba(0,0,0,0.08)" pb={6} mb={6}>
        <Text {...baseLabelStyle} mb={1}>
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

      {/* ── Arm Stops & Dividers ───────────────────────────── */}
      <Flex mt={4} gap={6} align="center">
        <Checkbox
          isChecked={showArmStops}
          onChange={toggleShowArmStops}
          {...checkboxStyle}
        >
          <Text {...baseLabelStyle}>Arm Stops</Text>
        </Checkbox>

        <Checkbox
          isChecked={showArmDividers}
          onChange={toggleShowArmDividers}
          {...checkboxStyle}
        >
          <Text {...baseLabelStyle}>Arm Dividers</Text>
        </Checkbox>
      </Flex>

      {showArmDividers && (
        <Box pl={7} mt={2}>
          <Text {...baseLabelStyle} mb={1}>Dividers Count</Text>
          <Flex align="center" gap={2}>
            <Stepper
              value={armDividerCount}
              min={1}
              max={5}
              onChange={setArmDividerCount}
            />
            <Slider
              flex={1}
              min={1}
              max={5}
              step={1}
              value={armDividerCount}
              onChange={setArmDividerCount}
              focusThumbOnChange={false}
            >
              <SliderTrack {...sliderTrackStyle}>
                <SliderFilledTrack bg="gray.800" />
              </SliderTrack>
              <SliderThumb {...sliderThumbStyle} />
            </Slider>
          </Flex>
        </Box>
      )}

    </Box>
  );
};
