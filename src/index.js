import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import {
  HeartCurve,
  KnotCurve,
  TorusKnot,
} from "three/examples/jsm/curves/CurveExtras.js";

import islandFloor from "./components/islandFloor.js";
import createTextMesh from "./components/text.js";

// bacground Music
const backgroundMusic = new Audio("/sounds/background.mp3");
backgroundMusic.volume = 0.25;
backgroundMusic.loop = true;
backgroundMusic.play();





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
camera.position.set(-50, 30, 50);
scene.add(camera);

//Bounds
const skyBounds = {
  minX: -250,
  maxX: 250,
  minY: 0,
  maxY: 250,
  minZ: -250,
  maxZ: 250
};

const constrainCameraWithinBounds = () => {
  camera.position.x = Math.max(skyBounds.minX, Math.min(skyBounds.maxX, camera.position.x));
  camera.position.y = Math.max(skyBounds.minY, Math.min(skyBounds.maxY, camera.position.y));
  camera.position.z = Math.max(skyBounds.minZ, Math.min(skyBounds.maxZ, camera.position.z));
};



const levelTextMeshes = [];

// Spline camera
const splineCamera = new THREE.PerspectiveCamera(
  84,
  sizes.width / sizes.height,
  0.5,
  1000
);

// Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1.75);
scene.add(ambientLight);

const spotlight = new THREE.SpotLight(0xfff000, 5000, 33, Math.PI * 0.28);
spotlight.position.set(-5, 40, 5);
spotlight.castShadow = true;

scene.add(spotlight);

// Helpers
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// Clouds
const objLoader = new GLTFLoader(loading);

for (let i = 0; i < 64; i++) {
  objLoader.load("/models/cloud.glb", (gltf) => {
    // Set a random scale for each cloud
    const scale = Math.random() * 0.01 + 0.035; // Adjust the range as needed
    gltf.scene.scale.set(scale, scale, scale);

    // Randomize the position of each cloud
    gltf.scene.position.set(
      (Math.random() - 0.5) * 400, // X position
      (Math.random() - 0.5) * 100, // Y position, starting from 10
      (Math.random() - 0.5) * 300 // Z position
    );

    // Randomize the rotation of each cloud
    gltf.scene.rotation.set(0, Math.random() * Math.PI, 0.1);

    scene.add(gltf.scene);
  });
}

// Island
objLoader.load("/models/mountain_landscape.glb", (gltf) => {
  gltf.scene.scale.set(1, 1, 1);
  gltf.scene.position.set(25, 0, 25);
  gltf.scene.rotation.set(0, -Math.PI / 2, 0);
  scene.add(gltf.scene);
});

objLoader.load("/models/mountain_landscape.glb", (gltf) => {
  gltf.scene.scale.set(1, 1, 1);
  gltf.scene.position.set(-25, 0, 25);
  gltf.scene.rotation.set(0, Math.PI, 0);
  scene.add(gltf.scene);
});

objLoader.load("/models/mountain_landscape.glb", (gltf) => {
  gltf.scene.scale.set(1, 1, 1);
  gltf.scene.position.set(25, 0, -25);
  gltf.scene.rotation.set(0, 0, 0);
  scene.add(gltf.scene);
});

objLoader.load("/models/mountain_landscape.glb", (gltf) => {
  gltf.scene.scale.set(1, 1, 1);
  gltf.scene.position.set(-25, 0, -25);
  gltf.scene.rotation.set(0, Math.PI / 2, 0);
  scene.add(gltf.scene);
});

objLoader.load("/models/sky_background.glb", (gltf) => {
  gltf.scene.scale.set(1, 1, 1);
  gltf.scene.position.set(0, 0, 0);
  scene.add(gltf.scene);
});

// Rings
const color1 = new THREE.Color(0x8dd964);
const ringGeometry = new THREE.TorusGeometry(0.3, 0.15, 15, 45);
const ringMaterial = new THREE.MeshStandardMaterial({
  color: color1,
  roughness: 0.01,
  metalness: 0.01,
});
for (let i = 0; i < 371; i++) {
  const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);

  ringMesh.position.set(
    (Math.random() - 0.5) * 100, // X position
    1 + Math.random() * 10, // Y position, starting from 10
    (Math.random() - 0.5) * 100 // Z position
  );

  ringMesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
  const scale = Math.random() * Math.random();
  ringMesh.scale.set(scale * 3, scale * 3, scale * 2);

  ringMesh.castShadow = true;
  scene.add(ringMesh);
}
//Game Title
createTextMesh(
  "SKYWORLD",
  "/fonts/8-bit Operator+ 8_Regular.json",
  "/textures/matcaps/8.png",
  4.5,
  1,
  [0, 26, 0]
).then((mesh) => scene.add(mesh));

createTextMesh(
  "ODYSSEY",
  "/fonts/8-bit Operator+ 8_Regular.json",
  "/textures/matcaps/8.png",
  4.5,
  0.2,
  [0, 20, 0]
).then((mesh) => scene.add(mesh));

// Levels

const levelGroups = {
  "Level 1": new THREE.Group(),
  "Level 2": new THREE.Group(),
  "Level 3": new THREE.Group(),
  "Level 4": new THREE.Group(),
};

Object.values(levelGroups).forEach((group) => scene.add(group));

