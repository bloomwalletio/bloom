import { get } from 'svelte/store'
import { INotification } from '../interfaces'
import { notifications } from '../stores'
import { NotificationVariant } from '../types'

export function isNewNotification(variant: NotificationVariant): boolean {
    return get(notifications).filter((data: INotification) => data.variant === variant).length === 0
}
