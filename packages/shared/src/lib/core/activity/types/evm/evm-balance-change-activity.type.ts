import { EvmActivityType } from '@core/activity/enums/evm'
import { TokenStandard } from '@core/token'
import { NftStandard } from '@core/nfts'
import { NetworkNamespace } from '@core/network'
import { BaseActivity } from '../base-activity.type'

export type EvmBalanceChangeActivity = BaseActivity & {
    namespace: NetworkNamespace.Evm

    type: EvmActivityType.BalanceChange
    tokenTransfer: {
        standard: TokenStandard.Irc30 | NftStandard.Irc27
        tokenId: string
        rawAmount: bigint
    }
}
