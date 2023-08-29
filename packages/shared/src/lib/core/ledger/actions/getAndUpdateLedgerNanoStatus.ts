import { Ledger } from '@core/ledger/classes'
import { profileManager as _profileManager } from '@core/profile-manager'
import { getLedgerNanoStatus } from '@lib/core/profile-manager/api'
import { resetLedgerNanoState, setLedgerNanoState } from '../stores'

export async function getAndUpdateLedgerNanoStatus(
    profileManager = _profileManager,
    forwardErrors = false
): Promise<void> {
    try {
        const ledgerNanoStatusResponse = await getLedgerNanoStatus(profileManager)
        const ethereumAppSettings = await Ledger.getEthereumAppSettings()
        setLedgerNanoState(ledgerNanoStatusResponse, ethereumAppSettings)
    } catch (err) {
        resetLedgerNanoState()
        if (forwardErrors) {
            return Promise.reject(err)
        } else {
            console.error(err)
        }
    }
}
