import { NetworkName } from '@core/network'
import { IFeatureFlag, IOnboardingFeaturesForNetwork } from '../interfaces'

export type OnboardingFeatures = {
    [key in NetworkName]?: IOnboardingFeaturesForNetwork & IFeatureFlag
} & { strongholdVersionCheck: IFeatureFlag } & IFeatureFlag
