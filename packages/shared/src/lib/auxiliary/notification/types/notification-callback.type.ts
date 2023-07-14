import { INotification } from '../interfaces'

export type NotificationCallback = (data: INotification, actionIndex: number) => void
