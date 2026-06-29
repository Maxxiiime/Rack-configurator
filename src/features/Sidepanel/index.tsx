import { Box, Flex, Text } from "@chakra-ui/react";
import { useAppStore } from "@/stores/appStore";
import { useEditorStore } from "@/stores/cantilever/editorStore";
import { usePricing } from "@/hooks/usePricing";
import { StyledBox } from "./styles";
import ChevronLeft from "@/assets/svgs/ChevronLeft";
import { Step1 } from "./components/Step1";
import { Step2 } from "./components/Step2";
import { Step3 } from "./components/Step3";

/* ─── Step indicator ────────────────────────────────────────────── */

const STEP_LABELS: Record<1 | 2 | 3, string> = {
  1: "Global Layout",
  2: "Advanced Options",
  3: "Bill of Materials",
};

function StepDots({
  currentStep,
  onStepClick,
}: {
  currentStep: 1 | 2 | 3;
  onStepClick: (s: 1 | 2 | 3) => void;
}) {
  return (
    <Flex align="center" justify="center" gap={2} mb={4}>
      {([1, 2, 3] as const).map((s) => {
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
            {s < 3 && (
              <Box
                h="1px"
                w="20px"
                bg={currentStep >= s + 1 ? "gray.400" : "gray.200"}
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
  const currentStep = useEditorStore((s) => s.currentStep);
  const setCurrentStep = useEditorStore((s) => s.setCurrentStep);
  const setSelectedArm = useEditorStore((s) => s.setSelectedArm);
  const setSelectedRackId = useEditorStore((s) => s.setSelectedRackId);

  const sidePanelOpen = useAppStore((s) => s.sidePanelOpen);
  const toggleSidePanel = useAppStore((s) => s.toggleSidePanel);
  const { totalPrice } = usePricing();

  const goToStep1 = () => {
    setSelectedArm(null);
    setSelectedRackId(null);
    setCurrentStep(1);
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
          currentStep={currentStep}
          onStepClick={(s) => {
            if (s === 1) goToStep1();
            else if (s === 2 && currentStep === 3) setCurrentStep(2);
          }}
        />

        {/* ── Step title ─────────────────────────────────────── */}
        <Flex align="center" gap={2} mb={8}>

          <Text
            fontSize="15px"
            fontWeight={700}
            color="gray.700"
          >
            Step {currentStep} — {STEP_LABELS[currentStep]}
          </Text>
        </Flex>

        {/* ── Step content ───────────────────────────────────── */}
        {currentStep === 1 && <Step1 onNext={() => setCurrentStep(2)} />}
        {currentStep === 2 && <Step2 onBack={goToStep1} />}
        {currentStep === 3 && <Step3 onBack={() => setCurrentStep(2)} />}

        {/* ── Price footer ───────────────────────────────────── */}
        {currentStep !== 3 && (
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
        )}
      </div>
    </StyledBox>
  );
};

export default Sidepanel;
