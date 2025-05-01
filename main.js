import * as THREE from 'three'
import gsap from 'gsap';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

import AtmosphereVertexShader from './shaders/atmosphereVertex.glsl';
import AtmosphereFragmentShader from './shaders/atmosphereFragment.glsl';


console.log(fragmentShader);

const canvasContainer = document.querySelector('#CanvasContainer');
console.log(canvasContainer)

const scene = new THREE.Scene();

// Set the background color
scene.background = new THREE.Color(0x0A071C); // Light sky blue color


const camera = new THREE.PerspectiveCamera(
    75,
    canvasContainer.offsetWidth / canvasContainer.offsetHeight,
    0.1,
    1000
);

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: document.querySelector('canvas')
});



renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
renderer.setPixelRatio(window.devicePixelRatio);


// create a sphere
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(5, 50, 50),
    new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
            globeTexture: {
                value: new THREE.TextureLoader().load('./assets/images/uv-map.jpeg')
            }
        } 
    })
);

console.log(sphere);

// create atmosphere
const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(5, 50, 50),
    new THREE.ShaderMaterial({
        vertexShader: AtmosphereVertexShader,
        fragmentShader: AtmosphereFragmentShader,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true
    })
);

atmosphere.scale.set(1.1, 1.1, 1.1);
console.log(atmosphere);

const group = new THREE.Group();
group.add(sphere);
group.add(atmosphere);
scene.add(group);

camera.position.z = 15;

const mouse = {
    x: 0,
    y: 0
};

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    sphere.rotation.y += 0.003;
    group.rotation.y += (mouse.x * 0.05 - group.rotation.y) * 0.1; // Smooth rotation
    gsap.to(group.rotation, {

        x: -mouse.y * 0.5,
        y: mouse.x * 0.5,
        duration: 2,


    })
}
animate();

window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    console.log(mouse);
});
