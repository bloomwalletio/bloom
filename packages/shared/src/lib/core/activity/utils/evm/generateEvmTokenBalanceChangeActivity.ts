import { EvmNetworkId } from '@core/network'
import { TokenStandard } from '@core/token'
import { BigIntAbs, Converter } from '@core/utils'
import { ActivityDirection } from '../../enums'
import { EvmBalanceChangeActivity, ITokenBalanceChange } from '../../types'
import { IAccountState } from '@core/account'
import { generateEvmBalanceChangeActivity } from './generateEvmBalanceChangeActivity'

export function generateEvmTokenBalanceChangeActivity(
    networkId: EvmNetworkId,
    tokenId: string,
    balanceChange: ITokenBalanceChange,
    account: IAccountState
): EvmBalanceChangeActivity {
    const newBalance = Converter.legacyNumberToBigInt(balanceChange.newBalance)
    const oldBalance = Converter.legacyNumberToBigInt(balanceChange.oldBalance)
    const difference = newBalance - oldBalance

    return generateEvmBalanceChangeActivity(
        {
            standard: TokenStandard.Irc30,
            tokenId,
            rawAmount: BigIntAbs(difference),
            direction: difference >= 0 ? ActivityDirection.Incoming : ActivityDirection.Outgoing,
            time: new Date(balanceChange.changedAt),
        },
        networkId,
        account
    )
}
