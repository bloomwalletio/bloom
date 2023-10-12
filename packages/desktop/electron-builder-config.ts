import type { Configuration } from 'electron-builder'
import path from 'path'
import { notarize } from '@electron/notarize'
import fs from 'fs'


const STAGE = process.env.STAGE || 'alpha'

const APP_NAME = getAppName()
const APP_ID = getAppId()
const APP_PROTOCOL = getAppProtocol()
const CHANNEL_NAME = getChannelName()

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

function getChannelName(): string {
    switch (STAGE) {
        case 'alpha':
            return 'alpha'
        case 'beta':
            return 'beta'
        default:
            return 'latest'
    }
}

function getIconPath(): string {
    const PATH = './public/assets/icons'
    const NAME = 'icon1024x1024'
    const EXTENSION = 'png'

    return `${PATH}/${STAGE}/${NAME}.${EXTENSION}`
}

async function notarizeMacos(appBundleId, appName): Promise<void> {
    console.log('Notarization - start')
    console.log('Notarization - appBundleId', appBundleId)
    console.log('Notarization - appName', appName)
    console.log('Notarization - process.platform', process.platform)
    console.log('Notarization - process.env.MACOS_SKIP_NOTARIZATION', process.env.MACOS_SKIP_NOTARIZATION)

    if (process.platform !== 'darwin' || process.env.MACOS_SKIP_NOTARIZATION === 'true') {
        return
    }

    const APPLE_ID = process.env.APPLE_ID
    const APPLE_ID_PASSWORD = process.env.APPLE_ID_PASSWORD

    if (!APPLE_ID) {
        console.log('Notarization - failed: Environment variable "BLOOM_APPLE_ID" is not defined')
        throw Error('Notarization failed: Environment variable "BLOOM_APPLE_ID" is not defined')
    }

    if (!APPLE_ID_PASSWORD) {
        console.log('Notarization - failed: Environment variable "BLOOM_APPLE_ID_PASSWORD" is not defined')
        throw Error('Notarization failed: Environment variable "BLOOM_APPLE_ID_PASSWORD" is not defined')
    }

    console.log('appPath:', path.resolve(__dirname, `./out/mac/${appName}.app`),)
    fs.readdir(path.resolve(__dirname, './out'), (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }


        console.log('Files at', path.resolve(__dirname, './out'), ':');
        files.forEach(file => {
            console.log(file);
        });
    });

    console.log('Notarization - start notarization')
    await notarize({
        tool: 'notarytool',
        appPath: path.resolve(__dirname, `./out/mac/${appName}.app`),
        appleId: APPLE_ID,
        appleIdPassword: APPLE_ID_PASSWORD,
        teamId: 'C2FJNDH9G2',
    })
    console.log('Notarization - finished')
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
            await notarizeMacos(APP_ID, APP_NAME)
        } catch (err) {
            console.log('Notarization - failed', err)
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
        asarUnpack: ['**/*.node'],
    },
    publish: {
        provider: 'github',
        repo: 'bloom',
        owner: 'bloomwalletio',
        vPrefixedTagName: false,
        // Following lines are required as long as we're closed source
        // private: true,
        // token: 'SOME_PRIVATE_GITHUB_ACCESS_TOKEN',
        channel: CHANNEL_NAME,
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

const build = () => {
    switch (STAGE) {
        case 'prod':
            return prodConfig
        default:
            return testConfig
    }
}

module.exports = build
