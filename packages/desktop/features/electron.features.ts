import { IElectronFeatures } from './interfaces'

const electronFeatures: IElectronFeatures = {
    developerTools: {
        enabled: true,
    },
    autoUpdate: {
        enabled: true,
        win32: {
            enabled: true,
        },
        linux: {
            enabled: true,
        },
        darwin: {
            enabled: true,
        },
    },
    importFromThirdParty: {
        enabled: true,
    },
}

export default electronFeatures
