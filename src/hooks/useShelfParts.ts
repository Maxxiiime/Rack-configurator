import sizes from '@/data/shelving_sizes.json';
import partsData from '@/data/shelving_parts.json';

export const useShelfParts = () => {
  const getColumnsOptions = (): Record<string, string> => {
    return partsData
      .filter((p) => p.shelving_system_id.startsWith('column_'))
      .reduce<Record<string, string>>(
        (acc, p) => ({ ...acc, [p.name]: p.shelving_system_id }),
        {}
      );
  };

  const getArmsOptions = (): Record<string, string> => {
    return partsData
      .filter((p) => p.shelving_system_id.startsWith('arm_'))
      .reduce<Record<string, string>>(
        (acc, p) => ({ ...acc, [p.name]: p.shelving_system_id }),
        {}
      );
  };

  const getBraceLength = (braceLengthKey: string): number => {
    return (sizes.brace_lengths as Record<string, number>)[braceLengthKey];
  };

  const getColumnHeight = (columnId: string): number => {
    const heightMm = parseInt(columnId.split('_').pop() || '2000', 10);
    return heightMm / 100;
  };

  const getOffsets = () => {
    return sizes.offsets;
  };

  const getPartData = (id: string) => {
    return partsData.find((p) => p.shelving_system_id === id);
  };

  const getDimensions = () => {
    return sizes.dimensions;
  };

  return {
    getColumnsOptions,
    getArmsOptions,
    getBraceLength,
    getColumnHeight,
    getOffsets,
    getPartData,
    getDimensions,
    sizes,
    partsData
  };
};
