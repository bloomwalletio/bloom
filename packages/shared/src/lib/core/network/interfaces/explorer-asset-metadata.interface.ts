import { TokenStandard } from '@core/token/enums'
import { NftStandard } from '@core/nfts/enums'

// snake_case returned by the API
export interface IExplorerAssetMetadata {
    address: string
    circulating_market_cap: string
    decimals: number
    exchange_rate: string
    holders: string
    icon_url: string
    name: string
    symbol: string
    total_supply: string
    type: TokenStandard | NftStandard
}
