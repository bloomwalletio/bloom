import { NotifyClient } from '@walletconnect/notify-client/dist/types/client'
import { Writable, get, writable } from 'svelte/store'

export const notifyClient: Writable<NotifyClient | undefined> = writable(undefined)

export function getNotifyClient(): NotifyClient | undefined {
    return get(notifyClient)
}
