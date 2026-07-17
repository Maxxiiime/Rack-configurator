import { Box } from "@chakra-ui/react";
import type {
  BoxProps,
  TextProps,
  FlexProps,
  CheckboxProps,
  ButtonProps,
  TableProps,
  TableContainerProps,
} from "@chakra-ui/react";
import styled from "@emotion/styled";

/* ─── Global Variables ─────────────────────────────────────────────── */

export const panelRadius = "sm";

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
  color: "black",
  textTransform: "uppercase" as const,
  mb: 2,
};

/* ─── Row label ──────────────────────────────────────────────────── */

export const rowLabelStyle = {
  fontSize: "13px",
  fontWeight: 500,
  color: "black",
  minW: "64px",
  flexShrink: 0,
  userSelect: "none" as const,
};

/* ─── Select ─────────────────────────────────────────────────────── */

export const selectStyle = {
  size: "sm" as const,
  borderRadius: panelRadius,
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
    borderRadius: panelRadius,
    px: 3,
    py: "5px",
    h: "auto",
    fontWeight: isActive ? 600 : 500,
    fontSize: "12px",
    lineHeight: "1",
    border: "1.5px solid",
    borderColor: isActive ? "black" : "gray.200",
    bg: isActive ? "black" : "gray.50",
    color: isActive ? "white" : "black",
    boxShadow: "none",
    _hover: {
      bg: isActive ? "black" : "gray.100",
      borderColor: isActive ? "black" : "gray.300",
      color: isActive ? "white" : "black",
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
  borderRadius: panelRadius,
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
  color: "black",
  _hover: { bg: "gray.100", color: "black" },
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
  color: "black",
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
  borderColor: "red.600",
  boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
  _focus: { boxShadow: "0 0 0 3px rgba(193,0,22,0.15)" },
};

/* ─── Reusable Layout Boxes ──────────────────────────────────────── */

export const hintBoxStyle: BoxProps = {
  p: 3,
  borderRadius: panelRadius,
  bg: "red.50",
  border: "1px solid",
  borderColor: "red.200",
};

export const priceBoxStyle: BoxProps = {
  p: 4,
  bg: "gray.50",
  borderRadius: panelRadius,
  border: "1px solid",
  borderColor: "gray.200",
};

/* ─── Typography & Shared Elements ───────────────────────────────── */

export const baseLabelStyle: TextProps = {
  fontSize: "12px",
  fontWeight: 500,
  color: "black",
};

export const hintTextStyle: TextProps = {
  fontSize: "11px",
  color: "red.600",
  lineHeight: "1.4",
};

export const resetButtonStyle: TextProps = {
  fontSize: "10px",
  fontWeight: 600,
  color: "red.500",
  cursor: "pointer",
  _hover: { color: "red.700" },
};

export const flexSpaceBetweenStyle: FlexProps = {
  align: "center",
  justify: "space-between",
  mb: 2,
};

export const checkboxStyle: CheckboxProps = {
  size: "md",
  colorScheme: "gray",
};

/* ─── Slider Filled Track ────────────────────────────────────────── */

export const sliderFilledTrackStyle = {
  bg: "gray.800",
};

/* ─── Navigation Buttons ─────────────────────────────────────────── */

export const nextButtonStyle: ButtonProps = {
  w: "full",
  bg: "black",
  color: "white",
  fontSize: "12px",
  fontWeight: 600,
  borderRadius: panelRadius,
  _hover: { bg: "gray.800" },
  _active: { bg: "gray.900" },
};

export const backButtonStyle: ButtonProps = {
  w: "full",
  bg: "white",
  border: "1px solid",
  borderColor: "gray.200",
  fontSize: "12px",
  fontWeight: 600,
  color: "black",
  borderRadius: panelRadius,
  _hover: { bg: "gray.50", borderColor: "gray.300" },
  _active: { bg: "gray.100" },
};

/* ─── Panel Header ───────────────────────────────────────────────── */

export const panelHeaderTextStyle: TextProps = {
  fontSize: "15px",
  fontWeight: 700,
  letterSpacing: "0.12em",
  textTransform: "uppercase" as const,
  color: "black",
};

/* ─── Step Dots ──────────────────────────────────────────────────── */

export function stepDotStyle(isActive: boolean, isPast: boolean): BoxProps {
  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    w: "24px",
    h: "24px",
    borderRadius: "full",
    border: "1.5px solid",
    borderColor: isActive ? "red.600" : isPast ? "gray.400" : "gray.200",
    bg: isActive ? "red.600" : isPast ? "gray.200" : "white",
    cursor: isPast ? "pointer" : "default",
    transition: "all 0.15s ease",
  } as BoxProps;
}

export const stepDotTextStyle = (isActive: boolean, isPast: boolean): TextProps => ({
  fontSize: "10px",
  fontWeight: 700,
  color: isActive ? "white" : isPast ? "black" : "gray.400",
  lineHeight: "1",
});

export const stepConnectorStyle: BoxProps = {
  h: "1px",
  w: "20px",
  transition: "background 0.2s ease",
};

/* ─── BOM Table ──────────────────────────────────────────────────── */

export const tableContainerStyle: TableContainerProps = {
  border: "1px solid",
  borderColor: "red.200",
  borderRadius: panelRadius,
};

export const tableStyle: TableProps = {
  variant: "simple",
  size: "sm",
};

/** sx prop for Chakra Table to set all th/td border color */
export const tableSxBorderColor = { "th, td": { borderColor: "red.200" } };

export const tableTheadStyle: BoxProps = {
  bg: "red.50",
};

export const tableThStyle = {
  px: 2,
  py: 3,
  fontSize: "12px",
  color: "black",
};

export const tableTdStyle = {
  px: 2,
  py: 3,
};

export const tableCellPrimaryStyle: TextProps = {
  fontWeight: 500,
  fontSize: "13px",
  color: "black",
};

export const tableCellSecondaryStyle: TextProps = {
  color: "black",
  fontSize: "11px",
};

export const tableCellPriceStyle: TextProps = {
  fontWeight: 600,
  fontSize: "13px",
  color: "black",
};

export const tableCellPriceSubStyle: TextProps = {
  color: "black",
  fontSize: "11px",
  fontWeight: "normal" as const,
};

/* ─── Price Total Footer ─────────────────────────────────────────── */

export const priceTotalBoxStyle: BoxProps & FlexProps = {
  ...priceBoxStyle,
  bg: "red.50",
  borderColor: "red.200",
  justify: "space-between",
  align: "center",
  mt: 4,
};

export const priceTotalLabelStyle: TextProps = {
  fontSize: "15px",
  fontWeight: "bold",
  color: "black",
};

export const priceTotalValueStyle: TextProps = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "black",
};
