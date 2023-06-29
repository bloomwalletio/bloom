import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import { DefinePlugin, NormalModuleReplacementPlugin, ProvidePlugin } from 'webpack'
import path from 'path'
import sveltePreprocess from 'svelte-preprocess'
import features from './features/features'
import { Configuration as WebpackConfiguration } from 'webpack'
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server'
import assert from 'assert'
import dotenv from 'dotenv'

dotenv.config() // used to read env vars from an .env file

type Mode = 'none' | 'development' | 'production'
interface Configuration extends WebpackConfiguration {
    devServer?: WebpackDevServerConfiguration
}

const mode: Mode = (process.env.NODE_ENV as Mode) || 'development'
const prod = mode === 'production'
const hardcodeNodeEnv = typeof process.env.HARDCODE_NODE_ENV !== 'undefined'
const stage = process.env.STAGE || 'alpha'
/**
 * If stage = 'prod' -> 'Bloom'
 * If stage = 'alpha' -> 'Bloom Alpha'
 */
const appName = stage === 'prod' ? 'Bloom' : `Bloom - ${stage.replace(/^\w/, (c) => c.toUpperCase())}`
const appId = stage === 'prod' ? 'org.bloom-labs.bloom' : `org.bloom-labs.bloom.${stage}`

const appProtocol = stage === 'prod' ? 'bloom' : `bloom-${stage.toLowerCase()}`

// / ------------------------ Resolve ------------------------

const fallback: { [index: string]: string | false | string[] } = {
    path: false,
    fs: false,
    crypto: false,
    // The Ethereum libraries require zlib and the buffer polyfill
    zlib: false,
    buffer: require.resolve('buffer'),
    // The Amplitude SDK requires http, https and url polyfills
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    url: require.resolve('url/'),
}

const resolve = {
    alias: {
        svelte: path.dirname(require.resolve('svelte/package.json')),
        '@auxiliary': path.resolve(__dirname, '../shared/src/lib/auxiliary'),
        '@contexts': path.resolve(__dirname, '../shared/src/lib/contexts'),
        '@components': path.resolve(__dirname, './components/'),
        '@core': path.resolve(__dirname, '../shared/src/lib/core'),
        '@features': path.resolve(__dirname, './features'),
        '@lib': path.resolve(__dirname, '../shared/src/lib'),
        '@desktop': path.resolve(__dirname, './lib'),
        '@ui': path.resolve(__dirname, '../shared/src/components/'),
        '@views': path.resolve(__dirname, './views/'),
    },
    conditionNames: ['svelte', 'module', 'import', 'require', 'node', 'default'],
    extensions: ['.mjs', '.js', '.ts', '.svelte'],
    mainFields: ['svelte', 'browser', 'module', 'main'],
    fallback,
}

// / ------------------------ Output ------------------------

const output = {
    publicPath: prod ? '../' : '/',
    path: path.join(__dirname, '/public'),
    filename: '[name].js',
    chunkFilename: 'build/[name].[id].js',
}

// / ------------------------ Module rules ------------------------

const mainRules = [
    {
        test: /\.ts$/,
        loader: 'esbuild-loader',
    },
    {
        test: /\.node$/,
        loader: 'node-loader',
        options: {
            name: 'build/[name].[ext]',
        },
    },
]

const rendererRules = [
    {
        test: /\.ts$/,
        loader: 'esbuild-loader',
    },
    {
        test: /\.svelte$/,
        use: {
            loader: 'svelte-loader',
            options: {
                compilerOptions: {
                    dev: !prod,
                },
                emitCss: prod,
                hotReload: !prod,
                preprocess: sveltePreprocess({
                    sourceMap: false,
                    postcss: true,
                }),
            },
        },
    },
    {
        test: /\.(woff|woff2)?$/,
        type: 'asset/resource',
        generator: {
            filename: ({ filename }): { filename: string } => filename.replace('../shared/', ''),
        },
    },
    {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
    },
    {
        // required to prevent errors from Svelte on Webpack 5+
        test: /node_modules\/svelte\/.*\.mjs$/,
        resolve: {
            fullySpecified: false,
        },
    },
]

// / ------------------------ Plugins ------------------------

