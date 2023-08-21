import { SupportedNetworkId } from '@core/network/enums'
import { NetworkId } from '@core/network/types'
import { TokenStandard } from '@core/token/enums'
import { IBaseToken } from '@core/token/interfaces'

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
    [SupportedNetworkId.Shimmer]: DEFAULT_SHIMMER_BASE_TOKEN,
    [SupportedNetworkId.Testnet]: DEFAULT_TESTNET_BASE_TOKEN,
}
