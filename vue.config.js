module.exports = {
  // 将资源打包为相对路径
  // publicPath: "././",
  lintOnSave: false, // 保存时检查格式，使用eslint
  crossorigin: 'anonymous', // htmlWebpackPlugin
  devServer: { // 对开发服务的设置
    // Various Dev Server settings
    port: 7700, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    open: true, // 自动调用默认浏览器打开
    https: false // 是否使用https, https使用node的一个内部默认的ca证书
  }
}