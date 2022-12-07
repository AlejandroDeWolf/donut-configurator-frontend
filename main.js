import * as THREE from 'three';
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js';
import {
    GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader.js';


const configurator = document.getElementById('configurator');
const renderer = new THREE.WebGLRenderer({
    perserveDrawingBuffer: true,
});
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

// Load the model
const loader = new GLTFLoader();
loader.load('images/donut2.glb', function (gltf) {
    Mesh = gltf.scene;
    Mesh.rotation.x = Math.PI / 4;
    scene.add(Mesh);
    for (var i = 0; i < Mesh.children.length; i++) {
        if (Mesh.children[i].name.startsWith("Doughnut") || Mesh.children[i].name.startsWith("Glaze")) {
            if (Mesh.children[i].name.startsWith("Doughnut")) {
                Mesh.children[i].material.color.setHex(0xf7e4c4);
            }
            Mesh.children[i].visible = true;
        } else {
            Mesh.children[i].visible = false;
        }
    }
    console.log(Mesh);
});


console.log(Mesh);


window.addEventListener('resize', function () {
    renderer.setSize(configurator.clientWidth, configurator.clientHeight);
    camera.aspect = configurator.clientWidth / configurator.clientHeight;
    camera.updateProjectionMatrix();
});

const pointLight = new THREE.PointLight(0xFFFFFF, 0.5);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.6);
scene.add(ambientLight);


requestAnimationFrame(update);

function update() {
    requestAnimationFrame(update);
    Mesh.rotation.y += 0.003;
    renderer.render(scene, camera);
    console.log(DonutDough + " " + DonutGlaze + " " + DonutTopping+ " " + DonutBrandTag);
}

var DonutDough = "base";
var DonutGlaze;
var DonutTopping;
var DonutBrandTag;

// Set glaze color
const glazes = document.querySelectorAll('.glaze');
glazes.forEach(button => {
    button.addEventListener('click', () => {
        var glaze = button.dataset.glaze;
        for (var i = 0; i < Mesh.children.length; i++) {
            if (Mesh.children[i].name.startsWith("Glaze")) {
                Mesh.children[i].material.color.setHex(glaze);
            }
        }
        DonutGlaze = button.dataset.glaze;
        unlockButton();
    });
});

// Set topping color
const toppings = document.querySelectorAll('.topping');
toppings.forEach(button => {
    button.addEventListener('click', () => {
        hideToppings();
        for (var i = 0; i < Mesh.children.length; i++) {
            var fullTopping = button.dataset.topping;
            var topping = fullTopping.substring(0, fullTopping.indexOf("_"));
            var toppingName = fullTopping.substring(fullTopping.indexOf("_") + 1);
            console.log(topping + " " + toppingName);
            if (Mesh.children[i].name.startsWith(topping)) {
                Mesh.children[i].visible = true;
                if (toppingName) {
                    Mesh.children[i].material.color.setHex(toppingName);
                }
            }
        }
        DonutTopping = button.dataset.topping;
        unlockButton();
    });
});

function hideToppings() {
    for (var i = 0; i < Mesh.children.length; i++) {
        if (!Mesh.children[i].name.startsWith("Doughnut") && !Mesh.children[i].name.startsWith("Glaze")) {
            Mesh.children[i].visible = false;
        }
    }
}


document.querySelector('.topping__clear').addEventListener('click', () => {
    hideToppings();
    DonutTopping = null;
    lockButton();
});


function unlockButton() {
    var button = document.getElementById("volgende__stap");
    button.classList.remove("configurator__btn--inactive");
    button.classList.add("configurator__btn");
    button.disabled = false;
}
function lockButton() {
    var button = document.getElementById("volgende__stap");
    button.classList.remove("configurator__btn");
    button.classList.add("configurator__btn--inactive");
    button.disabled = true;
}

