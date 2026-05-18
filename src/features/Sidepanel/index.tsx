import Subtitle from "@/components/Subtitle";
import Title from "@/components/Title";
import use3dText from "@/hooks/use3dText";
import { Input } from "@chakra-ui/react";
import { StyledBox } from "./styles";
import ChevronLeft from "@/assets/svgs/ChevronLeft";
import { useState } from "react";

const Sidepanel = ({ width = 350 }) => {
	const [open, setOpen] = useState(true);
	const { text, setText } = use3dText();
	return (
		<StyledBox open={open} width={width}>
			<div className="panel-toggle" onClick={() => setOpen((p) => !p)}>
				<ChevronLeft />
			</div>
			<div className="panel-inner">
				<Title onClick={() => setOpen((p) => !p)}>Flux Starter Template</Title>
				<Subtitle>3D Text</Subtitle>
				<Input onChange={(e) => setText(e.target.value)} value={text} placeholder="Basic usage" />
			</div>
		</StyledBox>
	);
};

export default Sidepanel;
