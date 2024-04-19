import { defineConfig } from "vite";
// import { resolve } from "path";
import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
// 按需引入Elementplus：自动导入（官网推荐）
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    // @/ 是webpack设置的路径别名
    alias: {
      // "@": resolve(__dirname, "src"),
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    //  反向代理
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        // 重写请求路径
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
