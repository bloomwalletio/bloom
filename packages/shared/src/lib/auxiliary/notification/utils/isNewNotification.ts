import { get } from 'svelte/store'
import { INotification } from '../interfaces'
import { appNotifications } from '../stores'
import { NotificationVariant } from '../types'

export function isNewNotification(variant: NotificationVariant): boolean {
    return get(appNotifications).filter((data: INotification) => data.variant === variant).length === 0
}
