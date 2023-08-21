import { OnboardingNetworkType } from '@contexts/onboarding/enums'
import { IFeatureFlag, IOnboardingFeaturesForNetwork } from '../interfaces'

export type OnboardingFeatures = {
    [key in OnboardingNetworkType]?: IOnboardingFeaturesForNetwork & IFeatureFlag
} & { strongholdVersionCheck: IFeatureFlag } & IFeatureFlag
