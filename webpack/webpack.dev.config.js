var webpack = require('webpack');
var path = require('path');

var parentDir = path.join(__dirname, '../src/');

module.exports = {
    entry: [
        path.join(parentDir, 'index.js')
    ],
    module: {
        rules: [
            {test: /\.js$/ , loader:'babel-loader', exclude: '/node_modules/'},
            {test: /\.jsx$/ , loader:'babel-loader', exclude: '/node_modules/'}
        ]
    },
    output: {
        // path: parentDir + '/dist',
        path: parentDir,
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: parentDir,
        historyApiFallback: true
    }
}