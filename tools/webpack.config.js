const pkg = require('../package.json');
const path = require('path');
const webpack = require('webpack');

// const ExtractTextPlugin = require('extract-text-webpack-plugin');

const alias = {};
['components', 'containers', 'styles', 'utils'].forEach((el) => {
  alias[el] = path.resolve(__dirname, '../src', el);
});

module.exports = {
  target: 'web',

  context: path.resolve(__dirname, '../'),

  devtool: 'cheap-module-eval-source-map',

  entry: {
    client: [
      'webpack-hot-middleware/client',
      './src/index.js',
    ],
  },

  output: {
    path: path.join(__dirname, '../build'),
    publicPath: '/build/',
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
  },

  resolve: {
    extensions: ['.js', '.css', '.json'],
    modules: ['node_modules'],
    alias,
  },

  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      include: path.resolve(__dirname, '../src'),
      options: {
        cacheDirectory: true,
        babelrc: false,
        presets: [
          ['env', {
            targets: {
              browsers: pkg.browserslist,
            },
            modules: false,
            useBuiltIns: false,
            debug: false,
          }],
          'stage-2', 'react',
        ],
      },
    }, {
      test: /\.css$/,
      include: [
        path.join(__dirname, '../src'),
      ],
      use: [
        {
          loader: 'style-loader',
        },
        {
          loader: 'css-loader',
          // options: {
          //   modules: true,
          //   localIndentName: '[name]__[local]__[hash:base64:5]',
          //   localIndentName: '[name]',
          //   sourceMap: true,
          //   discardComments: { removeAll: true }
          // }
        },
        {
          loader: 'postcss-loader',
          options: {
            config: './tools/postcss.config.js',
          },
        },
      ],
      // use: ExtractTextPlugin.extract({
      //   fallback: 'style-loader',
      //   use: [
      //     {
      //       loader: 'css-loader',
      //     },
      //     {
      //       loader: 'postcss-loader',
      //       options: {
      //         config: './tools/postcss.config.js',
      //       }
      //     }
      //   ],
      // })
    }, {
      test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
      loader: 'file-loader',
      query: {
        name: '[path][name].[ext]?[hash:8]',
      },
    }],
  },
  plugins: [

    // new ExtractTextPlugin({ filename: 'spec.css', allChunks: true }),

    // Move modules that occur in multiple entry chunks to a new entry chunk (the commons chunk).
    // http://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: module => /node_modules/.test(module.resource),
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity,
    }),

    new webpack.HotModuleReplacementPlugin(),

    // new webpack.EvalSourceMapDevToolPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      'process.env.BROWSER': true,
      __DEV__: true,
    }),
  ],
};
