// webpack.config.js
var webpack = require('webpack');


const production = false;

const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractSass = new ExtractTextPlugin({
    filename: "[name].[contenthash].css",
    disable: process.env.NODE_ENV === "development"
});

module.exports = {
    devtool: 'source-map',
    entry: './client/src/index.js',
    output: {
        path: __dirname + '/src/main/resources/webroot/js',
        filename: 'bundle.js'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loaders: ["babel"] ,
            exclude: /node_modules/
        },{
            test: /\.scss$/,
            loaders: ["style-loader", "css-loader", "sass-loader"]
        }
    ] }
};
