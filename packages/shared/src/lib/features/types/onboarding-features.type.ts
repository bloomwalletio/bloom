import { OnboardingNetworkType } from '@contexts/onboarding/enums'
import { IFeatureFlag, IOnboardingFeaturesForNetwork } from '../interfaces'

export type OnboardingFeatures = IFeatureFlag & {
    [key in OnboardingNetworkType]: IOnboardingFeaturesForNetwork & IFeatureFlag
} & {
    addEvmNetworks: IFeatureFlag
    importFromThirdParty: IFeatureFlag
    strongholdVersionCheck: IFeatureFlag
    confetti: IFeatureFlag
}
