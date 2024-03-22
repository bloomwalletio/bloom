import { EvmActivityType } from '@core/activity/enums/evm'
import { BaseEvmActivity } from './base-evm-activity.type'
import { TokenStandard } from '@core/token'
import { NftStandard } from '@core/nfts'

export type EvmTokenTransferActivity = BaseEvmActivity & {
    type: EvmActivityType.TokenTransfer
    tokenTransfer: {
        standard: TokenStandard.Erc20 | TokenStandard.Irc30 | NftStandard.Irc27 | NftStandard.Erc721
        tokenId: string
        rawAmount: bigint
    }
    contractAddress: string
}
