import { useEffect, useMemo } from "react";
import { useControls } from "leva";
import { useRackStore, RackType } from "@/stores/rackStore";
import { useShelfParts } from "@/hooks/useShelfParts";
import { getMaxArmCount } from "@/utils/armPositions";

export const useRackControls = () => {
	const {
		rackType,
		columnId,
		armId,
		braceId,
		armSpacing,
		armCount,
		setRackType,
		setColumnId,
		setArmId,
		setBraceId,
		setArmSpacing,
		setArmCount,
	} = useRackStore();

	const { getColumnsOptions, getArmsOptions, getPartSize, findPartId, getColumnHeight, sizes } = useShelfParts();

	const columnsOpts = useMemo(() => getColumnsOptions(), [getColumnsOptions]);
	const armsOpts = useMemo(() => getArmsOptions(), [getArmsOptions]);

	const widthOpts = useMemo(() => [750, 1000, 1250, 1500, 1750, 2000], []);
	const initialWidth = useMemo(() => getPartSize(braceId) || 1000, []);

	// Compute the max arm count based on current column height and spacing
	const columnHeightUnits = getColumnHeight(columnId);
	const maxArms = useMemo(
		() => getMaxArmCount(sizes.arm.start_y, sizes.arm.end_y, columnHeightUnits, armSpacing),
		[columnHeightUnits, armSpacing, sizes.arm.start_y, sizes.arm.end_y]
	);

	const [, setControls] = useControls(
		"Rack Settings",
		() => ({
			Type: {
				value: rackType,
				options: { Single: "single", Double: "double" },
				onChange: (v) => setRackType(v as RackType),
			},
			Column: {
				value: columnId,
				options: columnsOpts,
				onChange: (v) => setColumnId(v),
			},
			Arm: {
				value: armId,
				options: armsOpts,
				onChange: (v) => setArmId(v),
			},
			Width: {
				value: getPartSize(braceId) || initialWidth,
				options: widthOpts,
				onChange: (v) => {
					const newBraceId = findPartId('x_brace', v);
					if (newBraceId) {
						setBraceId(newBraceId);
					}
				},
			},
			"Arm Spacing": {
				value: armSpacing,
				min: 2,
				max: 10,
				step: 1,
				onChange: (v) => setArmSpacing(v),
			},
			"Arm Count": {
				value: Math.min(armCount, maxArms),
				min: 1,
				max: maxArms,
				step: 1,
				onChange: (v) => setArmCount(v),
			},
		}),
		[columnsOpts, armsOpts, initialWidth, maxArms]
	);

	// Sync controls with store state and clamp arm count when max changes
	useEffect(() => {
		const clampedCount = Math.min(armCount, maxArms);
		if (clampedCount !== armCount) {
			setArmCount(clampedCount);
		}
		setControls({
			Type: rackType,
			Column: columnId,
			Arm: armId,
			Width: getPartSize(braceId) || 1000,
			"Arm Spacing": armSpacing,
			"Arm Count": clampedCount,
		});
	}, [rackType, columnId, armId, braceId, armSpacing, armCount, maxArms, setControls, getPartSize, setArmCount]);
};
