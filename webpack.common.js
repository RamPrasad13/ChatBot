const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
  	app: './src/app.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
  	rules: [
  		{
  			test: /\.js$/,
  			exclude: /(node_modules|bower_components)/,
  			use: {
  				loader: 'babel-loader',
  			}
  		},
  		// {
  		// 	test: /\.scss$/,
  		// 	use: [{
  		// 		loader: 'style-loader'
  		// 	}, {
  		// 		loader: 'css-loader'
  		// 	}, {
  		// 		loader: 'sass-loader'
  		// 	}]
  		// },
  		{
  			test: /\.(png|svg|jpg|gif)$/,
  			use: [
  				{
  					loader: 'file-loader'
  				}
  			]
  		}
  	]
  },
  plugins: [
  	new CleanWebpackPlugin(['dist']),
  	new HtmlWebpackPlugin({
  		title: 'InMobi ChatBot'
  	})
  ]
}