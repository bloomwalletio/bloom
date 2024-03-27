import { OnboardingNetworkType } from '@contexts/onboarding/enums/onboarding-network-type.enum'
import { SupportedNetworkId } from '../enums'
import { NetworkId } from '../types'

export function getNetworkIdFromOnboardingNetworkType(networkType: OnboardingNetworkType): NetworkId | undefined {
    if (!networkType) {
        return undefined
    }

    const nameMap: { [key in OnboardingNetworkType]?: SupportedNetworkId } = {
        [OnboardingNetworkType.Iota]: SupportedNetworkId.Iota,
        [OnboardingNetworkType.Shimmer]: SupportedNetworkId.Shimmer,
        [OnboardingNetworkType.Testnet]: SupportedNetworkId.Testnet,
    }

    return nameMap[networkType]
}
