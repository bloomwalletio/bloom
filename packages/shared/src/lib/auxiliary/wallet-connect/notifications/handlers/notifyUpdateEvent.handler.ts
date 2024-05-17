import { NotifyClientTypes } from '@walletconnect/notify-client'
import { NotifyEvent } from '../enums'

export function notifyUpdateEventHandler(event: NotifyClientTypes.EventArguments[NotifyEvent.Update]): void {
    const { error } = event.params

    if (error) {
        console.error('ERROR: notifySubscriptionUpdateEventHandler', error)
    } else {
        console.warn('notifySubscriptionUpdateEventHandler', event)
    }
}
