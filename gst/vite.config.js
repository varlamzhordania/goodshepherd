import path from "path"
import react from "@vitejs/plugin-react"
import tailwindcss from 'tailwindcss';
import {defineConfig} from "vite"
import {API_BASE_URL} from "./src/lib/config.js";

export default defineConfig({

    plugins: [react(), tailwindcss()],
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
