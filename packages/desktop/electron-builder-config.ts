import type { Configuration } from 'electron-builder'
import path from 'path'
import { notarize } from '@electron/notarize'

const STAGE = process.env.STAGE || 'alpha'

const APP_NAME = getAppName()
const APP_ID = getAppId()
const APP_PROTOCOL = getAppProtocol()

/**
 * If stage = 'prod' -> 'Bloom'
 * If stage = 'alpha' -> 'Bloom Alpha'
 * @param {string} stage
 * @returns
 */
function getAppName(): string {
    return STAGE === 'prod' ? 'Bloom' : `Bloom - ${STAGE.replace(/^\w/, (c) => c.toUpperCase())}`
}

function getAppProtocol(): string {
    return STAGE === 'prod' ? 'bloom' : `bloom-${STAGE.toLowerCase()}`
}

function getAppId(): string {
    const defaultAppId = 'io.bloomwallet.bloom'
    if (STAGE === 'prod') {
        return defaultAppId
    }
    return `${defaultAppId}.${STAGE}`
}

function getIconPath(): string {
    const PATH = './public/build/icons'
    const NAME = 'icon'
    const platform = getPlatform()
    const extension = platform === 'win32' ? 'ico' : 'png'
    return `${PATH}/${STAGE}/${platform}/${NAME}.${extension}`
}

function getPlatform(): string {
    switch (process.platform) {
        case 'win32':
        case 'darwin':
            return process.platform
        default:
            return 'linux'
    }
}
async function notarizeMacos(appName: string): Promise<void> {
    if (process.platform !== 'darwin' || process.env.MACOS_SKIP_NOTARIZATION === 'true') {
        return
    }

    const APPLE_ID = process.env.BLOOM_APPLE_ID // Requires prefix of BLOOM otherwise electron builder tries to notarize the app using the env variables
    const APPLE_ID_PASSWORD = process.env.BLOOM_APPLE_ID_PASSWORD // Requires prefix of BLOOM otherwise electron builder tries to notarize the app using the env variables

    if (!APPLE_ID) {
        throw Error('Notarization failed: Environment variable "BLOOM_APPLE_ID" is not defined')
    }

    if (!APPLE_ID_PASSWORD) {
        throw Error('Notarization failed: Environment variable "BLOOM_APPLE_ID_PASSWORD" is not defined')
    }

    await notarize({
        tool: 'notarytool',
        appPath: path.resolve(__dirname, `./out/mac/${appName}.app`),
        appleId: APPLE_ID,
        appleIdPassword: APPLE_ID_PASSWORD,
        teamId: 'C2FJNDH9G2',
    })
}

const prodConfig: Configuration = {
    productName: APP_NAME,
    artifactName: 'bloom-desktop-${version}.${ext}',
    copyright: 'Bloom Labs Ltd',
    directories: { buildResources: './public', output: './out' },
    files: ['public/', 'package.json', '!node_modules/@iota/sdk/target/*'],
    appId: APP_ID,
    afterSign: async () => {
        // eslint-disable-next-line no-useless-catch
        try {
            await notarizeMacos(APP_NAME)
        } catch (err) {
            // This catch is necessary or the promise rejection is swallowed
            throw err
        }
    },
    asar: true,
    protocols: [{ name: 'Bloom URL Scheme', schemes: [APP_PROTOCOL] }],
    dmg: {
        iconSize: 120,
        title: '${productName}',
        background: 'public/assets/background/mac/background.png',
        sign: false,
        contents: [
            { x: 500, y: 250, type: 'link', path: '/Applications' },
            { x: 170, y: 250, type: 'file' },
        ],
    },
    nsis: {
        oneClick: true,
        deleteAppDataOnUninstall: false,
        perMachine: true,
        include: 'public/installer.nsh',
    },
    win: {
        icon: getIconPath(),
        publisherName: 'Bloom Labs Ltd',
        target: 'nsis',
        timeStampServer: 'http://timestamp.sectigo.com',
        rfc3161TimeStampServer: 'http://timestamp.sectigo.com',
        sign: process.env.SIGN === 'true' ? './customSign.js' : null,
        signExts: ['.dll'],
    },
    linux: {
        target: ['AppImage'],
        desktop: {
            Name: APP_NAME,
            Comment: 'Web3 wallet for the IOTA/Shimmer ecosystem',
            Categories: 'Office;Network;Finance',
        },
        icon: getIconPath(),
    },
    mac: {
        icon: getIconPath(),
        category: 'public.app-category.finance',
        target: ['dmg', 'zip'],
        entitlements: './entitlements.mac.plist',
        entitlementsInherit: './entitlements.mac.plist',
        hardenedRuntime: true,
        gatekeeperAssess: false,
        notarize: false, // Disable notarize in electron builder as we use @electron/notarize instead
        asarUnpack: ['**/*.node'],
        extendInfo: {
            NSCameraUsageDescription: 'Bloom requires access to your camera for Transak KYC verification',
        },
    },
    publish: {
        provider: 'github',
        repo: 'bloom',
        owner: 'bloomwalletio',
        vPrefixedTagName: false,
        channel: 'latest',
        publishAutoUpdate: true,
    },
}

const testConfig: Configuration = {
    ...prodConfig,
    nsis: {
        oneClick: false,
        allowToChangeInstallationDirectory: true,
        deleteAppDataOnUninstall: false,
        perMachine: true,
        include: 'public/installer.nsh',
    },
}

const build = (): Configuration => {
    switch (STAGE) {
        case 'prod':
            return prodConfig
        default:
            return testConfig
    }
}

module.exports = build
