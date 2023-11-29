import type { Event } from '@iota/sdk/out/types'

export type WalletApiEventHandler = (error: Error, event: Event) => void | Promise<void>
