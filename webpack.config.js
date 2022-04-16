const HtmlWebpackPlugin = require('html-webpack-plugin');
const MonacoEditorWebpackPlugin = require('monaco-editor-webpack-plugin');
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
    rules: [
      { test: /\.ts$/, loader: 'ts-loader', exclude: /test/ },
      // for monaco editor
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.ttf$/,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'dev.html',
    }),
    new MonacoEditorWebpackPlugin({
      languages: ['yaml'],
    }),
  ],
};
