import * as THREE from 'three';
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js';
import {
    GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader.js';

import JSConfetti from 'js-confetti'


const configurator = document.getElementById('configurator');
const renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setSize(configurator.clientWidth, configurator.clientHeight);
renderer.setClearColor(0xffffff);


configurator.appendChild(renderer.domElement);

const FOV = 45;
const ASPECT = configurator.clientWidth / configurator.clientHeight;
const NEAR = 0.1;
const FAR = 1000;
const camera = new THREE.PerspectiveCamera(FOV, ASPECT, NEAR, FAR);
cameraPosition();

function cameraPosition() {
    if (window.innerWidth < 1368 && window.innerWidth > 1021) {
        camera.position.z = 5;
    } else if (window.innerWidth <= 1020 && window.innerWidth > 931) {
        camera.position.z = 6;
    } else if (window.innerWidth < 930) {
        camera.position.z = 3.5;
    } else {
        camera.position.z = 4;
    }
}


const scene = new THREE.Scene();

var Mesh = null;
var loaded = false;

// Load the model
const loader = new GLTFLoader();
loader.load('images/donut2.glb', function (gltf) {
    Mesh = gltf.scene;
    Mesh.rotation.x = Math.PI / 4;
    scene.add(Mesh);
    for (var i = 0; i < Mesh.children.length; i++) {
        if (Mesh.children[i].name.startsWith("Doughnut") || Mesh.children[i].name.startsWith("Glaze")) {
            if (Mesh.children[i].name.startsWith("Doughnut")) {
                Mesh.children[i].material.color.setHex(0xEEC783);
            }
            if (Mesh.children[i].name.startsWith("Glaze")) {
                Mesh.children[i].material.color.setHex(0xff5cce);
            }
            Mesh.children[i].visible = true;
        } else {
            Mesh.children[i].visible = false;
        }
    }
});


window.addEventListener('resize', function () {
    renderer.setSize(configurator.clientWidth, configurator.clientHeight);
    camera.aspect = configurator.clientWidth / configurator.clientHeight;
    camera.updateProjectionMatrix();
    cameraPosition();
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
    if (animationDone) {
        Mesh.rotation.y += 0.2;
    }
    console.log(DonutDough + " " + DonutGlaze + " " + DonutTopping + " " + DonutBrandTag + " " + CompanyName + " " + DateNow + " " + DonutRemarks + " " + DonutSnapshot + " " + DonutBrandTagType);
}

var DonutDough = "base";
var DonutGlaze;
var DonutTopping;
var DonutBrandTag;
var DonutBrandTagType = "Naam";
var CompanyName;
var CompanyContact;
var now = new Date();
var DateNow = now.getDate() + '/' + (now.getMonth()+1) + '/' + now.getFullYear().toString().substr(-2);
var DonutRemarks;
var DonutSnapshot;
var SnapshotDone = false;
var DonutQuantity;
var DonutID;
var message;
var animationDone = false;
var step = 0;


const glazes = document.querySelectorAll('.glaze');
glazes.forEach(button => {
    button.addEventListener('click', () => {
        var glaze = button.dataset.glaze;
        if (glaze == "NULL") {
            for (var i = 0; i < Mesh.children.length; i++) {
                if (Mesh.children[i].name.startsWith("Glaze")) {
                    Mesh.children[i].visible = false;
                }
            }
        } else {
            for (var i = 0; i < Mesh.children.length; i++) {
                if (Mesh.children[i].name.startsWith("Glaze")) {
                    Mesh.children[i].material.color.setHex(glaze);
                }
            }
        }
        DonutGlaze = button.dataset.glaze;
        message = button.dataset.name;
        popup(3);
        unlockButton();
    });
});

const tags = document.querySelectorAll('.tag');
tags.forEach(button => {
    button.addEventListener('click', () => {
        DonutBrandTagType = button.dataset.tag;
        hideBrandTag();
        uploadBrandTag(DonutBrandTag);
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
            if (Mesh.children[i].name.startsWith(topping)) {
                Mesh.children[i].visible = true;
                if (toppingName) {
                    Mesh.children[i].material.color.setHex(toppingName);
                }
            }
        }
        DonutTopping = button.dataset.topping;
        message = button.dataset.name;
        popup(3);
        unlockButton();
    });
});

document.querySelector(".company__name").onchange = function () {
    CompanyName = document.querySelector(".company__name").value;
    unlockButtonForm();
};
document.querySelector(".donut__remarks").onchange = function () {
    DonutRemarks = document.querySelector(".donut__remarks").value;
};
document.querySelector(".company__contact").onchange = function () {
    CompanyContact = document.querySelector(".company__contact").value;
    unlockButtonForm();
};
document.querySelector(".donut__quantity").onchange = function () {
    DonutQuantity = document.querySelector(".donut__quantity").value;
    unlockButtonForm();
};


function unlockButtonForm() {
    if (CompanyName && CompanyContact && DonutQuantity) {
        if (validEmail(CompanyContact)) {
            unlockButton();
        } else {
            message = "Vul een geldig e-mailadres in";
            popup(3);
        }
    }
}

function validEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

function hideToppings() {
    for (var i = 0; i < Mesh.children.length; i++) {
        if (!Mesh.children[i].name.startsWith("Doughnut") && !Mesh.children[i].name.startsWith("Glaze")) {
            Mesh.children[i].visible = false;
        }
    }
}

document.querySelector('.topping__clear').addEventListener('click', () => {
    hideToppings();
    DonutTopping = "none";
    unlockButton();
});


function unlockButton() {
    var button = document.getElementById("volgende__stap");
    button.classList.remove("configurator__btn--inactive");
    button.classList.add("configurator__btn");
    button.disabled = false;
}

function unlockButton2() {
    var button = document.getElementById("vorige__stap");
    button.classList.remove("configurator__btn--inactive");
    button.classList.add("configurator__btn");
    button.disabled = false;
}

function lockButton2() {
    var button = document.getElementById("vorige__stap");
    button.classList.remove("configurator__btn");
    button.classList.add("configurator__btn--inactive");
    button.disabled = true;
}

function popup(color) {
    document.querySelector('.message__div').style.zIndex = "2";
    if (color == 1) {
        document.querySelector('.message__div').style.backgroundColor = "#4CAF50";
    } else if (color == 2) {
        document.querySelector('.message__div').style.backgroundColor = "#f44336";
    } else {
        document.querySelector('.message__div').style.backgroundColor = "#2196F3";
    }
    document.querySelector('.message__div').style.opacity = "1";
    document.querySelector('.message__div').innerHTML = message;
    setTimeout(function () {
        document.querySelector('.message__div').style.opacity = "0";
        document.querySelector('.message__div').style.zIndex = "-1";
    }, 3000);
}

function popup2(color) {
    document.querySelector('.message__div').style.zIndex = "2";
    if (color == 1) {
        document.querySelector('.message__div').style.backgroundColor = "#4CAF50";
    } else if (color == 2) {
        document.querySelector('.message__div').style.backgroundColor = "#f44336";
    } else {
        document.querySelector('.message__div').style.backgroundColor = "#2196F3";
    }
    document.querySelector('.message__div').style.opacity = "1";
    setTimeout(function () {
        document.querySelector('.message__div').style.opacity = "0";
        document.querySelector('.message__div').style.zIndex = "-1";
    }, 5000);
    document.querySelector('.message__div').innerHTML = message;
}

function lockButton() {
    var button = document.getElementById("volgende__stap");
    button.classList.remove("configurator__btn");
    button.classList.add("configurator__btn--inactive");
    button.disabled = true;
}

document.querySelector('#volgende__stap').addEventListener('click', () => {
    if (step == 0) {
        if (DonutTopping) {
            unlockButton();
        } else {
            lockButton();
        }
        document.querySelector('.donut__topping').style.display = "grid";
        document.querySelector('.donut__glaze').style.display = "none";
        document.querySelector('.configurator__steps li:nth-child(3)').style.fontWeight = "bold";
        document.querySelector('.configurator__steps li:nth-child(4)').style.fontWeight = "bold";
        document.querySelector('.configurator__steps li:nth-child(3)').style.color = "#e72c70";
        document.querySelector('.configurator__steps li:nth-child(4)').style.color = "#e72c70";
        document.querySelector('.options__title').innerHTML = "Kies een topping";
        step = 1;
        unlockButton2();
        return;
    }
    if (step == 1) {
        document.querySelector('.donut__brandtag').style.display = "block";
        document.querySelector('.donut__topping').style.display = "none";
        document.querySelector('.configurator__steps li:nth-child(5)').style.fontWeight = "bold";
        document.querySelector('.configurator__steps li:nth-child(6)').style.fontWeight = "bold";
        document.querySelector('.configurator__steps li:nth-child(5)').style.color = "#e72c70";
        document.querySelector('.configurator__steps li:nth-child(6)').style.color = "#e72c70";
        document.querySelector('.options__title').innerHTML = "Upload een brandtag";
        step = 2;
        return;
    }
    if (step == 2) {
        document.querySelector('.donut__brandtag').style.display = "none";
        document.querySelector('.donut__bake').style.display = "block";
        document.querySelector('.configurator__steps li:nth-child(7)').style.fontWeight = "bold";
        document.querySelector('.configurator__steps li:nth-child(7)').style.color = "#e72c70";
        document.querySelector('#volgende__stap').innerHTML = "Bakken";
        document.querySelector('.options__title').innerHTML = "Bak je donut!";
        lockButton();
        step = 3;
        return;
    }
    if (step == 3) {
        message = "Je donut wordt gebakken! Even geduld aub...";
        popup2(3);
        document.querySelector('#container').style.justifyContent = "center";
        document.querySelector('#configurator__options').innerHTML = "";
        //if window width is smaller than 600px
        if (window.innerWidth < 930) {
            document.querySelector('#container').style.marginTop = "25vh";
            document.querySelector('#container').style.height = "auto";
            document.querySelector('#configurator__options').style.height = "0";
        } else {
            document.querySelector('#configurator__options').style.width = "0";
        }
        renderer.setSize(configurator.clientWidth, configurator.clientHeight);
        camera.aspect = configurator.clientWidth / configurator.clientHeight;
        camera.updateProjectionMatrix();
        snapshot();
    }
});

document.querySelector('#brand__foto').addEventListener('change', () => {
    var file = document.querySelector('#brand__foto').files[0];
    var reader = new FileReader();
    if (file.type != "image/jpeg" && file.type != "image/png") {
        message = "Bestand moet een jpg of png zijn.";
        popup(2);
    } else if (file.size > 10000000) {
        message = "Bestand mag niet groter dan 10mb zijn!";
        popup(2);
    } else {
        lockBrandTagButton();
        document.querySelector('#brand__foto__upload').disabled = false;
        reader.onloadend = function () {
            document.querySelector('.image__preview').style.backgroundImage = "url(" + reader.result + ")";
        }
        document.querySelector('.image__preview').style.border = "3.5px dashed #82d1e4";
        document.querySelector('.image__preview').innerHTML = "";
        reader.readAsDataURL(file);
        message = "Foto is geupload!";
        popup(1);
    }
});

document.querySelector('#vorige__stap').addEventListener('click', () => {
    if (step == 1) {
        step1();
        lockButton2();
        unlockButton();
        step = 0;
    }
    if (step == 2) {
        if (DonutTopping) {
            unlockButton();
        } else {
            lockButton();
        }
        step2();
        step = 1;
    }
    if (step == 3) {
        step3();
        step = 2;
        unlockButton();
    }
});

function step1() {
    hideAll();
    document.querySelector('.donut__glaze').style.display = "grid";
    document.querySelector('.options__title').innerHTML = "Kies een glazuur";
    resetBreadCrumbs();
    document.querySelector('#volgende__stap').innerHTML = "Volgende";
}

function step2() {
    hideAll();
    document.querySelector('.donut__brandtag').style.display = "none";
    document.querySelector('.donut__topping').style.display = "grid";
    document.querySelector('.options__title').innerHTML = "Kies een topping";
    resetBreadCrumbs();
    setBreadCrumb(3);
    setBreadCrumb(4);
    document.querySelector('#volgende__stap').innerHTML = "Volgende";
}
function step3() {
    hideAll();
    document.querySelector('.donut__brandtag').style.display = "block";
    document.querySelector('.options__title').innerHTML = "Upload een brandtag";
    resetBreadCrumbs();
    setBreadCrumb(3);
    setBreadCrumb(4);
    setBreadCrumb(5);
    setBreadCrumb(6);
    document.querySelector('#volgende__stap').innerHTML = "Volgende";
}
function step4() {
    hideAll();
    document.querySelector('.donut__bake').style.display = "block";
    document.querySelector('.options__title').innerHTML = "Bak je donut!";
    document.querySelector('#volgende__stap').innerHTML = "Bakken";
    resetBreadCrumbs();
    setBreadCrumb(3);
    setBreadCrumb(4);
    setBreadCrumb(5);
    setBreadCrumb(6);
    setBreadCrumb(7);
}

function resetBreadCrumbs() {
    document.querySelector('.configurator__steps li:nth-child(3)').style.fontWeight = "normal";
    document.querySelector('.configurator__steps li:nth-child(4)').style.fontWeight = "normal";
    document.querySelector('.configurator__steps li:nth-child(5)').style.fontWeight = "normal";
    document.querySelector('.configurator__steps li:nth-child(6)').style.fontWeight = "normal";
    document.querySelector('.configurator__steps li:nth-child(7)').style.fontWeight = "normal";
    document.querySelector('.configurator__steps li:nth-child(3)').style.color = "#000";
    document.querySelector('.configurator__steps li:nth-child(4)').style.color = "#000";
    document.querySelector('.configurator__steps li:nth-child(5)').style.color = "#000";
    document.querySelector('.configurator__steps li:nth-child(6)').style.color = "#000";
    document.querySelector('.configurator__steps li:nth-child(7)').style.color = "#000";
}

function setBreadCrumb(number) {
    document.querySelector('.configurator__steps li:nth-child(' + number + ')').style.fontWeight = "bold";
    document.querySelector('.configurator__steps li:nth-child(' + number + ')').style.color = "#e72c70";
}


//event listeners for ul li 2nd child
document.querySelector('.configurator__steps li:nth-child(1)').addEventListener('click', () => {
    step1();
    step = 0;
    if (DonutGlaze) {
        unlockButton();
    }
    lockButton2();
});
document.querySelector('.configurator__steps li:nth-child(3)').addEventListener('click', () => {
    if (DonutGlaze) {
        unlockButton2();
        step2();
        step = 1;
        if (DonutTopping) {
            unlockButton();
        }
        else {
            lockButton();
        }
    }
});
document.querySelector('.configurator__steps li:nth-child(5)').addEventListener('click', () => {
    if (DonutTopping && DonutGlaze) {
        step3();
        step = 2;
        unlockButton2();
    }
});
document.querySelector('.configurator__steps li:nth-child(7)').addEventListener('click', () => {
    if (DonutTopping && DonutGlaze) {
        step4();
        step = 3;
        unlockButton2();
    }
});


function hideAll() {
    document.querySelector('.donut__glaze').style.display = "none";
    document.querySelector('.donut__topping').style.display = "none";
    document.querySelector('.donut__brandtag').style.display = "none";
    document.querySelector('.donut__bake').style.display = "none";
}

function hideBrandTag() {
    for (var i = 0; i < Mesh.children.length; i++) {
        if (Mesh.children[i].name == "Naam") {
            Mesh.children[i].visible = false;
        } else if (Mesh.children[i].name == "Naam2") {
            Mesh.children[i].visible = false;
        } else if (Mesh.children[i].name == "Naam3") {
            Mesh.children[i].visible = false;
        }
    }
}

function uploadBrandTag(image) {
    console.log(DonutBrandTagType + " is visible" + image);
    for (var i = 0; i < Mesh.children.length; i++) {
        if (Mesh.children[i].name == DonutBrandTagType) {
            Mesh.children[i].visible = true;
            var texture = new THREE.TextureLoader().load(image);
            Mesh.children[i].material.map = texture;
            Mesh.children[i].material.map.wrapS = THREE.RepeatWrapping;
            Mesh.children[i].material.map.wrapT = THREE.RepeatWrapping;
            Mesh.children[i].material.transparent = true;
            Mesh.children[i].material.map.offset.set(0, 0);
            Mesh.children[i].material.map.center.set(0, 0);
            Mesh.children[i].material.map.repeat.set(1, 1);
            Mesh.children[i].material.map.rotation = 0;
            Mesh.children[i].material.map.flipY = false;
            Mesh.children[i].material.map.needsUpdate = true;
            Mesh.children[i].rotation.y = Math.PI / 1.3;
        }
    }
    unlockBrandTagButton();
    unlockButton();
}

function unlockBrandTagButton() {
    document.querySelector('.image__preview').style.display = "none";
    document.querySelector('.brandtag__options').style.display = "flex";
}

function lockBrandTagButton() {
    document.querySelector('.image__preview').style.display = "block";
    document.querySelector('.brandtag__options').style.display = "none";
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
        message = "Upload een jpg of png bestand!";
        popup(2);
    }
};
window.ajaxSuccess = function () {
    let response = JSON.parse(this.responseText);
    DonutBrandTag = response.secure_url;
    uploadBrandTag(DonutBrandTag);
    unlockButton();
    message = "Brandtag is geupload!";
    popup(3);
};



