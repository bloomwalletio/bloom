import { ContractAbi } from 'web3'

// Functions of the ISC Magic Contract to access the core accounts functionality
// https://wiki.iota.org/isc/reference/magic-contract/ISCAccounts/
export const ISC_MAGIC_CONTRACT_ACCOUNTS_ABI: ContractAbi = [
    {
        inputs: [
            {
                internalType: 'string',
                name: 'tokenName',
                type: 'string',
            },
            {
                internalType: 'string',
                name: 'tokenSymbol',
                type: 'string',
            },
            {
                internalType: 'uint8',
                name: 'tokenDecimals',
                type: 'uint8',
            },
            {
                components: [
                    {
                        internalType: 'uint256',
                        name: 'mintedTokens',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'meltedTokens',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'maximumSupply',
                        type: 'uint256',
                    },
                ],
                internalType: 'struct NativeTokenScheme',
                name: 'tokenScheme',
                type: 'tuple',
            },
            {
                components: [
                    {
                        internalType: 'uint64',
                        name: 'baseTokens',
                        type: 'uint64',
                    },
                    {
                        components: [
                            {
                                components: [
                                    {
                                        internalType: 'bytes',
                                        name: 'data',
                                        type: 'bytes',
                                    },
                                ],
                                internalType: 'struct NativeTokenID',
                                name: 'ID',
                                type: 'tuple',
                            },
                            {
                                internalType: 'uint256',
                                name: 'amount',
                                type: 'uint256',
                            },
                        ],
                        internalType: 'struct NativeToken[]',
                        name: 'nativeTokens',
                        type: 'tuple[]',
                    },
                    {
                        internalType: 'NFTID[]',
                        name: 'nfts',
                        type: 'bytes32[]',
                    },
                ],
                internalType: 'struct ISCAssets',
                name: 'allowance',
                type: 'tuple',
            },
        ],
        name: 'createNativeTokenFoundry',
        outputs: [
            {
                internalType: 'uint32',
                name: '',
                type: 'uint32',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: 'uint256',
                        name: 'mintedTokens',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'meltedTokens',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'maximumSupply',
                        type: 'uint256',
                    },
                ],
                internalType: 'struct NativeTokenScheme',
                name: 'tokenScheme',
                type: 'tuple',
            },
            {
                components: [
                    {
                        internalType: 'uint64',
                        name: 'baseTokens',
                        type: 'uint64',
                    },
                    {
                        components: [
                            {
                                components: [
                                    {
                                        internalType: 'bytes',
                                        name: 'data',
                                        type: 'bytes',
                                    },
                                ],
                                internalType: 'struct NativeTokenID',
                                name: 'ID',
                                type: 'tuple',
                            },
                            {
                                internalType: 'uint256',
                                name: 'amount',
                                type: 'uint256',
                            },
                        ],
                        internalType: 'struct NativeToken[]',
                        name: 'nativeTokens',
                        type: 'tuple[]',
                    },
                    {
                        internalType: 'NFTID[]',
                        name: 'nfts',
                        type: 'bytes32[]',
                    },
                ],
                internalType: 'struct ISCAssets',
                name: 'allowance',
                type: 'tuple',
            },
        ],
        name: 'foundryCreateNew',
        outputs: [
            {
                internalType: 'uint32',
                name: '',
                type: 'uint32',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: 'bytes',
                        name: 'data',
                        type: 'bytes',
                    },
                ],
                internalType: 'struct ISCAgentID',
                name: 'agentID',
                type: 'tuple',
            },
        ],
        name: 'getL2BalanceBaseTokens',
        outputs: [
            {
                internalType: 'uint64',
                name: '',
                type: 'uint64',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: 'bytes',
                        name: 'data',
                        type: 'bytes',
                    },
                ],
                internalType: 'struct NativeTokenID',
                name: 'id',
                type: 'tuple',
            },
            {
                components: [
                    {
                        internalType: 'bytes',
                        name: 'data',
                        type: 'bytes',
                    },
                ],
                internalType: 'struct ISCAgentID',
                name: 'agentID',
                type: 'tuple',
            },
        ],
        name: 'getL2BalanceNativeTokens',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: 'bytes',
                        name: 'data',
                        type: 'bytes',
                    },
                ],
                internalType: 'struct ISCAgentID',
                name: 'agentID',
                type: 'tuple',
            },
        ],
        name: 'getL2NFTAmount',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: 'bytes',
                        name: 'data',
                        type: 'bytes',
                    },
                ],
                internalType: 'struct ISCAgentID',
                name: 'agentID',
                type: 'tuple',
            },
            {
                internalType: 'NFTID',
                name: 'collectionId',
                type: 'bytes32',
            },
        ],
        name: 'getL2NFTAmountInCollection',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: 'bytes',
                        name: 'data',
                        type: 'bytes',
                    },
                ],
                internalType: 'struct ISCAgentID',
                name: 'agentID',
                type: 'tuple',
            },
        ],
        name: 'getL2NFTs',
        outputs: [
            {
                internalType: 'NFTID[]',
                name: '',
                type: 'bytes32[]',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: 'bytes',
                        name: 'data',
                        type: 'bytes',
                    },
                ],
                internalType: 'struct ISCAgentID',
                name: 'agentID',
                type: 'tuple',
            },
            {
                internalType: 'NFTID',
                name: 'collectionId',
                type: 'bytes32',
            },
        ],
        name: 'getL2NFTsInCollection',
        outputs: [
            {
                internalType: 'NFTID[]',
                name: '',
                type: 'bytes32[]',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint32',
                name: 'foundrySN',
                type: 'uint32',
            },
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
            {
                components: [
                    {
                        internalType: 'uint64',
                        name: 'baseTokens',
                        type: 'uint64',
                    },
                    {
                        components: [
                            {
                                components: [
                                    {
                                        internalType: 'bytes',
                                        name: 'data',
                                        type: 'bytes',
                                    },
                                ],
                                internalType: 'struct NativeTokenID',
                                name: 'ID',
                                type: 'tuple',
                            },
                            {
                                internalType: 'uint256',
                                name: 'amount',
                                type: 'uint256',
                            },
                        ],
                        internalType: 'struct NativeToken[]',
                        name: 'nativeTokens',
                        type: 'tuple[]',
                    },
                    {
                        internalType: 'NFTID[]',
                        name: 'nfts',
                        type: 'bytes32[]',
                    },
                ],
                internalType: 'struct ISCAssets',
                name: 'allowance',
                type: 'tuple',
            },
        ],
        name: 'mintNativeTokens',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
]
