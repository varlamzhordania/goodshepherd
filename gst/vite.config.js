import path from "path"
import react from "@vitejs/plugin-react"
import tailwindcss from 'tailwindcss';
import {defineConfig} from "vite"
import {API_BASE_URL} from "./src/lib/config.js";
import {VitePWA} from 'vite-plugin-pwa'

export default defineConfig({

    plugins: [
        react(),
        tailwindcss(),
        VitePWA({
            registerType: 'autoUpdate',
            injectRegister: 'auto',
            devOptions: {
                enabled: true
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg}']
            },
        })
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        cors: false,
        proxy: {
            '/api': {
                target: API_BASE_URL,
                changeOrigin: true,
                secure: false,
            },
        },
    },

})
