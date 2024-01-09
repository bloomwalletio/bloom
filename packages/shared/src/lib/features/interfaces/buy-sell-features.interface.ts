import { IFeatureFlag } from './feature-flag.interface'

export interface IBuySellFeatures extends IFeatureFlag {
    buy: IFeatureFlag
    sell: IFeatureFlag
}
