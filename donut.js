import * as THREE from 'three';
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js';
import {
    GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader.js';

var url = window.location.href;
var id = url.substring(url.lastIndexOf('=') + 1);

var p = document.createElement("p");


let DonutGlaze;
let DonutTopping;
let DonutBrandtag;
let DonutDate;

//fetch api and set donut data with async and return data
async function getDonutData() {
    const response = await fetch('https://adorable-red-sundress.cyclic.app/donuts/' + id);
    const data = await response.json();
    return data;
}

var data = getDonutData();

data.then(function (result) {
    createDonut(result);
    console.log(result);
});

const showcase = document.getElementById('showcase');
const renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setSize(showcase.clientWidth, showcase.clientHeight);
renderer.setClearColor(0xFFFFFF, 1);

showcase.appendChild(renderer.domElement);

const FOV = 45;
const ASPECT = showcase.clientWidth / showcase.clientHeight;
const NEAR = 0.1;
const FAR = 1000;
const camera = new THREE.PerspectiveCamera(FOV, ASPECT, NEAR, FAR);
camera.position.z = 4;

const scene = new THREE.Scene();
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 4;
controls.maxDistance = 5;


var Mesh;

function createDonut(donut) {
    const loader = new GLTFLoader();
    loader.load('images/donut2.glb', function (gltf) {
        Mesh = gltf.scene;
        Mesh.rotation.x = Math.PI / 4;
        scene.add(Mesh);
        console.log(Mesh);
        var fullTopping = donut.topping;
        var topping = fullTopping.substring(0, fullTopping.indexOf("_"));
        var toppingHex = fullTopping.substring(fullTopping.indexOf("_") + 1);
        for (var i = 0; i < Mesh.children.length; i++) {
            if (Mesh.children[i].name != "Glaze" && Mesh.children[i].name != "Doughnut" && Mesh.children[i].name != topping && Mesh.children[i].name != "Naam") {
                Mesh.children[i].visible = false;
            } else if (Mesh.children[i].name == "Naam") {
                hideBrandTag();
                uploadBrandTag(donut.brandtag);
            }
            else if (Mesh.children[i].name == topping) {
                Mesh.children[i].material.color.setHex(toppingHex);
            }
            else if (Mesh.children[i].name == "Glaze") {
                var glaze = donut.glaze;
                Mesh.children[i].material.color.setHex(glaze);
            }
        }
        animate();
    });
}

console.log(DonutGlaze + " " + DonutTopping + " " + DonutBrandtag + " " + DonutDate);

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    Mesh.rotation.y += 0.003;
    renderer.render(scene, camera);
}

window.addEventListener('resize', function () {
    renderer.setSize(showcase.clientWidth, showcase.clientHeight);
    camera.aspect = showcase.clientWidth / showcase.clientHeight;
    camera.updateProjectionMatrix();
});

const pointLight = new THREE.PointLight(0xFFFFFF, 0.5);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.6);
scene.add(ambientLight);


function uploadBrandTag(image) {
    for (var i = 0; i < Mesh.children.length; i++) {
        if (Mesh.children[i].name == "Naam") {
            Mesh.children[i].visible = true;
            var texture = new THREE.TextureLoader().load(image);
            Mesh.children[i].material.map = texture;
            Mesh.children[i].material.map.wrapS = THREE.RepeatWrapping;
            Mesh.children[i].material.map.wrapT = THREE.RepeatWrapping;
            Mesh.children[i].material.map.offset.set(0, 0);
            Mesh.children[i].material.map.center.set(0, 0);
            Mesh.children[i].material.map.repeat.set(1, 1);
            Mesh.children[i].material.map.rotation = 0;
            Mesh.children[i].material.map.flipY = false;
            Mesh.children[i].material.map.needsUpdate = true;
            Mesh.children[i].rotation.y = Math.PI / 1.3;
        }
    }
}

function hideBrandTag() {
    for (var i = 0; i < Mesh.children.length; i++) {
        if (Mesh.children[i].name == "Naam") {
            Mesh.children[i].visible = false;
        }
        else if (Mesh.children[i].name == "Naam2") {
            Mesh.children[i].visible = false;
        }
        else if (Mesh.children[i].name == "Naam3") {
            Mesh.children[i].visible = false;
        }
    }
}

window.addEventListener("load", function () {
    setInterval(function () {
        document.querySelector('body').style.overflow = "auto";
        document.querySelector('.loading__screen').classList.add("loading__screen__animation");
        setTimeout(function () {
            document.querySelector('.loading__screen').style.display = "none";
        }, 200);
    }, 2000);
    loaded = true;
});
