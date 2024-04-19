import { IPersistedAccountData } from '@core/account/interfaces'
import { IClientOptions, IEvmNetwork, IStardustNetworkMetadata } from '@core/network/interfaces'
import { Nft } from '@core/nfts/interfaces'
import { StrongholdVersion } from '@core/stronghold/enums'
import { ProfileType } from '../enums'
import { IProfileSettings } from './profile-settings.interface'
import { IContactMap, INetworkContactAddressMap } from '@core/contact/interfaces'
import { TrackedTokens } from '@core/token/types'
import { DashboardRoute } from '@core/router'
import { AppStage } from '@core/app'

export interface IPersistedProfile {
    id: string
    versionTrack: AppStage
    version: number
    name: string
    type: ProfileType
    network: IStardustNetworkMetadata
    evmNetworks: IEvmNetwork[]
    lastStrongholdBackupTime?: Date
    settings: IProfileSettings
    accountPersistedData: {
        [accountId: string]: IPersistedAccountData
    }
    contacts: IContactMap
    networkContactAddresses: INetworkContactAddressMap
    features: { [key in DashboardRoute]: boolean }
    hasVisitedDashboard?: boolean
    lastUsedAccountIndex?: number
    clientOptions: IClientOptions
    forceAssetRefresh: boolean
    strongholdVersion: StrongholdVersion
    trackedTokens: TrackedTokens
    trackedNfts: TrackedTokens
    pfp?: Nft
    color?: string
    pincodeLocation?: string
}
