import { ChainType, IChain } from '@core/network'
import { Converter } from '@iota/util.js'

export function evmAddressToAgentId(evmStoreAccount: string, chain: IChain): Uint8Array {
    const chainConfiguration = chain.getConfiguration()
    const chainAliasAddress = chainConfiguration.type === ChainType.Iscp ? chainConfiguration.aliasAddress : ''

    // This function constructs an AgentID that is required to be used with contracts
    // Wasp understands different AgentID types and each AgentID needs to provide a certain ID that describes it's address type.
    // In the case of EVM addresses it's ID 3.
    const agentIDKindEthereumAddress = 3

    // Note: we need the evmStoreAccount to be in lower case,
    // otherwise fetching balances using the iscmagic contract will fail,
    // because evm addresses are case-insensitive but hexToBytes is not.
    const chainAliasAddressBinary = Converter.hexToBytes(chainAliasAddress?.toLowerCase())
    const receiverAddrBinary = Converter.hexToBytes(evmStoreAccount?.toLowerCase())
    const addressBytes = new Uint8Array([agentIDKindEthereumAddress, ...chainAliasAddressBinary, ...receiverAddrBinary])

    return addressBytes
}
