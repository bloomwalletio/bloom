import { WalletConnectEvents } from '../enums'
import type { SessionTypes } from '@walletconnect/types'

export function doesNamespaceSupportEvent(namespace: SessionTypes.Namespace, event: WalletConnectEvents): boolean {
    return namespace.events?.includes(event)
}
