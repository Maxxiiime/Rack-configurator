import { Box, Flex, Text, Button, VStack } from "@chakra-ui/react";
import { useAppStore } from "@/stores/appStore";
import { useActiveProduct } from "@/products";
import {
  StyledBox,
  priceBoxStyle,
  panelHeaderTextStyle,
  stepDotStyle,
  stepDotTextStyle,
  stepConnectorStyle,
  nextButtonStyle,
  backButtonStyle,
} from "./styles";
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
    <Flex align="center" justify="center" gap={2} mb={8}>
      {stepsArray.map((s) => {
        const isActive = currentStep === s;
        const isPast = currentStep > s;
        return (
          <Flex key={s} align="center" gap={2}>
            <Box
              as="button"
              onClick={() => onStepClick(s)}
              {...stepDotStyle(isActive, isPast)}
              _hover={isPast ? { bg: "gray.300" } : {}}
            >
              <Text {...stepDotTextStyle(isActive, isPast)}>
                {s}
              </Text>
            </Box>
            {s < totalSteps && (
              <Box
                {...stepConnectorStyle}
                bg={currentStep >= s + 1 ? "gray.400" : "gray.200"}
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

  const showNext = activeStep.showNext ?? validStep < totalSteps;
  const showBack = activeStep.showBack ?? validStep > 1;

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
          <Text {...panelHeaderTextStyle}>
            STEP {validStep} — {activeStep.label}
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



        <StepComponent />

        {/* ── Bottom Section (Nav & Price) ───────────────────── */}
        <Box mt="auto" pt={5}>
          {(showNext || showBack) && (
            <VStack spacing={3} borderTop="1px solid" borderColor="rgba(0,0,0,0.08)" pt={5}>
              {showNext && (
                <Button
                  {...nextButtonStyle}
                  onClick={() => setCurrentStep(validStep + 1)}
                >
                  Next
                </Button>
              )}
              {showBack && (
                <Button
                  {...backButtonStyle}
                  onClick={() => {
                    if (validStep === 2) goToFirstStep();
                    else setCurrentStep(validStep - 1);
                  }}
                >
                  Back
                </Button>
              )}
            </VStack>
          )}

          {/* ── Price footer ───────────────────────────────────── */}
          {validStep !== totalSteps && (
            <Box
              mt={4}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              {...priceBoxStyle}
            >
              <Text fontSize="15px" fontWeight={600} color="black">Total:</Text>
              <Text fontSize="18px" fontWeight={800} color="black">
                {totalPrice.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
              </Text>
            </Box>
          )}
        </Box>
      </div>
    </StyledBox>
  );
};

export default Sidepanel;

