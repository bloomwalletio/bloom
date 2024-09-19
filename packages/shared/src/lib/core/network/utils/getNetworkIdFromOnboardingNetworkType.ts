import { OnboardingNetworkType } from '@contexts/onboarding/enums/onboarding-network-type.enum'
import { SupportedStardustNetworkId } from '../constants'
import { StardustNetworkId } from '../types'

export function getNetworkIdFromOnboardingNetworkType(
    networkType: OnboardingNetworkType
): StardustNetworkId | undefined {
    if (!networkType) {
        return undefined
    }

    const nameMap: { [key in OnboardingNetworkType]?: StardustNetworkId } = {
        [OnboardingNetworkType.Iota]: SupportedStardustNetworkId.Iota,
        [OnboardingNetworkType.IotaTestnet]: SupportedStardustNetworkId.IotaTestnet,
        [OnboardingNetworkType.Shimmer]: SupportedStardustNetworkId.Shimmer,
        [OnboardingNetworkType.Testnet]: SupportedStardustNetworkId.Testnet,
    }

    return nameMap[networkType]
}
