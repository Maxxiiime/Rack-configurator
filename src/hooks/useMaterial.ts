import materialData from "@/data/material.json";

export const useMaterial = () => {
  const getMetalMaterial = (name: string) => {
    return materialData.metal.find((material) => material.name === name);
  };

  return { getMetalMaterial };
};
