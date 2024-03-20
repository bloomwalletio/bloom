import { get } from 'svelte/store'
import { appNotifications } from '../stores'
import { NotificationVariant } from '../types'

export function isNewNotification(variant: NotificationVariant): boolean {
    return get(appNotifications).filter((data) => data.variant === variant).length === 0
}
