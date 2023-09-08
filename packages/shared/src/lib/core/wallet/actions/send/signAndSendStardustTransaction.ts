import { NftOutput, OutputType } from '@iota/sdk/out/types'
import { IAccountState } from '@core/account'
import { updateSelectedAccount } from '@core/account/stores'
import { processAndAddToActivities } from '@core/activity/utils'
import { updateNftInAllAccountNfts } from '@core/nfts/actions'
import { DEFAULT_TRANSACTION_OPTIONS } from '@core/wallet/constants'
import { Output } from '@core/wallet/types'
import { getActiveNetworkId } from '@core/network'

export async function signAndSendStardustTransaction(output: Output, account: IAccountState): Promise<void> {
    try {
        const networkId = getActiveNetworkId()

        updateSelectedAccount({ isTransferring: true })
        const transaction = await account.sendOutputs([output], DEFAULT_TRANSACTION_OPTIONS)
        // Reset transaction details state, since the transaction has been sent
        if (output.type === OutputType.Nft) {
            const { nftId } = output as NftOutput
            updateNftInAllAccountNfts(account.index, nftId, { isSpendable: false })
        }

        await processAndAddToActivities(transaction, account, networkId)
        updateSelectedAccount({ isTransferring: false })
        return
    } catch (err) {
        updateSelectedAccount({ isTransferring: false })
        throw err
    }
}
