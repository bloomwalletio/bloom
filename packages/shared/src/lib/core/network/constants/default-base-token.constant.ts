import { SupportedNetworkId } from '@core/network/enums'
import { NetworkId } from '@core/network/types'
import { IBaseToken } from '@core/wallet/interfaces'
import { TokenStandard } from '@core/wallet/enums'

const DEFAULT_IOTA_BASE_TOKEN: IBaseToken = {
    standard: TokenStandard.BaseToken,
    name: 'IOTA',
    tickerSymbol: 'MIOTA',
    unit: 'i',
    decimals: 0,
    subunit: null,
    useMetricPrefix: true,
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

export const DEFAULT_BASE_TOKEN: Readonly<{ [id: NetworkId]: IBaseToken }> = {
    [SupportedNetworkId.Iota]: DEFAULT_IOTA_BASE_TOKEN,
    [SupportedNetworkId.Shimmer]: DEFAULT_SHIMMER_BASE_TOKEN,
    [SupportedNetworkId.Testnet]: DEFAULT_TESTNET_BASE_TOKEN,
}
