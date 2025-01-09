import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import TextManager from './text_manager.js';

document.addEventListener('DOMContentLoaded', async () => {
    const loadingAnimation = lottie.loadAnimation({
        container: document.getElementById('lottie-animation'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: './assets/loading.json', // Path to your Lottie file
    });
    function checkDeviceType() {
        const mobileWarning = document.getElementById('mobile-warning');
        const mainContent = document.querySelector('.threejs-container');

        // Check if device is mobile using screen width and user agent
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
            || window.innerWidth <= 768;

        if (isMobile) {
            // Show warning and hide main content
            mobileWarning.style.display = 'flex';
            if (mainContent) {
                mainContent.style.display = 'none';
            }
            // Prevent scrolling on mobile
            document.body.style.overflow = 'hidden';
        } else {
            // Hide warning and show main content
            mobileWarning.style.display = 'none';
            if (mainContent) {
                mainContent.style.display = 'block';
            }
            // Allow scrolling on desktop
            document.body.style.overflow = '';
        }
    }
    const loadingScreen = document.getElementById('loading-screen');
    checkDeviceType();
    loadingScreen.style.display = 'flex'; // Make sure it's visible

    console.log("DOM fully loaded and parsed");

    const response = await fetch('strings.json');
    const strings = await response.json();

    let currentLanguage = 'en';

    // DOM elements for localization
    const titleElement = document.querySelector('.text-container h1');
    const descriptionElement = document.querySelector('.text-container p');
    const scrollButton = document.querySelector('#scroll-button');
    const portfolioTitle = document.querySelector('.portfolio-area h1');
    let isAnimating = false; // Flag to track animation state


    // Initialize TextManager for title and description
    const titleManager = new TextManager(titleElement);
    const descriptionManager = new TextManager(descriptionElement);
    const portfolioTitleManager = new TextManager(portfolioTitle);
    scrollButton.textContent = strings[currentLanguage].scrollButton;

    // DOM elements for about section
    const aboutMeTitle = document.querySelector('.section-title');
    const aboutMeSubtitle = document.querySelector('.info-section h3');
    const aboutMeDescription = document.querySelector('.about-text .description');
    const skillsTitle = document.querySelector('.skills-section h3');
    const skillsDescription = document.querySelector('.skills-section .description');
    const scanMeText = document.querySelector('.scan-text');
    const thanksText = document.querySelector('.thank-you-section p');

    // Initialize TextManager instances
    const textManagers = {
        title: new TextManager(titleElement),
        description: new TextManager(descriptionElement),
        portfolioTitle: new TextManager(portfolioTitle),
        aboutMeTitle: new TextManager(aboutMeTitle),
        aboutMeDescription: new TextManager(aboutMeDescription),
        skillsTitle: new TextManager(skillsTitle),
        skillsDescription: new TextManager(skillsDescription),
        aboutMeSubtitle: new TextManager(aboutMeSubtitle),
        scanMeText: new TextManager(scanMeText),
        thanksText: new TextManager(thanksText),

    };
    async function updateTextContent(language) {
        if (isAnimating) return;
        isAnimating = true;

        // Reset all text managers
        Object.values(textManagers).forEach(manager => manager.resetText());

        // Hide button
        scrollButton.classList.remove('visible');
        scrollButton.textContent = strings[language].scrollButton;
        scrollButton.classList.add('hidden');

        // Main section animations
        textManagers.title.animateText(
            strings[language].welcomeTitle,
            'typeWriter',
            { speed: 100, icon: strings[language].welcomeTitleIcon }
        );
        textManagers.aboutMeTitle.animateText(
            strings[language].aboutMe,
            'fadeIn',
            { duration: 1 }
        );
        textManagers.skillsTitle.animateText(
            strings[language].skills,
            'fadeIn',
            { duration: 1 }
        );
        textManagers.aboutMeSubtitle.animateText(
            strings[language].introduction,
            'fadeIn',
            { duration: 1 }
        );


        textManagers.aboutMeDescription.animateText(
            strings[language].aboutMeDescription,
            'typeWriter',
            { speed: 5 }
        );


        textManagers.skillsDescription.animateText(
            strings[language].skillsDescription,
            'typeWriter',
            { speed: 5 }
        );

        // Sequence the animations
        setTimeout(() => {
            textManagers.description.animateText(
                strings[language].welcomeDescription,
                'fadeIn',
                { duration: 1 }
            );

            // Update static content
            portfolioTitle.textContent = strings[language].portfolioTitle;
            // aboutMeTitle.textContent = strings[language].aboutMe;
            // aboutMeSubtitle.textContent = strings[language].introduction;
            // // skillsTitle.textContent = strings[language].skills;
            // scanMeText.textContent = strings[language].scanMe;
            // thanksText.textContent = strings[language].thanks;



            // Animate about section content
            setTimeout(() => {
                scrollButton.classList.remove('hidden');
                scrollButton.classList.add('visible');
                // Show button after all animations
                setTimeout(() => {

                    isAnimating = false;
                    textManagers.thanksText.animateText(
                        strings[language].thanks,
                        'fadeIn',
                        { duration: 3 }
                    );
                    textManagers.scanMeText.animateText(
                        strings[language].scanMe,
                        'fadeIn',
                        { duration: 1 }
                    );
                }, 12000);
            }, 1000);
        }, 2800);
    }

    // Function to initialize all text content
    function initializeTextContent(language) {
        titleElement.textContent = strings[language].welcomeTitle;
        descriptionElement.textContent = strings[language].welcomeDescription;
        scrollButton.textContent = strings[language].scrollButton;
        portfolioTitle.textContent = strings[language].portfolioTitle;
        aboutMeTitle.textContent = strings[language].aboutMe;
        aboutMeSubtitle.textContent = strings[language].introduction;
        aboutMeDescription.textContent = strings[language].aboutMeDescription;
        skillsTitle.textContent = strings[language].skills;
        skillsDescription.textContent = strings[language].skillsDescription;
        scanMeText.textContent = strings[language].scanMe;
        thanksText.textContent = strings[language].thanks;
    }


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
        if (isAnimating) return; // Prevent interaction during animation

        currentLanguage = currentLanguage === 'en' ? 'vn' : 'en';
        updateTextContent(currentLanguage);

        // Update flag visibility
        flagVN.style.display = currentLanguage === 'vn' ? 'none' : 'block';
        flagUS.style.display = currentLanguage === 'en' ? 'none' : 'block';
    });


    // Control Manager
    // Control Manager
    class ControlManager {
        constructor() {
            this.currentArea = 'room';
            this.scrollIndex = 0;
            this.scrollTarget = 0;
            this.scrollThreshold = 12;
            this.inTransition = false;
            this.scrollAccumulator = 0;
            this.isScrolling = false;
            this.scrollTimeout = null;
            this.lastScrollTime = Date.now();
            this.scrollCooldown = 500;
            this.touchpadThreshold = 100;
        }

        switchToPortfolio() {
            this.inTransition = true;
            this.scrollIndex = 0;
            this.scrollTarget = 0;
            this.scrollAccumulator = 0;
            camera2.position.y = 0;
            document.querySelector('body').style.overflow = 'hidden';
            document.querySelector('.portfolio-area').scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
                this.currentArea = 'portfolio';
                this.inTransition = false;
            }, 600);
        }

        switchToRoom() {
            this.inTransition = true;
            this.scrollAccumulator = 0;
            document.querySelector('body').style.overflow = '';
            document.querySelector('.background-container').scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
                this.currentArea = 'room';
                this.inTransition = false;
            }, 600);
        }

        switchToAbout() {
            this.inTransition = true;
            this.scrollAccumulator = 0;
            document.querySelector('body').style.overflow = '';
            document.querySelector('.about-me-container').scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
                this.currentArea = 'about';
                this.inTransition = false;
            }, 600);
            updateTextContent(currentLanguage);
        }

        handleScroll(event) {
            event.preventDefault();

            if (this.inTransition || this.isScrolling) return;

            const currentTime = Date.now();
            if (currentTime - this.lastScrollTime < this.scrollCooldown) {
                return;
            }

            const isTouchpad = Math.abs(event.deltaY) < 50;

            if (isTouchpad) {
                this.scrollAccumulator += event.deltaY;

                if (this.scrollTimeout) {
                    clearTimeout(this.scrollTimeout);
                }

                this.scrollTimeout = setTimeout(() => {
                    if (Math.abs(this.scrollAccumulator) >= this.touchpadThreshold) {
                        this.processScroll(Math.sign(this.scrollAccumulator));
                    }
                    this.scrollAccumulator = 0;
                }, 50);
            } else {
                this.processScroll(Math.sign(event.deltaY));
            }
        }

        processScroll(direction) {
            if (this.currentArea === 'room' && direction > 0) {
                this.switchToPortfolio();
            } else if (this.currentArea === 'portfolio') {
                if (direction > 0) {
                    if (this.scrollIndex < items.length - 1) {
                        // Still have portfolio items to scroll through
                        this.isScrolling = true;
                        this.scrollIndex++;
                        this.scrollTarget = -this.scrollIndex * this.scrollThreshold;
                        this.lastScrollTime = Date.now();

                        setTimeout(() => {
                            this.isScrolling = false;
                        }, this.scrollCooldown);
                    } else if (this.scrollIndex === items.length - 1) {
                        // At the last portfolio item, switch to about section
                        this.switchToAbout();
                    }
                } else if (direction < 0) {
                    if (this.scrollIndex > 0) {
                        this.isScrolling = true;
                        this.scrollIndex--;
                        this.scrollTarget = -this.scrollIndex * this.scrollThreshold;
                        this.lastScrollTime = Date.now();

                        setTimeout(() => {
                            this.isScrolling = false;
                        }, this.scrollCooldown);
                    } else {
                        this.switchToRoom();
                    }
                }
            } else if (this.currentArea === 'about' && direction < 0) {
                // Allow scrolling back to portfolio from about section
                this.switchToPortfolio();
            }
        }
    }
    const controlManager = new ControlManager();

    // Area 1: GLTF Model Scene
    const scene1 = new THREE.Scene();
    scene1.background = new THREE.Color(0xffffff);

    const camera1 = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera1.position.set(-5.9465677518731036, 9.3223679953203122, 4.0080446767202433);
    camera1.rotation.set(-0.9967727847626417, 0.9581597811485589, 0.859592369623756);

    const renderer1 = new THREE.WebGLRenderer({ antialias: true });
    renderer1.setSize(window.innerWidth, window.innerHeight);
    renderer1.setPixelRatio(window.devicePixelRatio);
    document.querySelector('.threejs-container').appendChild(renderer1.domElement);

    const ambientLight1 = new THREE.AmbientLight(0xffffff, 2);
    scene1.add(ambientLight1);

    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
    hemisphereLight.position.set(0, 10, 0);
    scene1.add(hemisphereLight);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isLightOn = true; // Flag to track the light's state
    let floorLampLight;
    // Enable shadow maps in the renderer
    renderer1.shadowMap.enabled = true;
    renderer1.shadowMap.type = THREE.PCFSoftShadowMap; // Soft shadows
    const loader = new GLTFLoader();
    let mixer = null;
    let characterAnimation = null;
    let animations = [];

    loader.load(
        'assets/background_8_1.glb',
        (gltf) => {
            const model = gltf.scene;
            model.position.set(-6.2, -1, -1);
            model.scale.set(1.9, 1.9, 1.9);

            // Traverse the model to configure shadows and set colorSpace
            model.traverse((child) => {
                if (child.isMesh) {
                    // Enable/disable shadows
                    if (child.name === 'Chair-15' || child.name === 'face_chair') {
                        child.castShadow = true; // Enable shadow casting for specific objects
                    } else {
                        child.castShadow = false; // Disable shadow casting for all other objects
                    }
                    child.receiveShadow = true; // Allow all objects to receive shadows

                    // Set the colorSpace for materials
                    if (child.material && child.material.map) {
                        child.material.map.colorSpace = THREE.SRGBColorSpace; // Set sRGB color space
                        child.material.map.needsUpdate = true; // Ensure the material updates
                    }
                }
            });

            // Locate Floor_Lamp
            const floorLamp = model.getObjectByName('Floor_Lamp');
            if (floorLamp) {
                console.log('Floor_Lamp found:', floorLamp.position);

                // Create a light source near the Floor Lamp
                floorLampLight = new THREE.PointLight(0xf18203, 25, 10);
                floorLampLight.position.set(
                    floorLamp.position.x - 7.35,
                    floorLamp.position.y + 2,
                    floorLamp.position.z - 2.7
                );
                floorLampLight.castShadow = true;
                floorLampLight.shadow.mapSize.width = 1024;
                floorLampLight.shadow.mapSize.height = 1024;
                console.log('Light position:', floorLampLight.position);
                scene1.add(floorLampLight);

                // Create a transparent sphere to represent the light source
                const sphereGeometry = new THREE.SphereGeometry(0.5, 16, 16); // Adjust size as needed
                const sphereMaterial = new THREE.MeshBasicMaterial({
                    color: 0xff0000, // Red for debugging
                    transparent: true,
                    opacity: 0, // Make it invisible
                });
                const lightSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
                lightSphere.position.copy(floorLampLight.position);
                lightSphere.name = 'LightSource'; // Give it a name for raycasting
                scene1.add(lightSphere);

                // Optional: Add a light helper for debugging
                // const lightHelper = new THREE.PointLightHelper(floorLampLight, 0.5);
                // scene1.add(lightHelper);
            } else {
                console.warn('Floor_Lamp not found in the model.');
            }

            // Add the model to the scene
            scene1.add(model);

            // Initialize AnimationMixer for animations

            if (gltf.animations.length > 0) {
                mixer = new THREE.AnimationMixer(model);
                gltf.animations.forEach((clip) => {
                    const action = mixer.clipAction(clip);
                    // action.play();
                    //store animation trigger into characterAnimation
                    animations.push(action);
                });
                console.log('Animations triggered:', gltf.animations);
            }

            // Hide the loading screen after a short delay
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                updateTextContent(currentLanguage);
                animations.forEach((action, index) => {
                    // Reset and play the animation
                    action.reset();
                    action.setLoop(THREE.LoopOnce); // Play only once
                    action.clampWhenFinished = true; // Stay at last frame
                    action.play();

                    console.log(`Playing animation ${index}`);
                });
            }, 500);
        },
        undefined,
        (error) => console.error('Error loading model:', error)
    );
    // Animation update in render loop
    const clock = new THREE.Clock();



    // Event listener for mouse clicks
    window.addEventListener('pointerdown', (event) => {
        console.log('floorLampLight assigned:', floorLampLight);
        // Convert mouse position to normalized device coordinates
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        const lightSwitchSound = new Audio('assets/audio/light_switch.mp3');
        // Update the raycaster with the camera and mouse position
        raycaster.setFromCamera(mouse, camera1);

        // Check for intersections with the scene objects
        const intersects = raycaster.intersectObjects(scene1.children, true);
        if (intersects.length > 0) {
            const clickedObject = intersects[0].object;
            console.log('Intersected:', clickedObject.name);

            // Check if the light sphere was clicked
            if (clickedObject.name === 'LightSource') {
                console.log('Light Source clicked!');
                lightSwitchSound.play().catch((err) => console.log('Audio play error:', err));
                // Toggle the light
                if (floorLampLight) {
                    console.log('Toggling light...');
                    isLightOn = !isLightOn; // Toggle the flag
                    floorLampLight.intensity = isLightOn ? 25 : 0; // Turn light on or off
                    console.log(`Light is now ${isLightOn ? 'ON' : 'OFF'}`);
                } else {
                    console.warn('FloorLampLight not found.');
                }
            };
            if (clickedObject.name === 'Mesh002_1' ||
                clickedObject.name === 'Mesh002_2' ||
                clickedObject.name === 'Mesh002_3') {
                console.log('Character clicked!');

                // Play all animations or specific ones
                animations.forEach((action, index) => {
                    // Reset and play the animation
                    action.reset();
                    action.setLoop(THREE.LoopOnce); // Play only once
                    action.clampWhenFinished = true; // Stay at last frame
                    action.play();

                    console.log(`Playing animation ${index}`);
                });
            }
        }
    });



    function animateScene1() {
        requestAnimationFrame(animateScene1);

        const delta = clock.getDelta();
        if (mixer) mixer.update(delta); // Update the mixer for animations

        renderer1.render(scene1, camera1);
    }

    animateScene1();
    //add a click event listener to the Floor_Lamp

    // Area 2: Portfolio Section
    const scene2 = new THREE.Scene();
    //set the background = sea.png
    const texture = new THREE.TextureLoader().load('assets/black.jpg');
    //set the colorSpace
    // texture.colorSpace = THREE.SRGBColorSpace;
    // scene2.background = texture;
    const camera2 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera2.position.z = 8;

    const renderer2 = new THREE.WebGLRenderer({ antialias: true });
    renderer2.setSize(window.innerWidth, window.innerHeight);
    renderer2.setPixelRatio(window.devicePixelRatio);
    document.querySelector('#threejs-portfolio').appendChild(renderer2.domElement);


    const textureLoader = new THREE.TextureLoader();
    const itemData = [
        { img: '/assets/items/project1.png', name: 'Project 1' },
        { img: '/assets/items/project2.png', name: 'Project 2' },
        { img: '/assets/items/project3.png', name: 'Project 3' },
        { img: '/assets/items/project4.png', name: 'Project 4' },
        { img: '/assets/items/project5.png', name: 'Project 5' },
        { img: '/assets/items/project6.png', name: 'Project 6' },
        { img: '/assets/items/project7.png', name: 'Project 7' },
        { img: '/assets/items/project8.png', name: 'Project 8' },
        { img: '/assets/items/project9.png', name: 'Project 9' },
        { img: '/assets/items/project10.png', name: 'Project 10' },
        { img: '/assets/items/project11.png', name: 'Project 11' },
        { img: '/assets/items/project12.png', name: 'Project 12' },
        { img: '/assets/items/project13.png', name: 'Project 13' },
        { img: '/assets/items/project14.png', name: 'Project 14' },
        { img: '/assets/items/project15.png', name: 'Project 15' },


    ];

    const items = new Array(itemData.length); // Create a fixed-size array for proper indexing
    itemData.forEach((data, index) => {
        textureLoader.load(
            data.img,
            (texture) => {
                texture.colorSpace = THREE.SRGBColorSpace;
                const aspectRatio = texture.image.width / texture.image.height;
                const geometry = new THREE.PlaneGeometry(10 * aspectRatio, 10);
                const material = new THREE.MeshBasicMaterial({ map: texture });
                const mesh = new THREE.Mesh(geometry, material);
                mesh.position.y = -index * 12;

                items[index] = mesh; // Ensure the correct order
                scene2.add(mesh);
            },
            undefined,
            (error) => {
                console.error(`Error loading texture for ${data.name}:`, error);
            }
        );
    });

    function animateScene2() {
        requestAnimationFrame(animateScene2);

        // Epsilon for snapping precision
        const epsilon = 0.01;

        items.forEach((item, index) => {
            // Calculate the target position
            const targetY = -index * 12 + (controlManager.scrollTarget - camera2.position.y);

            const isActive = controlManager.scrollIndex === index;

            // Smoothly approach target position
            item.position.y += (targetY - item.position.y) * 0.1;

            // Snap to the exact position if close enough
            if (Math.abs(targetY - item.position.y) < epsilon) {
                item.position.y = targetY;
            }

            // Determine rotation for active and inactive items
            const targetRotation = index % 2 === 0 ? -0.1 : 0.1; // Alternate rotation
            if (isActive) {
                // Smooth rotation for active item
                if (Math.abs(item.rotation.y - targetRotation) > 0.005) {
                    item.rotation.y += (targetRotation - item.rotation.y) * 0.1;
                }
            } else {
                // Reset rotation for inactive items
                if (Math.abs(item.rotation.y) > 0.005) {
                    item.rotation.y += (0 - item.rotation.y) * 0.1;
                }
            }

            // Smooth scaling for active item
            const targetScale = isActive ? 1.2 : 0.9;
            item.scale.setScalar(item.scale.x + (targetScale - item.scale.x) * 0.1);

            // Dimming inactive items
            item.material.color.setScalar(isActive ? 1 : 0.6);
        });

        // Smoothly move the camera position
        camera2.position.y += (controlManager.scrollTarget - camera2.position.y) * 0.1;

        renderer2.render(scene2, camera2);
    }

    animateScene2();
    scrollButton.addEventListener('click', () => {
        const waveOverlay = document.getElementById('wave-overlay');
        const waveImage = waveOverlay.querySelector('img');
        const bubbleSound = new Audio('assets/audio/bubble.mp3');
        bubbleSound.volume = 0.5;
        // Show the wave overlay and trigger the animation
        waveOverlay.classList.remove('hidden');
        waveOverlay.classList.add('active'); // This will trigger visibility and opacity
        waveImage.classList.add('active'); // This triggers the animation for the image


        setTimeout(() => {
            controlManager.switchToPortfolio(); // Navigate to portfolio area
            bubbleSound.play().catch((err) => console.log('Audio play error:', err));
        }, 500); // Match the wave animation duration (1s)  
        // Navigate to the portfolio area after the animation completes
        setTimeout(() => {
            waveOverlay.classList.remove('active');
            waveOverlay.classList.add('hidden'); // Re-hide the wave overlay
            waveImage.classList.remove('active'); // Reset image animation

            console.log('Animation complete, switching to portfolio'); // Debugging log
        }, 1500); // Match the animation duration (1.5s)
    });

    window.addEventListener('wheel', (event) => controlManager.handleScroll(event));

    window.addEventListener('resize', () => {
        camera1.aspect = window.innerWidth / window.innerHeight;
        camera1.updateProjectionMatrix();
        renderer1.setSize(window.innerWidth, window.innerHeight);
        checkDeviceType();
        camera2.aspect = window.innerWidth / window.innerHeight;
        camera2.updateProjectionMatrix();
        renderer2.setSize(window.innerWidth, window.innerHeight);
    });
});