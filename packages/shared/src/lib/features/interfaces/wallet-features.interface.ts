import { IFeatureFlag } from './feature-flag.interface'

export interface IWalletFeatures extends IFeatureFlag {
    accountSummary: IFeatureFlag
    sendAndReceive: IFeatureFlag & {
        nft: IFeatureFlag
    }
    newDashboard: IFeatureFlag & {
        accountSummaryMenu: IFeatureFlag
    }
    walletConnect: IFeatureFlag
    assets: IFeatureFlag & {
        burnToken: IFeatureFlag
        unwrapToken: IFeatureFlag
    }
    activityHistory: IFeatureFlag & {
        sync: IFeatureFlag
        search: IFeatureFlag
    }
}
