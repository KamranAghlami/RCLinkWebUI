const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        'index': './src/index.ts',
        'service_worker': './src/service_worker.ts'
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
                include: [
                    path.resolve(__dirname, 'src'),
                    path.resolve(__dirname, 'node_modules/normalize.css'),
                    path.resolve(__dirname, 'node_modules/@xterm/xterm/css/xterm.css')
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'public/index.html',
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'public', to: '', globOptions: { ignore: ['**/index.html', '**/.gitkeep'] } }
            ],
        }),
    ],
    devServer: {
        static: path.join(__dirname, 'dist'),
    }
};
