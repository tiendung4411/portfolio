import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import TextManager from './text_manager.js';

document.addEventListener('DOMContentLoaded', async () => {
    console.log("DOM fully loaded and parsed");

    const response = await fetch('src/strings.json');
    const strings = await response.json();

    let currentLanguage = 'en';

    // DOM elements for localization
    const titleElement = document.querySelector('.text-container h1');
    const descriptionElement = document.querySelector('.text-container p');
    const scrollButton = document.querySelector('#scroll-button');
    const portfolioTitle = document.querySelector('.portfolio-area h1');

    // Initialize TextManager for title and description
    const titleManager = new TextManager(titleElement);
    const descriptionManager = new TextManager(descriptionElement);

    async function updateTextContent(language) {
        titleManager.resetText();
        descriptionManager.resetText();
        titleManager.animateText(strings[language].welcomeTitle, 'typeWriter', { speed: 100 });
        descriptionManager.animateText(strings[language].welcomeDescription, 'fadeIn', { duration: 1 });
        scrollButton.textContent = strings[language].scrollButton;
        portfolioTitle.textContent = strings[language].portfolioTitle;
    }

    updateTextContent(currentLanguage);

    const languageToggleButton = document.createElement('div');
    languageToggleButton.style.position = 'fixed';
    languageToggleButton.style.top = '10px';
    languageToggleButton.style.right = '10px';
    languageToggleButton.style.zIndex = '1000';
    languageToggleButton.style.cursor = 'pointer';

    const flagVN = document.createElement('img');
    flagVN.src = 'assets/flag-vn.png';
    flagVN.alt = 'Vietnamese';
    flagVN.style.width = '45px';
    flagVN.style.height = '30px';
    flagVN.style.display = currentLanguage === 'vn' ? 'none' : 'block';

    const flagUS = document.createElement('img');
    flagUS.src = 'assets/flag-us.png';
    flagUS.alt = 'English';
    flagUS.style.width = '45px';
    flagUS.style.height = '30px';
    flagUS.style.display = currentLanguage === 'en' ? 'none' : 'block';

    languageToggleButton.appendChild(flagVN);
    languageToggleButton.appendChild(flagUS);
    document.body.appendChild(languageToggleButton);

    languageToggleButton.addEventListener('click', () => {
        currentLanguage = currentLanguage === 'en' ? 'vn' : 'en';
        updateTextContent(currentLanguage);
        flagVN.style.display = currentLanguage === 'vn' ? 'none' : 'block';
        flagUS.style.display = currentLanguage === 'en' ? 'none' : 'block';
    });

    // Control Manager
    class ControlManager {
        constructor() {
            this.currentArea = 'room'; // Start in the first area
            this.scrollIndex = 0;
            this.scrollTarget = 0;
            this.scrollThreshold = 12;
            this.inTransition = false;
        }

        switchToPortfolio() {
            this.inTransition = true;
            this.scrollIndex = 0; // Lock to the first item
            this.scrollTarget = 0; // Reset scrolling
            camera2.position.y = 0; // Align camera to the first item
            document.querySelector('.portfolio-area').scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
                this.currentArea = 'portfolio';
                this.inTransition = false;
            }, 600); // Allow smooth scroll transition
        }

        switchToRoom() {
            this.inTransition = true;
            document.querySelector('.background-container').scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
                this.currentArea = 'room';
                this.inTransition = false;
            }, 600); // Allow smooth scroll transition
        }

        handleScroll(event) {
            event.preventDefault();

            if (this.inTransition) return; // Ignore scroll during transitions

            if (this.currentArea === 'room' && event.deltaY > 0) {
                this.switchToPortfolio();
            } else if (this.currentArea === 'portfolio') {
                if (event.deltaY > 0) {
                    if (this.scrollIndex < items.length - 1) {
                        this.scrollIndex++;
                        this.scrollTarget = -this.scrollIndex * this.scrollThreshold;
                    }
                } else if (event.deltaY < 0) {
                    if (this.scrollIndex > 0) {
                        this.scrollIndex--;
                        this.scrollTarget = -this.scrollIndex * this.scrollThreshold;
                    } else {
                        this.switchToRoom();
                    }
                }
            }
        }
    }

    const controlManager = new ControlManager();

    // Area 1: GLTF Model Scene
    const scene1 = new THREE.Scene();
    scene1.background = new THREE.Color(0xffffff);

    const camera1 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera1.position.set(-0.9465677518731036, 3.3223679953203122, 3.0080446767202433);
    camera1.rotation.set(-0.9567727847626417, 0.9581597811485589, 0.859592369623756);

    const renderer1 = new THREE.WebGLRenderer({ antialias: true });
    renderer1.setSize(window.innerWidth, window.innerHeight);
    renderer1.setPixelRatio(window.devicePixelRatio);
    document.querySelector('.threejs-container').appendChild(renderer1.domElement);

    const ambientLight1 = new THREE.AmbientLight(0xffffff, 2.5);
    scene1.add(ambientLight1);

    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
    hemisphereLight.position.set(0, 10, 0);
    scene1.add(hemisphereLight);

    const loader = new GLTFLoader();
    loader.load(
        'assets/model.glb',
        (gltf) => {
            const model = gltf.scene;
            model.position.set(-5, -1, -1);
            model.scale.set(1, 1, 1);
            scene1.add(model);
        },
        undefined,
        (error) => console.error('Error loading model:', error)
    );

    function animateScene1() {
        requestAnimationFrame(animateScene1);
        renderer1.render(scene1, camera1);
    }
    animateScene1();

    // Area 2: Portfolio Section
    const scene2 = new THREE.Scene();
    const camera2 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera2.position.z = 8;

    const renderer2 = new THREE.WebGLRenderer({ antialias: true });
    renderer2.setSize(window.innerWidth, window.innerHeight);
    renderer2.setPixelRatio(window.devicePixelRatio);
    document.querySelector('#threejs-portfolio').appendChild(renderer2.domElement);

    const items = [];
    const textureLoader = new THREE.TextureLoader();
    const itemData = [
        { img: 'assets/project1.png', name: 'Project 1' },
        { img: 'assets/project2.png', name: 'Project 2' },
        { img: 'assets/project3.png', name: 'Project 3' },
        { img: 'assets/project4.png', name: 'Project 4' },
    ];

    itemData.forEach((data, index) => {
        textureLoader.load(data.img, (texture) => {
            texture.colorSpace = THREE.SRGBColorSpace;
            const aspectRatio = texture.image.width / texture.image.height;
            const geometry = new THREE.PlaneGeometry(10 * aspectRatio, 10);
            const material = new THREE.MeshBasicMaterial({ map: texture });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.y = -index * 12;
            items.push(mesh);
            scene2.add(mesh);
        });
    });

    function animateScene2() {
        requestAnimationFrame(animateScene2);

        items.forEach((item, index) => {
            const targetY = -index * 12 + (controlManager.scrollTarget - camera2.position.y);
            item.position.y += (targetY - item.position.y) * 0.1;
        });

        camera2.position.y += (controlManager.scrollTarget - camera2.position.y) * 0.1;

        renderer2.render(scene2, camera2);
    }
    animateScene2();

    scrollButton.addEventListener('click', () => {
        controlManager.switchToPortfolio();
    });

    window.addEventListener('wheel', (event) => controlManager.handleScroll(event));

    window.addEventListener('resize', () => {
        camera1.aspect = window.innerWidth / window.innerHeight;
        camera1.updateProjectionMatrix();
        renderer1.setSize(window.innerWidth, window.innerHeight);

        camera2.aspect = window.innerWidth / window.innerHeight;
        camera2.updateProjectionMatrix();
        renderer2.setSize(window.innerWidth, window.innerHeight);
    });
});