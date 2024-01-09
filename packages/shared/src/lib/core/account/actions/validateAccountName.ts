import { localize } from '@core/i18n'
import { activeAccounts } from '@core/profile/stores'
import { getTrimmedLength } from '@core/utils'
import { get } from 'svelte/store'
import { MAX_ACCOUNT_NAME_LENGTH } from '../constants'

export function validateAccountName(name: string, validateLength = true, validateDuplicate = true): void {
    if (getTrimmedLength(name) === 0) {
        throw Error(localize('error.account.emptyName'))
    }
    if (validateLength && getTrimmedLength(name) > MAX_ACCOUNT_NAME_LENGTH) {
        throw Error(
            localize('error.account.length', {
                values: {
                    length: MAX_ACCOUNT_NAME_LENGTH,
                },
            })
        )
    }
    if (validateDuplicate && get(activeAccounts)?.find((existingAccount) => existingAccount.name === name)) {
        throw Error(localize('error.account.duplicate'))
    }
}
