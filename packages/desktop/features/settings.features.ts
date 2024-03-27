import { ISettingsFeatures } from '@lib/features/interfaces'

const settingsFeatures: ISettingsFeatures = {
    enabled: true,
    general: {
        enabled: true,
        theme: {
            enabled: true,
        },
        language: {
            enabled: true,
        },
        notifications: {
            enabled: false,
        },
        crashReporting: {
            enabled: false,
        },
        deepLinks: {
            enabled: false,
        },
    },
    profile: {
        enabled: true,
        changeProfileName: {
            enabled: true,
        },
        currency: {
            enabled: true,
        },
        deleteProfile: {
            enabled: true,
        },
    },
    security: {
        enabled: true,
        autoLogout: {
            enabled: true,
        },
        strongholdTimeout: {
            enabled: true,
        },
        changePincode: {
            enabled: true,
        },
        changePassword: {
            enabled: true,
        },
        exportStronghold: {
            enabled: true,
        },
    },
    collectibles: {
        enabled: true,
        maxMediaSize: {
            enabled: true,
        },
        maxMediaDownloadTime: {
            enabled: true,
        },
        refreshNftMedia: {
            enabled: true,
        },
    },
    network: {
        enabled: true,
        networkInformation: {
            enabled: true,
        },
        configureNodeList: {
            enabled: true,
        },
        localProofOfWork: {
            enabled: true,
        },
    },
    advanced: {
        enabled: true,
        walletFinder: {
            enabled: true,
        },
        hiddenAccounts: {
            enabled: true,
        },
        toggleFeatures: {
            enabled: true,
        },
    },
    help: {
        enabled: true,
        diagnostics: {
            enabled: true,
        },
        errorLog: {
            enabled: true,
        },
        documentation: {
            enabled: true,
        },
        faq: {
            enabled: false,
        },
        discord: {
            enabled: true,
        },
        reportAnIssue: {
            enabled: true,
        },
    },
}

export default settingsFeatures
