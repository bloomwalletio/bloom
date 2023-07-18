import { IAccountState, updateSelectedAccount } from '@core/account'
import { updateNftInAllAccountNfts } from '@core/nfts/actions'
import { DEFAULT_TRANSACTION_OPTIONS, OUTPUT_TYPE_NFT } from '@core/wallet/constants'
import { resetNewTokenTransactionData } from '@core/wallet/stores'
import { Output } from '@core/wallet/types'
import { processAndAddToActivities } from '@core/wallet/utils'

export async function signAndSendStardustTransaction(output: Output, account: IAccountState): Promise<void> {
    try {
        updateSelectedAccount({ isTransferring: true })
        const transaction = await account.sendOutputs([output], DEFAULT_TRANSACTION_OPTIONS)
        // Reset transaction details state, since the transaction has been sent
        if (output.type === OUTPUT_TYPE_NFT) {
            updateNftInAllAccountNfts(account.index, output.nftId, { isSpendable: false })
        }

        resetNewTokenTransactionData()

        await processAndAddToActivities(transaction, account)
        updateSelectedAccount({ isTransferring: false })
        return
    } catch (err) {
        updateSelectedAccount({ isTransferring: false })
        throw err
    }
}
