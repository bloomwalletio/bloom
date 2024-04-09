import type { MarketCurrency } from '@core/market'
import type { DownloadPermission } from '@core/nfts/enums'

export interface IProfileSettings {
    marketCurrency: MarketCurrency
    lockScreenTimeoutInMinutes: number
    strongholdPasswordTimeoutInMinutes: number
    nfts: {
        downloadPermissions: DownloadPermission
        maxMediaSizeInMegaBytes: number
        maxMediaDownloadTimeInSeconds: number
    }

    hideNetworkStatistics: boolean
}
