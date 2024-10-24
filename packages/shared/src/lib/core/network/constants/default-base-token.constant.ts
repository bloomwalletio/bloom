import { TokenStandard } from '@core/token/enums'
import { IBaseToken } from '@core/token/interfaces'
import { NetworkId } from '../types'
import { SupportedNetworkId } from './supported-network-id.constant'

const IOTA_BASE_TOKEN: IBaseToken = {
    standard: TokenStandard.BaseToken,
    name: 'IOTA',
    tickerSymbol: 'IOTA',
    unit: 'IOTA',
    decimals: 6,
    subunit: 'micro',
}

const IOTA_EVM_BASE_TOKEN: IBaseToken = {
    ...IOTA_BASE_TOKEN,
    decimals: 18,
}

export const SHIMMER_BASE_TOKEN: IBaseToken = {
    standard: TokenStandard.BaseToken,
    name: 'Shimmer',
    tickerSymbol: 'SMR',
    unit: 'SMR',
    decimals: 6,
    subunit: 'glow',
}

export const SHIMMER_EVM_BASE_TOKEN: IBaseToken = {
    ...SHIMMER_BASE_TOKEN,
    decimals: 18,
}

const IOTA_TESTNET_BASE_TOKEN: IBaseToken = {
    standard: TokenStandard.BaseToken,
    name: 'Test Token',
    tickerSymbol: 'TST',
    unit: 'TST',
    decimals: 6,
    subunit: 'testies',
}

export const IOTA_TESTNET_EVM_BASE_TOKEN: IBaseToken = {
    ...IOTA_TESTNET_BASE_TOKEN,
    decimals: 18,
}

export const EVM_BASE_TOKEN: IBaseToken = {
    standard: TokenStandard.BaseToken,
    name: 'Ethereum',
    tickerSymbol: 'ETH',
    unit: 'ETH',
    decimals: 18,
}

export const BNB_BASE_TOKEN: IBaseToken = {
    standard: TokenStandard.BaseToken,
    name: 'BNB',
    tickerSymbol: 'BNB',
    unit: 'BNB',
    decimals: 18,
}

export const BNB_TESTNET_BASE_TOKEN: IBaseToken = {
    standard: TokenStandard.BaseToken,
    name: 'Test BNB',
    tickerSymbol: 'tBNB',
    unit: 'tBNB',
    decimals: 18,
}

export const DEFAULT_BASE_TOKEN: Readonly<{ [id in NetworkId]: IBaseToken }> = {
    [SupportedNetworkId.Iota]: IOTA_BASE_TOKEN,
    [SupportedNetworkId.Shimmer]: SHIMMER_BASE_TOKEN,
    [SupportedNetworkId.IotaTestnet]: IOTA_TESTNET_BASE_TOKEN,
    [SupportedNetworkId.Testnet]: SHIMMER_BASE_TOKEN,
    [SupportedNetworkId.IotaEvm]: IOTA_EVM_BASE_TOKEN,
    [SupportedNetworkId.ShimmerEvm]: SHIMMER_EVM_BASE_TOKEN,
    [SupportedNetworkId.IotaTestnetEvm]: IOTA_TESTNET_EVM_BASE_TOKEN,
    [SupportedNetworkId.TestnetEvm]: SHIMMER_EVM_BASE_TOKEN,
    [SupportedNetworkId.Ethereum]: EVM_BASE_TOKEN,
    [SupportedNetworkId.Sepolia]: EVM_BASE_TOKEN,
    [SupportedNetworkId.GenericEvm]: EVM_BASE_TOKEN,
    [SupportedNetworkId.Bnb]: BNB_BASE_TOKEN,
    [SupportedNetworkId.BnbTestnet]: BNB_TESTNET_BASE_TOKEN,
}
