import { NotificationCallback } from '../types'

export interface INotificationAction {
    label: string
    callback: NotificationCallback
    isSecondary?: boolean
}
