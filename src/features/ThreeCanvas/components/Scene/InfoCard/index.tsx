import ExternalLink from "@/assets/svgs/ExternalLink";
import { Html } from "@react-three/drei";

import { Card } from "./styles";

const InfoCard = () => {
	return (
		<Html center position={[0, -1.5, 0]}>
			<Card className="card-wrapper">
				<h3>React Three starter guide on Flux Docs</h3>
				<a target="_blank" rel="noopener noreferrer" href="https://docs.flux.be/docs/guides/react-three-template/">
					Open guide <ExternalLink />
				</a>
			</Card>
		</Html>
	);
};

export default InfoCard;
