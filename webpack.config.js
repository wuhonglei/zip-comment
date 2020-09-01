const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

const resolve = (subPath) => path.resolve(__dirname, subPath);

module.exports = {
    mode: 'development',
    entry: './src/zip_comment.js',
    output: {
        filename: 'zip_comment.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'loadZipAsync',
        libraryTarget: 'umd',
        globalObject: 'this'
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: resolve('./dist'), to: resolve('./test') },
            ],
        }),
    ],
}