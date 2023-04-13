import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import monacoEditorPlugin from "vite-plugin-monaco-editor";
function pathResolve(dir) {
  return resolve(__dirname, ".", dir);
}
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/mixins/base.scss";`
      }
    }
  },
  plugins: [
    vue(),
    monacoEditorPlugin() //配置在线编辑器
    // apiURL: loadEnv(mode, process.cwd()).VITE_APP_API,//配置全局变量，api
  ], // 配置需要使用的插件列表，这里将vue添加进去
  // 配置文件别名 vite1.0是/@/  2.0改为/@
  // 这里是将src目录配置别名为 /@ 方便在项目中导入src目录下的文件
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      snapsvg: "snapsvg/dist/snap.svg.js"
    }
  },
  // 强制预构建插件包
  // optimizeDeps: {
  //     include: ['axios'],
  // },
  // 打包配置
  build: {
    target: "modules",
    outDir: "dist-test", //指定输出路径
    assetsDir: "assets", // 指定生成静态资源的存放路径
    minify: "terser" // 混淆器，terser构建后文件体积更小
  },
  // 本地运行配置，及反向代理配置
  server: {
    port: 3002,
    host: "0.0.0.0",
    cors: true, // 默认启用并允许任何源
    open: true, // 在服务器启动时自动在浏览器中打开应用程序
    //反向代理配置，注意rewrite写法，开始没看文档在这里踩了坑
    proxy: {
      "/vi": {
        target: "http://localhost:3000", //代理接口
        changeOrigin: true
        // rewrite: (path) => path.replace(/^\/api/, "")
      }
    }
  }
});
