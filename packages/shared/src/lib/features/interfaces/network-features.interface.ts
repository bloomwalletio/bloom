import { IFeatureFlag } from './feature-flag.interface'

export interface INetworkFeatures extends IFeatureFlag {
    config: IFeatureFlag & {
        addChain: IFeatureFlag & {
            customChain: IFeatureFlag
        }
        removeNetwork: IFeatureFlag
    }
}
