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
        {
          test: /\.(j|t)s$/,
          loader: 'ts-loader',
          exclude: /node_modules|test/,
        },
        {
          test: /src\/.*\.module\.css$/,
          exclude: /node_modules/,
          // use: ['style-loader', 'css-loader'],
          use: [
            // 'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: true,
                // esModule: true,
                // modules: {
                //   namedExport: true,
                // },
              },
            },
          ],
        },
        // for monaco editor
        {
          test: /\.css$/,
          exclude: /src\/.*\.module\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.ttf$/,
          type: 'asset/resource',
        },
        {
          test: /\.yml$/,
          type: 'asset/source',
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
