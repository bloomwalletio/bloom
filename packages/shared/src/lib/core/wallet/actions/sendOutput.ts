import { NftOutput, OutputType } from '@iota/sdk/out/types'
import { getSelectedAccount, updateSelectedAccount } from '@core/account/stores'
import { updateNftForAccount } from '@core/nfts/stores'

import { processAndAddToActivities } from '@core/activity/actions'
import { getTransactionOptions } from '../utils'
import { Output } from '../types'
import { getActiveNetworkId } from '@core/network'

export async function sendOutput(output: Output): Promise<void> {
    try {
        const account = getSelectedAccount()
        const networkId = getActiveNetworkId()

        updateSelectedAccount({ isTransferring: true })
        const transaction = await account.sendOutputs([output], getTransactionOptions(account.depositAddress))
        // Reset transaction details state, since the transaction has been sent
        if (output.type === OutputType.Nft) {
            const nftId = (output as NftOutput).nftId
            updateNftForAccount(account.index, { id: nftId, isSpendable: false })
        }

        await processAndAddToActivities(transaction, account, networkId)
        updateSelectedAccount({ isTransferring: false })
        return
    } catch (err) {
        updateSelectedAccount({ isTransferring: false })
        throw err
    }
}
