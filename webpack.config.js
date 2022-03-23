const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'rest-model.js',
        library: 'rest-model',
        libraryTarget: 'umd',
        publicPath: '/'
    },
    devServer: {
        contentBase: './dist',
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        plugins: [
                            '@babel/plugin-proposal-private-property-in-object',
                            '@babel/plugin-proposal-private-methods',
                            '@babel/plugin-proposal-class-properties',
                        ]
                    }
                }
            }
        ]
    }
};
