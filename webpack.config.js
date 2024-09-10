const path = require('path');

module.exports = {
  mode: 'development', // Или 'production' в зависимости от ваших нужд
  entry: './src/index.js',
  output: {
    filename: 'widget-bundle.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'MyReactWidget',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};