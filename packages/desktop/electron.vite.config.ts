import path, { resolve } from 'path'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig, externalizeDepsPlugin, loadEnv } from 'electron-vite'
import postcss from './postcss.config'
import features from './features/features'

export default defineConfig(({ mode }) => {
    // Load env file based on `mode` in the current working directory.
    // By default, only env variables prefixed with `MAIN_VITE_`,
    // `PRELOAD_VITE_` and `RENDERER_VITE_` are loaded,
    // unless the third parameter `prefixes` is changed.
    const env = loadEnv(mode)

    type Mode = 'none' | 'development' | 'production'

    const envMode: Mode = (env.NODE_ENV as Mode) || 'development'
    // const prod = envMode === 'production'
    // const hardcodeNodeEnv = typeof env.HARDCODE_NODE_ENV !== 'undefined'
    const stage = env.STAGE || 'alpha'
    /**
     * If stage = 'prod' -> 'Bloom'
     * If stage = 'alpha' -> 'Bloom Alpha'
     */
    const appName = stage === 'prod' ? 'Bloom' : `Bloom - ${stage.replace(/^\w/, (c) => c.toUpperCase())}`
    const appId = stage === 'prod' ? 'org.bloom-labs.bloom' : `org.bloom-labs.bloom.${stage}`

    const appProtocol = stage === 'prod' ? 'bloom' : `bloom-${stage.toLowerCase()}`

    const alias = {
        svelte: path.resolve('../../node_modules', 'svelte/src/runtime'),
        '@auxiliary': path.resolve(__dirname, '../shared/src/lib/auxiliary'),
        '@contexts': path.resolve(__dirname, '../shared/src/lib/contexts'),
        '@components': path.resolve(__dirname, './components/'),
        '@core': path.resolve(__dirname, '../shared/src/lib/core'),
        '@features': path.resolve(__dirname, './features'),
        '@lib': path.resolve(__dirname, '../shared/src/lib'),
        '@desktop': path.resolve(__dirname, './lib'),
        '@ui': path.resolve(__dirname, '../shared/src/components/'),
        '@views': path.resolve(__dirname, './views/'),
    }

    const define = {
        'process.env.AMPLITUDE_API_KEY': JSON.stringify(process.env.AMPLITUDE_API_KEY),
        'process.env.APP_PROTOCOL': JSON.stringify(appProtocol),
        'process.env.PLATFORM': JSON.stringify(process.env.PLATFORM || 'desktop'),
        'process.env.STAGE': JSON.stringify(stage),
        'process.env.TRANSAK_API_KEY': JSON.stringify(process.env.TRANSAK_API_KEY),
        'process.env.WALLETCONNECT_PROJECT_ID': JSON.stringify(process.env.WALLETCONNECT_PROJECT_ID),
        'process.platform': JSON.stringify(process.platform),
        APP_ID: JSON.stringify(appId),
        APP_NAME: JSON.stringify(appName),
        features: JSON.stringify(features),
        PRELOAD_SCRIPT: JSON.stringify(false),
    }

    return {
        main: {
            build: {
                rollupOptions: {
                    input: {
                        main: resolve(__dirname, 'lib/electron/processes/main.process.ts'),
                        ledger: resolve(__dirname, 'lib/electron/processes/ledger.process.ts'),
                    },
                    output: {
                        format: 'es',
                    },
                },
            },
            resolve: {
                alias,
            },
            plugins: [externalizeDepsPlugin({ exclude: ['electron-updater', 'node-machine-id'] })],
            define,
        },
        preload: {
            build: {
                rollupOptions: {
                    input: {
                        main: resolve(__dirname, 'lib/electron/preloads/preload.ts'),
                        about: resolve(__dirname, 'lib/electron/preloads/about.preload.ts'),
                        error: resolve(__dirname, 'lib/electron/preloads/error.preload.ts'),
                        transak: resolve(__dirname, 'lib/electron/preloads/transak.preload.ts'),
                    },
                }
            },
            resolve: {
                alias,
            },
            plugins: [externalizeDepsPlugin()],
            define,
        },
        renderer: {
            root: '.',
            build: {
                rollupOptions: {
                    input: {
                        main: 'public/index.html',
                    },
                }
            },
            resolve: {
                alias,
            },
            define,
            plugins: [svelte()],
            css: {
                postcss,
            },
        },
    }
})
