const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    port: 9000,
    static: {
      directory: __dirname,
    },
  },
  entry: './src/browser.ts',
  output: {
    filename: 'browser.js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [{ test: /\.ts$/, loader: 'ts-loader', exclude: /test/ }],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'dev.html',
    }),
  ],
};
