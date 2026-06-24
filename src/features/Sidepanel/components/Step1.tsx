import { useMemo, useRef, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  VStack,
  Select,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Checkbox,
} from "@chakra-ui/react";
import { useRackConfigStore, RackType } from "@/stores/cantilever/rackConfigStore";
import { useShelfParts } from "@/hooks/useShelfParts";
import { getMaxArmCount, getMaxAllowedSpacing } from "@/utils/armPositions";
import {
  sectionBoxStyle,
  sectionLabelStyle,
  selectStyle,
  sliderTrackStyle,
  sliderThumbStyle,
} from "../styles";
import { PillGroup, Row, Stepper } from "./Shared";

interface Step1Props {
  onNext: () => void;
}

export function Step1({ onNext }: Step1Props) {
  const rackType = useRackConfigStore((s) => s.rackType);
  const columnId = useRackConfigStore((s) => s.columnId);
  const armId = useRackConfigStore((s) => s.armId);
  const braceId = useRackConfigStore((s) => s.braceId);
  const armSpacing = useRackConfigStore((s) => s.armSpacing);
  const armCount = useRackConfigStore((s) => s.armCount);
  const showArmStops = useRackConfigStore((s) => s.showArmStops);

  const setRackType = useRackConfigStore((s) => s.setRackType);
  const setColumnId = useRackConfigStore((s) => s.setColumnId);
  const setArmId = useRackConfigStore((s) => s.setArmId);
  const setBraceId = useRackConfigStore((s) => s.setBraceId);
  const setArmCount = useRackConfigStore((s) => s.setArmCount);
  const setArmSpacing = useRackConfigStore((s) => s.setArmSpacing);
  const toggleShowArmStops = useRackConfigStore((s) => s.toggleShowArmStops);

  const { getColumnsOptions, getArmsOptions, getPartSize, findPartId, getColumnHeight, getMaxArmsByWeight, offsets } =
    useShelfParts();

  /* ── Options ───────────────────────────────────────────────── */
  const columnOpts = useMemo(() => {
    const raw = getColumnsOptions();
    return Object.entries(raw).map(([label, value]) => ({
      label: label.replace("Column ", ""),
      value,
    }));
  }, [getColumnsOptions]);

  const armsOpts = useMemo(() => {
    const raw = getArmsOptions();
    return Object.entries(raw).map(([label, value]) => ({
      label: label.replace("Arm ", ""),
      value,
    }));
  }, [getArmsOptions]);

  const widthOpts = useMemo(
    () => [750, 1000, 1250, 1500, 1750, 2000].map((v) => ({ label: String(v), value: v })),
    []
  );

  const currentWidth = getPartSize(braceId) || 1000;

  /* ── Arm count constraints ─────────────────────────────────── */
  const columnHeightUnits = getColumnHeight(columnId);
  const weightMaxArms = useMemo(
    () => getMaxArmsByWeight(columnId, armId),
    [columnId, armId, getMaxArmsByWeight]
  );
  const physicalMaxArms = useMemo(
    () => getMaxArmCount(offsets.arm.start_y, columnHeightUnits, 2),
    [columnHeightUnits, offsets.arm.start_y]
  );
  const absoluteMaxArms = useMemo(
    () => Math.min(physicalMaxArms, weightMaxArms === Infinity ? physicalMaxArms : weightMaxArms),
    [physicalMaxArms, weightMaxArms]
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
  const prevRef = useRef({ columnId: '', armId: '' });
  useEffect(() => {
    if (prevRef.current.columnId !== columnId || prevRef.current.armId !== armId) {
      prevRef.current = { columnId, armId };
      // Default to max arms with max spacing
      const maxSpacing = getMaxAllowedSpacing(offsets.arm.start_y, columnHeightUnits, absoluteMaxArms);
      setArmCount(absoluteMaxArms);
      setArmSpacing(maxSpacing);
    }
  }, [columnId, armId, absoluteMaxArms, columnHeightUnits, offsets.arm.start_y, setArmCount, setArmSpacing]);

  const handleArmCountChange = (newCount: number) => {
    setArmCount(newCount);
    setArmSpacing(getMaxAllowedSpacing(offsets.arm.start_y, columnHeightUnits, newCount));
  };

  return (
    <VStack align="stretch" spacing={0} flex={1}>

      {/* ── Type ──────────────────────────────────────────────── */}
      <Box mb={6}>
        <Row label="Type">
          <PillGroup<RackType>
            options={[
              { label: "Single", value: "single" },
              { label: "Double", value: "double" },
            ]}
            value={rackType}
            onChange={setRackType}
          />
        </Row>
      </Box>

      {/* ── Dimensions ────────────────────────────────────────── */}
      <Box {...sectionBoxStyle}>
        <Text {...sectionLabelStyle}>Dimensions</Text>
        <VStack align="stretch" spacing={4}>
          <Row label="Height (mm)">
            <Select {...selectStyle} value={columnId} onChange={(e) => setColumnId(e.target.value)}>
              {columnOpts.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </Select>
          </Row>

          <Row label="Width (mm)">
            <Select
              {...selectStyle}
              value={currentWidth}
              onChange={(e) => {
                const v = Number(e.target.value);
                const newBraceId = findPartId("x_brace", v);
                if (newBraceId) setBraceId(newBraceId);
              }}
            >
              {widthOpts.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </Select>
          </Row>

        </VStack>
      </Box>

      {/* ── Arms ──────────────────────────────────────────────── */}
      <Box borderTop="1px solid" borderColor="rgba(0,0,0,0.08)" pt={5} mt={2}>
        <Text {...sectionLabelStyle}>Arms</Text>
        <VStack align="stretch" spacing={5}>

          <Row label="Arms Length (mm)">
            <Select {...selectStyle} value={armId} onChange={(e) => setArmId(e.target.value)}>
              {armsOpts.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </Select>
          </Row>

          <Box>
            <Text fontSize="12px" fontWeight={500} color="gray.500" mb={1}>Count</Text>
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

          <Checkbox
            isChecked={showArmStops}
            onChange={toggleShowArmStops}
            size="lg"
            colorScheme="gray"
          >
            <Text fontSize="12px" fontWeight={500} color="gray.600">Arm Stops</Text>
          </Checkbox>

        </VStack>
      </Box>

      {/* ── Next step ─────────────────────────────────────────── */}
      <Box pt={5} borderTop="1px solid" borderColor="rgba(0,0,0,0.08)" mt={6}>
        <Button
          w="full"
          bg="gray.900"
          color="white"
          fontSize="12px"
          fontWeight={600}
          borderRadius="lg"
          _hover={{ bg: "gray.700" }}
          _active={{ bg: "gray.800" }}
          onClick={onNext}
        >
          Advanced Options
        </Button>
      </Box>

    </VStack>
  );
}
