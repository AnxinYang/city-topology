const path = require('path');

module.exports = {
    devtool: 'inline-source-map',
    entry: './src/index.ts',
    mode: 'development',
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/
        }]
    },
    output: {
        filename: 'client.js',
        path: path.resolve(__dirname, './build')
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js']
    },
    devServer: {
        hot: true,
        host: "0.0.0.0",
        port: 1992,
        contentBase: path.resolve(__dirname, './build')
    }
};