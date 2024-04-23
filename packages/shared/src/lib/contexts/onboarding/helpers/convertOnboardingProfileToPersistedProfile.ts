import { IPersistedProfile } from '@core/profile/interfaces'
import { DEFAULT_PERSISTED_PROFILE_OBJECT } from '@core/profile/constants'

import { IOnboardingProfile } from '../interfaces'
import { DEFAULT_L1_EVM_NETWORK_CONFIGURATION, SupportedNetworkId } from '@core/network/constants'
import features from '@features/features'
import { IPureEvmNetworkConfiguration, IStardustNetwork } from '@core/network/interfaces'

export function convertOnboardingProfileToPersistedProfile(
    onboardingProfile?: Partial<IOnboardingProfile>
): IPersistedProfile {
    const { network } = onboardingProfile ?? {}
    if (!network) {
        throw new Error('Network is undefined!')
    }

    let evmNetworks: IPureEvmNetworkConfiguration[] | undefined
    if (features.network.evmNetworks.enabled) {
        const addMainnetEthereum = [SupportedNetworkId.Shimmer, SupportedNetworkId.Iota].includes(network.id)
        evmNetworks = [
            DEFAULT_L1_EVM_NETWORK_CONFIGURATION[
                addMainnetEthereum ? SupportedNetworkId.Ethereum : SupportedNetworkId.Sepolia
            ],
        ]
    }

    return {
        ...structuredClone(DEFAULT_PERSISTED_PROFILE_OBJECT),
        ...{ network: onboardingProfile?.network as IStardustNetwork },
        ...(evmNetworks && { evmNetworks }),
        ...(onboardingProfile?.name && { name: onboardingProfile.name }),
        ...(onboardingProfile?.id && { id: onboardingProfile.id }),
        ...(onboardingProfile?.type && { type: onboardingProfile.type }),
        ...(onboardingProfile?.lastStrongholdBackupTime && {
            lastStrongholdBackupTime: onboardingProfile.lastStrongholdBackupTime,
        }),
        ...(onboardingProfile?.settings && { settings: onboardingProfile.settings }),
        ...(onboardingProfile?.strongholdVersion && { strongholdVersion: onboardingProfile.strongholdVersion }),
        ...(onboardingProfile?.accountPersistedData && {
            accountPersistedData: onboardingProfile.accountPersistedData,
        }),
        ...(onboardingProfile?.hasVisitedDashboard && { hasVisitedDashboard: onboardingProfile.hasVisitedDashboard }),
        ...(onboardingProfile?.lastUsedAccountIndex && {
            lastUsedAccountIndex: onboardingProfile.lastUsedAccountIndex,
        }),
        ...(onboardingProfile?.clientOptions && { clientOptions: onboardingProfile.clientOptions }),
        ...(onboardingProfile?.color && { color: onboardingProfile.color }),
        ...(onboardingProfile?.version !== undefined && { version: onboardingProfile.version }),
    }
}
