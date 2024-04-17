import { EvmBalanceChangeActivity } from './evm-balance-change-activity.type'
import { EvmCoinTransferActivity } from './evm-coin-transfer-activity.type'
import { EvmContractCallActivity } from './evm-contract-call-activity.type'
import { EvmTokenTransferActivity } from './evm-token-transfer-activity.type'
import { EvmTokenMintingActivity } from './evm-token-minting-activity.type'

export type EvmActivity =
    | EvmCoinTransferActivity
    | EvmTokenMintingActivity
    | EvmTokenTransferActivity
    | EvmBalanceChangeActivity
    | EvmContractCallActivity
