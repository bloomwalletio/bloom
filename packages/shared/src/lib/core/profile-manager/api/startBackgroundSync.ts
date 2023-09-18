import { get } from 'svelte/store'
import { SyncOptions } from '@iota/sdk/out/types'
import { profileManager } from '../stores'

export async function startBackgroundSync(options?: SyncOptions, interval?: number): Promise<void> {
    const manager = get(profileManager)
    await manager.startBackgroundSync(options, interval)
}
