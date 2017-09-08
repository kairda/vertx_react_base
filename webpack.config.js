// webpack.config.js
var webpack = require('webpack');

module.exports = {
    devtool: 'source-map',
    entry: './client/src/index.js',
    output: {
        path: __dirname + '/src/main/resources/webroot/js',
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ["babel"],
                exclude: /node_modules/
            }, {
                test: /\.scss$/,
                exclude: /node_modules/,
                loaders: [{
                    loader: 'css-loader',
                    options: {
                        sourceMap: true,
                    },
                }, {
                    loader: 'postcss-loader',
                }, {
                    loader: 'sass-loader',
                    options: {
                        sourceMap: true,
                        outputStyle: 'expanded',
                    },
                }],
                fallback: 'style-loader',
            }
        ]
    }

};
