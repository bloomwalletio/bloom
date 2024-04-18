import { DEFAULT_MARKET_CURRENCY } from '@core/market/constants'
import { ProfileType } from '../enums'
import { IPersistedProfile } from '../interfaces'
import { DEFAULT_LOCK_SCREEN_TIMEOUT_IN_MINUTES } from './default-lock-screen-timeout-in-minutes.constant'
import { DEFAULT_STRONGHOLD_PASSWORD_TIMEOUT_IN_MINUTES } from './default_stronghold_password_timeout_in_minutes.constant'
import { DEFAULT_MAX_NFT_DOWNLOADING_TIME_IN_SECONDS, DEFAULT_MAX_NFT_SIZE_IN_MEGABYTES } from '@core/nfts/constants'
import { PROFILE_VERSION } from './profile-version.constant'
import { APP_STAGE } from '@core/app/constants'
import { StrongholdVersion } from '@core/stronghold/enums'
import { DownloadPermission } from '@core/nfts/enums'
import { DEFAULT_IPFS_GATEWAYS } from './default-ipfs-gateways.constant'

export const DEFAULT_PERSISTED_PROFILE_OBJECT: Omit<IPersistedProfile, 'network'> = {
    id: '',
    versionTrack: APP_STAGE,
    version: PROFILE_VERSION[APP_STAGE],
    name: '',
    type: ProfileType.Software,
    contacts: {},
    networkContactAddresses: {},
    settings: {
        marketCurrency: DEFAULT_MARKET_CURRENCY,
        lockScreenTimeoutInMinutes: DEFAULT_LOCK_SCREEN_TIMEOUT_IN_MINUTES,
        strongholdPasswordTimeoutInMinutes: DEFAULT_STRONGHOLD_PASSWORD_TIMEOUT_IN_MINUTES,
        nfts: {
            ipfsGateways: DEFAULT_IPFS_GATEWAYS,
            downloadPermissions: DownloadPermission.AllowListOnly,
            maxMediaSizeInMegaBytes: DEFAULT_MAX_NFT_SIZE_IN_MEGABYTES,
            maxMediaDownloadTimeInSeconds: DEFAULT_MAX_NFT_DOWNLOADING_TIME_IN_SECONDS,
        },
        hideNetworkStatistics: true,
    },
    lastStrongholdBackupTime: undefined,
    accountPersistedData: {},
    features: {
        wallet: true,
        collectibles: true,
        governance: true,
        campaigns: true,
        buySell: true,
        developer: false,
        settings: true,
    },
    forceAssetRefresh: false,
    strongholdVersion: StrongholdVersion.V2,
    trackedTokens: {},
    trackedNfts: {},
    clientOptions: {},
}
