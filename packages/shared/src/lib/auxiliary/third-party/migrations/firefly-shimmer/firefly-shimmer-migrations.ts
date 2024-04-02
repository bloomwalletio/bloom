import {
    DEFAULT_CHAIN_CONFIGURATIONS,
    IIscpChainMetadata,
    getDefaultPersistedNetwork,
    getNetworkIdFromOnboardingNetworkType,
} from '@core/network'
import { INode } from '@iota/sdk'
import { DEFAULT_MAX_NFT_DOWNLOADING_TIME_IN_SECONDS, DEFAULT_MAX_NFT_SIZE_IN_MEGABYTES } from '@core/nfts'
import { ProfileType } from '@core/profile/enums'
import { StrongholdVersion } from '@core/stronghold/enums'
import { DEFAULT_PERSISTED_PROFILE_OBJECT, DEFAULT_STRONGHOLD_PASSWORD_TIMEOUT_IN_MINUTES } from '@core/profile/constants'
import { OnboardingNetworkType } from '@contexts/onboarding'
import { IThirdPartyPersistedAccountData, IThirdPartyPersistedNetwork, IThirdPartyPersistedProfile } from '@auxiliary/third-party/interfaces'

export function fireflyShimmerProfileMigrationToV4(existingProfile: unknown): void {
    const newProfile = {}

    const keysToKeep = [
        'id',
        'name',
        'type',
        'networkProtocol',
        'networkType',
        'lastStrongholdBackupTime',
        'settings',
        'accountMetadata',
        'isDeveloperProfile',
        'hasVisitedDashboard',
        'lastUsedAccountIndex',
        'clientOptions',
    ]

    keysToKeep.forEach((key) => {
        const existingValue = existingProfile?.[key]
        newProfile[key] = existingValue
    })
    existingProfile = newProfile
}

export function fireflyShimmerProfileMigrationToV5(existingProfile: unknown): void {
    interface IOldPersistedProfile {
        settings: {
            currency: unknown
        }
    }

    const oldProfile = existingProfile as IOldPersistedProfile
    delete oldProfile?.settings?.currency

    const newProfile = oldProfile as unknown as IThirdPartyPersistedProfile
    newProfile.settings.marketCurrency = DEFAULT_PERSISTED_PROFILE_OBJECT.settings?.marketCurrency
}

export function fireflyShimmerProfileMigrationToV6(existingProfile: unknown): void {
    existingProfile.forceAssetRefresh = true
}

export function fireflyShimmerProfileMigrationToV7(existingProfile: unknown): void {
    const newProfile = {}

    const keysToKeep = [
        'id',
        'name',
        'type',
        'networkProtocol',
        'networkType',
        'lastStrongholdBackupTime',
        'settings',
        'accountMetadata',
        'isDeveloperProfile',
        'hasVisitedDashboard',
        'lastUsedAccountIndex',
        'clientOptions',
        'forceAssetRefresh',
    ]

    keysToKeep.forEach((key) => {
        const existingValue = existingProfile?.[key]
        newProfile[key] = existingValue
    })

    existingProfile = newProfile
}

export function fireflyShimmerProfileMigrationToV8(existingProfile: unknown): void {
    existingProfile.settings = { ...existingProfile.settings, maxMediaSizeInMegaBytes: 50 }
}

export function fireflyShimmerProfileMigrationToV9(existingProfile: unknown): void {
    function migrateNode(node: INode): INode {
        if (node) {
            return {
                url: node.url as string,
                auth: {
                    jwt: node.auth?.jwt,
                    // @ts-expect-error interfaces don't mismatch
                    basicAuthNamePwd: [node.auth?.username, node.auth?.password],
                },
            }
        } else {
            return undefined
        }
    }

    existingProfile.clientOptions.nodes = existingProfile?.clientOptions?.nodes?.map(migrateNode)
    existingProfile.clientOptions.primaryNode = migrateNode(existingProfile?.clientOptions?.primaryNode)
}

export function fireflyShimmerProfileMigrationToV10(existingProfile: unknown): void {
    existingProfile.settings = {
        ...existingProfile.settings,
        strongholdPasswordTimeoutInMinutes: DEFAULT_STRONGHOLD_PASSWORD_TIMEOUT_IN_MINUTES,
        maxMediaSizeInMegaBytes: DEFAULT_MAX_NFT_SIZE_IN_MEGABYTES,
    }
}

