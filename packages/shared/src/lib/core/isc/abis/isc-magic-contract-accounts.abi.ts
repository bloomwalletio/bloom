import { ContractAbi } from 'web3'
import { AbiType, StateMutabilityType } from '../../layer-2/enums'

// Functions of the ISC Magic Contract to access the core accounts functionality
// https://wiki.iota.org/isc/reference/magic-contract/ISCAccounts/
export const ISC_MAGIC_CONTRACT_ACCOUNTS_ABI: ContractAbi = [
    // function getL2BalanceBaseTokens(struct ISCAgentID agentID) external view returns (uint64)
    {
        type: AbiType.Function,
        name: 'getL2BalanceBaseTokens',
        inputs: [
            {
                components: [{ internalType: 'bytes', name: 'data', type: 'bytes' }],
                internalType: 'struct ISCAgentID',
                name: 'agentID',
                type: 'tuple',
            },
        ],
        outputs: [{ internalType: 'uint64', name: '', type: 'uint64' }],
        stateMutability: StateMutabilityType.View,
    },
    // function getL2BalanceNativeTokens(struct NativeTokenID id, struct ISCAgentID agentID) external view returns (uint256)
    {
        type: AbiType.Function,
        name: 'getL2BalanceNativeTokens',
        inputs: [
            {
                components: [{ internalType: 'bytes', name: 'data', type: 'bytes' }],
                internalType: 'struct NativeTokenID',
                name: 'id',
                type: 'tuple',
            },
            {
                components: [{ internalType: 'bytes', name: 'data', type: 'bytes' }],
                internalType: 'struct ISCAgentID',
                name: 'agentID',
                type: 'tuple',
            },
        ],
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: StateMutabilityType.View,
    },
    // function getL2NFTs(struct ISCAgentID agentID) external view returns (NFTID[])
    {
        type: AbiType.Function,
        name: 'getL2NFTs',
        inputs: [
            {
                components: [{ internalType: 'bytes', name: 'data', type: 'bytes' }],
                internalType: 'struct ISCAgentID',
                name: 'agentID',
                type: 'tuple',
            },
        ],
        outputs: [{ internalType: 'NFTID[]', name: '', type: 'bytes32[]' }],
        stateMutability: StateMutabilityType.View,
    },
]
