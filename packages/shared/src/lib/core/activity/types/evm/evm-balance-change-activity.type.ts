import { EvmActivityType } from '@core/activity/enums/evm'
import { TokenStandard } from '@core/token'
import { NftStandard } from '@core/nfts'
import { BaseEvmActivity } from './base-evm-activity.type'

export type EvmBalanceChangeActivity = BaseEvmActivity & {
    type: EvmActivityType.BalanceChange
    tokenTransfer: {
        standard: TokenStandard.Irc30 | NftStandard.Irc27
        tokenId: string
        rawAmount: bigint
    }
}
