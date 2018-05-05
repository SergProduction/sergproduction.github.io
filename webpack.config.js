const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const fs = require('fs')

const dirs = fs.readdirSync(path.resolve(__dirname, './src'))

const arrToObj = (arr, setValue) => arr.reduce((acc, dirname) => Object.assign(acc, { [dirname]: setValue(dirname) }), {})

const alias = arrToObj(dirs, (dirname) => `./src/${dirname}`)

const entrys = arrToObj(dirs, (dirname) => `./src/${dirname}/index.js`)

const outputs = arrToObj(dirs, (dirname) => `./public/${dirname}/index.js`)


const common = {
  entry: entrys,
  context: __dirname,
  output: {
    path: path.resolve(__dirname, './public/'),
    filename: '[name]/[name].js',
    library: '[name]',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
        }
      },
      {
        test: /\.html$/,
        loader: 'file-loader',
        include: path.resolve(__dirname, './src'),
        options: {
          context: path.resolve(__dirname, './src'),
          name: '[path][name].[ext]',
        },
      },

    ]
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      dirs: dirs,
    }),
  ]
}

const dev = {
  devtool: 'cheap-module-eval-source-map',
  watch: true,
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    publicPath: '/',
    compress: true,
    watchContentBase: true,
    host: '0.0.0.0',
    port: 9000,
    historyApiFallback: {
      from: '/',
      to: 'main/index.html'
    }
  }
}

const prod = {
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new UglifyJsPlugin(),
  ],
}


module.exports = (env) => merge(common, ({
  'production': prod
}[env && env.NODE_ENV]) || dev)