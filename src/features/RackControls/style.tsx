import type { BoxProps } from "@chakra-ui/react";

/* ─── Panel ──────────────────────────────────────────────────────── */

export const panelStyle: BoxProps = {
  position: "fixed",
  top: "24px",
  right: "24px",
  zIndex: 100,
  bg: "rgba(255, 255, 255, 0.15)",
  backdropFilter: "blur(20px)",
  style: { WebkitBackdropFilter: "blur(20px)" },
  border: "1px solid",
  borderColor: "rgba(255, 255, 255, 0.7)",
  borderRadius: "18px",
  px: 6,
  py: 5,
  minW: "240px",
  maxW: "25vw",
  boxShadow: "0 4px 6px rgba(0,0,0,0.04), 0 16px 40px rgba(0,0,0,0.1)",
  userSelect: "none",
  fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
};

/* ─── Section divider ────────────────────────────────────────────── */

export const sectionBoxStyle: BoxProps = {
  borderTop: "1px solid",
  borderColor: "rgba(0,0,0,0.08)",
  pt: 3,
  mb: 3,
};

export const sectionLabelStyle = {
  fontSize: "10px",
  fontWeight: 700,
  letterSpacing: "0.08em",
  color: "gray.400",
  textTransform: "uppercase" as const,
  mb: 2,
};

/* ─── Row label ──────────────────────────────────────────────────── */

export const rowLabelStyle = {
  fontSize: "13px",
  fontWeight: 500,
  color: "gray.500",
  minW: "64px",
  flexShrink: 0,
  userSelect: "none" as const,
};

/* ─── Select ─────────────────────────────────────────────────────── */

export const selectStyle = {
  size: "sm" as const,
  borderRadius: "lg",
  fontSize: "12px",
  bg: "rgba(255,255,255,0.6)",
  borderColor: "rgba(148, 148, 148, 0.5)",
  _hover: { borderColor: "blue.300" },
  _focus: { borderColor: "blue.400", boxShadow: "0 0 0 1px #4299e1" },
};

/* ─── PillGroup button ───────────────────────────────────────────── */

export function pillButtonStyle(isActive: boolean) {
  return {
    size: "xs",
    borderRadius: "full",
    px: 3,
    py: "5px",
    h: "auto",
    fontWeight: isActive ? 600 : 500,
    fontSize: "12px",
    lineHeight: "1",
    border: "1.5px solid",
    borderColor: isActive ? "blue.500" : "gray.200",
    bg: isActive ? "blue.500" : "gray.50",
    color: isActive ? "white" : "gray.500",
    boxShadow: isActive ? "0 2px 8px rgba(66,153,225,0.35)" : "none",
    _hover: {
      bg: isActive ? "blue.400" : "gray.100",
      borderColor: isActive ? "blue.400" : "gray.300",
      color: isActive ? "white" : "gray.700",
      transform: "translateY(-1px)",
    },
    _active: { transform: "scale(0.97)" },
    transition: "all 0.14s ease",
  };
}

/* ─── Stepper ────────────────────────────────────────────────────── */

export const stepperContainerStyle = {
  align: "center",
  border: "1.5px solid",
  borderColor: "gray.200",
  borderRadius: "full",
  bg: "gray.50",
  overflow: "hidden" as const,
  display: "inline-flex" as const,
};

export const stepperButtonStyle = {
  size: "xs",
  variant: "ghost",
  borderRadius: "0",
  w: "28px",
  h: "26px",
  minW: "28px",
  color: "gray.500",
  _hover: { bg: "blue.50", color: "blue.500" },
  _disabled: { opacity: 0.3 },
};

export const stepperIconStyle = {
  fontSize: "16px",
  lineHeight: "1",
  userSelect: "none" as const,
};

export const stepperValueStyle = {
  fontSize: "13px",
  fontWeight: 600,
  color: "gray.800",
  minW: "24px",
  textAlign: "center" as const,
  px: 1,
  userSelect: "none" as const,
};

/* ─── Slider ─────────────────────────────────────────────────────── */

export const sliderTrackStyle = {
  h: "3px",
  borderRadius: "full",
  bg: "gray.200",
};

export const sliderThumbStyle = {
  boxSize: "14px",
  bg: "white",
  border: "2px solid",
  borderColor: "blue.400",
  boxShadow: "0 1px 4px rgba(66,153,225,0.4)",
  _focus: { boxShadow: "0 0 0 3px rgba(66,153,225,0.3)" },
};
