import React, { useMemo } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  VStack,
  IconButton,
  Select,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from "@chakra-ui/react";
import { useRackStore, RackType } from "@/stores/rackStore";
import { useAppStore } from "@/stores/appStore";
import { useShelfParts } from "@/hooks/useShelfParts";
import { getMaxArmCount } from "@/utils/armPositions";
import { StyledBox } from "./styles";
import ChevronLeft from "@/assets/svgs/ChevronLeft";
import {
  sectionBoxStyle,
  sectionLabelStyle,
  rowLabelStyle,
  selectStyle,
  pillButtonStyle,
  stepperContainerStyle,
  stepperButtonStyle,
  stepperIconStyle,
  stepperValueStyle,
  sliderTrackStyle,
  sliderThumbStyle,
} from "./styles";

/* ─── Pill button group ──────────────────────────────────────────── */

interface PillGroupProps<T extends string | number> {
  options: { label: string; value: T }[];
  value: T;
  onChange: (v: T) => void;
}

function PillGroup<T extends string | number>({
  options,
  value,
  onChange,
}: PillGroupProps<T>) {
  return (
    <Flex flexWrap="wrap" gap="6px">
      {options.map((opt) => {
        const isActive = value === opt.value;
        return (
          <Button
            key={String(opt.value)}
            {...pillButtonStyle(isActive)}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </Button>
        );
      })}
    </Flex>
  );
}

/* ─── Stepper ────────────────────────────────────────────────────── */

interface StepperProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
}

function Stepper({ value, min, max, step = 1, onChange }: StepperProps) {
  return (
    <Flex {...stepperContainerStyle}>
      <IconButton
        aria-label="Decrease"
        icon={<Text {...stepperIconStyle}>−</Text>}
        {...stepperButtonStyle}
        isDisabled={value <= min}
        onClick={() => onChange(Math.max(min, value - step))}
      />
      <Text {...stepperValueStyle}>{value}</Text>
      <IconButton
        aria-label="Increase"
        icon={<Text {...stepperIconStyle}>+</Text>}
        {...stepperButtonStyle}
        isDisabled={value >= max}
        onClick={() => onChange(Math.min(max, value + step))}
      />
    </Flex>
  );
}

/* ─── Row helper ─────────────────────────────────────────────────── */

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Flex align="center" gap={3}>
      <Text {...rowLabelStyle}>{label}</Text>
      {children}
    </Flex>
  );
}

/* ─── Sidepanel ──────────────────────────────────────────────────── */

const Sidepanel = ({ width = 300 }) => {
  const sidePanelOpen = useAppStore((s) => s.sidePanelOpen);
  const toggleSidePanel = useAppStore((s) => s.toggleSidePanel);

  const {
    rackType,
    columnId,
    armId,
    braceId,
    armSpacing,
    armCount,
    setRackType,
    setColumnId,
    setArmId,
    setBraceId,
    setArmSpacing,
    setArmCount,
  } = useRackStore();

  const { getColumnsOptions, getArmsOptions, getPartSize, findPartId, getColumnHeight, offsets } =
    useShelfParts();

  /* options */
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

  /* arm count constraints */
  const columnHeightUnits = getColumnHeight(columnId);
  const maxArms = useMemo(
    () => getMaxArmCount(offsets.arm.start_y, columnHeightUnits, armSpacing),
    [columnHeightUnits, armSpacing, offsets.arm.start_y]
  );
  const clampedArmCount = Math.min(armCount, maxArms);

  return (
    <StyledBox open={sidePanelOpen} width={width}>
      <div className="panel-toggle" onClick={toggleSidePanel}>
        <ChevronLeft />
      </div>
      <div className="panel-inner">
        <Box mb={4} pb={3} borderBottom="1px solid" borderColor="rgba(0,0,0,0.08)">
          <Text
            fontSize="15px"
            fontWeight={700}
            letterSpacing="0.12em"
            textTransform="uppercase"
            color="gray.800"
          >
            vamm-rack
          </Text>
        </Box>
        <VStack align="stretch" spacing={0}>

          {/* ── Type ───────────────────────────────────── */}
          <Box mb={3}>
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

          {/* ── Dimensions ─────────────────────────────── */}
          <Box {...sectionBoxStyle}>
            <Text {...sectionLabelStyle}>Dimensions</Text>
            <VStack align="stretch" spacing={2}>
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

              <Row label="Depth (mm)">
                <Select {...selectStyle} value={armId} onChange={(e) => setArmId(e.target.value)}>
                  {armsOpts.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </Select>
              </Row>
            </VStack>
          </Box>

          {/* ── Arms ───────────────────────────────────── */}
          <Box borderTop="1px solid" borderColor="rgba(0,0,0,0.08)" pt={3}>
            <Text {...sectionLabelStyle}>Arms</Text>
            <VStack align="stretch" spacing={4}>

              {/* Count */}
              <Box>
                <Text fontSize="12px" fontWeight={500} color="gray.500" mb={1}>Count</Text>
                <Flex align="center" gap={2}>
                  <Stepper value={clampedArmCount} min={1} max={maxArms} onChange={setArmCount} />
                  <Slider
                    flex={1}
                    min={1}
                    max={maxArms}
                    step={1}
                    value={clampedArmCount}
                    onChange={setArmCount}
                    focusThumbOnChange={false}
                  >
                    <SliderTrack {...sliderTrackStyle}>
                      <SliderFilledTrack bg="gray.800" />
                    </SliderTrack>
                    <SliderThumb {...sliderThumbStyle} />
                  </Slider>
                </Flex>
              </Box>

              {/* Spacing */}
              <Box>
                <Text fontSize="12px" fontWeight={500} color="gray.500" mb={1}>Spacing (mm)</Text>
                <Flex align="center" gap={2}>
                  <Stepper
                    value={armSpacing * 100}
                    min={200}
                    max={1000}
                    step={100}
                    onChange={(v) => {
                      const newSpacing = v / 100;
                      setArmSpacing(newSpacing);
                      setArmCount(getMaxArmCount(offsets.arm.start_y, columnHeightUnits, newSpacing));
                    }}
                  />
                  <Slider
                    flex={1}
                    min={2}
                    max={10}
                    step={1}
                    value={armSpacing}
                    onChange={(newSpacing) => {
                      setArmSpacing(newSpacing);
                      setArmCount(getMaxArmCount(offsets.arm.start_y, columnHeightUnits, newSpacing));
                    }}
                    focusThumbOnChange={false}
                  >
                    <SliderTrack {...sliderTrackStyle}>
                      <SliderFilledTrack bg="gray.800" />
                    </SliderTrack>
                    <SliderThumb {...sliderThumbStyle} />
                  </Slider>
                </Flex>
              </Box>

            </VStack>
          </Box>

        </VStack>
      </div>
    </StyledBox>
  );
};

export default Sidepanel;
