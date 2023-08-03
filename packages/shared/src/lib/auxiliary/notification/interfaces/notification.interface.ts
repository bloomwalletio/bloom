import { NotificationVariant } from '../types'
import { INotificationAction } from './notification-action.interface'

export interface INotification {
    id: string
    variant: NotificationVariant
    text: string
    creationTime: number
    duration: number
    action?: INotificationAction
}

export interface IAppUpdateNotification {
    id: string
    variant: 'appUpdate'
}
