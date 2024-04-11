import { StardustNetworkName, SupportedNetworkId, TokenSupply } from '@core/network/enums'
import { IProtocol } from '../interfaces'
import { DEFAULT_BECH32_HRP } from './default-bech32-hrp.constant'
import { NetworkId } from '..'

const DEFAULT_IOTA_PROTOCOL: IProtocol = {
    version: 2,
    networkName: StardustNetworkName.Iota,
    bech32Hrp: DEFAULT_BECH32_HRP[SupportedNetworkId.Iota] ?? '',
    minPowScore: 1500,
    belowMaxDepth: 15,
    rentStructure: {
        vByteCost: 250,
        vByteFactorData: 1,
        vByteFactorKey: 10,
    },
    tokenSupply: TokenSupply.Iota,
}

const DEFAULT_SHIMMER_PROTOCOL: IProtocol = {
    version: 2,
    networkName: StardustNetworkName.Shimmer,
    bech32Hrp: DEFAULT_BECH32_HRP[SupportedNetworkId.Shimmer] ?? '',
    minPowScore: 1500,
    belowMaxDepth: 15,
    rentStructure: {
        vByteCost: 100,
        vByteFactorData: 1,
        vByteFactorKey: 10,
    },
    tokenSupply: TokenSupply.Shimmer,
}

const DEFAULT_TESTNET_PROTOCOL: IProtocol = {
    version: 2,
    networkName: StardustNetworkName.Testnet,
    bech32Hrp: DEFAULT_BECH32_HRP[SupportedNetworkId.Testnet] ?? '',
    minPowScore: 1500,
    belowMaxDepth: 15,
    rentStructure: {
        vByteCost: 100,
        vByteFactorData: 1,
        vByteFactorKey: 10,
    },
    tokenSupply: TokenSupply.Testnet,
}

export const DEFAULT_PROTOCOL: Readonly<{ [id in NetworkId]?: IProtocol }> = {
    [SupportedNetworkId.Iota]: DEFAULT_IOTA_PROTOCOL,
    [SupportedNetworkId.Shimmer]: DEFAULT_SHIMMER_PROTOCOL,
    [SupportedNetworkId.Testnet]: DEFAULT_TESTNET_PROTOCOL,
}
