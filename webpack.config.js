const HtmlWebpackPlugin = require('html-webpack-plugin');
const MonacoEditorWebpackPlugin = require('monaco-editor-webpack-plugin');
const path = require('path');

module.exports = (env, argv) => {
  let config = {
    mode: argv.mode || 'production',
    entry: './src/browser.ts',
    output: {
      path: path.resolve(__dirname, 'docs'),
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

  if (argv.mode === 'development') {
    config = {
      ...config,
      devtool: 'inline-source-map',
      devServer: {
        port: 9000,
        static: {
          directory: __dirname,
        },
      },
    };
  }
  return config;
};
