module.exports = {
  devServer: {
    port: 9000
  },
  runtimeCompiler: true,
  chainWebpack: (config) => {
    const svgRule = config.module.rule('svg')

    svgRule.uses.clear()

    svgRule
      .use('vue-svg-loader')
      .loader('vue-svg-loader')
  }
}
