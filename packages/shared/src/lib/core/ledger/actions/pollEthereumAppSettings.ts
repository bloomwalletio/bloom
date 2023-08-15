import { get } from 'svelte/store'
import { updateLedgerEthereumAppSettings } from '../actions'
import { deconstructLedgerNanoStatusPollingConfiguration } from '../helpers'
import { isPollingLedgerEthereumAppSettings } from '../stores'

let intervalTimer: ReturnType<typeof setInterval>

export function pollLedgerEthereumAppSettings(): void {
    const { pollInterval } = deconstructLedgerNanoStatusPollingConfiguration()

    if (!get(isPollingLedgerEthereumAppSettings)) {
        void updateLedgerEthereumAppSettings()
        intervalTimer = setInterval(() => {
            void updateLedgerEthereumAppSettings()
        }, pollInterval)
        isPollingLedgerEthereumAppSettings.set(true)
    }
}

export function stopPollingLedgerEthereumAppSettings(): void {
    if (get(isPollingLedgerEthereumAppSettings)) {
        clearInterval(intervalTimer)
        intervalTimer = null
        isPollingLedgerEthereumAppSettings.set(false)
    }
}
