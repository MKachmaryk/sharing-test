module.exports = {
  lintOnSave: process.env.NODE_ENV !== 'production',
  devServer: {
    port: 8100,
    https: true,
    hot: true
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/assets/sass/partials/_variables.sass"` // empty file
      },
      scss: {
        prependData: `@import "@/assets/sass/partials/_mixins.scss";`
      }
    }
  },
};
