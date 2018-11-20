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
            {test: /\.jsx$/ , loader:'babel-loader', exclude: '/node_modules/'},
            {test: /\.css$/,  use: [ 'style-loader', 'css-loader' ]}
        ]
    },
    output: {
        // path: parentDir + '/dist',
        path: parentDir,
        filename: 'bundle.js'
    },
    mode: 'production'
};