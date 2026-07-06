import { Box, Flex, Text } from "@chakra-ui/react";
import { useAppStore } from "@/stores/appStore";
import { useActiveProduct } from "@/products";
import { StyledBox } from "./styles";
import ChevronLeft from "@/assets/svgs/ChevronLeft";

/* ─── Step indicator ────────────────────────────────────────────── */

function StepDots({
  currentStep,
  totalSteps,
  onStepClick,
}: {
  currentStep: number;
  totalSteps: number;
  onStepClick: (s: number) => void;
}) {
  const stepsArray = Array.from({ length: totalSteps }, (_, i) => i + 1);
  return (
    <Flex align="center" justify="center" gap={2} mb={4}>
      {stepsArray.map((s) => {
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
            {s < totalSteps && (
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
  const activeProduct = useActiveProduct();
  const useEditorStore = activeProduct.useEditorStore;
  const usePricing = activeProduct.usePricing;

  const currentStep = useEditorStore((s) => s.currentStep);
  const setCurrentStep = useEditorStore((s) => s.setCurrentStep);
  const clearSelection = useEditorStore((s) => s.clearSelection);

  const sidePanelOpen = useAppStore((s) => s.sidePanelOpen);
  const toggleSidePanel = useAppStore((s) => s.toggleSidePanel);
  const { totalPrice } = usePricing();

  const totalSteps = activeProduct.steps.length;
  
  // Safeguard: if step is out of bounds
  const validStep = Math.max(1, Math.min(currentStep, totalSteps));
  const activeStep = activeProduct.steps[validStep - 1];
  const StepComponent = activeStep.Component;

  const goToFirstStep = () => {
    if (clearSelection) clearSelection();
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
            {activeProduct.name}
          </Text>
        </Box>

        {/* ── Step dots ──────────────────────────────────────── */}
        <StepDots
          currentStep={validStep}
          totalSteps={totalSteps}
          onStepClick={(s) => {
            if (s === 1) goToFirstStep();
            else if (s < validStep) setCurrentStep(s);
          }}
        />

        {/* ── Step title ─────────────────────────────────────── */}
        <Flex align="center" gap={2} mb={8}>
          <Text
            fontSize="15px"
            fontWeight={700}
            color="gray.700"
          >
            Step {validStep} — {activeStep.label}
          </Text>
        </Flex>

        {/* ── Step content ───────────────────────────────────── */}
        <StepComponent
          onNext={() => {
            if (validStep < totalSteps) setCurrentStep(validStep + 1);
          }}
          onBack={() => {
            if (validStep > 1) {
              if (validStep === 2) {
                goToFirstStep();
              } else {
                setCurrentStep(validStep - 1);
              }
            }
          }}
        />

        {/* ── Price footer ───────────────────────────────────── */}
        {validStep !== totalSteps && (
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
