import * as THREE from 'three';

document.addEventListener('DOMContentLoaded', async () => {
    console.log("DOM fully loaded and parsed");

    // Fetch strings for localization
    const response = await fetch('src/strings.json');
    const strings = await response.json();

    let currentLanguage = 'en';

    // DOM elements
    const title = document.querySelector('.text-container h1');
    const description = document.querySelector('.text-container p');
    const scrollButton = document.querySelector('#scroll-button');
    const portfolioTitle = document.querySelector('.portfolio-area h1');

    // Function to update text content based on language
    function updateTextContent(language) {
        title.textContent = strings[language].welcomeTitle;
        description.textContent = strings[language].welcomeDescription;
        scrollButton.textContent = strings[language].scrollButton;
        portfolioTitle.textContent = strings[language].portfolioTitle;
    }

    // Initialize text content
    updateTextContent(currentLanguage);

    // Add language toggle button with flags
    const languageToggleButton = document.createElement('div');
    languageToggleButton.style.position = 'fixed';
    languageToggleButton.style.top = '10px';
    languageToggleButton.style.right = '10px';
    languageToggleButton.style.zIndex = '1000';
    languageToggleButton.style.cursor = 'pointer';

    const flagVN = document.createElement('img');
    flagVN.src = 'assets/flag-vn.png'; // Path to Vietnamese flag image
    flagVN.alt = 'Vietnamese';
    flagVN.style.width = '45px';
    flagVN.style.height = '30px';
    flagVN.style.display = currentLanguage === 'vn' ? 'none' : 'block';
    flagVN.style.border = '2px solid white';

    const flagUS = document.createElement('img');
    flagUS.src = 'assets/flag-us.png'; // Path to US flag image
    flagUS.alt = 'English';
    flagUS.style.width = '45px';
    flagUS.style.height = '30px';
    flagUS.style.display = currentLanguage === 'en' ? 'none' : 'block';
    flagUS.style.border = '2px solid white';

    languageToggleButton.appendChild(flagVN);
    languageToggleButton.appendChild(flagUS);
    document.body.appendChild(languageToggleButton);

    // Handle language toggle
    languageToggleButton.addEventListener('click', () => {
        currentLanguage = currentLanguage === 'en' ? 'vn' : 'en';
        updateTextContent(currentLanguage);

        // Toggle flag visibility
        flagVN.style.display = currentLanguage === 'vn' ? 'none' : 'block';
        flagUS.style.display = currentLanguage === 'en' ? 'none' : 'block';
    });

    // Rest of your portfolio scrolling and Three.js logic
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputEncoding = THREE.sRGBEncoding;
    document.querySelector('.threejs-container').appendChild(renderer.domElement);

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
            texture.colorSpace = THREE.SRGBColorSpace;
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

    let scrollIndex = -1;
    let scrollTarget = 0;
    let scrollAccumulator = 0;
    const scrollThreshold = 2;
    const snapThreshold = 0.5;
    const animationSpeed = 0.05;
    let inPortfolioArea = false;

    window.addEventListener(
        'wheel',
        (event) => {
            event.preventDefault();
            scrollAccumulator += event.deltaY * 0.01;

            if (!inPortfolioArea) {
                if (scrollAccumulator >= scrollThreshold) {
                    document.querySelector('.portfolio-area').scrollIntoView({ behavior: 'smooth' });
                    inPortfolioArea = true;
                    scrollIndex = 0;
                    scrollTarget = 0;
                    scrollAccumulator = 0;
                }
            } else {
                if (scrollAccumulator >= scrollThreshold) {
                    scrollIndex = Math.min(scrollIndex + 1, items.length - 1);
                    scrollTarget = -scrollIndex * 12;
                    scrollAccumulator = 0;
                } else if (scrollAccumulator <= -scrollThreshold) {
                    if (scrollIndex === 0) {
                        document.querySelector('.background-container').scrollIntoView({ behavior: 'smooth' });
                        inPortfolioArea = false;
                        scrollIndex = -1;
                    } else {
                        scrollIndex = Math.max(scrollIndex - 1, 0);
                        scrollTarget = -scrollIndex * 12;
                    }
                    scrollAccumulator = 0;
                }
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
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    document.getElementById('scroll-button').addEventListener('click', () => {
        document.querySelector('.portfolio-area').scrollIntoView({ behavior: 'smooth' });
        inPortfolioArea = true;
        scrollIndex = 0;
        scrollTarget = 0;
        scrollAccumulator = 0;
    });
});