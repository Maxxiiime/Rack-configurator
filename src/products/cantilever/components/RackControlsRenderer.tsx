import React from 'react';
import { Button3D } from '@/components/3d/Button3D';
import { useRackSectionsStore } from '../stores/sectionsStore';
import { useEditorStore } from '../stores/editorStore';
import { useRackPositions } from '../hooks/useRackPositions';

export const RackControls: React.FC = () => {
	const currentStep = useEditorStore((s) => s.currentStep);
	const addSectionLeft = useRackSectionsStore((s) => s.addSectionLeft);
	const addSectionRight = useRackSectionsStore((s) => s.addSectionRight);
	const { columnPositionsX } = useRackPositions();

	if (currentStep !== 1) return null;

	return (
		<>
			<Button3D
				type="plus"
				position={[columnPositionsX[0] - 5, 10.0, 0]}
				onClick={addSectionLeft}
			/>
			<Button3D
				type="plus"
				position={[columnPositionsX[columnPositionsX.length - 1] + 5, 10.0, 0]}
				onClick={addSectionRight}
			/>
		</>
	);
};
