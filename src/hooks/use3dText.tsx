import removeEmojis from "@/helpers/parsers/removeEmojis";
import { useAppStore } from "../stores/appStore";

const use3dText = () => {
	const text3d = useAppStore((state) => state.text3d);
	const update = useAppStore((state) => state.update);

	const setText = (newText: string) => {
		update({ text3d: removeEmojis(newText) });
	};

	return { text: text3d, setText };
};

export default use3dText;
