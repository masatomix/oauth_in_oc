const path = require('path')
console.log(process.env.NODE_ENV)

module.exports = {
  configureWebpack: {
    node: {
      module: 'empty',
    },
    resolve: {
      alias: {
        appConfig: path.resolve(`src/config/${process.env.NODE_ENV}.js`),
        firebaseConfig: path.resolve(
          `src/config/firebaseConfig_${process.env.NODE_ENV}.js`,
        ),
      },
    },
  },
  transpileDependencies: ['vuetify'],
}
