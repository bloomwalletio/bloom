import { OnboardingNetworkType } from '@contexts/onboarding'
import { MarketCurrency } from '@core/market'
import { IClientOptions, IProtocol } from '@core/network'
import { IBaseToken } from '@core/token'
import { AccountAddress, ParticipationEventId } from '@iota/sdk/out/types'
import { StrongholdVersion } from '@core/stronghold'
import { Nft } from '@core/nfts'
import { ProfileType } from '@core/profile'
import { ThirdPartyAppName } from '../enums'

export interface IThirdPartyPersistedNetwork {
    id: OnboardingNetworkType
    name: string
    coinType: number
    protocol: IProtocol
    baseToken: IBaseToken
}

export interface IThirdPartyPersistedSettings {
    marketCurrency?: MarketCurrency
    lockScreenTimeoutInMinutes?: number
    strongholdPasswordTimeoutInMinutes?: number
    maxMediaSizeInMegaBytes?: number
    maxMediaDownloadTimeInSeconds?: number
    hideNetworkStatistics: boolean
}

export interface IThirdPartyPersistedAccountData {
    name: string
    color: string
    hidden: boolean
    shouldRevote: boolean
    removedProposalIds?: ParticipationEventId[]
    knownAddresses: AccountAddress[]
}

export interface IThirdPartyPersistedProfile {
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

export interface IThirdPartyProfileStoreItem {
    profile: IThirdPartyPersistedProfile
    needsChrysalisToStardustDbMigration: boolean
    alreadyImported: boolean
    appName: ThirdPartyAppName
}
