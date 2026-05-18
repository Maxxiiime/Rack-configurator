import { Box } from "@chakra-ui/react";
import styled from "@emotion/styled";

export const Card = styled(Box)`
	background-color: white;
	box-shadow: 0px 4px 12px 2px #00000040;
	padding: 1rem;
	border-radius: 16px;
	width: 100%;

	h3 {
		white-space: nowrap;
		margin-bottom: 0.5rem;
		font-weight: 700;
	}

	a {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 0.5rem;
		font-size: 1.1rem;

		svg {
			width: 25px;
			height: 25px;
			stroke-width: 1.5px;
		}
	}
`;
