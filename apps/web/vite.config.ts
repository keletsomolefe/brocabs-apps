import { defineConfig } from 'vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { nitroV2Plugin } from '@tanstack/nitro-v2-vite-plugin';
import viteReact from '@vitejs/plugin-react';
import viteTsConfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';

const config = defineConfig({
  server: {
    allowedHosts: ['web.plt.local'],
  },
  plugins: [
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    nitroV2Plugin({ compatibilityDate: '2025-10-19' }),
  ],
});

export default config;
