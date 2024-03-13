import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'
import { VantResolver } from 'unplugin-vue-components/resolvers'  
import Components from 'unplugin-vue-components/vite'  
import { nodePolyfills } from 'vite-plugin-node-polyfills'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VueDevTools(),
    nodePolyfills(),
    Components({  
      dirs: ['src/components'], // 配置需要默认导入的自定义组件文件夹  
      resolvers: [VantResolver({ importStyle: true, resolveIcons: true })]  
    }),  
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
