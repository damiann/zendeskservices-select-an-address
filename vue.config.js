const WriteFilePlugin = require('write-file-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')

const isProduction = process.env.VUE_APP_IS_PRODUCTION === 'true'

module.exports = {
  baseUrl: isProduction ? '.' : undefined,
  assetsDir: undefined,
  runtimeCompiler: !isProduction,
  outputDir: 'dist/assets',
  productionSourceMap: undefined,
  parallel: undefined,
  css: {
    extract: false,
  },
  configureWebpack: {
    output: {
      filename: 'js/[name].js',
      chunkFilename: 'js/[name].js',
      hotUpdateChunkFilename: 'hot/hot-update.js',
      hotUpdateMainFilename: 'hot/hot-update.json'
    },
    resolve: {
      alias: {
        'style': path.resolve(__dirname, 'src/style/')
      }
    }
  },
  chainWebpack: (config) => {
    config.module
      .rule('svg')
      .use('file-loader')
      .loader('vue-svg-loader')

    config
      .plugin('copy-files')
      .use(CopyWebpackPlugin, [
        [
          {
            from: path.resolve(__dirname, 'zaf'),
            to: path.resolve(__dirname, 'dist')
          },
        ]
      ])

    config
      .plugin('write-files')
      .use(WriteFilePlugin)

    config
      .plugin('html')
      .tap((args) => {
        args[0].template = path.resolve(__dirname, 'src/iframe.html')
        args[0].filename = path.resolve(__dirname, 'dist/assets/iframe.html')
        args[0].minify = isProduction
        return args
      })
  },
}
