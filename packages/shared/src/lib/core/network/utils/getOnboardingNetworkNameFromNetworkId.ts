import { OnboardingNetworkType, SupportedNetworkId } from '../enums'
import { NetworkId } from '../types'

export function getOnboardingNetworkNameFromNetworkId(networkId: NetworkId): OnboardingNetworkType {
    const nameMap: { [id: NetworkId]: OnboardingNetworkType } = {
        [SupportedNetworkId.Iota]: OnboardingNetworkType.Iota,
        [SupportedNetworkId.Shimmer]: OnboardingNetworkType.Shimmer,
        [SupportedNetworkId.Testnet]: OnboardingNetworkType.Testnet,
    }

    return nameMap[networkId] ?? OnboardingNetworkType.Custom
}
