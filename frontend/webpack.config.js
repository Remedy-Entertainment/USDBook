const path = require('path');

const CopyPlugin = require('copy-webpack-plugin');


module.exports = {
    mode: 'production',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, '..', 'theme', 'js'),
        filename: 'usdz-viewer.js',
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                // Service Worker to serve the HTTP(S) Headers required for WASM resources:
                {
                    from: './node_modules/coi-serviceworker/coi-serviceworker.min.js',
                    to: '../..',
                },
                // Copy WASM resources to a distributable folder:
                {
                    from: './node_modules/three-usdz-loader/external',
                    to: '../../src/wasm',
                },
            ],
        }),
    ],
};
