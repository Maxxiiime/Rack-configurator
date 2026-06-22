import { useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { useAppStore } from "@/stores/appStore";
import { useEditorStore } from "@/stores/cantilever/editorStore";
import { usePricing } from "@/hooks/usePricing";
import { StyledBox } from "./styles";
import ChevronLeft from "@/assets/svgs/ChevronLeft";
import { Step1 } from "./components/Step1";
import { Step2 } from "./components/Step2";

/* ─── Step indicator ────────────────────────────────────────────── */

const STEP_LABELS: Record<1 | 2, string> = {
  1: "Global Layout",
  2: "Advanced Options",
};

function StepDots({
  currentStep,
  onStepClick,
}: {
  currentStep: 1 | 2;
  onStepClick: (s: 1 | 2) => void;
}) {
  return (
    <Flex align="center" justify="center" gap={2} mb={4}>
      {([1, 2] as const).map((s) => {
        const isActive = currentStep === s;
        const isPast = currentStep > s;
        return (
          <Flex key={s} align="center" gap={2}>
            <Box
              as="button"
              onClick={() => onStepClick(s)}
              display="flex"
              alignItems="center"
              justifyContent="center"
              w="24px"
              h="24px"
              borderRadius="full"
              border="1.5px solid"
              borderColor={isActive ? "gray.800" : isPast ? "gray.400" : "gray.200"}
              bg={isActive ? "gray.900" : isPast ? "gray.200" : "white"}
              cursor={isPast ? "pointer" : "default"}
              transition="all 0.15s ease"
              _hover={isPast ? { bg: "gray.300" } : {}}
            >
              <Text
                fontSize="10px"
                fontWeight={700}
                color={isActive ? "white" : isPast ? "gray.600" : "gray.300"}
                lineHeight="1"
              >
                {s}
              </Text>
            </Box>
            {s === 1 && (
              <Box
                h="1px"
                w="20px"
                bg={currentStep >= 2 ? "gray.400" : "gray.200"}
                transition="background 0.2s ease"
              />
            )}
          </Flex>
        );
      })}
    </Flex>
  );
}

/* ─── Sidepanel ──────────────────────────────────────────────────── */

const Sidepanel = ({ width = 300 }) => {
  const [step, setStep] = useState<1 | 2>(1);

  const sidePanelOpen = useAppStore((s) => s.sidePanelOpen);
  const toggleSidePanel = useAppStore((s) => s.toggleSidePanel);
  const { totalPrice } = usePricing();
  const setSelectedArmIndex = useEditorStore((s) => s.setSelectedArmIndex);
  const setSelectedRackId = useEditorStore((s) => s.setSelectedRackId);

  const goToStep1 = () => {
    setSelectedArmIndex(null);
    setSelectedRackId(null);
    setStep(1);
  };

  return (
    <StyledBox open={sidePanelOpen} width={width}>
      <div className="panel-toggle" onClick={toggleSidePanel}>
        <ChevronLeft />
      </div>

      <div className="panel-inner">
        {/* ── Header ─────────────────────────────────────────── */}
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

        {/* ── Step dots ──────────────────────────────────────── */}
        <StepDots
          currentStep={step}
          onStepClick={(s) => { if (s < step) goToStep1(); }}
        />

        {/* ── Step title ─────────────────────────────────────── */}
        <Flex align="center" gap={2} mb={3}>

          <Text
            fontSize="15px"
            fontWeight={700}
            color="gray.700"
          >
            Step {step} — {STEP_LABELS[step]}
          </Text>
        </Flex>

        {/* ── Step content ───────────────────────────────────── */}
        {step === 1 && <Step1 onNext={() => setStep(2)} />}
        {step === 2 && <Step2 onBack={goToStep1} />}

        {/* ── Price footer ───────────────────────────────────── */}
        <Box
          mt="auto"
          p={4}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Text fontSize="18px" fontWeight={600} color="gray.600">Total Price:</Text>
          <Text fontSize="20px" fontWeight={800} color="gray.800">
            {totalPrice.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
          </Text>
        </Box>
      </div>
    </StyledBox>
  );
};

export default Sidepanel;
