import { EvmNetworkId } from '@core/network'
import { ActivityDirection } from '../../enums'
import { EvmBalanceChangeActivity, INftBalanceChange } from '../../types'
import { IAccountState } from '@core/account'
import { generateEvmBalanceChangeActivity } from './generateEvmBalanceChangeActivity'
import { NftStandard } from '@core/nfts'

export function generateEvmNftBalanceChangeActivity(
    networkId: EvmNetworkId,
    nftId: string,
    balanceChange: INftBalanceChange,
    account: IAccountState
): EvmBalanceChangeActivity {
    return generateEvmBalanceChangeActivity(
        {
            standard: NftStandard.Irc27,
            tokenId: nftId,
            rawAmount: BigInt(1),
            direction: balanceChange.owned ? ActivityDirection.Incoming : ActivityDirection.Outgoing,
            time: new Date(balanceChange.changedAt),
        },
        networkId,
        account
    )
}
