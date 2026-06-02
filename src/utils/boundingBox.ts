import { Object3D } from "three";
import { Box3 } from "three";

export type BoundingBox = {
  boundingX: number;
  boundingZ: number;
  boundingY: number;
};

export function getBoundingBox(mesh: Object3D): BoundingBox {
  const bounding = new Box3();
  bounding.setFromObject(mesh);

  return {
    boundingX: bounding.max.x - bounding.min.x,
    boundingZ: bounding.max.z - bounding.min.z,
    boundingY: bounding.max.y - bounding.min.y,
  };
}

export function getBoundingBoxPoints(mesh: Object3D): Box3 {
  const bounding = new Box3();
  bounding.setFromObject(mesh);

  return bounding;
}