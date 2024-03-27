import { EvmActivityType } from '@core/activity/enums/evm'
import { BaseEvmActivity } from './base-evm-activity.type'

export type EvmCoinTransferActivity = BaseEvmActivity & {
    type: EvmActivityType.CoinTransfer
    baseTokenTransfer: {
        tokenId: string
        rawAmount: bigint
    }
}
