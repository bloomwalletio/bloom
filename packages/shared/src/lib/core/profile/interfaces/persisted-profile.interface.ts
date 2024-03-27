import { IPersistedAccountData } from '@core/account/interfaces'
import { IClientOptions, IPersistedNetwork } from '@core/network/interfaces'
import { Nft } from '@core/nfts/interfaces'
import { StrongholdVersion } from '@core/stronghold/enums'
import { ProfileType } from '../enums'
import { IProfileSettings } from './profile-settings.interface'
import { IContactMap, INetworkContactAddressMap } from '@core/contact/interfaces'
import { TrackedTokens } from '@core/token/types'
import { DashboardRoute } from '@core/router'

export interface IPersistedProfile {
    id: string
    version: number
    name: string
    type: ProfileType
    network: IPersistedNetwork
    lastStrongholdBackupTime?: Date
    settings: IProfileSettings
    accountPersistedData: {
        [accountId: string]: IPersistedAccountData
    }
    contacts: IContactMap
    networkContactAddresses: INetworkContactAddressMap
    isDeveloperProfile: boolean
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
}
