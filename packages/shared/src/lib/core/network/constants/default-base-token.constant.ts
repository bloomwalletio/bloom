import { SupportedNetworkId } from '@core/network/enums'
import { TokenStandard } from '@core/token/enums'
import { IBaseToken } from '@core/token/interfaces'
import { NetworkId } from '../types'

const DEFAULT_IOTA_BASE_TOKEN: IBaseToken = {
    standard: TokenStandard.BaseToken,
    name: 'IOTA',
    tickerSymbol: 'IOTA',
    unit: 'IOTA',
    decimals: 6,
    subunit: 'micro',
    useMetricPrefix: false,
}

const DEFAULT_SHIMMER_BASE_TOKEN: IBaseToken = {
    standard: TokenStandard.BaseToken,
    name: 'Shimmer',
    tickerSymbol: 'SMR',
    unit: 'SMR',
    decimals: 6,
    subunit: 'glow',
    useMetricPrefix: false,
}

const DEFAULT_TESTNET_BASE_TOKEN: IBaseToken = {
    standard: TokenStandard.BaseToken,
    name: 'Shimmer',
    tickerSymbol: 'SMR',
    unit: 'SMR',
    decimals: 6,
    subunit: 'glow',
    useMetricPrefix: false,
}

export const DEFAULT_BASE_TOKEN: Readonly<{ [id in NetworkId]?: IBaseToken }> = {
    [SupportedNetworkId.Iota]: DEFAULT_IOTA_BASE_TOKEN,
    [SupportedNetworkId.Shimmer]: DEFAULT_SHIMMER_BASE_TOKEN,
    [SupportedNetworkId.Testnet]: DEFAULT_TESTNET_BASE_TOKEN,
    [SupportedNetworkId.ShimmerEvm]: DEFAULT_SHIMMER_BASE_TOKEN,
    [SupportedNetworkId.TestnetEvm]: DEFAULT_TESTNET_BASE_TOKEN,
}
