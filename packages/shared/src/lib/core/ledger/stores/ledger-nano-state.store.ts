import { LedgerNanoStatus } from '@iota/wallet'
import { writable } from 'svelte/store'
import { ILedgerEthereumAppSettings, ILedgerNanoState } from '../interfaces'
import { LedgerAppName } from '../enums'

const DEFAULT_LEDGER_STATUS: ILedgerNanoState = {
    connected: false,
    locked: true,
}

export const ledgerNanoState = writable<ILedgerNanoState>(DEFAULT_LEDGER_STATUS)

export function updateLedgerNanoState(payload: Partial<ILedgerNanoState>): void {
    return ledgerNanoState.update((state) => {
        if (ledgerNanoState) {
            return { ...state, ...payload }
        } else {
            return state
        }
    })
}

export function setLedgerNanoState(status: LedgerNanoStatus, ethereumAppSettings?: ILedgerEthereumAppSettings): void {
    return ledgerNanoState.set({
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

export function resetLedgerNanoState(): void {
    ledgerNanoState.set(DEFAULT_LEDGER_STATUS)
}
