   // webpack.config.js
   const path = require('path');
   const nodeExternals = require('webpack-node-externals');

   module.exports = {
     entry: './src/index.js',
     output: {
       path: path.resolve(__dirname, 'build'),
       filename: 'index.js',
       library: 'MyReactLibrary',
       libraryTarget: 'umd',
       globalObject: 'this',
     },
     externals: [nodeExternals()],
     module: {
       rules: [
         {
           test: /\.js$/,
           exclude: /node_modules/,
           use: {
             loader: 'babel-loader',
             options: {
               presets: ['@babel/preset-env', '@babel/preset-react'],
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
           },
         },
       ],
     },
     resolve: {
       extensions: ['.js', '.jsx'],
     },
   };
   
