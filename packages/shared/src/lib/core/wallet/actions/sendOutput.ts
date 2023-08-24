import { selectedAccount, updateSelectedAccount } from '@core/account/stores'
import { NftOutput, OutputType } from '@iota/sdk/out/types'
import { updateNftInAllAccountNfts } from '@core/nfts/actions'
import { get } from 'svelte/store'

import { processAndAddToActivities } from '@core/activity/utils'
import { DEFAULT_TRANSACTION_OPTIONS } from '../constants'
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
        if (output.type === OutputType.Nft) {
            const nftId = (output as NftOutput).nftId
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
