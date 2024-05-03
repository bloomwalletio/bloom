import { IFeatureFlag } from './feature-flag.interface'

export interface INetworkFeatures extends IFeatureFlag {
    config: IFeatureFlag & {
        addChain: IFeatureFlag
    }
    evmNetworks: IFeatureFlag
}
