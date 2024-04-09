import { MarketCurrency } from '@core/market'
import { DownloadPermission } from '@core/nfts'

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
