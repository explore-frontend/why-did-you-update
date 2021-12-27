module.exports = {
  publicPath: "",
  chainWebpack(config) {
    config.devtool("source-map");
    config.plugins.delete("fork-ts-checker");
  },
};
