export type PartCategory = 'arm' | 'h_brace' | 'x_brace' | 'column' | 'single_leg' | 'double_leg';

export interface ShelvingPart {
	shelving_system_id: string;
	category: PartCategory;
	size_mm: number;
	name: string;
	path: string;
}

export interface ShelvingSizes {
	offsets: Record<string, number>;
	dimensions: {
		column_width: number;
		column_depth: number;
		brace_height: number;
	};
	brace_lengths: Record<string, number>;
}