createTextMesh(
  "Level 4",
  "/fonts/8-bit Operator+ 8_Regular.json",
  "/textures/matcaps/7.png",
  3.5,
  0.2,
  [-25, 12, -25]
).then((mesh) => {
  mesh.name = "Level 4";
  levelGroups["Level 4"].add(mesh);
  const torusKnot = new TorusKnot(5); // Adjust the size as needed
  const tknotGeometry = new THREE.TubeGeometry(torusKnot, 50, 2, 3, true);
  const tknotMaterial = new THREE.MeshLambertMaterial({ color: 0xffffcf });
  const tKnotMesh = new THREE.Mesh(tknotGeometry, tknotMaterial);
  tKnotMesh.position.set(-70, 0, -25);
  levelGroups["Level 4"].add(tKnotMesh);
});

createTextMesh(
  "Level 3",
  "/fonts/8-bit Operator+ 8_Regular.json",
  "/textures/matcaps/7.png",
  3.5,
  0.2,
  [25, 12, -25]
).then((mesh) => {
  mesh.name = "Level 3";
  levelGroups["Level 3"].add(mesh);
  const knotShape = new KnotCurve(2); // Adjust the size as needed
  const knotGeometry = new THREE.TubeGeometry(knotShape, 50, 3, 4, true);
  const knotMaterial = new THREE.MeshLambertMaterial({ color: 0xffffcf });
  const lapMesh = new THREE.Mesh(knotGeometry, knotMaterial);
  lapMesh.position.set(60, -30, -100);
  lapMesh.rotation.set(0, Math.PI / 2, 0);
  levelGroups["Level 3"].add(lapMesh);
});

createTextMesh(
  "Level 2",
  "/fonts/8-bit Operator+ 8_Regular.json",
  "/textures/matcaps/7.png",
  3.5,
  0.2,
  [25, 12, 25]
).then((mesh) => {
  mesh.name = "Level 2";
  levelGroups["Level 2"].add(mesh);
  const knotShape = new KnotCurve(2); // Adjust the size as needed
  const knotGeometry = new THREE.TubeGeometry(knotShape, 50, 3, 4, true);
  const knotMaterial = new THREE.MeshLambertMaterial({ color: 0xffffcf });
  const knotMesh = new THREE.Mesh(knotGeometry, knotMaterial);
  knotMesh.position.set(100, -30, 25);
  levelGroups["Level 2"].add(knotMesh);
});

createTextMesh(
  "Level 1",
  "/fonts/8-bit Operator+ 8_Regular.json",
  "/textures/matcaps/7.png",
  3.5,
  0.2,
  [-25, 12, 25]
).then((mesh) => {
  mesh.name = "Level 1";
  levelGroups["Level 1"].add(mesh);
  const heartShape = new HeartCurve(2.5); // Adjust the size as needed
  const heartGeometry = new THREE.TubeGeometry(heartShape, 50, 3, 3, true);
  const heartMaterial = new THREE.MeshLambertMaterial({ color: 0xffffcf });
  const heartMesh = new THREE.Mesh(heartGeometry, heartMaterial);
  heartMesh.position.set(-100, 0, 25);
  levelGroups["Level 1"].add(heartMesh);
});

// Orbit Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Resize
window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
});

// Camera Animation
function animateCameraToLevel(clickedMesh) {
  const levelGroup = levelGroups[clickedMesh.name];
  if (!levelGroup) {
    console.error("Group not found for", clickedMesh.name);
    return;
  }

  // Find the spline mesh within the group
  const splineMesh = levelGroup.children.find(
    (child) =>
      child instanceof THREE.Mesh &&
      child.geometry instanceof THREE.TubeGeometry
  );
  if (!splineMesh) {
    console.error("Spline mesh not found in group for", clickedMesh.name);
    return;
  }

  const spline = splineMesh.geometry.parameters.path;

  const looptime = 20 * 1000; // Duration of the animation
  let t = 0;

  function animate() {
    t += (1 / looptime) * clock.getDelta();
    if (t > 1) t = 0; // Loop or reset based on your preference

    const position = spline.getPointAt(t);
    const tangent = spline.getTangentAt(t).normalize();
    const lookAtPosition = position.clone().add(tangent);

    camera.position.copy(position);
    camera.lookAt(lookAtPosition);

    requestAnimationFrame(animate);
  }

  animate();
}

//Clicks
canvas.addEventListener("click", onCanvasClick);
function onCanvasClick(event) {
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(levelTextMeshes);
  if (intersects.length > 0) {
    // A level text mesh was clicked
    animateCameraToLevel(intersects[0].object);
  }
}

//Player Character
const player1 = objLoader.load("/models/player.glb", (gltf) => {
  gltf.scene.scale.set(0.02, 0.02, 0.02);
  gltf.scene.position.set(0, 10, 0);
  scene.add(gltf.scene);
});

const playerSpeed = 5;
let movementDirection = new THREE.Vector3(0, 0, 0);

const keysPressed = {};

window.addEventListener("keydown", (event) => {
  keysPressed[event.key.toLowerCase()] = true;
});

window.addEventListener("keyup", (event) => {
  keysPressed[event.key.toLowerCase()] = false;
});

const updatePlayerPosition = () => {
  movementDirection.set(
    keysPressed["a"] ? -1 : keysPressed["d"] ? 1 : 0,
    0,
    keysPressed["w"] ? -1 : keysPressed["s"] ? 1 : 0
  );
  movementDirection.normalize().multiplyScalar(playerSpeed * clock.getDelta());
  player1.position.add(movementDirection);
};

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
        }
      }
    });
    constrainCameraWithinBounds();
    // Render the scene
    renderer.render(scene, camera);
    
    
    // Request the next frame of animation
    requestAnimationFrame(animate);
  };

  animate();
  
  
};
loop();
