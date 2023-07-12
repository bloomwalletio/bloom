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
    walletConnect: {
        enabled: true,
    },
    contacts: {
        enabled: false,
        sendTo: {
            enabled: true,
        },
        addContact: {
            enabled: true,
        },
        editContact: {
            enabled: true,
        },
        removeContact: {
            enabled: true,
        },
        addNetworkAddress: {
            enabled: true,
        },
        editNetworkAddresses: {
            enabled: true,
        },
        removeNetwork: {
            enabled: true,
        },
    },
    assets: {
        enabled: true,
        burnAsset: {
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
