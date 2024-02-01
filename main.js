import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";

import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import {CSS2DRenderer ,CSS2DObject} from "three/examples/jsm/renderers/CSS2DRenderer"
const scene = new THREE.Scene();

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight/2,
};

const labelRenderer=new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth,window.innerHeight/2);
labelRenderer.domElement.style.position="absolute";
labelRenderer.domElement.style.top='2px';
labelRenderer.domElement.style.pointerEvents='none';
document.body.appendChild(labelRenderer.domElement)
const formgroup=new THREE.Group();
//textInput
  const input=document.createElement('input');
  input.type='text';
  input.id='todocontent';
  input.value='ecrire ici';
  input.style.color='red';
 
  //Addbutton
  const AddButton=document.createElement('input');
  AddButton.type='button';
  AddButton.id='todobutton';
  AddButton.value='ADD';
  AddButton.style.color='red';
  
//container
const container=document.createElement('div');
container.id='container';
container.appendChild(input);
container.appendChild(AddButton);

const divcontainer=new CSS2DObject(container);
divcontainer.position.set(1,0,0);

formgroup.add(divcontainer)
scene.add(formgroup)
const group=new THREE.Group();
function addBook(){
  let model;
const gltfLoader = new GLTFLoader();
gltfLoader.load(
  '/paladins_book/scene.gltf',
  (gltf) => {
    model = gltf.scene;
   const x = (Math.random() - 0.5) * 5;
   const y = (Math.random() - 0.5) * 5;
   const z = (Math.random() - 0.5) * 2;
   model.position.set(x,y,z);
     model.rotation.x = Math.random() * Math.PI;
 model.rotation.y = Math.random() * Math.PI;
   const scale = Math.random();
  model.scale.set(scale, scale, scale);
   group.add(model);
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
  },
  (error) => {
    console.error('An error occurred while loading the GLTF model:', error);
  }
);
}
scene.add(group);
group.position.set(0, 0, 3); 
const fontLoader= new FontLoader();
fontLoader.load("/static/helvetiker_regular.typeface.json",(font)=>{
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; 
  controls.dampingFactor = 0.25;
  controls.screenSpacePanning = false;
  controls.update();
  for (let index = 0; index < 10; index++) {
    addBook();
   
  }

  controls.maxPolarAngle = Math.PI / 2;
  const textGeometry=new TextGeometry("To Do List",
 { font:font,
size:1,
height:0.5,
curveSegments:10,
bevelEnabled:true,
bevelThickness:0.03,
bevelSize:0.01,
bevelOffset:0,
bevelSegments:10
}
  );
  textGeometry.center();
  const textMaterial=new THREE.MeshBasicMaterial({color:0x556B2F,transparent:true,opacity:1});
  const text =new THREE.Mesh(textGeometry,textMaterial);
text.position.set(-1,0,0);
  scene.add(text);
})



const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);

camera.position.z=5

scene.add(camera);

const ambientLight = new THREE.AmbientLight( );
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x00ffff , 1);
scene.add(directionalLight);

const renderer = new THREE.WebGLRenderer({alpha:true });
renderer.setSize(sizes.width, sizes.height);
document.body.appendChild(renderer.domElement);

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
labelRenderer.setSize(window.innerWidth,window.innerHeight)
});

const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  group.children.forEach(element => {
   element.rotation.x = Math.PI * elapsedTime * 0.01;
    element.rotation.z = Math.PI * elapsedTime * 0.1;
  });
    group.rotation.x = Math.PI * elapsedTime * 0.01;
  group.rotation.y = Math.PI * elapsedTime * 0.01;
  group.rotation.z = Math.PI * elapsedTime * 0.05;
 renderer.render(scene, camera);
 labelRenderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();
