export type PartCategory = 'arm' | 'arm_stop' | 'h_brace' | 'x_brace' | 'column' | 'single_leg' | 'double_leg' | 'bolts' | 'arm_divider';

export interface ShelvingPart {
	shelving_system_id: string;
	category: PartCategory;
	size_mm?: number;
	name: string;
	path: string;
	arm_stop_y?: number;
	price?: number;
	max_weight?: number;
	max_weight_350mm?: number;
	max_weight_600mm?: number;
	max_weight_900mm?: number;
	max_weight_1250mm?: number;
	arm_stop_id?: string;
}

export type BraceType = 'h_brace' | 'x_brace';

export interface BraceElement {
	type: BraceType;
	y_position: number;
}

export type BraceLayouts = Record<string, BraceElement[]>;

export interface ShelvingOffsets {
	column: {
		x: number;
		z: number;
	};
	leg: {
		x: number;
		y: number;
		z: number;
		double_z: number;
	};
	arm: {
		x: number;
		z: number;
		start_y: number;
		double_x: number;
		double_z: number;
	};
	brace: {
		h_x: number;
		h_z: number;
		x_x: number;
		x_z: number;
	};
	brace_bolt: {
		first_x: number;
		last_x: number;
		z: number;
	};
	bottom_bolt: {
		y: number;
	};
	arm_stop: {
		x: number;
		z: number;
		double_x: number;
		double_z: number;
	};
	arm_divider: {
		x: number;
		y: number;
		z: number;
	};
}
