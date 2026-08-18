import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    client: { entry: "src/app/client.tsx" },
    server: { entry: "server" },
  },
  nitro: { preset: "netlify" },
});
