import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Lets tests import app code with the same "@/" alias as the app.
export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./", import.meta.url)) } },
});
