import { OnboardingNetworkType } from '@contexts/onboarding/enums/onboarding-network-type.enum'
import { SupportedNetworkId } from '../enums'
import { NetworkId } from '../types'

export function getNetworkIdFromOnboardingNetworkType(networkType: OnboardingNetworkType): NetworkId | undefined {
    const nameMap: { [key in OnboardingNetworkType]?: NetworkId } = {
        [OnboardingNetworkType.Shimmer]: SupportedNetworkId.Shimmer,
        [OnboardingNetworkType.Testnet]: SupportedNetworkId.Testnet,
    }

    return nameMap[networkType]
}
