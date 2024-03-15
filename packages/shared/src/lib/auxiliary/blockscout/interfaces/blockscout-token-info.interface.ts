import { NftStandard } from '@core/nfts/enums'
import { TokenStandard } from '@core/token/enums'

export interface IBlockscoutTokenInfoDto extends IBlockscoutTokenInfoCommon {
    type: 'ERC-20' | 'ERC-721'
}

export interface IBlockscoutTokenInfo extends IBlockscoutTokenInfoCommon {
    type: TokenStandard.Erc20 | NftStandard.Erc721
}

// snake_case returned by the API
interface IBlockscoutTokenInfoCommon {
    address: string
    circulating_market_cap: string
    decimals: number
    exchange_rate: string
    holders: string
    icon_url: string
    name: string
    symbol: string
    total_supply: string
}