//on click of button id volgendestap run alert
document.querySelector('#volgende__stap').addEventListener('click', () => {
    if(DonutGlaze){
        document.querySelector('.donut__topping').style.display = "grid";
        document.querySelector('.donut__glaze').style.display = "none";
        lockButton();
        document.querySelector('.configurator__steps li:nth-child(3)').style.fontWeight = "bold";
        document.querySelector('.configurator__steps li:nth-child(4)').style.fontWeight = "bold";
        document.querySelector('.configurator__steps li:nth-child(3)').style.color = "#e72c70";
        document.querySelector('.configurator__steps li:nth-child(4)').style.color = "#e72c70";
    }
    if(DonutTopping){
        document.querySelector('.donut__brandtag').style.display = "grid";
        document.querySelector('.donut__topping').style.display = "none";
        lockButton();
        document.querySelector('.configurator__steps li:nth-child(5)').style.fontWeight = "bold";
        document.querySelector('.configurator__steps li:nth-child(6)').style.fontWeight = "bold";
        document.querySelector('.configurator__steps li:nth-child(5)').style.color = "#e72c70";
        document.querySelector('.configurator__steps li:nth-child(6)').style.color = "#e72c70";
    }
    if(DonutBrandTag){
        document.querySelector('.donut__brandtag').style.display = "none";
        document.querySelector('.donut__bake').style.display = "block";
        document.querySelector('.configurator__steps li:nth-child(7)').style.fontWeight = "bold";
        document.querySelector('.configurator__steps li:nth-child(7)').style.color = "#e72c70";
        document.querySelector('#volgende__stap').innerHTML = "Bak Donut!";
    }
});

document.querySelector('#brand__foto').addEventListener('change', () => {
    document.querySelector('#brand__foto__upload').disabled = false;
    var file = document.querySelector('#brand__foto').files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
        document.querySelector('.image__preview').style.backgroundImage = "url(" + reader.result + ")";
    }
    console.log(reader.readAsDataURL(file));
    document.querySelector('.image__preview').style.border = "5px dashed #82d1e4";
    document.querySelector('.image__preview').innerHTML = "";
});

// document.querySelector('#vorige__stap').addEventListener('click', () => {
//     if (document.querySelector('.donut__topping').style.display == "block") {
//         document.querySelector('.donut__topping').style.display = "none";
//         document.querySelector('.donut__glaze').style.display = "block";
//     }
//     else if(document.querySelector('.donut__brandtag').style.display == "block"){
//         document.querySelector('.donut__brandtag').style.display = "none";
//         document.querySelector('.donut__').style.display = "block";
//     }
// });




function uploadBrandTag(image){
    for (var i = 0; i < Mesh.children.length; i++) {
        if (Mesh.children[i].name.startsWith("Naam")) {
            Mesh.children[i].visible = true;
            var texture = new THREE.TextureLoader().load(image);
            Mesh.children[i].material.map = texture; 
            Mesh.children[i].material.map.wrapS = THREE.RepeatWrapping;
            Mesh.children[i].material.map.wrapT = THREE.RepeatWrapping;
            Mesh.children[i].material.map.offset.set( 0, 0 );
            Mesh.children[i].material.map.center.set( 0, 0 );
            Mesh.children[i].material.map.repeat.set( 1, 1 );
            Mesh.children[i].material.map.rotation = 0;
            Mesh.children[i].material.map.flipY = false;
            Mesh.children[i].material.map.needsUpdate = true;  
            Mesh.children[i].rotation.y = Math.PI / 1.2;
        }
    }
}



window.AJAXSubmit = function (formElement) {
    if (!formElement.action) {
        console.log("fail");
        return;
    }
    let xhr = new XMLHttpRequest();
    xhr.onload = ajaxSuccess;
    xhr.open("post", "https://api.cloudinary.com/v1_1/dck3erw0v/image/upload");
    let dataPreset = new FormData(formElement);
    dataPreset.append("upload_preset", "donuts");
    if (dataPreset.get("file").type == "image/jpeg" || dataPreset.get("file").type == "image/png") {
        xhr.send(dataPreset);
    } else {
        alert("Please upload a jpg or png file");
    }
};
window.ajaxSuccess = function () {
    let response = JSON.parse(this.responseText);
    DonutBrandTag = response.secure_url;
    uploadBrandTag(DonutBrandTag);
    unlockButton();
};



const api_url = "https://adorable-red-sundress.cyclic.app/donuts";

//eventlistener for id postDonut prevent default
document.getElementById("postDonut").addEventListener("click", function (e) {
    var dataURL = renderer.domElement.toDataURL();
    
    e.preventDefault();
    fetch(api_url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            dough : DonutDough,
            glaze: DonutGlaze,
            topping: DonutTopping,
            company: DonutBrandTag,
        }),
    })
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
    });
});
       
