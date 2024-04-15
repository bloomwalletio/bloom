import { OnboardingNetworkType } from '@contexts/onboarding/enums/onboarding-network-type.enum'
import { SupportedNetworkId } from '../constants'
import { StardustNetworkId } from '../types'

export function getOnboardingNetworkTypeFromNetworkId(networkId: StardustNetworkId | undefined): OnboardingNetworkType {
    const nameMap: { [id in StardustNetworkId]?: OnboardingNetworkType } = {
        [SupportedNetworkId.Iota]: OnboardingNetworkType.Iota,
        [SupportedNetworkId.Shimmer]: OnboardingNetworkType.Shimmer,
        [SupportedNetworkId.Testnet]: OnboardingNetworkType.Testnet,
    }

    if (networkId) {
        return nameMap[networkId] ?? OnboardingNetworkType.Custom
    } else {
        return OnboardingNetworkType.Custom
    }
}
