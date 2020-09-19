const path = require('path');
//const nodeExternals = require('webpack-node-externals');
module.exports = {
  entry: './src/index.ts',
  devtool: 'inline-source-map',
  target:"node",
  node: {
    fs: 'empty'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  externals: {
    "pouchdb": "require('pouchdb')"
 }
};