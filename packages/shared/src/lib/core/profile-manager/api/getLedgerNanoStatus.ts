import { get } from 'svelte/store'
import { profileManager as _profileManager } from '@core/profile-manager/stores'
import type { LedgerNanoStatus } from '@iota/sdk/out/types'

export function getLedgerNanoStatus(profileManager = _profileManager): Promise<LedgerNanoStatus> {
    const manager = get(profileManager)
    return manager.getLedgerNanoStatus()
}