const api_url = "https://adorable-red-sundress.cyclic.app/donuts";

//create function with prevent default
function postDonut() {
    var dataURL = renderer.domElement.toDataURL();
    fetch(api_url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                dough: DonutDough,
                glaze: DonutGlaze,
                topping: DonutTopping,
                company: CompanyName,
                brandtag: DonutBrandTag,
                brandtagtype: DonutBrandTagType,
                date: DateNow,
                remarks: DonutRemarks,
                snapshot: DonutSnapshot,
                status: "Nieuw",
                quantity: DonutQuantity,
                email: CompanyContact,
            }),
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            DonutID = data._id;
            console.log(DonutID);
            if (DonutID) {
            donutBaked();
            message = "Donut is gebakken!";
            popup(1);
            document.querySelector('.donut__finished').style.display = "flex";
            const jsConfetti = new JSConfetti()
            jsConfetti.addConfetti({
                confettiColors: [
                    '#E72C70', '#E72C70', '#82D1E4', '#F7F249',
                ],
            })} 
            else {
                message = "Er is iets misgegaan!";
                popup(2);
            }
        });
}




//window on load
window.addEventListener("load", function () {
    setInterval(function () {
        document.querySelector('.loading__screen').classList.add("loading__screen__animation");
        setTimeout(function () {
            document.querySelector('.loading__screen').style.display = "none";
        }, 450);
        document.querySelector('body').style.overflow = "auto";
    }, 2000);
    loaded = true;
    
});


