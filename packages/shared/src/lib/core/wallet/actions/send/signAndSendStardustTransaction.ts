import { IAccountState, updateSelectedAccount } from '@core/account'
import { updateNftInAllAccountNfts } from '@core/nfts/actions'
import { DEFAULT_TRANSACTION_OPTIONS, OUTPUT_TYPE_NFT } from '@core/wallet/constants'
import { Output } from '@core/wallet/types'
import { processAndAddToActivities } from '@core/activity/utils'
import { network } from '@core/network'
import { get } from 'svelte/store'

export async function signAndSendStardustTransaction(
    output: Output,
    account: IAccountState | undefined
): Promise<void> {
    try {
        const networkId = get(network)?.getMetadata()?.id
        if (!account || !networkId) {
            throw new Error('Account or network undefined')
        }

        updateSelectedAccount({ isTransferring: true })
        const transaction = await account.sendOutputs([output], DEFAULT_TRANSACTION_OPTIONS)
        // Reset transaction details state, since the transaction has been sent
        if (output.type === OUTPUT_TYPE_NFT) {
            updateNftInAllAccountNfts(account.index, output.nftId, { isSpendable: false })
        }

        await processAndAddToActivities(transaction, account, networkId)
        updateSelectedAccount({ isTransferring: false })
        return
    } catch (err) {
        updateSelectedAccount({ isTransferring: false })
        throw err
    }
}
