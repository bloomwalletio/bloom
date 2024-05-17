import { NotifyClientTypes } from '@walletconnect/notify-client'
import { NotifyEvent } from '../enums'

export function notifySubscriptionsChangedEventHandler(
    event: NotifyClientTypes.EventArguments[NotifyEvent.SubscriptionsChanged]
): void {
    // `subscriptions` will contain any *changed* subscriptions since the last time this event was emitted.
    // To get a full list of subscriptions for a given account you can use `notifyClient.getActiveSubscriptions({ account: 'eip155:1:0x63Be...' })`
    console.warn('notifySubscriptionsChangedEventHandler', event)
}
