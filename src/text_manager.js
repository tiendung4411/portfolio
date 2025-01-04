class TextManager {
    constructor(element) {
        this.element = element;
        this.animationId = null; // Store animation ID for cancellation
        this.typingSound = new Audio('assets/audio/typing.mp3'); // Preload sound
        this.typingSound.loop = true;
        this.typingSound.volume = 0.5;
        this.currentText = ''; // Keep track of the current text being animated
    }

    resetText() {
        this.stopAnimation(); // Stop any ongoing animation
        this.element.innerHTML = ''; // Clear the text (use innerHTML for icons)
        this.typingSound.pause(); // Stop sound if it's playing
        this.typingSound.currentTime = 0; // Reset sound to the beginning
        this.currentText = ''; // Reset current text
    }

    stopAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId); // Stop animation frame
            this.animationId = null;
        }
    }

    animateText(text, type, options = {}) {
        this.resetText(); // Ensure a clean slate
        this.currentText = text; // Set the current text to be animated

        const { speed = 50, duration = 1, icon = null } = options;

        if (type === 'typeWriter') {
            this.typeWriterAnimation(text, speed, icon);
        } else if (type === 'fadeIn') {
            this.fadeInAnimation(text, duration, icon);
        }
    }

    typeWriterAnimation(text, speed, icon) {
        let index = 0;

        // Create a placeholder with non-breaking spaces to stabilize the layout
        const placeholder = text.replace(/./g, ' ');
        this.element.textContent = placeholder;

        // Play the typing sound
        this.typingSound.play().catch((err) => console.log('Audio play error:', err));

        const addCharacter = () => {
            if (index < text.length) {
                // Replace the character at the current index
                const animatedText = text.slice(0, index + 1) + placeholder.slice(index + 1);
                this.element.textContent = animatedText;

                index++;

                // Use a constant speed for smooth animation
                setTimeout(addCharacter, speed);
            } else {
                this.animationId = null; // Animation complete
                this.typingSound.pause();
                this.typingSound.currentTime = 0;

                // Append the icon if provided
                if (icon) {
                    this.appendIcon(icon);
                }
            }
        };

        addCharacter();
    }

    fadeInAnimation(text, duration, icon) {
        this.element.textContent = text;
        this.element.style.opacity = 0;
        let startTime = null;

        const step = (timestamp) => {
            // Check if the current animation has been interrupted
            if (text !== this.currentText) {
                return; // Exit if the text no longer matches
            }

            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
            this.element.style.opacity = progress;

            if (progress < 1) {
                this.animationId = requestAnimationFrame(step);
            } else {
                this.animationId = null; // Animation complete

                // Append the icon if provided
                if (icon) {
                    this.appendIcon(icon);
                }
            }
        };

        this.animationId = requestAnimationFrame(step);
    }

    appendIcon(icon) {
        // Create an element for the icon
        const iconElement = document.createElement('img');
        iconElement.src = icon; // Use the provided icon URL
        iconElement.alt = 'Icon';

        // Get the computed font size of the text element
        const fontSize = window.getComputedStyle(this.element).fontSize;

        // Apply the font size to the icon's width and height
        iconElement.style.width = fontSize;
        iconElement.style.height = fontSize;

        iconElement.style.marginLeft = '8px'; // Add some space between text and icon
        iconElement.style.verticalAlign = 'middle'; // Align the icon with the text

        // Adjust the vertical position slightly
        iconElement.style.position = 'relative';
        iconElement.style.top = '-2px'; // Adjust this value to fine-tune the height

        // Append the icon to the element
        this.element.appendChild(iconElement);
    }
}

export default TextManager;