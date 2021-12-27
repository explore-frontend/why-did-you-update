module.exports = {
  parallel: false,
  productionSourceMap: false,
  configureWebpack: {
    plugins: [
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('unplugin-vue2-script-setup/webpack')({
        /* options */
      })
    ]
  },
  chainWebpack(config) {
    // disable type check and let `vue-tsc` handles it
    config.plugins.delete('fork-ts-checker');
  }
};
