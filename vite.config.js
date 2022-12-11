import { resolve } from 'path'
import { defineConfig } from 'vite'


export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        configurator: resolve(__dirname, 'configurator.html'),
        donut: resolve(__dirname, 'donut.html'),
      }
    }
  }
})