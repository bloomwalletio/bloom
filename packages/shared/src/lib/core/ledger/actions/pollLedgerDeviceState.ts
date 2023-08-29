import { get } from 'svelte/store'
import { deconstructLedgerDeviceStatePollingConfiguration } from '../helpers'
import { ILedgerDeviceStatePollingConfiguration } from '../interfaces'
import { isPollingLedgerDeviceState } from '../stores'
import { getAndUpdateLedgerDeviceState } from './getAndUpdateLedgerDeviceState'

let intervalTimer: ReturnType<typeof setInterval> | undefined

export function pollLedgerDeviceState(config?: ILedgerDeviceStatePollingConfiguration): void {
    const { pollInterval, profileManager } = deconstructLedgerDeviceStatePollingConfiguration(config)

    if (!get(isPollingLedgerDeviceState)) {
        void getAndUpdateLedgerDeviceState(profileManager)
        intervalTimer = setInterval(() => {
            void getAndUpdateLedgerDeviceState(profileManager)
        }, pollInterval)
        isPollingLedgerDeviceState.set(true)
    }
}

export function stopPollingLedgerDeviceState(): void {
    if (get(isPollingLedgerDeviceState)) {
        clearInterval(intervalTimer)
        intervalTimer = undefined
        isPollingLedgerDeviceState.set(false)
    }
}
