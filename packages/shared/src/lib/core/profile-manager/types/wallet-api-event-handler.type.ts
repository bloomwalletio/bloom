import type { Event } from '@iota/sdk'

export type WalletApiEventHandler = (error: Error, event: Event) => void | Promise<void>
