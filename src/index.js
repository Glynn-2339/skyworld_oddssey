import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import islandFloor from "./components/islandFloor.js";
import createTextMesh from "./components/text.js";

// bacground Music
const backgroundMusic = new Audio('/sounds/background.mp3');
backgroundMusic.volume = 0.5;
backgroundMusic.loop = true;


function playMusic(event) {
  if (event.key === "p" || event.key === "P") {
    backgroundMusic.play();
  }
}

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

// Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
scene.add(ambientLight);

const spotlight = new THREE.SpotLight(0xfff000, 5000, 33, Math.PI * 0.28 );
spotlight.position.set(-5, 40, 5);
spotlight.castShadow = true;

scene.add(spotlight);



// Helpers
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);




// Clouds
const objLoader = new GLTFLoader(loading);



for (let i = 0; i < 84; i++) {
  objLoader.load("/models/cloud/scene.gltf", (gltf) => {
    // Set a random scale for each cloud
    const scale = Math.random() * 0.01 + 0.035; // Adjust the range as needed
    gltf.scene.scale.set(scale, scale, scale);

    // Randomize the position of each cloud
    gltf.scene.position.set(
      (Math.random() - 0.5) * 400, // X position
      (Math.random() -0.5)*100,   // Y position, starting from 10
      (Math.random() - 0.5) * 300 // Z position
    );

    // Randomize the rotation of each cloud
    gltf.scene.rotation.set(0, Math.random() * Math.PI, 0.1);


    scene.add(gltf.scene);
  });
}



// Island
objLoader.load("/models/mountain_landscape/scene.gltf", (gltf) => {
  gltf.scene.scale.set(1, 1, 1);
  gltf.scene.position.set(25, 0, 25);
  gltf.scene.rotation.set(0, -Math.PI/2, 0);
  scene.add(gltf.scene);
});

objLoader.load("/models/mountain_landscape/scene.gltf", (gltf) => {
  gltf.scene.scale.set(1, 1, 1);
  gltf.scene.position.set(-25, 0, 25);
  gltf.scene.rotation.set(0, Math.PI, 0);
  scene.add(gltf.scene);
});

objLoader.load("/models/mountain_landscape/scene.gltf", (gltf) => {
  gltf.scene.scale.set(1, 1, 1);
  gltf.scene.position.set(25, 0, -25);
  gltf.scene.rotation.set(0, 0, 0);
  scene.add(gltf.scene);
});

objLoader.load("/models/mountain_landscape/scene.gltf", (gltf) => {
  gltf.scene.scale.set(1, 1, 1);
  gltf.scene.position.set(-25, 0, -25);
  gltf.scene.rotation.set(0, Math.PI/2, 0);
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
    1 + Math.random() * 10,   // Y position, starting from 10
    (Math.random() - 0.5) * 100 // Z position
  );

  ringMesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
  const scale = Math.random() * Math.random();
  ringMesh.scale.set(scale * 3, scale * 3, scale * 2);

  ringMesh.castShadow = true;
  scene.add(ringMesh);
}
//FONTS
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

createTextMesh(
  "Level 4",
  "/fonts/8-bit Operator+ 8_Regular.json",
  "/textures/matcaps/7.png",
  3.5,
  0.2,
  [-25, 12, -25]
).then((mesh) => scene.add(mesh));

createTextMesh(
  "Level 3",
  "/fonts/8-bit Operator+ 8_Regular.json",
  "/textures/matcaps/7.png",
  3.5,
  0.2,
  [25, 12, -25]
).then((mesh) => scene.add(mesh));

createTextMesh(
  "Level 2",
  "/fonts/8-bit Operator+ 8_Regular.json",
  "/textures/matcaps/7.png",
  3.5,
  0.2,
  [ 25, 12, 25]
).then((mesh) => scene.add(mesh));

createTextMesh(
  "Level 1",
  "/fonts/8-bit Operator+ 8_Regular.json",
  "/textures/matcaps/7.png",
  3.5,
  0.2,
  [-25, 12, 25]
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

window.addEventListener("keydown", playMusic);

class CustomSinCurve extends THREE.Curve {

	constructor( scale = 1 ) {
		super();
		this.scale = scale;
	}

	getPoint( t, optionalTarget = new THREE.Vector3() ) {

		const tx = t * 3 - 1.5;
		const ty = Math.sin( 2 * Math.PI * t );
		const tz = 0;

		return optionalTarget.set( tx, ty, tz ).multiplyScalar( this.scale );
	}
}

const path = new CustomSinCurve( 20 );
const geometry = new THREE.TubeGeometry( path, 44, 5, 8, false );
const material = new THREE.MeshBasicMaterial( { color: color1 } );
const mesh = new THREE.Mesh( geometry, material );
mesh.position.set(-25, 5, -60);
scene.add( mesh );