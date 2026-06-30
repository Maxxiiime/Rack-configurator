import offsets from '../data/offsets.json';
import partsData from '../data/parts.json';
import type { ShelvingPart, ShelvingOffsets } from '../types';

const typedParts = partsData as ShelvingPart[];
const typedOffsets = offsets as ShelvingOffsets;

export const useShelfParts = () => {
  const getColumnsOptions = (): Record<string, string> => {
    return typedParts
      .filter((p) => p.category === 'column')
      .reduce<Record<string, string>>(
        (acc, p) => ({ ...acc, [p.name]: p.shelving_system_id }),
        {}
      );
  };

  const getArmsOptions = (): Record<string, string> => {
    return typedParts
      .filter((p) => p.category === 'arm')
      .reduce<Record<string, string>>(
        (acc, p) => ({ ...acc, [p.name]: p.shelving_system_id }),
        {}
      );
  };

  const getColumnHeight = (columnId: string): number => {
    const part = typedParts.find((p) => p.shelving_system_id === columnId);
    return (part?.size_mm ?? 2000) / 100;
  };

  const getPartSize = (id: string): number => {
    const part = typedParts.find((p) => p.shelving_system_id === id);
    return part?.size_mm ?? 0;
  };

  const findPartId = (category: string, size: number): string | undefined => {
    return typedParts.find((p) => p.category === category && p.size_mm === size)
      ?.shelving_system_id;
  };

  const getPartData = (id: string) => {
    return typedParts.find((p) => p.shelving_system_id === id);
  };

  const getColumnMaxWeightForArm = (columnId: string, armId: string): number => {
    const column = typedParts.find((p) => p.shelving_system_id === columnId);
    const arm = typedParts.find((p) => p.shelving_system_id === armId);
    if (!column || !arm) return Infinity;

    const armSize = arm.size_mm ?? 0;
    const key = `max_weight_${armSize}mm` as keyof typeof column;
    return (column[key] as number | undefined) ?? Infinity;
  };

  const getMaxArmsByWeight = (columnId: string, armId: string): number => {
    const columnMaxWeight = getColumnMaxWeightForArm(columnId, armId);
    const arm = typedParts.find((p) => p.shelving_system_id === armId);
    const armWeight = arm?.max_weight ?? 0;
    if (armWeight <= 0 || columnMaxWeight === Infinity) return Infinity;
    return Math.floor(columnMaxWeight / armWeight);
  };

  return {
    getColumnsOptions,
    getArmsOptions,
    getColumnHeight,
    getPartSize,
    findPartId,
    getPartData,
    getColumnMaxWeightForArm,
    getMaxArmsByWeight,
    offsets: typedOffsets,
    partsData: typedParts,
  };
};
