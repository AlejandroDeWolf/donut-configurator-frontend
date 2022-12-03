import * as THREE from 'three';
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js';
import {
    GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader.js';


const configurator = document.getElementById('configurator');
const renderer = new THREE.WebGLRenderer();
renderer.setSize(configurator.clientWidth, configurator.clientHeight);
renderer.setClearColor(0xFFFFFF, 1);

configurator.appendChild(renderer.domElement);

const FOV = 45;
const ASPECT = configurator.clientWidth / configurator.clientHeight;
const NEAR = 0.1;
const FAR = 1000;
const camera = new THREE.PerspectiveCamera(FOV, ASPECT, NEAR, FAR);
camera.position.z = 5;

const scene = new THREE.Scene();
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 4;
controls.maxDistance = 5;

var Mesh = null;

const loader = new GLTFLoader();
loader.load('images/donut.glb', function (gltf) {
    Mesh = gltf.scene;
    Mesh.rotation.x = Math.PI / 4;
    scene.add(Mesh);
});


console.log(Mesh);




const pointLight = new THREE.PointLight(0xFFFFFF, 0.5);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.6);
scene.add(ambientLight);

