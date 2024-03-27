import { EvmBalanceChangeActivity } from './evm-balance-change-activity.type'
import { EvmCoinTransferActivity } from './evm-coin-transfer-activity.type'
import { EvmContractCallActivity } from './evm-contract-call-activity.type'
import { EvmTokenTransferActivity } from './evm-token-transfer-activity.type'
import { EvmTokenCreationActivity } from './evm-token-creation-activity.type'

export type EvmActivity =
    | EvmCoinTransferActivity
    | EvmTokenCreationActivity
    | EvmTokenTransferActivity
    | EvmBalanceChangeActivity
    | EvmContractCallActivity