function donutBaked() {
    animationDone = true;
    setTimeout(function () {
        animationDone = false;
    }, 600);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 4;
    controls.maxDistance = 5;
}



function snapshot() {
    var img = new Image();
    renderer.setClearColor(0xffffff, 0);
    renderer.render(scene, camera);
    img.src = renderer.domElement.toDataURL();
    let xhr = new XMLHttpRequest();
    xhr.onload = ajaxSuccessScreen;
    xhr.open("post", "https://api.cloudinary.com/v1_1/dck3erw0v/image/upload");
    let dataPreset = new FormData();
    dataPreset.append("file", img.src);
    dataPreset.append("upload_preset", "donuts");
    xhr.send(dataPreset);
};


function ajaxSuccessScreen() {
    let response = JSON.parse(this.responseText);
    DonutSnapshot = response.secure_url;
    postDonut();
}


document.querySelector('.share__donut').addEventListener('click', () => {
    var link = "https://donuttello.netlify.app/donut.html?id=" + DonutID;
    navigator.clipboard.writeText(link);
    message = "Link is gekopieerd naar je clipboard!";
    popup(3);
});

document.querySelector('.screenshot__donut').addEventListener('click', () => {
    var img = new Image();
    renderer.render(scene, camera);
    img.src = renderer.domElement.toDataURL();
    var link = document.createElement('a');
    link.download = 'donut.png';
    link.href = img.src;
    link.click();
    message = "Donut is screenshot is opgeslagen!";
    popup(3);
});