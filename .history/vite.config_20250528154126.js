import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false, // css in js
        }),
      ],
    }),
  ],
  server: {
    // https:true,
    hmr: true, //启动热更新，就是更改了代码自动刷新页面
    port: 5173, //自定义启动时的端口
    // open: true, //代表vite项目在启动时自动打开浏览器
    proxy: {
      // 易支付接口
      '/mzf': {
        target: 'https://www.mazfu.com',
        //你的需要请求的服务器地址
        changeOrigin: true, // 允许跨域
        secure: true, //忽略安全证书
        rewrite: (path) => path.replace(/^\/yzf/,''), // 重写路径把路径变成空字符,
        configure: (proxy, options) => {
          // proxy 是 'http-proxy' 的实例
          proxy.on('proxyReq',(proxyReq)=>{
            console.log(`代理请求：${proxyReq.method} ${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`)
          })
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
