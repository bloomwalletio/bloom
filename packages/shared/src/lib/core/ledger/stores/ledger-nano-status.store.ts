import { LedgerNanoStatus } from '@iota/wallet'
import { writable } from 'svelte/store'
import { ILedgerEthereumAppSettings, ILedgerStatus } from '../interfaces'
import { LedgerAppName } from '../enums'

const DEFAULT_LEDGER_STATUS: ILedgerStatus = {
    connected: false,
    locked: true,
}

export const ledgerNanoStatus = writable<ILedgerStatus>(DEFAULT_LEDGER_STATUS)

export function updateLedgerNanoStatus(payload: Partial<ILedgerStatus>): void {
    return ledgerNanoStatus.update((state) => {
        if (ledgerNanoStatus) {
            return { ...state, ...payload }
        } else {
            return state
        }
    })
}

export function setLedgerNanoStatus(status: LedgerNanoStatus, ethereumAppSettings?: ILedgerEthereumAppSettings): void {
    return ledgerNanoStatus.set({
        connected: status.connected,
        locked: status.locked,
        device: status.device,
        app: status.app?.name as LedgerAppName,
        settings: {
            ...(status.app?.name === LedgerAppName.Shimmer && {
                [LedgerAppName.Shimmer]: {
                    version: status.app.version,
                    blindSigningEnabled: status?.blindSigningEnabled,
                },
            }),
            ...(ethereumAppSettings && { [LedgerAppName.Ethereum]: ethereumAppSettings }),
        },
    })
}

export function resetLedgerNanoStatus(): void {
    ledgerNanoStatus.set(DEFAULT_LEDGER_STATUS)
}
