import { useMemo, useState } from "react";
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
} from "@chakra-ui/react";
import { useRackStore, RackType } from "@/stores/rackStore";
import { useAppStore } from "@/stores/appStore";
import { useShelfParts } from "@/hooks/useShelfParts";
import { getMaxArmCount, getMaxAllowedSpacing } from "@/utils/armPositions";
import { StyledBox } from "./styles";
import ChevronLeft from "@/assets/svgs/ChevronLeft";
import {
  sectionBoxStyle,
  sectionLabelStyle,
  selectStyle,
  sliderTrackStyle,
  sliderThumbStyle,
} from "./styles";

import { PillGroup, Row, Stepper } from "./components/Shared";
import { CustomArms } from "./components/CustomArms";
import { CustomDimensions } from "./components/CustomDimensions";

/* ─── Sidepanel ──────────────────────────────────────────────────── */

const Sidepanel = ({ width = 300 }) => {
  const [activeMenu, setActiveMenu] = useState<"main" | "custom_dimensions" | "custom_arms">("main");
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
    setArmCount,
    setArmSpacing,
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
  const absoluteMaxArms = useMemo(
    () => getMaxArmCount(offsets.arm.start_y, columnHeightUnits, 2),
    [columnHeightUnits, offsets.arm.start_y]
  );
  const currentMaxArms = useMemo(
    () => getMaxArmCount(offsets.arm.start_y, columnHeightUnits, armSpacing),
    [columnHeightUnits, armSpacing, offsets.arm.start_y]
  );
  const actualArmCount = Math.min(armCount, currentMaxArms);

  const handleArmCountChange = (newCount: number) => {
    setArmCount(newCount);
    // Overwrite spacing to maximum allowed so arms are evenly spaced and centered
    setArmSpacing(getMaxAllowedSpacing(offsets.arm.start_y, columnHeightUnits, newCount));
  };

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

        {activeMenu !== "main" && (
          <Flex align="center" gap={2} mb={4} cursor="pointer" onClick={() => setActiveMenu("main")}>
            <Box transform="scale(0.8)" display="flex" alignItems="center" justifyContent="center">
              <ChevronLeft />
            </Box>
            <Text
              fontSize="14px"
              fontWeight={600}
              color="gray.800"
            >
              {activeMenu === "custom_dimensions" ? "Custom Dimensions" : "Custom Arms"}
            </Text>
          </Flex>
        )}

        <VStack align="stretch" spacing={0}>
          {activeMenu === "main" && (
            <>

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
                  <Button
                    mt={2}
                    bg="white"
                    border="1px solid"
                    borderColor="gray.200"
                    fontSize="12px"
                    fontWeight={600}
                    color="gray.700"
                    _hover={{ bg: "gray.50" }}
                    onClick={() => setActiveMenu("custom_dimensions")}
                  >
                    Custom dimensions
                  </Button>
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
                      <Stepper value={actualArmCount} min={1} max={absoluteMaxArms} onChange={handleArmCountChange} />
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

                  <Button
                    mt={2}
                    bg="white"
                    border="1px solid"
                    borderColor="gray.200"
                    fontSize="12px"
                    fontWeight={600}
                    color="gray.700"
                    _hover={{ bg: "gray.50" }}
                    onClick={() => setActiveMenu("custom_arms")}
                  >
                    Custom Arms
                  </Button>

                </VStack>
              </Box>
            </>
          )}

          {activeMenu === "custom_dimensions" && <CustomDimensions />}

          {activeMenu === "custom_arms" && <CustomArms />}

        </VStack>
      </div>
    </StyledBox>
  );
};

export default Sidepanel;
