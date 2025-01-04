
class TextManager {
    constructor(element) {
        this.element = element;
        this.originalText = element.textContent;
        this.isAnimating = false;
    }

    typewriter(text, speed = 100) {
        this.isAnimating = true;
        this.element.textContent = '';
        let index = 0;

        return new Promise((resolve) => {
            const interval = setInterval(() => {
                if (index < text.length) {
                    this.element.textContent += text.charAt(index);
                    index++;
                } else {
                    clearInterval(interval);
                    this.isAnimating = false;
                    resolve();
                }
            }, speed);
        });
    }

    fadeIn(duration = 1) {
        this.isAnimating = true;
        this.element.style.opacity = '0';
        this.element.offsetHeight;
        this.element.style.transition = `opacity ${duration}s ease-in-out`;

        return new Promise((resolve) => {
            requestAnimationFrame(() => {
                this.element.style.opacity = '1';
                setTimeout(() => {
                    this.isAnimating = false;
                    resolve();
                }, duration * 1000);
            });
        });
    }

    resetText() {
        if (this.element.tagName.toLowerCase() === 'p') {
            this.element.style.transition = 'none';
            this.element.style.opacity = '0';
            this.element.offsetHeight;
        } else {
            this.element.textContent = '';
        }
        this.isAnimating = false;
    }

    async animateText(text, animationType = 'typewriter', options = {}) {
        this.resetText();
        switch (animationType) {
            case 'typewriter':
            case 'typeWriter':
                await this.typewriter(text, options.speed || 50);
                break;
            case 'fadeIn':
                this.element.textContent = text;
                await this.fadeIn(options.duration || 2);
                break;
            default:
                console.error('Unknown animation type:', animationType);
        }
    }
}
export default TextManager; 