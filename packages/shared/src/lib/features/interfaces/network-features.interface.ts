import { IFeatureFlag } from './feature-flag.interface'

export interface INetworkFeatures extends IFeatureFlag {
    config: IFeatureFlag & {
        manageNetworks: IFeatureFlag & {
            customChain: IFeatureFlag
        }
        removeNetwork: IFeatureFlag
    }
}
