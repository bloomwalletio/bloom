import { pollLayer2Tokens } from '@core/layer-2/actions'
import { resetNftDownloadQueue } from '@core/nfts/stores'
import { activeAccounts, updateActiveProfile } from '@core/profile/stores'
import { clearFilters } from '@core/utils'
import { resetSendOptionIndex } from '@core/wallet/stores'
import { get } from 'svelte/store'
import { selectedAccountIndex } from '../stores'

export function setSelectedAccount(index: number): void {
    resetNftDownloadQueue(true)

    const account = get(activeAccounts)?.find((_account) => _account.index === index)
    if (account) {
        selectedAccountIndex.set(index)
        updateActiveProfile({ lastUsedAccountIndex: index })
        clearFilters()
        pollLayer2Tokens(account)
        resetSendOptionIndex()
    } else {
        throw new Error(`Account with ID ${index} cannot be found!`)
    }
}
