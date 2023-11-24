import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import islandFloor from "./components/islandFloor.js";
import createTextMesh from "./components/text.js";

//Loading Manager
const loading = new THREE.LoadingManager();
loading.onStart = () => {
  console.log("loading started");
};
loading.onLoad = () => {
  console.log("loading finished");
};

// Textures
const textureLoader = new THREE.TextureLoader(loading);
const colorTexture = textureLoader.load("/textures/minecraft.png");
const matcapTexture = textureLoader.load("/textures/matcaps/7.png");
colorTexture.minFilter = THREE.NearestFilter;
colorTexture.magFilter = THREE.NearestFilter;

// Scene
const scene = new THREE.Scene();

// Camera
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.5,
  1000
);
camera.position.set(0, 50, 0);
scene.add(camera);

// Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
scene.add(ambientLight);

const createSpotLight = (
  color,
  intensity,
  distance,
  angle,
  penumbra,
  decay,
  position
) => {
  const light = new THREE.SpotLight(
    color,
    intensity,
    distance,
    angle,
    penumbra,
    decay
  );
  light.position.set(...position);
  light.castShadow = true;
  light.shadow.mapSize.width = 1024;
  light.shadow.mapSize.height = 1024;
  light.shadow.camera.near = 0.5;
  light.shadow.camera.far = 1000;
  light.shadow.focus = 1;
  light.shadow.bias = 0.0001;

  return light;
};
const spotLight = createSpotLight(
  0xfff000,
  30,
  35,
  Math.PI * 0.2,
  0.1,
  1,
  [0, 22.5, 10]
);
const level1Light = createSpotLight(
  0xfff000,
  200,
  35,
  Math.PI * 0.5,
  0.1,
  1,
  [-25, 25, -25]
);
const level2Light = createSpotLight(
  0xfff000,
  200,
  35,
  Math.PI * 0.5,
  0.1,
  1,
  [25, 25, -25]
);
const level3Light = createSpotLight(
  0xfff000,
  200,
  35,
  Math.PI * 0.5,
  0.1,
  1,
  [25, 25, 25]
);
const level4Light = createSpotLight(
  0xfff000,
  200,
  35,
  Math.PI * 0.5,
  0.1,
  1,
  [-25, 25, 25]
);
scene.add(level1Light);
scene.add(level2Light);
scene.add(level3Light);
scene.add(level4Light);
scene.add(spotLight);

// Helpers
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);


// Plane

const planeGeometry = new THREE.PlaneGeometry(1000, 1000, 100, 100);
const planeMaterial = new THREE.MeshStandardMaterial({
  map: colorTexture,
});
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
planeMesh.rotation.x = -Math.PI / 2;
planeMesh.position.y = -1;
planeMesh.receiveShadow = true;
scene.add(planeMesh);

// Island
const cylinder1 = islandFloor(
  2,
  16,
  10.2,
  52,
  0x777700,
  0.01,
  [-25, -0.5, -25]
);
const cylinder2 = islandFloor(2, 16, 10.2, 52, 0x777700, 0.01, [25, -0.5, -25]);
const cylinder3 = islandFloor(2, 16, 10.2, 52, 0x777700, 0.01, [25, -0.5, 25]);
const cylinder4 = islandFloor(2, 16, 10.2, 52, 0x777700, 0.01, [-25, -0.5, 25]);
const pipeline = islandFloor(
  16,
  16,
  30.2,
  52,
  0x777700,
  0.01,
  [-25, 5, -60],
  [Math.PI / 2, 0, 0]
);

// Add cylinders to the scene
scene.add(cylinder1);
scene.add(cylinder2);
scene.add(cylinder3);
scene.add(cylinder4);
scene.add(pipeline);

// Rings
const color1 = new THREE.Color(0x8dd964);
const ringGeometry = new THREE.TorusGeometry(0.25, 0.15, 15, 45);
const ringMaterial = new THREE.MeshStandardMaterial({
  color: color1,
  roughness: 0.01,
  metalness: 0.01,
});
for (let i = 0; i < 171; i++) {
  const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);

  ringMesh.position.set(
    (Math.random() - 0.5) * 20,
    (Math.random() - 0.5) * 4 + 13,
    (Math.random() - 0.5) * 3
  );

  ringMesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
  const scale = Math.random() * Math.random();
  ringMesh.scale.set(scale * 2, scale * 2, scale * 2);

  ringMesh.castShadow = true;
  scene.add(ringMesh);
}
//FONTS
createTextMesh(
  "SKYWORLD ODYSSEY",
  "/fonts/helvetiker_regular.typeface.json",
  "/textures/minecraft.png",
  1.1,
  0.2,
  [0, 8, 0]
).then((mesh) => scene.add(mesh));

createTextMesh(
  "Level 1",
  "/fonts/helvetiker_regular.typeface.json",
  "/textures/minecraft.png",
  0.8,
  0.2,
  [-25, 8, -25]
).then((mesh) => scene.add(mesh));

createTextMesh(
  "Level 2",
  "/fonts/helvetiker_regular.typeface.json",
  "/textures/minecraft.png",
  0.8,
  0.2,
  [25, 8, -25]
).then((mesh) => scene.add(mesh));

createTextMesh(
  "Level 3",
  "/fonts/helvetiker_regular.typeface.json",
  "/textures/minecraft.png",
  0.8,
  0.2,
  [ 25, 8, 25]
).then((mesh) => scene.add(mesh));

createTextMesh(
  "Level 4",
  "/fonts/helvetiker_regular.typeface.json",
  "/textures/minecraft.png",
  0.8,
  0.2,
  [-25, 8, 25]
).then((mesh) => scene.add(mesh));

// Orbit Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Animation
const clock = new THREE.Clock();
const loop = () => {
  //TIMING
  const animate = () => {
    // Update the positions, rotations, and scales of the rings
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        if (object.geometry.type === "TorusGeometry") {
          object.rotation.x += 0.01 * Math.sin(Date.now() * 0.001);
          object.rotation.y += 0.02 * Math.sin(Date.now() * 0.001);
          object.scale.set(
            Math.sin(Date.now() * 0.001) * 0.3 + 0.8,
            Math.sin(Date.now() * 0.001) * 0.3 + 0.8,
            Math.sin(Date.now() * 0.001) * 0.3 + 0.8
          );
        }
      }
    });

    // Render the scene
    renderer.render(scene, camera);

    // Request the next frame of animation
    requestAnimationFrame(animate);
  };

  animate();
};
loop();