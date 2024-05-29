import { ContractAbi } from 'web3'
import { AbiType, StateMutabilityType } from '../../layer-2/enums'

// This is the main interface of the ISC Magic Contract.
// https://wiki.iota.org/isc/reference/magic-contract/ISCSandbox/
export const ISC_MAGIC_CONTRACT_SANDBOX_ABI: ContractAbi = [
    // function getRequestID() external view returns (struct ISCRequestID)
    {
        type: AbiType.Function,
        name: 'getRequestID',
        inputs: [],
        outputs: [
            {
                components: [{ internalType: 'bytes', name: 'data', type: 'bytes' }],
                internalType: 'struct ISCRequestID',
                name: '',
                type: 'tuple',
            },
        ],
        stateMutability: StateMutabilityType.NonPayable,
    },
    // function getSenderAccount() external view returns (struct ISCAgentID)
    {
        type: AbiType.Function,
        name: 'getSenderAccount',
        inputs: [],
        outputs: [
            {
                components: [{ internalType: 'bytes', name: 'data', type: 'bytes' }],
                internalType: 'struct ISCAgentID',
                name: '',
                type: 'tuple',
            },
        ],
        stateMutability: StateMutabilityType.NonPayable,
    },
    // function triggerEvent(string s) external
    {
        type: AbiType.Function,
        name: 'triggerEvent',
        inputs: [{ internalType: 'string', name: 's', type: 'string' }],
        outputs: [],
        stateMutability: StateMutabilityType.NonPayable,
    },
    // function getEntropy() external view returns (bytes32)
    {
        type: AbiType.Function,
        name: 'getEntropy',
        inputs: [],
        outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        stateMutability: StateMutabilityType.NonPayable,
    },
    // function allow(address target, struct ISCAssets allowance) external
    {
        type: AbiType.Function,
        name: 'allow',
        inputs: [
            { internalType: 'address', name: 'target', type: 'address' },
            {
                components: [
                    { internalType: 'uint64', name: 'baseTokens', type: 'uint64' },
                    {
                        components: [
                            {
                                components: [{ internalType: 'bytes', name: 'data', type: 'bytes' }],
                                internalType: 'struct NativeTokenID',
                                name: 'ID',
                                type: 'tuple',
                            },
                            { internalType: 'uint256', name: 'amount', type: 'uint256' },
                        ],
                        internalType: 'struct NativeToken[]',
                        name: 'nativeTokens',
                        type: 'tuple[]',
                    },
                    { internalType: 'NFTID[]', name: 'nfts', type: 'bytes32[]' },
                ],
                internalType: 'struct ISCAssets',
                name: 'allowance',
                type: 'tuple',
            },
        ],
        outputs: [],
        stateMutability: StateMutabilityType.NonPayable,
    },
    // function takeAllowedFunds(address addr, struct ISCAssets allowance) external
    {
        type: AbiType.Function,
        name: 'takeAllowedFunds',
        inputs: [
            { internalType: 'address', name: 'addr', type: 'address' },
            {
                components: [
                    { internalType: 'uint64', name: 'baseTokens', type: 'uint64' },
                    {
                        components: [
                            {
                                components: [{ internalType: 'bytes', name: 'data', type: 'bytes' }],
                                internalType: 'struct NativeTokenID',
                                name: 'ID',
                                type: 'tuple',
                            },
                            { internalType: 'uint256', name: 'amount', type: 'uint256' },
                        ],
                        internalType: 'struct NativeToken[]',
                        name: 'nativeTokens',
                        type: 'tuple[]',
                    },
                    { internalType: 'NFTID[]', name: 'nfts', type: 'bytes32[]' },
                ],
                internalType: 'struct ISCAssets',
                name: 'allowance',
                type: 'tuple',
            },
        ],
        outputs: [],
        stateMutability: StateMutabilityType.NonPayable,
    },
    // function getAllowanceFrom(address addr) external view returns (struct ISCAssets)
    {
        type: AbiType.Function,
        name: 'getAllowanceFrom',
        inputs: [{ internalType: 'address', name: 'addr', type: 'address' }],
        outputs: [
            {
                components: [
                    { internalType: 'uint64', name: 'baseTokens', type: 'uint64' },
                    {
                        components: [
                            {
                                components: [{ internalType: 'bytes', name: 'data', type: 'bytes' }],
                                internalType: 'struct NativeTokenID',
                                name: 'ID',
                                type: 'tuple',
                            },
                            { internalType: 'uint256', name: 'amount', type: 'uint256' },
                        ],
                        internalType: 'struct NativeToken[]',
                        name: 'nativeTokens',
                        type: 'tuple[]',
                    },
                    { internalType: 'NFTID[]', name: 'nfts', type: 'bytes32[]' },
                ],
                internalType: 'struct ISCAssets',
                name: '',
                type: 'tuple',
            },
        ],
        stateMutability: StateMutabilityType.View,
    },
    // function getAllowanceTo(address target) external view returns (struct ISCAssets)
    {
        type: AbiType.Function,
        name: 'getAllowanceTo',
        inputs: [{ internalType: 'address', name: 'target', type: 'address' }],
        outputs: [
            {
                components: [
                    { internalType: 'uint64', name: 'baseTokens', type: 'uint64' },
                    {
                        components: [
                            {
                                components: [{ internalType: 'bytes', name: 'data', type: 'bytes' }],
                                internalType: 'struct NativeTokenID',
                                name: 'ID',
                                type: 'tuple',
                            },
                            { internalType: 'uint256', name: 'amount', type: 'uint256' },
                        ],
                        internalType: 'struct NativeToken[]',
                        name: 'nativeTokens',
                        type: 'tuple[]',
                    },
                    { internalType: 'NFTID[]', name: 'nfts', type: 'bytes32[]' },
                ],
                internalType: 'struct ISCAssets',
                name: '',
                type: 'tuple',
            },
        ],
        stateMutability: StateMutabilityType.View,
    },
    // function getAllowance(address from, address to) external view returns (struct ISCAssets)
    {
        type: AbiType.Function,
        name: 'getAllowance',
        inputs: [
            { internalType: 'address', name: 'from', type: 'address' },
            { internalType: 'address', name: 'to', type: 'address' },
        ],
        outputs: [
            {
                components: [
                    { internalType: 'uint64', name: 'baseTokens', type: 'uint64' },
                    {
                        components: [
                            {
                                components: [{ internalType: 'bytes', name: 'data', type: 'bytes' }],
                                internalType: 'struct NativeTokenID',
                                name: 'ID',
                                type: 'tuple',
                            },
                            { internalType: 'uint256', name: 'amount', type: 'uint256' },
                        ],
                        internalType: 'struct NativeToken[]',
                        name: 'nativeTokens',
                        type: 'tuple[]',
                    },
                    { internalType: 'NFTID[]', name: 'nfts', type: 'bytes32[]' },
                ],
                internalType: 'struct ISCAssets',
                name: '',
                type: 'tuple',
            },
        ],
        stateMutability: StateMutabilityType.View,
    },
    // function send(struct L1Address targetAddress, struct ISCAssets assets, bool adjustMinimumStorageDeposit, struct ISCSendMetadata metadata, struct ISCSendOptions sendOptions) external payable
    {
        type: AbiType.Function,
        name: 'send',
        inputs: [
            {
                components: [{ internalType: 'bytes', name: 'data', type: 'bytes' }],
                internalType: 'struct L1Address',
                name: 'targetAddress',
                type: 'tuple',
            },
            {
                components: [
                    { internalType: 'uint64', name: 'baseTokens', type: 'uint64' },
                    {
                        components: [
                            {
                                components: [{ internalType: 'bytes', name: 'data', type: 'bytes' }],
                                internalType: 'struct NativeTokenID',
                                name: 'ID',
                                type: 'tuple',
                            },
                            { internalType: 'uint256', name: 'amount', type: 'uint256' },
                        ],
                        internalType: 'struct NativeToken[]',
                        name: 'nativeTokens',
                        type: 'tuple[]',
                    },
                    { internalType: 'NFTID[]', name: 'nfts', type: 'bytes32[]' },
                ],
                internalType: 'struct ISCAssets',
                name: 'assets',
                type: 'tuple',
            },
            { internalType: 'bool', name: 'adjustMinimumStorageDeposit', type: 'bool' },
            {
                components: [
                    { internalType: 'ISCHname', name: 'targetContract', type: 'uint32' },
                    { internalType: 'ISCHname', name: 'entrypoint', type: 'uint32' },
                    {
                        components: [
                            {
                                components: [
                                    { internalType: 'bytes', name: 'key', type: 'bytes' },
                                    { internalType: 'bytes', name: 'value', type: 'bytes' },
                                ],
                                internalType: 'struct ISCDictItem[]',
                                name: 'items',
                                type: 'tuple[]',
                            },
                        ],
                        internalType: 'struct ISCDict',
                        name: 'params',
                        type: 'tuple',
                    },
                    {
                        components: [
                            { internalType: 'uint64', name: 'baseTokens', type: 'uint64' },
                            {
                                components: [
                                    {
                                        components: [{ internalType: 'bytes', name: 'data', type: 'bytes' }],
                                        internalType: 'struct NativeTokenID',
                                        name: 'ID',
                                        type: 'tuple',
                                    },
                                    { internalType: 'uint256', name: 'amount', type: 'uint256' },
                                ],
                                internalType: 'struct NativeToken[]',
                                name: 'nativeTokens',
                                type: 'tuple[]',
                            },
                            { internalType: 'NFTID[]', name: 'nfts', type: 'bytes32[]' },
                        ],
                        internalType: 'struct ISCAssets',
                        name: 'allowance',
                        type: 'tuple',
                    },
                    { internalType: 'uint64', name: 'gasBudget', type: 'uint64' },
                ],
                internalType: 'struct ISCSendMetadata',
                name: 'metadata',
                type: 'tuple',
            },
            {
                components: [
                    { internalType: 'int64', name: 'timelock', type: 'int64' },
                    {
                        components: [
                            { internalType: 'int64', name: 'time', type: 'int64' },
                            {
                                components: [{ internalType: 'bytes', name: 'data', type: 'bytes' }],
                                internalType: 'struct L1Address',
                                name: 'returnAddress',
                                type: 'tuple',
                            },
                        ],
                        internalType: 'struct ISCExpiration',
                        name: 'expiration',
                        type: 'tuple',
                    },
                ],
                internalType: 'struct ISCSendOptions',
                name: 'sendOptions',
                type: 'tuple',
            },
        ],
        outputs: [],
        stateMutability: StateMutabilityType.Payable,
    },
    // function call(ISCHname contractHname, ISCHname entryPoint, struct ISCDict params, struct ISCAssets allowance) external returns (struct ISCDict)
    {
        type: AbiType.Function,
        name: 'call',
        inputs: [
            { internalType: 'ISCHname', name: 'contractHname', type: 'uint32' },
            { internalType: 'ISCHname', name: 'entryPoint', type: 'uint32' },
            {
                components: [
                    {
                        components: [
                            { internalType: 'bytes', name: 'key', type: 'bytes' },
                            { internalType: 'bytes', name: 'value', type: 'bytes' },
                        ],
                        internalType: 'struct ISCDictItem[]',
                        name: 'items',
                        type: 'tuple[]',
                    },
                ],
                internalType: 'struct ISCDict',
                name: 'params',
                type: 'tuple',
            },
            {
                components: [
                    { internalType: 'uint64', name: 'baseTokens', type: 'uint64' },
                    {
                        components: [
                            {
                                components: [{ internalType: 'bytes', name: 'data', type: 'bytes' }],
                                internalType: 'struct NativeTokenID',
                                name: 'ID',
                                type: 'tuple',
                            },
                            { internalType: 'uint256', name: 'amount', type: 'uint256' },
                        ],
                        internalType: 'struct NativeToken[]',
                        name: 'nativeTokens',
                        type: 'tuple[]',
                    },
                    { internalType: 'NFTID[]', name: 'nfts', type: 'bytes32[]' },
                ],
                internalType: 'struct ISCAssets',
                name: 'allowance',
                type: 'tuple',
            },
        ],
        outputs: [
            {
                components: [
                    {
                        components: [
                            { internalType: 'bytes', name: 'key', type: 'bytes' },
                            { internalType: 'bytes', name: 'value', type: 'bytes' },
                        ],
                        internalType: 'struct ISCDictItem[]',
                        name: 'items',
                        type: 'tuple[]',
                    },
                ],
                internalType: 'struct ISCDict',
                name: '',
                type: 'tuple',
            },
        ],
        stateMutability: StateMutabilityType.NonPayable,
    },
    // function callView(ISCHname contractHname, ISCHname entryPoint, struct ISCDict params) external view returns (struct ISCDict)
    {
        type: AbiType.Function,
        name: 'callView',
        inputs: [
            { internalType: 'ISCHname', name: 'contractHname', type: 'uint32' },
            { internalType: 'ISCHname', name: 'entryPoint', type: 'uint32' },
            {
                components: [
                    {
                        components: [
                            { internalType: 'bytes', name: 'key', type: 'bytes' },
                            { internalType: 'bytes', name: 'value', type: 'bytes' },
                        ],
                        internalType: 'struct ISCDictItem[]',
                        name: 'items',
                        type: 'tuple[]',
                    },
                ],
                internalType: 'struct ISCDict',
                name: 'params',
                type: 'tuple',
            },
        ],
        outputs: [
            {
                components: [
                    {
                        components: [
                            { internalType: 'bytes', name: 'key', type: 'bytes' },
                            { internalType: 'bytes', name: 'value', type: 'bytes' },
                        ],
                        internalType: 'struct ISCDictItem[]',
                        name: 'items',
                        type: 'tuple[]',
                    },
                ],
                internalType: 'struct ISCDict',
                name: '',
                type: 'tuple',
            },
        ],
        stateMutability: StateMutabilityType.View,
    },
    // function getChainID() external view returns (ISCChainID)
    {
        type: AbiType.Function,
        name: 'getChainID',
        inputs: [],
        outputs: [{ internalType: 'ISCChainID', name: '', type: 'bytes32' }],
        stateMutability: StateMutabilityType.View,
    },
    // function getChainOwnerID() external view returns (struct ISCAgentID)
    {
        type: AbiType.Function,
        name: 'getChainOwnerID',
        inputs: [],
        outputs: [
            {
                components: [{ internalType: 'bytes', name: 'data', type: 'bytes' }],
                internalType: 'struct ISCAgentID',
                name: '',
                type: 'tuple',
            },
        ],
        stateMutability: StateMutabilityType.View,
    },
    // function getTimestampUnixSeconds() external view returns (int64)
    {
        type: AbiType.Function,
        name: 'getTimestampUnixSeconds',
        inputs: [],
        outputs: [{ internalType: 'int64', name: '', type: 'int64' }],
        stateMutability: StateMutabilityType.View,
    },
    // function getBaseTokenProperties() external view returns (struct ISCTokenProperties)
    {
        type: AbiType.Function,
        name: 'getBaseTokenProperties',
        inputs: [],
        outputs: [
            {
                components: [
                    { internalType: 'string', name: 'name', type: 'string' },
                    { internalType: 'string', name: 'tickerSymbol', type: 'string' },
                    { internalType: 'uint8', name: 'decimals', type: 'uint8' },
                    { internalType: 'uint256', name: 'totalSupply', type: 'uint256' },
                ],
                internalType: 'struct ISCTokenProperties',
                name: '',
                type: 'tuple',
            },
        ],
        stateMutability: StateMutabilityType.View,
    },
    // function getNativeTokenID(uint32 foundrySN) external view returns (struct NativeTokenID)
    {
        type: AbiType.Function,
        name: 'getNativeTokenID',
        inputs: [{ internalType: 'uint32', name: 'foundrySN', type: 'uint32' }],
        outputs: [
            {
                components: [{ internalType: 'bytes', name: 'data', type: 'bytes' }],
                internalType: 'struct NativeTokenID',
                name: '',
                type: 'tuple',
            },
        ],
        stateMutability: StateMutabilityType.View,
    },
    // function getNativeTokenScheme(uint32 foundrySN) external view returns (struct NativeTokenScheme)
    {
        type: AbiType.Function,
        name: 'getNativeTokenScheme',
        inputs: [{ internalType: 'uint32', name: 'foundrySN', type: 'uint32' }],
        outputs: [
            {
                components: [
                    { internalType: 'uint256', name: 'mintedTokens', type: 'uint256' },
                    { internalType: 'uint256', name: 'meltedTokens', type: 'uint256' },
                    { internalType: 'uint256', name: 'maximumSupply', type: 'uint256' },
                ],
                internalType: 'struct NativeTokenScheme',
                name: '',
                type: 'tuple',
            },
        ],
        stateMutability: StateMutabilityType.View,
    },
    // function getNFTData(NFTID id) external view returns (struct ISCNFT)
    {
        type: AbiType.Function,
        name: 'getNFTData',
        inputs: [{ internalType: 'NFTID', name: 'id', type: 'bytes32' }],
        outputs: [
            {
                components: [
                    { internalType: 'NFTID', name: 'ID', type: 'bytes32' },
                    {
                        components: [{ internalType: 'bytes', name: 'data', type: 'bytes' }],
                        internalType: 'struct L1Address',
                        name: 'issuer',
                        type: 'tuple',
                    },
                    { internalType: 'bytes', name: 'metadata', type: 'bytes' },
                    {
                        components: [{ internalType: 'bytes', name: 'data', type: 'bytes' }],
                        internalType: 'struct ISCAgentID',
                        name: 'owner',
                        type: 'tuple',
                    },
                ],
                internalType: 'struct ISCNFT',
                name: '',
                type: 'tuple',
            },
        ],
        stateMutability: StateMutabilityType.View,
    },
    // function getIRC27NFTData(NFTID id) external view returns (struct IRC27NFT)
    {
        type: AbiType.Function,
        name: 'getIRC27NFTData',
        inputs: [{ internalType: 'NFTID', name: 'id', type: 'bytes32' }],
        outputs: [
            {
                components: [
                    {
                        components: [
                            { internalType: 'NFTID', name: 'ID', type: 'bytes32' },
                            {
                                components: [{ internalType: 'bytes', name: 'data', type: 'bytes' }],
                                internalType: 'struct L1Address',
                                name: 'issuer',
                                type: 'tuple',
                            },
                            { internalType: 'bytes', name: 'metadata', type: 'bytes' },
                            {
                                components: [{ internalType: 'bytes', name: 'data', type: 'bytes' }],
                                internalType: 'struct ISCAgentID',
                                name: 'owner',
                                type: 'tuple',
                            },
                        ],
                        internalType: 'struct ISCNFT',
                        name: 'nft',
                        type: 'tuple',
                    },
                    {
                        components: [
                            { internalType: 'string', name: 'standard', type: 'string' },
                            { internalType: 'string', name: 'version', type: 'string' },
                            { internalType: 'string', name: 'mimeType', type: 'string' },
                            { internalType: 'string', name: 'uri', type: 'string' },
                            { internalType: 'string', name: 'name', type: 'string' },
                        ],
                        internalType: 'struct IRC27NFTMetadata',
                        name: 'metadata',
                        type: 'tuple',
                    },
                ],
                internalType: 'struct IRC27NFT',
                name: '',
                type: 'tuple',
            },
        ],
        stateMutability: StateMutabilityType.View,
    },
    // function erc20NativeTokensAddress(uint32 foundrySN) external view returns (address)
    {
        type: AbiType.Function,
        name: 'erc20NativeTokensAddress',
        inputs: [{ internalType: 'uint32', name: 'foundrySN', type: 'uint32' }],
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: StateMutabilityType.View,
    },
    // function erc721NFTCollectionAddress(NFTID collectionID) external view returns (address)
    {
        type: AbiType.Function,
        name: 'erc721NFTCollectionAddress',
        inputs: [{ internalType: 'NFTID', name: 'collectionID', type: 'bytes32' }],
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: StateMutabilityType.View,
    },
    // function erc20NativeTokensFoundrySerialNumber(address addr) external view returns (uint32)
    {
        type: AbiType.Function,
        name: 'erc20NativeTokensFoundrySerialNumber',
        inputs: [{ internalType: 'address', name: 'addr', type: 'address' }],
        outputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
        stateMutability: StateMutabilityType.View,
    },
    // function registerERC20NativeToken(uint32 foundrySN, string name, string symbol, uint8 decimals, struct ISCAssets allowance) external
    {
        type: AbiType.Function,
        name: 'registerERC20NativeToken',
        // TODO: implement abi for this function
    },
]
