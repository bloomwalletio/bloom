import { NftOutput, OutputType } from '@iota/sdk/out/types'
import { IAccountState } from '@core/account'
import { updateSelectedAccount } from '@core/account/stores'
import { processAndAddToActivities } from '@core/activity/utils'
import { updateNftInAllAccountNftsForAccount } from '@core/nfts/actions'
import { Output } from '@core/wallet/types'
import { getActiveNetworkId } from '@core/network'
import { getTransactionOptions } from '@core/wallet/utils'

export async function signAndSendStardustTransaction(output: Output, account: IAccountState): Promise<void> {
    try {
        const networkId = getActiveNetworkId()

        updateSelectedAccount({ isTransferring: true })
        const transaction = await account.sendOutputs([output], getTransactionOptions(account.depositAddress))
        // Reset transaction details state, since the transaction has been sent
        if (output.type === OutputType.Nft) {
            const { nftId } = output as NftOutput
            updateNftInAllAccountNftsForAccount(account.index, nftId, { isSpendable: false })
        }

        await processAndAddToActivities(transaction, account, networkId)
        updateSelectedAccount({ isTransferring: false })
        return
    } catch (err) {
        updateSelectedAccount({ isTransferring: false })
        throw err
    }
}
