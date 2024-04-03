import { Writable, get, writable } from 'svelte/store'
import type { SyncClient } from '@walletconnect/sync-client/dist/types/client'

export const syncClient: Writable<SyncClient | undefined> = writable(undefined)

export function getSyncClient(): SyncClient | undefined {
    return get(syncClient)
}
