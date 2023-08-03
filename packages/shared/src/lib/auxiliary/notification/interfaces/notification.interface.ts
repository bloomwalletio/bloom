import { NotificationVariant } from '../types'
import { INotificationAction } from './notification-action.interface'

export interface INotification {
    id: string
    variant: NotificationVariant | 'appUpdate'
    text: string
    creationTime: number
    duration: number
    action?: INotificationAction
}
