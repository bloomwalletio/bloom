import { IPersistedAccountData } from '@core/account'
import { IClientOptions, IPersistedNetwork, ITrackedTokens } from '@core/network'
import { INft } from '@core/nfts'
import { StrongholdVersion } from '@core/stronghold/enums'
import { ProfileType } from '../enums'
import { IProfileSettings } from './profile-settings.interface'
import { IContactMap, INetworkContactAddressMap } from '@core/contact/interfaces'

export interface IPersistedProfile {
    id: string
    name: string
    type: ProfileType
    network: IPersistedNetwork
    lastStrongholdBackupTime: Date
    settings: IProfileSettings
    accountPersistedData: {
        [accountId: string]: IPersistedAccountData
    }
    contacts: IContactMap
    networkContactAddresses: INetworkContactAddressMap
    isDeveloperProfile: boolean
    hasVisitedDashboard?: boolean
    lastUsedAccountIndex?: number
    clientOptions: IClientOptions
    forceAssetRefresh: boolean
    strongholdVersion: StrongholdVersion
    trackedTokens: ITrackedTokens
    pfp?: INft
}
