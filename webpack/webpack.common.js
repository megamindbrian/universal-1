const {root} = require('./helpers');

/**
 * This is a common webpack config which is the base for all builds
 */
module.exports = {
    devtool: 'source-map',
    resolve: {
        extensions: ['.ts', '.js']
    },
    output: {
        path: root('../jupytangular2/public')
    },
    module: {
        rules: [
            {test: /\.ts$/, loader: '@ngtools/webpack'},
            {test: /\.css$/, loader: 'raw-loader'},
            {test: /\.html$/, loader: 'raw-loader'},
            {test: /\.scss$/, loaders: ['raw-loader', 'sass-loader']}
        ]
    },
    node: {
        fs: 'empty'
    },
    plugins: []
};
