import { OnboardingNetworkType, SupportedNetworkId } from '../enums'
import { NetworkId } from '../types'

export function getOnboardingNetworkNameFromNetworkId(networkId: NetworkId): OnboardingNetworkType {
    const nameMap: { [id in NetworkId]?: OnboardingNetworkType } = {
        [SupportedNetworkId.Shimmer]: OnboardingNetworkType.Shimmer,
        [SupportedNetworkId.Testnet]: OnboardingNetworkType.Testnet,
    }

    return nameMap[networkId] ?? OnboardingNetworkType.Custom
}
