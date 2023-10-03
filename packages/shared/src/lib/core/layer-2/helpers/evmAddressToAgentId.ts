import { EXTERNALLY_OWNED_ACCOUNT_TYPE_ID } from '@core/layer-2/constants'
import { ChainConfiguration, ChainType, SupportedNetworkId } from '@core/network'
import { api } from '@core/profile-manager'
import { Converter } from '@iota/util.js'

export function evmAddressToAgentId(evmStoreAccount: string, chainConfig: ChainConfiguration): Uint8Array {
    const chainAliasAddress = chainConfig.type === ChainType.Iscp ? chainConfig.aliasAddress : ''

    // This function constructs an AgentID that is required to be used with contracts
    // Wasp understands different AgentID types and each AgentID needs to provide a certain ID that describes it's address type.
    // In the case of EVM addresses it's ID 3.
    const agentIDKindEthereumAddress = EXTERNALLY_OWNED_ACCOUNT_TYPE_ID

    // Note: we need the evmStoreAccount to be in lower case,
    // otherwise fetching balances using the iscmagic contract will fail,
    // because evm addresses are case-insensitive but hexToBytes is not.
    const receiverAddrBinary = Converter.hexToBytes(evmStoreAccount?.toLowerCase())

    // Keep the branch with chainAliasAddressBinary once IF updates the encoding for the EVM testnet
    if (chainConfig.id === SupportedNetworkId.ShimmerEvmTestnet) {
        return new Uint8Array([agentIDKindEthereumAddress, ...receiverAddrBinary])
    } else {
        const chainAliasAddressBinary = Converter.hexToBytes(api.bech32ToHex(chainAliasAddress))
        return new Uint8Array([agentIDKindEthereumAddress, ...chainAliasAddressBinary, ...receiverAddrBinary])
    }
}
