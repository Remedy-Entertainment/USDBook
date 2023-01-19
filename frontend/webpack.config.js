const path = require('path');

const CopyPlugin = require('copy-webpack-plugin');


module.exports = (env, argv) => {
    const buildSettings = {
        mode: argv.mode,
        target: 'web',
        entry: './src/index.ts',
        output: {
            path: path.resolve(__dirname, '..', 'theme', 'js'),
            filename: 'usdz-viewer.js',
            clean: true,
        },
        module: {
            rules: [
                {
                    test: /\.ts?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
            ],
        },
        resolve: {
            extensions: ['.js', '.ts'],
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

    // Include source maps in development mode:
    if (argv.mode === 'development') {
        buildSettings.devtool = 'source-map';
    }

    return buildSettings;
};
