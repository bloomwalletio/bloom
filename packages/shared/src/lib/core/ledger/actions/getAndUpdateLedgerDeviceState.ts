import { profileManager as _profileManager } from '@core/profile-manager/stores'
import { getLedgerNanoStatus } from '@lib/core/profile-manager/api'
import { Ledger } from '../classes'
import { resetLedgerDeviceState, setLedgerDeviceState } from '../stores'
import { sleep } from '@core/utils'

let isMakingRequest: boolean = false

export async function getAndUpdateLedgerDeviceState(
    profileManager = _profileManager,
    forwardErrors = false
): Promise<void> {
    try {
        if (!isMakingRequest) {
            isMakingRequest = true
            const ledgerNanoStatus = await getLedgerNanoStatus(profileManager)
            // sleep to make sure ledger process on iota sdk is wrapped up
            await sleep(50)
            const ethereumAppSettings = await Ledger.getEthereumAppSettings()
            setLedgerDeviceState(ledgerNanoStatus, ethereumAppSettings)
        }
    } catch (err) {
        resetLedgerDeviceState()
        if (forwardErrors) {
            return Promise.reject(err)
        } else {
            console.error(err)
        }
    } finally {
        isMakingRequest = false
    }
}
