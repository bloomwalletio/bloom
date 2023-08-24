import { WalletEventType } from '@iota/wallet/types'
import { WalletApiEventHandler } from './wallet-api-event-handler.type'

export type WalletApiEventMap = {
    [key in WalletEventType]?: WalletApiEventHandler
}
