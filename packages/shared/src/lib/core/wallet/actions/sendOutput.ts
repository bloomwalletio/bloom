import { selectedAccount, updateSelectedAccount } from '@core/account/stores'
import { updateNftInAllAccountNfts } from '@core/nfts/actions'
import { get } from 'svelte/store'

import { processAndAddToActivities } from '@core/activity/utils'
import { DEFAULT_TRANSACTION_OPTIONS, OUTPUT_TYPE_NFT } from '../constants'
import { Output } from '../types'
import { getActiveNetworkId } from '@core/network'
import { localize } from '@core/i18n'

export async function sendOutput(output: Output): Promise<void> {
    try {
        const account = get(selectedAccount)
        const networkId = getActiveNetworkId()

        if (!account || !networkId) {
            throw new Error(localize('error.global.accountOrNetworkUndefined'))
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
