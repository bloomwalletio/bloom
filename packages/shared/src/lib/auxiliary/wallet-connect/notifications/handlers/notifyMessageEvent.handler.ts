import { NotifyClientTypes } from '@walletconnect/notify-client'
import { NotifyEvent } from '../enums'

export function notifyMessageEventHandler(event: NotifyClientTypes.EventArguments[NotifyEvent.Message]): void {
    console.warn('notifyMessageEventHandler', event)
}
