import { IPersistedAccountData } from '@core/account'
import { IClientOptions, IPersistedNetwork } from '@core/network'
import { INft } from '@core/nfts'
import { StrongholdVersion } from '@core/stronghold/enums'
import { ProfileType } from '../enums'
import { IProfileSettings } from './profile-settings.interface'
import { IContactMetadataMap, INetworkContactAddressMap } from '@core/contacts/interfaces'

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
    contacts: IContactMetadataMap
    networkContactAddresses: INetworkContactAddressMap
    isDeveloperProfile: boolean
    hasVisitedDashboard?: boolean
    lastUsedAccountIndex?: number
    clientOptions: IClientOptions
    forceAssetRefresh: boolean
    strongholdVersion: StrongholdVersion
    pfp?: INft
}
