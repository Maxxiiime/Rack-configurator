import offsetsData from '../data/offsets.json';
import partsDataJson from '../data/parts.json';
import type { ShelvingPart, ShelvingOffsets } from '../types';

export const partsData = partsDataJson as ShelvingPart[];
export const offsets = offsetsData as ShelvingOffsets;

export const getColumnsOptions = (): Record<string, string> => {
  return partsData
    .filter((p) => p.category === 'column')
    .reduce<Record<string, string>>(
      (acc, p) => ({ ...acc, [p.name]: p.shelving_system_id }),
      {}
    );
};

export const getArmsOptions = (): Record<string, string> => {
  return partsData
    .filter((p) => p.category === 'arm')
    .reduce<Record<string, string>>(
      (acc, p) => ({ ...acc, [p.name]: p.shelving_system_id }),
      {}
    );
};

export const getColumnHeight = (columnId: string): number => {
  const part = partsData.find((p) => p.shelving_system_id === columnId);
  return (part?.size_mm ?? 2000) / 100;
};

export const getPartSize = (id: string): number => {
  const part = partsData.find((p) => p.shelving_system_id === id);
  return part?.size_mm ?? 0;
};

export const findPartId = (category: string, size: number): string | undefined => {
  return partsData.find((p) => p.category === category && p.size_mm === size)
    ?.shelving_system_id;
};

export const getPartData = (id: string) => {
  return partsData.find((p) => p.shelving_system_id === id);
};

export const getColumnMaxWeightForArm = (columnId: string, armId: string): number => {
  const column = partsData.find((p) => p.shelving_system_id === columnId);
  const arm = partsData.find((p) => p.shelving_system_id === armId);
  if (!column || !arm) return Infinity;

  const armSize = arm.size_mm ?? 0;
  const key = `max_weight_${armSize}mm` as keyof typeof column;
  return (column[key] as number | undefined) ?? Infinity;
};

export const getMaxArmsByWeight = (columnId: string, armId: string): number => {
  const columnMaxWeight = getColumnMaxWeightForArm(columnId, armId);
  const arm = partsData.find((p) => p.shelving_system_id === armId);
  const armWeight = arm?.max_weight ?? 0;
  if (armWeight <= 0 || columnMaxWeight === Infinity) return Infinity;
  return Math.floor(columnMaxWeight / armWeight);
};
