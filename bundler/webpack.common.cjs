const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path');

module.exports = {
    entry: path.resolve(__dirname, '../src/index.js'),
    output: {
        filename: 'bundle.[contenthash].js',
        path: path.resolve(__dirname, '../dist'),
        clean: true, // Clean the output directory before emit.
    },
    module: {
        rules: [
            // HTML
            {
                test: /\.html$/,
                use: ['html-loader']
            },
            // JavaScript
            
            // CSS and SASS
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    MiniCSSExtractPlugin.loader,
                    'css-loader', // Add sass-loader to handle SASS files
                ]
            },
            // Images
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                use:
                [
                    {
                        loader: 'file-loader',
                        options:
                        {
                            outputPath: 'assets/images/'
                        }
                    }
                ]
            },
            // Fonts
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                use:
                [
                    {
                        loader: 'file-loader',
                        options:
                        {
                            outputPath: 'assets/fonts/'
                        }
                    }
                ]
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../src/index.html'),
            minify: true
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: path.resolve(__dirname, '../static') }
            ]
        }),
        new MiniCSSExtractPlugin(),
    ],
};
