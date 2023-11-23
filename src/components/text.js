import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

const createTextMesh = (text, fontPath, texturePath, size, height, position) => {
    const fontLoader = new FontLoader();
    const textureLoader = new THREE.TextureLoader();
    const colorTexture = textureLoader.load(texturePath);
    colorTexture.minFilter = THREE.NearestFilter;
    colorTexture.magFilter = THREE.NearestFilter;
  
    return new Promise((resolve, reject) => {
      fontLoader.load(fontPath, (font) => {
        const textGeometry = new TextGeometry(text, {
          font: font,
          size: size,
          height: height,
          // ... other text geometry parameters ...
        });
        textGeometry.center();
  
        const textMaterial = new THREE.MeshStandardMaterial({
          map: colorTexture,
          // ... other material parameters ...
        });
  
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(...position);
        textMesh.castShadow = true;
  
        resolve(textMesh);
      }, undefined, reject);
    });
  };
  
  export default createTextMesh;