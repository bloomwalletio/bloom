import { ContractAbi } from 'web3'
import { AbiType } from '../../layer-2/enums'

// The accounts contract is one of the core contracts on each IOTA Smart Contracts chain.
// This contract keeps a consistent ledger of on-chain accounts in its state, i.e. the L2 ledger.
// https://wiki.iota.org/isc/reference/core-contracts/accounts/
export const ISC_CORE_CONTRACT_ACCOUNTS_ABI: ContractAbi = [
    // function deposit()
    {
        type: AbiType.Function,
        name: 'deposit',
    },
    // function withdraw()
    {
        type: AbiType.Function,
        name: 'withdraw',
    },
    // function transferAllowanceTo(a AgentId)
    {
        type: AbiType.Function,
        name: 'transferAllowanceTo',
        inputs: [
            {
                type: 'AgentId',
                name: 'a',
            },
        ],
    },
    // function transferAllowanceToChain(g GasReserve)
    {
        type: AbiType.Function,
        name: 'transferAccountToChain',
        inputs: [
            {
                type: 'GasReserve',
                name: 'g',
            },
        ],
    },
    // function foundryCreateNew(t TokenScheme) returns s SerialNumber
    {
        type: AbiType.Function,
        name: 'foundryCreateNew',
        inputs: [
            {
                type: 'TokenScheme',
                name: 't',
            },
        ],
        outputs: [
            {
                type: 'SerialNumber',
                name: 's',
            },
        ],
    },
    // function foundryModifySupply(s SerialNumber, d SupplyDeltaAbs, y DestroyTokens)
    {
        type: AbiType.Function,
        name: 'foundryModifySupply',
        inputs: [
            {
                type: 'SerialNumber',
                name: 's',
            },
            {
                type: 'SupplyDeltaAbs',
                name: 'd',
            },
            {
                type: 'DestroyTokens',
                name: 'y',
            },
        ],
    },
    // function foundryDestroy(s SerialNumber)
    {
        type: AbiType.Function,
        name: 'foundryDestroy',
        inputs: [
            {
                type: 'SerialNumber',
                name: 's',
            },
        ],
    },
    // function mintNFT(I ImmutableData, a AgentID, C CollectionID, w WithdrawOnMint) returns d MintId
    {
        type: AbiType.Function,
        name: 'mintNFT',
        inputs: [
            {
                type: 'ImmutableData',
                name: 'I',
            },
            {
                type: 'AgentID',
                name: 'a',
            },
            {
                type: 'CollectionID',
                name: 'C',
            },
            {
                type: 'WithdrawOnMint',
                name: 'w',
            },
        ],
        outputs: [
            {
                type: 'MintId',
                name: 'd',
            },
        ],
    },
    // function balance(a AgentID) returns b Balance
    {
        type: AbiType.Function,
        name: 'balance',
        inputs: [
            {
                type: 'AgentID',
                name: 'a',
            },
        ],
        outputs: [
            {
                type: 'Balance',
                name: 'b',
            },
        ],
    },
    // function balanceBaseToken(a AgentID) returns b Balance
    {
        type: AbiType.Function,
        name: 'balanceBaseToken',
        inputs: [
            {
                type: 'AgentID',
                name: 'a',
            },
        ],
        outputs: [
            {
                type: 'Balance',
                name: 'b',
            },
        ],
    },
    // function balanceNativeToken(a AgentID, N TokenID)
    {
        type: AbiType.Function,
        name: 'balanceNativeToken',
        inputs: [
            {
                type: 'AgentID',
                name: 'a',
            },
            {
                type: 'TokenID',
                name: 'N',
            },
        ],
    },
    // function totalAssets()
    {
        type: AbiType.Function,
        name: 'totalAssets',
    },
    // function accounts()
    {
        type: AbiType.Function,
        name: 'accounts',
    },
    // function getNativeTokenIDRegistry()
    {
        type: AbiType.Function,
        name: 'getNativeTokenIDRegistry',
    },
    // function foundryOutput(s FoundrySerialNumber)
    {
        type: AbiType.Function,
        name: 'foundryOutput',
        inputs: [
            {
                type: 'FoundrySerialNumber',
                name: 's',
            },
        ],
    },
    // function accountNFTs(a AgentID)
    {
        type: AbiType.Function,
        name: 'accountNFTs',
        inputs: [
            {
                type: 'AgentID',
                name: 'a',
            },
        ],
    },
    // function accountNFTAmount(a AgentID)
    {
        type: AbiType.Function,
        name: 'accountNFTAmount',
        inputs: [
            {
                type: 'AgentID',
                name: 'a',
            },
        ],
    },
]
