import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger"; // Keeping this import as it is not being removed

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()].filter(Boolean), // Removed lovable from the plugins array
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
