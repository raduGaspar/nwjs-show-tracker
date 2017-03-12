var path = require('path'),
  webpack = require('webpack'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  CopyWebpackPlugin = require('copy-webpack-plugin'),
  environment = process.env.APP_ENV,
  env = (environment ? environment.trim() : 'development'),
  devFlagPlugin = new webpack.DefinePlugin({
    __DEV__: env !== 'production',
    'process.env.NODE_ENV': JSON.stringify(env)
  });

  console.log('Requested environment is', environment);
  console.log('Environment is', env);

  module.exports = {
  context: path.join(__dirname, 'src'),
  entry: {
    app: [
      './index'
    ]
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    sourceMapFilename: 'bundle.js.map'
  },
  eslint: {
    configFile: path.join(__dirname, '.eslintrc'),
    emitError: false
  },
  module: {
    preLoaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'eslint'
      }
    ],
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react', 'stage-0']
        }
      },
      {
        test: /\.less/,
        loaders: ['style', 'css', 'less']
      },
      {
        test: /\.css/,
        loaders: ['style', 'css']
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        loader: 'url?limit=10000',
      },
      {
        test: /\.(svg|woff|ttf)$/,
        loader: 'file'
      }
    ]
  },
  devtool: 'source-map',
  devServer: {
    contentBase: './dist',
    host: 'localhost',
    port: '3000',
    stats: {
      colors: true,
      chunks: false
    }
  },
  plugins: [
    new HtmlWebpackPlugin(
      {
        template: 'index.html'
      }
    ),
    new CopyWebpackPlugin([
      // copy all files and folder
      {
        from: './assets',
        to: './assets'
      }
    ]),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.DedupePlugin(),
    devFlagPlugin
  ].concat(
    env === 'production' ? new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        dead_code: true,
        drop_console: false,
        drop_debugger: true,
      },
      output: {
        comments: false
      }
    }) : []
  )
};
