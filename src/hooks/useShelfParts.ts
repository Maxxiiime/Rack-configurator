import offsets from '@/data/shelving_offset.json';
import partsData from '@/data/shelving_parts.json';
import type { ShelvingPart, ShelvingOffsets } from '@/types/shelving';

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

  return {
    getColumnsOptions,
    getArmsOptions,
    getColumnHeight,
    getPartSize,
    findPartId,
    getPartData,
    offsets: typedOffsets,
    partsData: typedParts,
  };
};
