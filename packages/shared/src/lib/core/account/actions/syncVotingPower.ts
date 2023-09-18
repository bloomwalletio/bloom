import { get } from 'svelte/store'
import { updateActiveAccount } from '@core/profile/stores'
import { getVotingPower } from '../api/getVotingPower'
import { selectedAccountIndex, updateSelectedAccount } from '../stores'

export async function syncVotingPower(accountIndex = get(selectedAccountIndex)): Promise<void> {
    const votingPower = await getVotingPower(accountIndex)
    if (get(selectedAccountIndex) === accountIndex) {
        updateSelectedAccount({ votingPower })
    } else {
        updateActiveAccount(accountIndex, { votingPower })
    }
    return
}
