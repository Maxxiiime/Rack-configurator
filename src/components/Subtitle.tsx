import { Text } from "@chakra-ui/react";
import { FC, ReactNode } from "react";

type SubTitleProps = { children: ReactNode };
const Subtitle: FC<SubTitleProps> = ({ children, ...props }) => {
	return (
		<Text mb="0.5" mt="2" fontSize="lg" fontWeight={500} {...props}>
			{children}
		</Text>
	);
};

export default Subtitle;
