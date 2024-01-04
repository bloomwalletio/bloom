import { SupportedNetworkId } from '@core/network/enums'
import { TokenStandard } from '@core/token/enums'
import { IBaseToken } from '@core/token/interfaces'

const DEFAULT_IOTA_BASE_TOKEN: IBaseToken = {
    standard: TokenStandard.BaseToken,
    name: 'IOTA',
    tickerSymbol: 'IOTA',
    unit: 'IOTA',
    decimals: 6,
    subunit: 'micro',
}

const DEFAULT_SHIMMER_BASE_TOKEN: IBaseToken = {
    standard: TokenStandard.BaseToken,
    name: 'Shimmer',
    tickerSymbol: 'SMR',
    unit: 'SMR',
    decimals: 6,
    subunit: 'glow',
}

const DEFAULT_TESTNET_BASE_TOKEN: IBaseToken = {
    standard: TokenStandard.BaseToken,
    name: 'Shimmer',
    tickerSymbol: 'SMR',
    unit: 'SMR',
    decimals: 6,
    subunit: 'glow',
}

export const DEFAULT_BASE_TOKEN: Readonly<{ [id in SupportedNetworkId]: IBaseToken }> = {
    [SupportedNetworkId.Iota]: DEFAULT_IOTA_BASE_TOKEN,
    [SupportedNetworkId.Shimmer]: DEFAULT_SHIMMER_BASE_TOKEN,
    [SupportedNetworkId.Testnet]: DEFAULT_TESTNET_BASE_TOKEN,
    [SupportedNetworkId.ShimmerEvm]: DEFAULT_SHIMMER_BASE_TOKEN,
    [SupportedNetworkId.TestnetEvm]: DEFAULT_TESTNET_BASE_TOKEN,
}
