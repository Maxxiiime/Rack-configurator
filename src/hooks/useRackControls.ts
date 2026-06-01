import { useEffect, useMemo } from "react";
import { useControls } from "leva";
import { useRackStore, RackType } from "@/stores/rackStore";
import { useShelfParts } from "@/hooks/useShelfParts";

export const useRackControls = () => {
	const {
		rackType,
		columnId,
		armId,
		braceId,
		setRackType,
		setColumnId,
		setArmId,
		setBraceId,
	} = useRackStore();

	const { getColumnsOptions, getArmsOptions, getPartSize, findPartId } = useShelfParts();

	const columnsOpts = useMemo(() => getColumnsOptions(), [getColumnsOptions]);
	const armsOpts = useMemo(() => getArmsOptions(), [getArmsOptions]);

	const widthOpts = useMemo(() => [750, 1000, 1250, 1500, 1750, 2000], []);
	const initialWidth = useMemo(() => getPartSize(braceId) || 1000, []);

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
		}),
		[columnsOpts, armsOpts, initialWidth]
	);

	useEffect(() => {
		setControls({
			Type: rackType,
			Column: columnId,
			Arm: armId,
			Width: getPartSize(braceId) || 1000,
		});
	}, [rackType, columnId, armId, braceId, setControls, getPartSize]);
};
