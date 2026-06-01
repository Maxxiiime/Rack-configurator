export type PartCategory = 'arm' | 'h_brace' | 'x_brace' | 'column' | 'single_leg' | 'double_leg';

export interface ShelvingPart {
	shelving_system_id: string;
	category: PartCategory;
	size_mm: number;
	name: string;
	path: string;
}

export interface ShelvingSizes {
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
		end_y: number;
		double_x: number;
		double_z: number;
	};
	brace: {
		h_x: number;
		h_z: number;
		x_x: number;
		x_z: number;
		top_offset: number;
		height: number;
	};
}
