import { get } from 'svelte/store'
import { profileManager as _profileManager } from '@core/profile-manager/stores'
import { DEFAULT_LEDGER_NANO_STATUS_POLL_INTERVAL } from '../constants'
import { ILedgerDeviceStatePollingConfiguration } from '../interfaces'
import { isPollingLedgerDeviceState } from '../stores'
import { getAndUpdateLedgerDeviceState } from './getAndUpdateLedgerDeviceState'

let intervalTimer: number | undefined

export function pollLedgerDeviceState(config?: ILedgerDeviceStatePollingConfiguration): void {
    const pollInterval = config?.pollInterval ?? DEFAULT_LEDGER_NANO_STATUS_POLL_INTERVAL
    const profileManager = config?.profileManager ?? _profileManager

    if (!get(isPollingLedgerDeviceState)) {
        void getAndUpdateLedgerDeviceState(profileManager)
        intervalTimer = window.setInterval(() => {
            void getAndUpdateLedgerDeviceState(profileManager)
        }, pollInterval)
        isPollingLedgerDeviceState.set(true)
    }
}

export function stopPollingLedgerDeviceState(): void {
    if (get(isPollingLedgerDeviceState)) {
        window.clearInterval(intervalTimer )
        intervalTimer = undefined
        isPollingLedgerDeviceState.set(false)
    }
}
