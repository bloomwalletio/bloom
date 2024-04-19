import { ChainId, EvmNetworkType, IEvmNetwork, NetworkNamespace, SupportedL1EvmNetworkId } from '@core/network'

export const DEFAULT_EVM_NETWORKS: Partial<IEvmNetwork>[] = [
    {
        id: SupportedL1EvmNetworkId.Ethereum,
        namespace: NetworkNamespace.Evm,
        chainId: ChainId.Ethereum,
        type: EvmNetworkType.PureEvm,
    },
]
