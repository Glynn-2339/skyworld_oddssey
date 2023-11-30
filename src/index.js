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
splineCamera.position.set(-50, 30, 50);


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

// Define the curves for each level
const curves = {
  "Level 1": new HeartCurve(2.5),
  "Level 2": new KnotCurve(2),
  "Level 3": new KnotCurve(2),
  "Level 4": new TorusKnot(5)
};

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
  levelGroups["Level 4"].curve = curves["Level 4"];
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
  levelGroups["Level 3"].curve = curves["Level 3"];
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
  levelGroups["Level 2"].curve = curves["Level 2"];
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
  levelGroups["Level 1"].curve = curves["Level 1"];
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
//Level Starts
const levelStartPoints = {
  "Level 1": { position: new THREE.Vector3(-50, 30, 50), lookAt: new THREE.Vector3(0, 0, 0) },
  "Level 2": { position: new THREE.Vector3(-60, 35, 60), lookAt: new THREE.Vector3(0, 0, 0) },
  "Level 3": { position: new THREE.Vector3(-70, 40, 70), lookAt: new THREE.Vector3(0, 0, 0) },
  "Level 4": { position: new THREE.Vector3(-80, 45, 80), lookAt: new THREE.Vector3(0, 0, 0) }
};


// Camera Animation
function animateCameraToLevel(clickedMesh) {
  const levelGroup = levelGroups[clickedMesh.name];
  if (!levelGroup || !levelGroup.curve) {
    console.error("Group or curve not found for", clickedMesh.name);
    return;
  }

  // Find the spline 

  const spline = levelGroup.curve;

  const looptime = 20 * 1000; // Duration of the animation
  let t = 0;

  function animate() {
    t += (1 / looptime) * clock.getDelta();
    if (t > 1) {
      t = 0;
      renderer.render(scene, camera); // Switch back to main camera after completion
      return; // Stop the animation loop
    }

    const position = spline.getPointAt(t);
    const tangent = spline.getTangentAt(t).normalize();
    const lookAtPosition = position.clone().add(tangent);

    splineCamera.position.copy(position);
    splineCamera.lookAt(lookAtPosition);

    renderer.render(scene, splineCamera); // Render with splineCamera
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

  const allLevelMeshes = []; // This should be an array of all clickable meshes
  for (const groupName in levelGroups) {
    allLevelMeshes.push(...levelGroups[groupName].children);
  }

  const intersects = raycaster.intersectObjects(allLevelMeshes);
  if (intersects.length > 0) {
    const clickedLevel = intersects[0].object.name;
    const startPoint = levelStartPoints[clickedLevel];
    if (startPoint) {
      camera.position.copy(startPoint.position);
      camera.lookAt(startPoint.lookAt);
    }
  }
}

//Player Character
let player1;

const playerLoader = objLoader.load("/models/player.glb", (gltf) => {
  gltf.scene.scale.set(0.02, 0.02, 0.02);
  gltf.scene.position.set(0, 10, 0);
  scene.add(gltf.scene);
  player1 = gltf.scene; // Store the player object for reference
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
  if (!player1) return; // Check if the player is loaded

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
    updatePlayerPosition();
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