 import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    base: './',
    plugins: [],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          about: path.resolve(__dirname, 'about.html'),
          services: path.resolve(__dirname, 'services.html'),
          projects: path.resolve(__dirname, 'projects.html'),
          maintenance: path.resolve(__dirname, 'maintenance.html'),
          quote: path.resolve(__dirname, 'quote.html'),
          serviceAreas: path.resolve(__dirname, 'service-areas.html'),
          areas: path.resolve(__dirname, 'areas.html'),
          faq: path.resolve(__dirname, 'faq.html'),
          contact: path.resolve(__dirname, 'contact.html'),
        },
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
