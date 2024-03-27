import { EvmActivityType } from '@core/activity/enums/evm'
import { TokenStandard } from '@core/token'
import { NftStandard } from '@core/nfts'
import { BaseEvmActivity } from './base-evm-activity.type'

export type EvmTokenCreationActivity = BaseEvmActivity & {
    type: EvmActivityType.TokenCreation
    tokenTransfer: {
        standard: TokenStandard.Erc20 | TokenStandard.Irc30 | NftStandard.Irc27 | NftStandard.Erc721
        tokenId: string
        rawAmount: bigint
    }
    verified: boolean
    rawData: string

    methodId?: string
    method?: string
    parameters?: Record<string, string>
}
