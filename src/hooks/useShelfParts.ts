import sizes from '@/data/shelving_sizes.json';
import partsData from '@/data/shelving_parts.json';
import type { ShelvingPart, ShelvingSizes } from '@/types/shelving';

const typedParts = partsData as ShelvingPart[];
const typedSizes = sizes as ShelvingSizes;

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

  const getBraceLength = (braceLengthKey: string): number => {
    return typedSizes.brace_lengths[braceLengthKey];
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

  const getOffsets = () => {
    return typedSizes.offsets;
  };

  const getPartData = (id: string) => {
    return typedParts.find((p) => p.shelving_system_id === id);
  };

  const getDimensions = () => {
    return typedSizes.dimensions;
  };

  return {
    getColumnsOptions,
    getArmsOptions,
    getBraceLength,
    getColumnHeight,
    getPartSize,
    findPartId,
    getOffsets,
    getPartData,
    getDimensions,
    sizes: typedSizes,
    partsData: typedParts,
  };
};