const mainPlugins = [
    new DefinePlugin({
        PLATFORM_LINUX: JSON.stringify(process.platform === 'linux'),
        PRELOAD_SCRIPT: JSON.stringify(false),
        APP_NAME: JSON.stringify(appName),
        APP_ID: JSON.stringify(appId),
        'process.env.STAGE': JSON.stringify(stage),
        'process.env.APP_PROTOCOL': JSON.stringify(appProtocol),
        'process.env.AMPLITUDE_API_KEY': JSON.stringify(process.env.AMPLITUDE_API_KEY),
    }),
]

const rendererPlugins = [
    new CopyPlugin({
        patterns: [
            {
                from: '../shared/assets/**/*',
                // we ignore the fonts since the `asset/resource` handles them
                filter: prod ? (asset) => !asset.includes('fonts') : undefined,
                to({ context, absoluteFilename }) {
                    assert(typeof absoluteFilename === 'string')
                    return path.relative(context, absoluteFilename).replace(/..[\\/]shared[\\/]/g, '')
                },
            },
            {
                from: '../shared/src/locales/*',
                to() {
                    return 'locales/[name][ext]'
                },
            },
        ],
    }),
    new MiniCssExtractPlugin({
        filename: '[name].css',
    }),
    new DefinePlugin({
        'process.env.PLATFORM': JSON.stringify(process.env.PLATFORM || 'desktop'),
        'process.env.STAGE': JSON.stringify(stage),
        features: JSON.stringify(features),
        PRELOAD_SCRIPT: JSON.stringify(false),
        'process.env.APP_PROTOCOL': JSON.stringify(appProtocol),
    }),
    // The ethereumjs libraries require the NormalModuleReplacementPlugin & the ProvidePlugin
    new NormalModuleReplacementPlugin(/node:/, (resource) => {
        resource.request = resource.request.replace(/^node:/, '')
    }),
    new ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
    }),
]

const preloadPlugins = [
    new DefinePlugin({
        PLATFORM_LINUX: JSON.stringify(process.platform === 'linux'),
        PRELOAD_SCRIPT: JSON.stringify(true),
        APP_NAME: JSON.stringify(appName),
        'process.env.STAGE': JSON.stringify(stage),
        'process.env.APP_PROTOCOL': JSON.stringify(appProtocol),
    }),
]

// / ------------------------ Webpack config ------------------------

const webpackConfig: Configuration[] = [
    {
        entry: {
            'build/index': ['./index.js'],
        },
        resolve,
        output,
        module: {
            rules: rendererRules,
        },
        mode,
        plugins: rendererPlugins,
        devtool: prod ? false : 'cheap-module-source-map',
        devServer: {
            hot: true,
            static: {
                directory: path.join(__dirname, 'public'),
                watch: {
                    ignored: path.resolve(__dirname, 'public/build/__storage__'),
                    usePolling: false,
                },
            },
            client: {
                overlay: {
                    errors: true,
                    warnings: false,
                },
            },
        },
    },
    {
        target: 'electron-main',
        entry: {
            'build/main': ['./electron/main.ts'],
            'build/lib/ledger': ['./electron/lib/ledger.ts'],
        },
        externals: {
            '@ledgerhq/hw-transport-node-hid': 'commonjs @ledgerhq/hw-transport-node-hid',
        },
        resolve,
        output,
        module: {
            rules: mainRules,
        },
        mode,
        plugins: mainPlugins,
        devtool: prod ? false : 'cheap-module-source-map',
        optimization: {
            nodeEnv: hardcodeNodeEnv ? mode : false,
            minimize: true,
        },
    },
    {
        target: 'electron-renderer',
        entry: {
            'build/preload': ['./electron/preload.ts'],
            'build/lib/aboutPreload': ['./electron/lib/aboutPreload.ts'],
            'build/lib/errorPreload': ['./electron/lib/errorPreload.ts'],
        },
        resolve,
        output,
        module: {
            rules: mainRules,
        },
        mode,
        plugins: preloadPlugins,
        devtool: prod ? false : 'cheap-module-source-map',
        optimization: {
            nodeEnv: hardcodeNodeEnv ? mode : false,
            minimize: true,
        },
    },
]

export default webpackConfig
