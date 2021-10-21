// vue.config.js

/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
 module.exports = {
    outputDir: "../public",
    devServer: {
      proxy: 'http://localhost:8080'
    }
  }