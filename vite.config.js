import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.jsx',
                'resources/js/auth.jsx',
                'resources/js/dashboard.jsx',
                'resources/js/products.jsx'
            ],
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
});
