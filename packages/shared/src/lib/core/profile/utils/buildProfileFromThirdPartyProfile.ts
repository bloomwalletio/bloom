import { OnboardingNetworkType } from '@contexts/onboarding'
import { IPersistedAccountData } from '@core/account'
import { MarketCurrency } from '@core/market'
import { IClientOptions, IProtocol, NetworkNamespace } from '@core/network'
import { DEFAULT_MAX_NFT_DOWNLOADING_TIME_IN_SECONDS, DEFAULT_MAX_NFT_SIZE_IN_MEGABYTES, Nft } from '@core/nfts'
import { StrongholdVersion } from '@core/stronghold'
import { IBaseToken } from '@core/token'
import { AccountAddress, ParticipationEventId } from '@iota/sdk/out/types'
import { DEFAULT_STRONGHOLD_PASSWORD_TIMEOUT_IN_MINUTES, PROFILE_VERSION } from '../constants'
import { DEFAULT_LOCK_SCREEN_TIMEOUT_IN_MINUTES } from '../constants/default-lock-screen-timeout-in-minutes.constant'
import { ProfileType } from '../enums'
import { IPersistedProfile } from '../interfaces'

interface IThirdPartyPersistedNetwork {
    id: OnboardingNetworkType
    name: string
    coinType: number
    protocol: IProtocol
    baseToken: IBaseToken
}

interface IThirdPartyPersistedSettings {
    marketCurrency?: MarketCurrency
    lockScreenTimeoutInMinutes?: number
    strongholdPasswordTimeoutInMinutes?: number
    maxMediaSizeInMegaBytes?: number
    maxMediaDownloadTimeInSeconds?: number
    hideNetworkStatistics: boolean
}

interface IThirdPartyPersistedAccountData {
    name: string
    color: string
    hidden: boolean
    shouldRevote: boolean
    removedProposalIds?: ParticipationEventId[]
    knownAddresses: AccountAddress[]
}

interface IThirdPartyPersistedProfile {
    id: string
    name: string
    type: ProfileType
    network: IThirdPartyPersistedNetwork
    lastStrongholdBackupTime?: Date
    settings: IThirdPartyPersistedSettings
    accountPersistedData: {
        [accountId: string]: IThirdPartyPersistedAccountData
    }
    isDeveloperProfile: boolean
    hasVisitedDashboard?: boolean
    lastUsedAccountIndex?: number
    clientOptions: IClientOptions
    forceAssetRefresh: boolean
    strongholdVersion?: StrongholdVersion
    needsChrysalisToStardustDbMigration?: boolean
    pfp?: Nft
}

export function buildPersistedAccountDataFromThirdPartyPersistedAccountData(thirdPartyAccountData: {
    [accountId: string]: IThirdPartyPersistedAccountData
}): { [accountId: string]: IPersistedAccountData } {
    const persistedAccountData: { [accountId: string]: IPersistedAccountData } = {}
    for (const accountId in thirdPartyAccountData) {
        const thirdPartyAccountDataItem = thirdPartyAccountData[accountId]
        const persistedAccountDataItem: IPersistedAccountData = {
            name: thirdPartyAccountDataItem.name,
            color: thirdPartyAccountDataItem.color,
            hidden: thirdPartyAccountDataItem.hidden,
            shouldRevote: thirdPartyAccountDataItem.shouldRevote,
            removedProposalIds: thirdPartyAccountDataItem.removedProposalIds,
            evmAddresses: {},
            depositAddress: '', // TODO: Add deposit address during login
            otherAddresses: thirdPartyAccountDataItem.knownAddresses?.map((address) => address.address) ?? [],
        }
        persistedAccountData[accountId] = persistedAccountDataItem
    }
    return persistedAccountData
}

export function buildProfileFromThirdPartyProfile(
    thirdPartyProfile: IThirdPartyPersistedProfile
): IPersistedProfile | undefined {
    if (!thirdPartyProfile || thirdPartyProfile.needsChrysalisToStardustDbMigration) {
        return undefined
    }
    const persistedProfile: IPersistedProfile = {
        id: thirdPartyProfile.id,
        version: PROFILE_VERSION.prod,
        name: thirdPartyProfile.name,
        type: thirdPartyProfile.type,
        network: {
            id: `${NetworkNamespace.Stardust}:${thirdPartyProfile.network.protocol.networkName}`,
            name: thirdPartyProfile.network.name,
            namespace: NetworkNamespace.Stardust,
            networkName: thirdPartyProfile.network.protocol.networkName,
            coinType: thirdPartyProfile.network.coinType,
            protocol: thirdPartyProfile.network.protocol,
            baseToken: thirdPartyProfile.network.baseToken,
            chainConfigurations: [],
        },
        lastStrongholdBackupTime: thirdPartyProfile.lastStrongholdBackupTime ?? new Date(),
        settings: {
            marketCurrency: thirdPartyProfile.settings.marketCurrency ?? MarketCurrency.Usd,
            lockScreenTimeoutInMinutes:
                thirdPartyProfile.settings.lockScreenTimeoutInMinutes ?? DEFAULT_LOCK_SCREEN_TIMEOUT_IN_MINUTES,
            strongholdPasswordTimeoutInMinutes:
                thirdPartyProfile.settings.strongholdPasswordTimeoutInMinutes ??
                DEFAULT_STRONGHOLD_PASSWORD_TIMEOUT_IN_MINUTES,
            maxMediaSizeInMegaBytes:
                thirdPartyProfile.settings.maxMediaSizeInMegaBytes ?? DEFAULT_MAX_NFT_SIZE_IN_MEGABYTES,
            maxMediaDownloadTimeInSeconds:
                thirdPartyProfile.settings.maxMediaDownloadTimeInSeconds ?? DEFAULT_MAX_NFT_DOWNLOADING_TIME_IN_SECONDS,
            hideNetworkStatistics: thirdPartyProfile.settings.hideNetworkStatistics,
        },
        accountPersistedData: buildPersistedAccountDataFromThirdPartyPersistedAccountData(
            thirdPartyProfile.accountPersistedData
        ),
        contacts: {},
        networkContactAddresses: {},
        isDeveloperProfile: thirdPartyProfile.isDeveloperProfile,
        hasVisitedDashboard: thirdPartyProfile.hasVisitedDashboard,
        lastUsedAccountIndex: thirdPartyProfile.lastUsedAccountIndex,
        clientOptions: thirdPartyProfile.clientOptions,
        forceAssetRefresh: false,
        strongholdVersion: thirdPartyProfile.strongholdVersion ?? StrongholdVersion.V2,
        trackedNfts: {},
        trackedTokens: {},
    }

    return persistedProfile
}
