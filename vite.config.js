import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      injectRegister: "auto",
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },

      includeAssets: [
        "logo.svg",
        "apple-touch-icon.png",
        "mask-icon.svg",
        "favicon.png",
      ],
      manifest: {
        name: "声音模拟器",
        short_name: "声音模拟器",
        description: "一款简单的声音模拟器",
        theme_color: "#0a0b17",
        start_url: "./",
        display: "fullscreen",
        background_color: "#0a0b17",
        registerType: "autoUpdate",
        icons: [
          {
            src: "logo.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
        ],
      },
    }),
  ],
});
