import { addEmptyAccountActivitiesToAllAccountActivities } from '@core/activity/stores'
import { localize } from '@core/i18n'
import { createAccount } from '@core/profile-manager'
import {
    activeAccounts,
    addAccountPersistedDataToActiveProfile,
    addAccountToActiveAccounts,
} from '@core/profile/stores'
import { get } from 'svelte/store'
import { DEFAULT_SYNC_OPTIONS } from '../constants'
import { IAccountState } from '../interfaces'
import { buildAccountStateAndPersistedData } from './buildAccountStateAndPersistedData'

export async function createNewAccount(name?: string, color?: string): Promise<IAccountState> {
    const account = await createAccount({
        alias: name || `${localize('general.account')} ${(get(activeAccounts)?.length ?? 0) + 1}`,
    })

    await account.sync(DEFAULT_SYNC_OPTIONS)

    const [newAccount, accountPersistedData] = await buildAccountStateAndPersistedData(account, name, color)
    const accountIndex = newAccount.getMetadata().index
    addAccountToActiveAccounts(newAccount)
    addAccountPersistedDataToActiveProfile(accountIndex, accountPersistedData)
    addEmptyAccountActivitiesToAllAccountActivities(accountIndex)

    return newAccount
}
