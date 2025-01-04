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
        this.element.textContent = ''; // Clear the text
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

        if (type === 'typeWriter') {
            this.typeWriterAnimation(text, options.speed || 50);
        } else if (type === 'fadeIn') {
            this.fadeInAnimation(text, options.duration || 1);
        }
    }

    typeWriterAnimation(text, speed) {
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

                // Random speed variance for natural effect
                const nextSpeed = speed + Math.random() * 30 - 15;
                setTimeout(addCharacter, Math.max(nextSpeed, 20)); // Minimum speed limit
            } else {
                this.animationId = null; // Animation complete
                this.typingSound.pause();
                this.typingSound.currentTime = 0;
            }
        };

        addCharacter();
    }

    fadeInAnimation(text, duration) {
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
            }
        };

        this.animationId = requestAnimationFrame(step);
    }
}

export default TextManager;