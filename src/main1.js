import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed");

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(-4, 1.2, 4); // Adjust the position to view the model
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Enable shadows on the renderer
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Use soft shadows
    renderer.outputEncoding = THREE.sRGBEncoding; // Correct output color
    renderer.toneMapping = THREE.ACESFilmicToneMapping; // Match your 3D modeling software tone mapping
    renderer.toneMappingExposure = 1; // Adjust exposure if needed
    document.querySelector('.threejs-container').appendChild(renderer.domElement);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); // Soft ambient light
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 5); // Position light above and to the side
    directionalLight.castShadow = true; // Enable shadows for the light
    directionalLight.shadow.mapSize.width = 1024; // Shadow resolution
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    scene.add(directionalLight);

    // Add a floor to receive shadows
    // const floorGeometry = new THREE.PlaneGeometry(20, 20);
    // const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
    // const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    // floor.rotation.x = -Math.PI / 2; // Lay flat
    // floor.position.y = -1; // Position below the objects
    // floor.receiveShadow = true; // Enable receiving shadows
    // scene.add(floor);

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Adds smooth damping to controls
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = true; // Allow panning to move the camera left/right
    controls.minDistance = 1; // Minimum zoom distance
    controls.maxDistance = 10; // Maximum zoom distance
    controls.maxPolarAngle = Math.PI / 2; // Restrict vertical rotation

    // Raycaster for detecting clicks
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let chair; // Store reference to the Celsius_Office_Chair

    // Load GLB model
    const loader = new GLTFLoader();
    loader.load(
        'assets/model.glb', // Path to your GLB model
        (gltf) => {
            const model = gltf.scene;

            model.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true; // Enable shadow casting for all meshes
                    child.receiveShadow = true; // Enable shadow receiving for all meshes
                    console.log('Found mesh:', child.name);

                    if (child.name === 'Celsius_Office_Chair') {
                        console.log('Found Celsius_Office_Chair');
                        chair = child; // Save the chair reference
                    }
                }
            });

            model.position.set(-5, -1, -1); // Adjust position
            model.scale.set(1, 1, 1); // Adjust scale
            scene.add(model);
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        (error) => {
            console.error('An error occurred:', error);
        }
    );

    // Add click event listener
    window.addEventListener('click', (event) => {
        // Convert mouse coordinates to normalized device coordinates
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Update raycaster
        raycaster.setFromCamera(mouse, camera);

        // Check for intersections
        const intersects = raycaster.intersectObjects(scene.children, true);
        if (intersects.length > 0 && intersects[0].object === chair) {
            // Rotate the chair
            const duration = 1000; // Animation duration in milliseconds
            const startRotation = chair.rotation.y;
            const endRotation = startRotation + Math.PI; // Rotate 180 degrees

            let startTime = null;

            function rotateChair(timestamp) {
                if (!startTime) startTime = timestamp;
                const elapsedTime = timestamp - startTime;
                const progress = Math.min(elapsedTime / duration, 1);

                // Interpolate rotation
                chair.rotation.y = startRotation + (endRotation - startRotation) * progress;

                if (progress < 1) {
                    requestAnimationFrame(rotateChair);
                }
            }

            requestAnimationFrame(rotateChair);
        }
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        controls.update(); // Required for damping
        renderer.render(scene, camera);
    }
    animate();

    // Resize handling
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});