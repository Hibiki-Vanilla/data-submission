const path = require("path");
const resolve = (dir) => {
  return path.join(__dirname, dir);
};
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8880,
    host: "10.10.15.241",
    proxy: {
      "/u": {
        target: "http://10.10.68.204:10010",
        changeOrigin: true,
        configure: (proxy, options) => {
          // proxy 是 'http-proxy' 的实例
        },
      },
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        "@": resolve("src"),
        // 'demo-common': path.resolve(__dirname, './src/demo-common'),
      },
    },
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            //这是配置css主题色
            // "primary-color": "#007AFF",
          },
          javascriptEnabled: true,
        },
      },
    },
  },
})

