import { get } from 'svelte/store'
import type { LedgerNanoStatus } from '@iota/sdk/out/types'
import { profileManager as _profileManager } from '@core/profile-manager/stores'

export function getLedgerNanoStatus(profileManager = _profileManager): Promise<LedgerNanoStatus> {
    const manager = get(profileManager)
    return manager.getLedgerNanoStatus()
}
