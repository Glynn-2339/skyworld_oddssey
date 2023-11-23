import * as THREE from "three";

const islandFloor = (radiusTop, radiusBottom, height, radialSegments, color, metalness, position, rotation) => {
  const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
  const material = new THREE.MeshStandardMaterial({ color: color, metalness: metalness });
  const cylinder = new THREE.Mesh(geometry, material);

  cylinder.position.set(...position);
  if (rotation) {
    cylinder.rotation.set(...rotation);
  }
  cylinder.receiveShadow = true;

  return cylinder;
};
    


export default islandFloor