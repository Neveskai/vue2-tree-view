const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  transpileDependencies: ['vuetify'],

  configureWebpack: {
    plugins: [new CopyWebpackPlugin([{ from: './src/assets/', to: './' }])],
  },

  css: {
    loaderOptions: {
      sass: {
        additionalData: `@import "@/styles/main.scss";`,
      },
    },
  },
  chainWebpack: config => {
    ;['vue-modules', 'vue', 'normal-modules', 'normal'].forEach(match => {
      config.module
        .rule('sass')
        .oneOf(match)
        .use('sass-loader')
        .tap(opt =>
          Object.assign(opt, {
            additionalData: `@import '~@/styles/main.scss'`,
          })
        )
    })
  },
  pluginOptions: {
    i18n: {
      locale: 'br',
      fallbackLocale: 'br',
      localeDir: 'locales',
      enableInSFC: true,
    },
  },
}
