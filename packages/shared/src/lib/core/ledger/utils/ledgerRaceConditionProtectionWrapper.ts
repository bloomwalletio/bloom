import { isOnboardingLedgerProfile } from '@contexts/onboarding'
import { get } from 'svelte/store'
import { stopPollingLedgerDeviceState, pollLedgerDeviceState } from '../actions'

export async function ledgerRaceConditionProtectionWrapper(_function: () => unknown): Promise<void> {
    try {
        if (get(isOnboardingLedgerProfile)) {
            stopPollingLedgerDeviceState()
        }
        await _function()
    } catch (err) {
        console.error(err)
    } finally {
        if (get(isOnboardingLedgerProfile)) {
            pollLedgerDeviceState()
        }
    }
}
