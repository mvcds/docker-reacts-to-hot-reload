const path = require('path')

const { APP_PORT } = require('./src/infra/environment')

const config = {
  entry: {
    app: path.resolve(__dirname, 'src/app')
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  resolve: {
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.css'
    ],
    alias: {
    }
  },
  devtool: 'source-map',
  target: 'web',
  devServer: {
    contentBase: path.join(__dirname, 'src/app'),
    historyApiFallback: true,
    https: true,
    noInfo: true,
    port:APP_PORT,
    host: '0.0.0.0'
  }
}

module.exports = config
