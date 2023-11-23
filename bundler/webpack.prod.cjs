const { merge } = require('webpack-merge');
const commonConfiguration = require('./webpack.common.cjs');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanPlugin } = require('webpack');


module.exports = merge(
    commonConfiguration,
    {
        mode: 'production',
        output: {
            filename: 'js/[name].[contenthash].bundle.js',
            chunkFilename: 'js/[name].[contenthash].chunk.js',
        },
        optimization: {
            minimize: true,
            minimizer: [new TerserPlugin()],
            splitChunks: {
                chunks: 'all',
            },
        },
        plugins: [
            new CleanPlugin()
        ]

    }
);