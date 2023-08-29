import { get } from 'svelte/store'
import { profileManager as _profileManager } from '@core/profile-manager/stores'
import { LedgerNanoStatus } from '@iota/wallet/types'

export function getLedgerNanoStatus(profileManager = _profileManager): Promise<LedgerNanoStatus> {
    const manager = get(profileManager)
    return manager.getLedgerNanoStatus()
}
