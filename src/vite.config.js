import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        outDir: 'dist', // Default output directory
        assetsDir: 'assets', // Where static assets like images will go
    },
});
