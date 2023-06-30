import { IFeatureFlag } from './feature-flag.interface'

export interface IWalletFeatures extends IFeatureFlag {
    accountSummary: IFeatureFlag
    sendAndReceive: IFeatureFlag & {
        nft: IFeatureFlag
    }
    walletConnect: IFeatureFlag
    contactBook: IFeatureFlag
    assets: IFeatureFlag & {
        burnAsset: IFeatureFlag
    }
    activityHistory: IFeatureFlag & {
        sync: IFeatureFlag
        search: IFeatureFlag
    }
}
