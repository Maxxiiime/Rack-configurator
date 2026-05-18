import { Text, TextProps } from "@chakra-ui/react";
import { FC, ReactNode } from "react";

type TitleProps = {
	children: ReactNode;
	onClick: TextProps["onClick"];
};
const Title: FC<TitleProps> = ({ children, ...rest }) => {
	return (
		<Text fontSize="2xl" fontWeight={600} {...rest}>
			{children}
		</Text>
	);
};

export default Title;
