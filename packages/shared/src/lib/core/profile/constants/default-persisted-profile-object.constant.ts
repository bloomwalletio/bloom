import { DEFAULT_MARKET_CURRENCY } from '@core/market'
import { ProfileType } from '../enums'
import { IPersistedProfile } from '../interfaces'
import { DEFAULT_LOCK_SCREEN_TIMEOUT_IN_MINUTES } from './default-lock-screen-timeout-in-minutes.constant'
import { DEFAULT_STRONGHOLD_PASSWORD_TIMEOUT_IN_MINUTES } from './default_stronghold_password_timeout_in_minutes.constant'
import { DEFAULT_MAX_NFT_DOWNLOADING_TIME_IN_SECONDS, DEFAULT_MAX_NFT_SIZE_IN_MEGABYTES } from '@core/nfts/constants'
import { PROFILE_VERSION } from './profile-version.constant'
import { APP_STAGE } from '@core/app/constants'
import { StrongholdVersion } from '@core/stronghold'
import { getDefaultPersistedNetwork } from '@core/network/utils'
import { StardustNetworkId } from '@core/network'

export const DEFAULT_PERSISTED_PROFILE_OBJECT: IPersistedProfile = {
    id: '',
    version: PROFILE_VERSION[APP_STAGE],
    name: '',
    type: ProfileType.Software,
    contacts: {},
    network: getDefaultPersistedNetwork(StardustNetworkId.Testnet),
    networkContactAddresses: {},
    settings: {
        marketCurrency: DEFAULT_MARKET_CURRENCY,
        lockScreenTimeoutInMinutes: DEFAULT_LOCK_SCREEN_TIMEOUT_IN_MINUTES,
        strongholdPasswordTimeoutInMinutes: DEFAULT_STRONGHOLD_PASSWORD_TIMEOUT_IN_MINUTES,
        maxMediaSizeInMegaBytes: DEFAULT_MAX_NFT_SIZE_IN_MEGABYTES,
        maxMediaDownloadTimeInSeconds: DEFAULT_MAX_NFT_DOWNLOADING_TIME_IN_SECONDS,
        hideNetworkStatistics: true,
    },
    lastStrongholdBackupTime: undefined,
    accountPersistedData: {},
    isDeveloperProfile: false,
    forceAssetRefresh: false,
    strongholdVersion: StrongholdVersion.V2,
    trackedTokens: {},
    trackedNfts: {},
    clientOptions: {},
}
