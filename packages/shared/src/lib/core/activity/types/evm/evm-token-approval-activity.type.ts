import { EvmActivityType } from '@core/activity/enums/evm'
import { TokenStandard } from '@core/token'
import { NftStandard } from '@core/nfts'
import { BaseEvmActivity } from './base-evm-activity.type'
import { IParsedInput } from '@core/layer-2/interfaces'

export type EvmTokenApprovalActivity = BaseEvmActivity & {
    type: EvmActivityType.TokenApproval
    tokenTransfer: {
        standard: TokenStandard.Erc20 | TokenStandard.Irc30 | NftStandard.Irc27 | NftStandard.Erc721
        tokenId: string
        rawAmount: bigint
    }
    rawData: string

    methodId?: string
    method?: string
    inputs?: IParsedInput[]
}
