import { get } from 'svelte/store'
import { deconstructLedgerNanoStatusPollingConfiguration } from '../helpers'
import { ILedgerNanoStatusPollingConfiguration } from '../interfaces'
import { isPollingLedgerNanoState } from '../stores'
import { getAndUpdateLedgerNanoStatus } from './getAndUpdateLedgerNanoStatus'

let intervalTimer: ReturnType<typeof setInterval> | undefined

export function pollLedgerNanoStatus(config?: ILedgerNanoStatusPollingConfiguration): void {
    const { pollInterval, profileManager } = deconstructLedgerNanoStatusPollingConfiguration(config)

    if (!get(isPollingLedgerNanoState)) {
        void getAndUpdateLedgerNanoStatus(profileManager)
        intervalTimer = setInterval(() => {
            void getAndUpdateLedgerNanoStatus(profileManager)
        }, pollInterval)
        isPollingLedgerNanoState.set(true)
    }
}

export function stopPollingLedgerNanoStatus(): void {
    if (get(isPollingLedgerNanoState)) {
        clearInterval(intervalTimer)
        intervalTimer = undefined
        isPollingLedgerNanoState.set(false)
    }
}