export function getNetworkIdFromOldNetworkType(networkType: 'mainnet' | 'devnet' | 'private-net'): OnboardingNetworkType {
    // At this point you have not been able to create IOTA profiles so we can assume that the network protocol was Shimmer
    switch (networkType) {
        case 'mainnet':
            return OnboardingNetworkType.Shimmer
        case 'devnet':
            return OnboardingNetworkType.Testnet
        case 'private-net':
            return OnboardingNetworkType.Custom
        default:
            return
    }
}

const COIN_TYPE = {
    [OnboardingNetworkType.Shimmer]: 4219,
}

export function fireflyShimmerProfileMigrationToV11(
    existingProfile: unknown & { networkType: 'mainnet' | 'devnet' | 'private-net' }
): void {
    if (!existingProfile?.network) {
        let network: IThirdPartyPersistedNetwork
        const onboardingNetworkType = getNetworkIdFromOldNetworkType(existingProfile?.networkType)
        if (onboardingNetworkType === OnboardingNetworkType.Shimmer || onboardingNetworkType === OnboardingNetworkType.Testnet) {
            network = getDefaultPersistedNetwork(getNetworkIdFromOnboardingNetworkType(onboardingNetworkType)) as IThirdPartyPersistedNetwork
        } else {
            network.id = OnboardingNetworkType.Custom
        }
        network.coinType = COIN_TYPE[OnboardingNetworkType.Shimmer]
        existingProfile.network = structuredClone(network)
    }

    existingProfile.settings = {
        ...existingProfile.settings,
        maxMediaDownloadTimeInSeconds: DEFAULT_MAX_NFT_DOWNLOADING_TIME_IN_SECONDS,
    }

    existingProfile.forceAssetRefresh = true

    const newProfile = {}
    const keysToKeep = [
        'id',
        'name',
        'type',
        'lastStrongholdBackupTime',
        'settings',
        'accountMetadata',
        'isDeveloperProfile',
        'hasVisitedDashboard',
        'lastUsedAccountIndex',
        'clientOptions',
        'forceAssetRefresh',
        'strongholdVersion',
        'network',
    ]
    keysToKeep.forEach((key) => {
        const existingValue = existingProfile?.[key]
        newProfile[key] = existingValue
    })

    existingProfile = newProfile
}

export function fireflyShimmerProfileMigrationToV12(existingProfile: unknown): void {
    existingProfile.strongholdVersion = StrongholdVersion.V2
}

export function fireflyShimmerProfileMigrationToV13(
    existingProfile: { accountMetadata: (IThirdPartyPersistedAccountData & { index: number })[] }
): void {
    const newProfile = {}
    const keysToKeep = [
        'id',
        'name',
        'type',
        'lastStrongholdBackupTime',
        'settings',
        'accountPersistedData',
        'isDeveloperProfile',
        'hasVisitedDashboard',
        'lastUsedAccountIndex',
        'clientOptions',
        'forceAssetRefresh',
        'strongholdVersion',
        'network',
    ]
    const accountPersistedData = {}
    existingProfile.accountMetadata?.forEach((metadata) => {
        const { index, ...rest } = metadata
        accountPersistedData[index] = { ...rest }
    })
    existingProfile.accountPersistedData = accountPersistedData
    keysToKeep.forEach((key) => {
        const existingValue = existingProfile?.[key]
        newProfile[key] = existingValue
    })

    existingProfile = newProfile

    if (existingProfile.network) {
        interface IOldPersistedNetwork {
            chainConfigurations: unknown
        }

        const oldNetwork = existingProfile.network as unknown as IOldPersistedNetwork
        delete oldNetwork.chainConfigurations

        const newNetwork = oldNetwork as unknown as IThirdPartyPersistedNetwork
        const maybeDefaultChainConfig = DEFAULT_CHAIN_CONFIGURATIONS[getNetworkIdFromOnboardingNetworkType(existingProfile.network.id)]

        const defaultChainConfig: IIscpChainMetadata[] = maybeDefaultChainConfig ? [maybeDefaultChainConfig] : []

        newNetwork.chains = defaultChainConfig
        existingProfile.network = newNetwork
    }

}

export function fireflyShimmerProfileMigrationToV14(existingProfile: unknown): void {
    const isLedgerProfile = existingProfile?.type === ProfileType.Ledger
    if (isLedgerProfile) {
        delete existingProfile.strongholdVersion
    }
}
