import { IPersistedAccountData } from '@core/account/interfaces'
import { IContactMap, INetworkContactAddressMap } from '@core/contact/interfaces'
import { IClientOptions, IPersistedNetwork } from '@core/network/interfaces'
import { INft } from '@core/nfts/interfaces'
import { StrongholdVersion } from '@core/stronghold/enums'
import { TrackedTokens } from '@core/token/types'
import { ProfileType } from '../enums'
import { IProfileSettings } from './profile-settings.interface'

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
    trackedTokens: TrackedTokens
    pfp?: INft
    color?: string
}
