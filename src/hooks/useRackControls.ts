import { useEffect, useMemo } from "react";
import { useControls } from "leva";
import { useRackStore, RackType } from "@/stores/rackStore";
import { useShelfParts } from "@/hooks/useShelfParts";

export const useRackControls = () => {
	const {
		rackType,
		numLevels,
		activeColumnId,
		activeArmId,
		activeBraceId,
		setRackType,
		setNumLevels,
		setActiveColumn,
		setActiveArm,
		setActiveBrace,
	} = useRackStore();

	const { getColumnsOptions, getArmsOptions, getPartSize, findPartId } = useShelfParts();

	// Setup Leva Controls with memoized options to prevent needless schema recreation
	const columnsOpts = useMemo(() => getColumnsOptions(), [getColumnsOptions]);
	const armsOpts = useMemo(() => getArmsOptions(), [getArmsOptions]);

	const widthOpts = useMemo(() => [750, 1000, 1250, 1500, 1750, 2000], []);
	const initialWidth = useMemo(() => getPartSize(activeBraceId) || 1000, []);

	const [, set] = useControls(
		() => ({
			Type: {
				value: rackType,
				options: { Single: "single", Double: "double" },
				onChange: (v) => setRackType(v as RackType),
			},
			Levels: {
				value: numLevels,
				min: 1,
				max: 10,
				step: 1,
				onChange: (v) => setNumLevels(v),
			},
			Column: {
				value: activeColumnId,
				options: columnsOpts,
				onChange: (v) => setActiveColumn(v),
			},
			Arm: {
				value: activeArmId,
				options: armsOpts,
				onChange: (v) => setActiveArm(v),
			},
			Width: {
				value: initialWidth,
				options: widthOpts,
				onChange: (v) => {
					const newBraceId = findPartId('x_brace', v);
					if (newBraceId) {
						setActiveBrace(newBraceId);
					}
				},
			},
		}),
		[columnsOpts, armsOpts, initialWidth]
	);

	// Sync Zustand -> Leva (if changed externally)
	useEffect(() => {
		set({
			Type: rackType,
			Levels: numLevels,
			Column: activeColumnId,
			Arm: activeArmId,
			Width: getPartSize(activeBraceId) || 1000,
		});
	}, [rackType, numLevels, activeColumnId, activeArmId, activeBraceId, set]);
};
