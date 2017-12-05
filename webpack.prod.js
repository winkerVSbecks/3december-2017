const webpack = require('webpack');
const path = require('path');

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/main.js',

  output: {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, 'dist'),
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-stage-2'],
            },
          },
        ],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
              },
            },
          ],
          fallback: 'style-loader',
        }),
      },
      {
        test: /\.(glsl|frag|vert)$/,
        use: [{ loader: 'raw-loader' }, { loader: 'glslify-loader' }],
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: file => {
                return '[path][name]-[hash].[ext]';
              },
            },
          },
        ],
      },
      {
        test: /node_modules/,
        loader: 'ify-loader',
      },
      {
        enforce: 'post',
        test: /\.js$/,
        loader: 'ify-loader',
      },
    ],
  },

  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js',
    },
    extensions: ['*', '.js', '.vue', '.json'],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      title: 'three-js-experiment',
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    new webpack.optimize.CommonsChunkPlugin({
      children: true,
      minChunks: 2,
      async: true,
    }),
    new UglifyJSPlugin(),
    new ExtractTextPlugin({
      filename: '[name].[contenthash:8].css',
    }),
  ],
};
