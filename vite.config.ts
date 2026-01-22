
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // The third parameter '' allows loading variables without the VITE_ prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // This specifically handles the process.env.API_KEY requirement
      'process.env.API_KEY': JSON.stringify(env.API_KEY || process.env.API_KEY),
      // This polyfills the process.env object to prevent ReferenceErrors in the browser
      'process.env': JSON.stringify({ 
        API_KEY: env.API_KEY || process.env.API_KEY 
      }),
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
    server: {
      port: 3000,
      open: true
    }
  };
});
