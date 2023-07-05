import { IFeatureFlag } from './feature-flag.interface'

export interface IWalletFeatures extends IFeatureFlag {
    accountSummary: IFeatureFlag
    sendAndReceive: IFeatureFlag & {
        nft: IFeatureFlag
    }
    walletConnect: IFeatureFlag
    contacts: IFeatureFlag & {
        sendTo: IFeatureFlag
        addContact: IFeatureFlag
        editContact: IFeatureFlag
        removeContact: IFeatureFlag
        addNetworkAddress: IFeatureFlag
        editNetworkAddresses: IFeatureFlag
        removeNetwork: IFeatureFlag
    }
    assets: IFeatureFlag & {
        burnAsset: IFeatureFlag
    }
    activityHistory: IFeatureFlag & {
        sync: IFeatureFlag
        search: IFeatureFlag
    }
}
