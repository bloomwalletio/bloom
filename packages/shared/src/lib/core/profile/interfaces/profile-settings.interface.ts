import type { MarketCurrency } from '@core/market'
import type { DownloadPermission } from '@core/nfts/enums'

export interface IProfileSettings {
    marketCurrency: MarketCurrency
    lockScreenTimeoutInMinutes: number
    strongholdPasswordTimeoutInMinutes: number
    nfts: {
        ipfsGateways: { url: string; isPrimary?: boolean }[]
        downloadPermissions: DownloadPermission
        maxMediaSizeInMegaBytes: number
        maxMediaDownloadTimeInSeconds: number
    }
    hideNetworkStatistics: boolean
}
