import { colors } from "@/theme/index";
import { Box } from "@chakra-ui/react";
import styled from "@emotion/styled";

export const StyledBox = styled(Box)<{ open: boolean; width: number }>`
	z-index: 10;
	position: relative;
	height: 100vh;
	max-width: ${({ open, width }) => (open ? `${width}px` : "0")};
	min-width: ${({ open, width }) => (open ? `${width}px` : "0")};
	background-color: #fff;
	transition: max-width 0.25s ease, min-width 0.25s ease;
	border-left: 1px solid ${colors.brand.light_gray};

	.panel-inner {
		min-width: ${({ width }) => `${width}px`};
		padding: 1rem;
		height: 100vh;
	}

	.panel-toggle {
		border: 1px solid ${colors.brand.light_gray};
		position: absolute;
		top: 40px;
		left: -35px;
		width: 35px;
		height: 50px;
		background-color: white;
		cursor: pointer;
		border-radius: 6px 0 0 6px;

		display: flex;
		align-items: center;
		justify-content: center;

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
