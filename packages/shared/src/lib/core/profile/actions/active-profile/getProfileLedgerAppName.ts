import { IOnboardingProfile, onboardingProfile } from '@contexts/onboarding'
import { LedgerAppName } from '@core/ledger'
import { get } from 'svelte/store'
import { SupportedStardustNetworkId } from '@core/network'
import { IProfile } from '@core/profile/interfaces'
import { activeProfile } from '@core/profile/stores'

export function getProfileLedgerAppName(
    profile: IProfile | Partial<IOnboardingProfile> = get(onboardingProfile) ?? get(activeProfile)
): LedgerAppName {
    const networkId = profile?.network?.id

    switch (networkId) {
        case SupportedStardustNetworkId.Iota:
        case SupportedStardustNetworkId.IotaTestnet:
            return LedgerAppName.Iota
        case SupportedStardustNetworkId.Shimmer:
        case SupportedStardustNetworkId.Testnet:
            return LedgerAppName.Shimmer
        default:
            throw new Error(`Unsupported network id: ${networkId}`)
    }
}
