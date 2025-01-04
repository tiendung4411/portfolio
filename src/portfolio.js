import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("Initializing Area 2 (Portfolio)...");

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('threejs-portfolio').appendChild(renderer.domElement);

    const items = [];
    const loader = new THREE.TextureLoader();
    const itemData = [
        { img: 'assets/project1.png', name: 'Project 1' },
        { img: 'assets/project2.png', name: 'Project 2' },
        { img: 'assets/project3.png', name: 'Project 3' },
        { img: 'assets/project4.png', name: 'Project 4' },
    ];

    itemData.forEach((data, index) => {
        loader.load(data.img, (texture) => {
            const aspectRatio = texture.image.width / texture.image.height;
            const geometry = new THREE.PlaneGeometry(10 * aspectRatio, 10);
            const material = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: false,
                color: 0xffffff,
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.y = -index * 12;
            items.push(mesh);
            scene.add(mesh);
        });
    });

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    let scrollIndex = -1;
    let scrollTarget = 0;
    let scrollAccumulator = 0;
    const scrollThreshold = 2;
    const animationSpeed = 0.05;

    window.addEventListener(
        'wheel',
        (event) => {
            event.preventDefault();
            scrollAccumulator += event.deltaY * 0.01;

            if (scrollAccumulator >= scrollThreshold) {
                scrollIndex = Math.min(scrollIndex + 1, items.length - 1);
                scrollTarget = -scrollIndex * 12;
                scrollAccumulator = 0;
            } else if (scrollAccumulator <= -scrollThreshold) {
                scrollIndex = Math.max(scrollIndex - 1, 0);
                scrollTarget = -scrollIndex * 12;
                scrollAccumulator = 0;
            }
        },
        { passive: false }
    );

    function animate() {
        requestAnimationFrame(animate);

        items.forEach((item, index) => {
            const distance = Math.abs(index - scrollIndex);
            const targetScale = distance === 0 ? 1 : 0.1;
            const targetY = -index * 12 + (index < scrollIndex ? 6 : index > scrollIndex ? -6 : 0);
            item.scale.setScalar(item.scale.x + (targetScale - item.scale.x) * animationSpeed);
            item.position.y += (targetY - item.position.y) * animationSpeed;
        });

        camera.position.y += (scrollTarget - camera.position.y) * animationSpeed;
        controls.update();
        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});