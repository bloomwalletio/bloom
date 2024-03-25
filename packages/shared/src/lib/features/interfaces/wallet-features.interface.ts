import { IFeatureFlag } from './feature-flag.interface'

export interface IWalletFeatures extends IFeatureFlag {
    accountSummary: IFeatureFlag
    sendAndReceive: IFeatureFlag & {
        nft: IFeatureFlag
    }
    assets: IFeatureFlag & {
        burnToken: IFeatureFlag
        unwrapToken: IFeatureFlag
    }
    activityHistory: IFeatureFlag & {
        sync: IFeatureFlag
        search: IFeatureFlag
        exportCsv: IFeatureFlag
    }
    portfolio: {
        filter: IFeatureFlag
    }
    smartContracts: {
        infuraRegistry: IFeatureFlag
    }
}
