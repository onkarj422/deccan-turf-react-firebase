import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({ target: 'react', autoCodeSplitting: true }),
    react(),
    tailwindcss(),
    svgr(),
  ],
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@hooks': '/src/hooks',
      '@utils': '/src/utils',
      '@assets': '/src/assets',
      '@routes': '/src/routes',
      '@pages': '/src/pages',
      '@layouts': '/src/layouts',
      '@context': '/src/context',
      '@lib': '/src/lib',
      '@styles': '/src/styles',
      '@theme': '/src/theme',
      '@constants': '/src/constants',
      '@types': '/src/types',
      '@stores': '/src/stores',
      '@services': '/src/services',
      '@config': '/src/config',
      '@auth': '/src/auth',
    }
  }
})
