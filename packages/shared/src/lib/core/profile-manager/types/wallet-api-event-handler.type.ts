import type { Event } from '@iota/wallet'

export type WalletApiEventHandler = (error: Error, event: Event) => void | Promise<void>
