import { IWalletFeatures } from '@lib/features/interfaces'

const walletFeatures: IWalletFeatures = {
    enabled: true,
    accountSummary: {
        enabled: true,
    },
    sendAndReceive: {
        enabled: true,
        nft: {
            enabled: true,
        },
    },
    assets: {
        enabled: true,
        burnToken: {
            enabled: true,
        },
        unwrapToken: {
            enabled: true,
        },
    },
    activityHistory: {
        enabled: true,
        sync: {
            enabled: true,
        },
        search: {
            enabled: true,
        },
        exportCsv: {
            enabled: false,
        },
    },
    portfolio: {
        filter: {
            enabled: false,
        },
    },
    smartContracts: {
        infuraRegistry: {
            enabled: false,
        },
    },
}

export default walletFeatures
