import { get } from 'svelte/store'

import { showNotification } from '@auxiliary/notification/actions'
import { registerProposalsFromNodes } from '@contexts/governance/actions'
import { Platform } from '@core/app/classes'
import { localize } from '@core/i18n'
import { displayNotificationForLedgerProfile } from '@core/ledger/actions'
import { isActiveLedgerProfile } from '@core/profile/stores'

import { createNewAccount } from './createNewAccount'
import { setSelectedAccount } from './setSelectedAccount'

export async function tryCreateAdditionalAccount(alias: string, color: string): Promise<void> {
    try {
        const account = await createNewAccount(alias, color)
        setSelectedAccount(account?.index)

        if (Platform.isFeatureFlagEnabled('governance')) {
            void registerProposalsFromNodes([account])
        }

        return Promise.resolve()
    } catch (err) {
        const errorMessage = err?.error || err
        if (err) {
            console.error(errorMessage)
            if (get(isActiveLedgerProfile)) {
                displayNotificationForLedgerProfile('error', true, false, err)
            } else {
                showNotification({
                    variant: 'error',
                    text: localize(errorMessage) ?? errorMessage,
                })
            }
        }
        return Promise.reject({ error: errorMessage })
    }
}
