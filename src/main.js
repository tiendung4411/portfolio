import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1, 3);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('threejs-container').appendChild(renderer.domElement);

// Add lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Load the GLB model
const loader = new GLTFLoader();
let mixer = null; // Animation mixer
let loadedModel = null;
let isAnimationPlaying = false;

// Add raycaster for click detection
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (event) => {
    // Convert mouse position to normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    // Check for intersections
    const intersects = raycaster.intersectObjects(scene.children, true);
    if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        console.log('Clicked on:', clickedObject);

        // Start or stop all animations based on the current state
        if (mixer) {
            if (!isAnimationPlaying) {
                // Play all animations
                mixer._actions.forEach((action) => {
                    action.reset().play();
                });
                isAnimationPlaying = true;
                console.log('All animations started');
            } else {
                // Stop all animations
                mixer._actions.forEach((action) => {
                    action.stop();
                });
                isAnimationPlaying = false;
                console.log('All animations stopped');
            }
        }
    }
});
const animationActions = []; // Store actions for each animation
let activeAction = null; // Currently playing action

// Load the GLB model
loader.load(
    './assets/testquat.glb', // Path to your GLB file
    (gltf) => {
        loadedModel = gltf.scene;
        loadedModel.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        scene.add(loadedModel);
        console.log('Model loaded:', loadedModel);

        // Set up the AnimationMixer if animations are present
        if (gltf.animations.length > 0) {
            mixer = new THREE.AnimationMixer(loadedModel);

            // Create an action for each animation and store it
            gltf.animations.forEach((clip, index) => {
                const action = mixer.clipAction(clip);
                action.loop = THREE.LoopRepeat; // Set looping behavior
                animationActions.push(action);

                console.log(`Animation ${index} loaded:`, clip.name);
            });
        }
    },
    undefined,
    (error) => {
        console.error('Error loading model:', error);
    }
);
const controlContainer = document.createElement('div');
controlContainer.style.position = 'absolute';
controlContainer.style.bottom = '20px';
controlContainer.style.left = '20px';
controlContainer.style.zIndex = '1000';
document.body.appendChild(controlContainer);

function createButton(label, index) {
    const button = document.createElement('button');
    button.innerText = label;
    button.style.margin = '5px';
    button.style.padding = '10px';
    button.style.fontSize = '14px';
    button.addEventListener('click', () => {
        playAnimation(index);
    });
    controlContainer.appendChild(button);
}

function playAnimation(index) {
    if (animationActions[index]) {
        // Check if the selected action is currently active
        if (activeAction === animationActions[index] && activeAction.isRunning()) {
            if (index === 1) {
                // Pause animation2 at its current state
                activeAction.paused = true;
                console.log(`Pausing animation ${index} at time: ${activeAction.time}`);
            } else {
                // Stop and reset other animations
                activeAction.stop();
                console.log(`Stopping animation ${index}`);
                activeAction = null; // Reset active action
            }
        } else {
            // Handle previously active action
            if (activeAction) {
                if (activeAction === animationActions[1]) {
                    // If the previously active action was animation2, just pause it
                    activeAction.paused = true;
                } else {
                    // Stop other actions completely
                    activeAction.stop();
                }
            }

            // Play or resume the selected action
            activeAction = animationActions[index];
            if (index === 1 && activeAction.paused) {
                // Resume animation2 from its current state
                activeAction.paused = false;
                console.log(`Resuming animation ${index} from time: ${activeAction.time}`);
            } else {
                // Reset and play other animations
                activeAction.reset().play();
                console.log(`Playing animation ${index}`);
            }
        }
    }
}
// Add buttons for each animation
['Animation 1', 'Animation 2', 'Animation 3'].forEach((label, index) => {
    createButton(label, index);
});

// Animation loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    // Update the AnimationMixer
    if (mixer) {
        const delta = clock.getDelta();
        mixer.update(delta);
    }

    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});