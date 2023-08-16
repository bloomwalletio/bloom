import { get } from 'svelte/store'
import { OutputType } from '@iota/sdk/out/types'
import { selectedAccount, updateSelectedAccount } from '@core/account'
import { updateNftInAllAccountNfts } from '@core/nfts/actions'

import { DEFAULT_TRANSACTION_OPTIONS } from '../constants'
import { Output } from '../types'
import { processAndAddToActivities } from '../utils'

export async function sendOutput(output: Output): Promise<void> {
    try {
        const account = get(selectedAccount)
        if (!account) {
            return
        }

        updateSelectedAccount({ isTransferring: true })
        const transaction = await account.sendOutputs([output], DEFAULT_TRANSACTION_OPTIONS)
        // Reset transaction details state, since the transaction has been sent
        if (output.type === OutputType.Nft) {
            updateNftInAllAccountNfts(account.index, output.nftId, { isSpendable: false })
        }

        await processAndAddToActivities(transaction, account)
        updateSelectedAccount({ isTransferring: false })
        return
    } catch (err) {
        updateSelectedAccount({ isTransferring: false })
        throw err
    }
}
