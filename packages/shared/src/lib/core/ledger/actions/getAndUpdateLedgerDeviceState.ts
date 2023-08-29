import { profileManager as _profileManager } from '@core/profile-manager/stores'
import { getLedgerNanoStatus } from '@lib/core/profile-manager/api'
import { Ledger } from '../classes'
import { resetLedgerDeviceState, setLedgerDeviceState } from '../stores'

export async function getAndUpdateLedgerDeviceState(
    profileManager = _profileManager,
    forwardErrors = false
): Promise<void> {
    try {
        const ledgerNanoStatus = await getLedgerNanoStatus(profileManager)
        const ethereumAppSettings = await Ledger.getEthereumAppSettings()
        setLedgerDeviceState(ledgerNanoStatus, ethereumAppSettings)
    } catch (err) {
        resetLedgerDeviceState()
        if (forwardErrors) {
            return Promise.reject(err)
        } else {
            console.error(err)
        }
    }
}
