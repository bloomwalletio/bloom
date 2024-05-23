import { profileManager as _profileManager } from '@core/profile-manager/stores'
import { getLedgerNanoStatus } from '@lib/core/profile-manager/api'
import { Ledger } from '../classes'
import { setLedgerDeviceState } from '../stores'
import { ILedgerEthereumAppSettings } from '@core/ledger/interfaces'
import { LedgerAppName } from '@core/ledger/enums'

let isMakingRequest: boolean = false

export async function getAndUpdateLedgerDeviceState(profileManager = _profileManager): Promise<void> {
    try {
        if (!isMakingRequest) {
            isMakingRequest = true
            const ledgerNanoStatus = await getLedgerNanoStatus(profileManager)

            let ethereumAppSettings: ILedgerEthereumAppSettings | undefined
            if (!ledgerNanoStatus?.connected || ledgerNanoStatus?.app?.name === LedgerAppName.Ethereum) {
                // We rely on the Ledger process to throw the error states
                // Additionally, we also need to save the ethereumAppSettings to know if blind signing is enabled
                ethereumAppSettings = await Ledger.getEthereumAppSettings()
            }

            if (ledgerNanoStatus?.connected) {
                setLedgerDeviceState(ledgerNanoStatus, ethereumAppSettings)
            }
        }
    } catch (err) {
        console.error(err)
    } finally {
        isMakingRequest = false
    }
}
