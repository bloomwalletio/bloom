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
    newDashboard: {
        enabled: false,
        accountSummaryMenu: {
            enabled: false,
        },
    },
    walletConnect: {
        enabled: false,
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
    },
}

export default walletFeatures
