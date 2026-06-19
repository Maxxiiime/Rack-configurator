import { colors } from "@/theme/index";
import { Box } from "@chakra-ui/react";
import type { BoxProps } from "@chakra-ui/react";
import styled from "@emotion/styled";

/* ─── Sidepanel shell ────────────────────────────────────────────── */

export const StyledBox = styled(Box) <{ open: boolean; width: number }>`
	z-index: 10;
	position: fixed;
	top: 0;
	right: 0;
	height: 100vh;
	overflow: visible;
	max-width: ${({ open, width }) => (open ? `${width}px` : "0")};
	min-width: ${({ open, width }) => (open ? `${width}px` : "0")};
	background: rgba(255, 255, 255, 0.55);
	backdrop-filter: blur(18px) saturate(180%);
	-webkit-backdrop-filter: blur(18px) saturate(180%);
	border-left: 1px solid rgba(255, 255, 255, 0.4);
	box-shadow: -8px 0 32px rgba(0, 0, 0, 0.08);
	transition: max-width 0.25s ease, min-width 0.25s ease;

	.panel-inner {
		min-width: ${({ width }) => `${width}px`};
		padding: 1rem;
		height: 100vh;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
	}

	.panel-toggle {
		position: absolute;
		top: 50%;
		left: -44px;
		transform: translateY(-50%);
		width: 44px;
		height: 70px;
		background: rgba(255, 255, 255, 0.55);
		backdrop-filter: blur(18px) saturate(180%);
		-webkit-backdrop-filter: blur(18px) saturate(180%);
		border: 1px solid rgba(255, 255, 255, 0.4);
		border-right: none;
		box-shadow: -4px 0 16px rgba(0, 0, 0, 0.08);
		cursor: pointer;
		border-radius: 6px 0 0 6px;

		display: flex;
		align-items: center;
		justify-content: center;

		&:hover {
			background: rgba(255, 255, 255, 0.75);
		}

		svg {
			stroke: #454545;
			stroke-width: 1.5px;
			width: 28px;
			height: 28px;
			transition: transform 0.15s ease-in-out;
			transform: rotate(${({ open }) => (open ? "180deg" : "0")});
		}
	}
`;

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
  _hover: { borderColor: "gray.400" },
  _focus: { borderColor: "gray.800", boxShadow: "0 0 0 1px #1a1a1a" },
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
    borderColor: isActive ? "gray.800" : "gray.200",
    bg: isActive ? "gray.900" : "gray.50",
    color: isActive ? "white" : "gray.500",
    boxShadow: isActive ? "0 2px 8px rgba(0,0,0,0.25)" : "none",
    _hover: {
      bg: isActive ? "gray.700" : "gray.100",
      borderColor: isActive ? "gray.700" : "gray.300",
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
  _hover: { bg: "gray.100", color: "gray.900" },
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
  borderColor: "gray.800",
  boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
  _focus: { boxShadow: "0 0 0 3px rgba(0,0,0,0.15)" },
};
