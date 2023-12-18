const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: './',
  devServer: {
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000/', // 本地后端地址
        //target: 'http://47.94.95.175:3000/', // 线上后端地址
        changeOrigin: true, //允许跨域
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  transpileDependencies: true,
  lintOnSave: false
})
