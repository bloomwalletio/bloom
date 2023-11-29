import { Writable } from 'svelte/store'

import { IProfileManager } from '@core/profile-manager'

export interface ILedgerDeviceStatePollingConfiguration {
    pollInterval?: number
    profileManager?: Writable<IProfileManager>
}
