import { NotifyClientTypes } from '@walletconnect/notify-client'
import { NotifyEvent } from '../enums'

export function notifySubscriptionEventHandler(
    event: NotifyClientTypes.EventArguments[NotifyEvent.Subscription]
): void {
    const { error } = event.params

    if (error) {
        console.error('ERROR: notifySubscriptionEventHandler', error)
    } else {
        console.warn('notifySubscriptionEventHandler', event)
    }
}
