import { IFeatureFlag } from './feature-flag.interface'

export interface ICollectiblesFeatures extends IFeatureFlag {
    useCaching: IFeatureFlag
    erc721: IFeatureFlag
    collections: IFeatureFlag
}
