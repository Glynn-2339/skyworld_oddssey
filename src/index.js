import "./style.css";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';



// Textures
const loading = new THREE.LoadingManager();
loading.onStart = () => {
  console.log("loading started");
};
loading.onLoad = () => {
  console.log("loading finished");
};

const textureLoader = new THREE.TextureLoader(loading);
const colorTexture = textureLoader.load("/textures/minecraft.png");
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
  0.1,
  100
);
camera.position.set(0, 3, 5);
scene.add(camera);




// Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xfff000, 2, 10, Math.PI * 0.15, 0.1, 1);
spotLight.position.set(0, 3.5, 5.5);
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.far = 10;
spotLight.shadow.camera.fov = 30;
spotLight.shadow.camera.near = 5;
spotLight.shadow.camera.far = 10;
spotLight.shadow.camera.left = -1;
spotLight.shadow.camera.right = 1;
spotLight.shadow.camera.top = 6;
spotLight.shadow.camera.bottom = -6;

scene.add(spotLight);

// Helpers
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);


const spotLightHelper = new THREE.CameraHelper(spotLight.shadow.camera);
spotLightHelper.visible = true;
scene.add(spotLightHelper);

window.requestAnimationFrame(() => {
  spotLightHelper.update;
});

// Plane
const planeGeometry = new THREE.PlaneGeometry(100, 100);
const planeMaterial = new THREE.MeshStandardMaterial({
  color: 0x777777,
  map: colorTexture,
});
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
planeMesh.rotation.x = -Math.PI / 2;
planeMesh.position.y = -1;
planeMesh.receiveShadow = true;
scene.add(planeMesh);

// Rings
const ringGeometry = new THREE.TorusGeometry(0.25, 0.2, 15, 45);
const ringMaterial = new THREE.MeshStandardMaterial({ map: colorTexture, metalness: 0.5, roughness: 0.5});
for (let i = 0; i < 21; i++) {
  const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);

  ringMesh.position.set(
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 1
  );

    ringMesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    const scale = Math.random() * Math.random() ;
    ringMesh.scale.set(scale*2, scale*2, scale*2);

  ringMesh.castShadow = true;
  scene.add(ringMesh);
}
//FONTS
const fontLoader = new FontLoader();
const matcapText = textureLoader.load("/textures/matcaps/8.png");

fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  const textGeometry = new TextGeometry("SkyWorld Oddssey", {
    font: font,
    size: 0.8,
    height: 0.3,
    curveSegments: 6,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 2,
  });
  textGeometry.center();

  const elementMaterial = new THREE.MeshStandardMaterial({
    map: colorTexture,
    metalness: 0.5,
  });

  const text = new THREE.Mesh(textGeometry, elementMaterial);

  text.castShadow = true;
  text.receiveShadow = true;

  scene.add(text);
});
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
            Math.sin(Date.now() * 0.001) * 0.2 + 0.8,
            Math.sin(Date.now() * 0.001) * 0.2 + 0.8,
            Math.sin(Date.now() * 0.001) * 0.2 + 0.8
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

// Resize Event
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});
