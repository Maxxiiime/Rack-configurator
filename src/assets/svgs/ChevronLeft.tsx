import { SVGProps } from "react";

const ChevronLeft = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="icon icon-tabler icon-tabler-chevron-left"
			width="44"
			height="44"
			viewBox="0 0 24 24"
			strokeWidth="1.5"
			stroke="#2c3e50"
			fill="none"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...props}>
			<path stroke="none" d="M0 0h24v24H0z" fill="none" />
			<path d="M15 6l-6 6l6 6" />
		</svg>
	);
};

export default ChevronLeft;
