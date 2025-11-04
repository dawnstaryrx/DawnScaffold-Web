import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), tailwindcss()],
  server: {
    host: "0.0.0.0", // 允许外部访问
    port: 80,      // 默认端口，你可以改
    open: false,     // 启动时是否自动打开浏览器
    proxy: {
      // ✅ 配置跨域代理
      "/api": {
        target: "http://localhost:8080", // 后端服务地址
        changeOrigin: true,              // 修改请求源（必须）
        rewrite: (path) => path.replace(/^\/api/, ""), // 去掉前缀 /api
      },
    },
  },
});
