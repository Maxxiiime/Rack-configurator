import { useEffect, useMemo } from "react";
import { useControls } from "leva";
import { useRackStore, RackType } from "@/stores/rackStore";
import { useShelfParts } from "@/hooks/useShelfParts";

export const useRackControls = () => {
	const {
		rackType,
		activeColumnId,
		activeArmId,
		activeBraceId,
		selectedRack,
		racks,
		editAllRacks,
		setRackType,
		setActiveColumn,
		setActiveArm,
		setActiveBrace,
		setEditAllRacks,
	} = useRackStore();

	const { getColumnsOptions, getArmsOptions, getPartSize, findPartId } = useShelfParts();

	const selectedRackConfig = useMemo(
		() => racks.find((r) => r.id === selectedRack),
		[racks, selectedRack]
	);

	const effectiveColumnId = selectedRackConfig?.columnId ?? activeColumnId;
	const effectiveBraceId = selectedRackConfig?.braceId ?? activeBraceId;

	const columnsOpts = useMemo(() => getColumnsOptions(), [getColumnsOptions]);
	const armsOpts = useMemo(() => getArmsOptions(), [getArmsOptions]);

	const widthOpts = useMemo(() => [750, 1000, 1250, 1500, 1750, 2000], []);
	const initialWidth = useMemo(() => getPartSize(activeBraceId) || 1000, []);

	// Global controls (apply to all racks)
	const [, setGlobal] = useControls(
		"Global",
		() => ({
			Type: {
				value: rackType,
				options: { Single: "single", Double: "double" },
				onChange: (v) => setRackType(v as RackType),
			},
			Arm: {
				value: activeArmId,
				options: armsOpts,
				onChange: (v) => setActiveArm(v),
			},
		}),
		[armsOpts]
	);

	// Per-rack or global controls (depend on "Edit All Racks" toggle)
	const [, setIndividual] = useControls(
		"Global or Individual",
		() => ({
			"Edit All Racks": {
				value: editAllRacks,
				onChange: (v: boolean) => setEditAllRacks(v),
			},
			Column: {
				value: effectiveColumnId,
				options: columnsOpts,
				onChange: (v) => setActiveColumn(v),
			},
			Width: {
				value: getPartSize(effectiveBraceId) || initialWidth,
				options: widthOpts,
				onChange: (v) => {
					const newBraceId = findPartId('x_brace', v);
					if (newBraceId) {
						setActiveBrace(newBraceId);
					}
				},
			},
		}),
		[columnsOpts, initialWidth, editAllRacks]
	);

	useEffect(() => {
		setGlobal({
			Type: rackType,
			Arm: activeArmId,
		});
		setIndividual({
			"Edit All Racks": editAllRacks,
			Column: effectiveColumnId,
			Width: getPartSize(effectiveBraceId) || 1000,
		});
	}, [rackType, effectiveColumnId, activeArmId, effectiveBraceId, editAllRacks, setGlobal, setIndividual, getPartSize]);
};
