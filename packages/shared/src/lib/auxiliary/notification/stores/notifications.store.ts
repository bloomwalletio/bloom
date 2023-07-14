import { writable } from 'svelte/store'

import { DEFAULT_NOTIFICATION_DURATION, NOTIFICATION_DURATION_NONE } from '../constants'
import { INotification } from '../interfaces'

export const notifications = writable<INotification[]>([])

export function removeDisplayNotification(id: string): void {
    notifications.update((_currentNotifications) => {
        const idx = _currentNotifications.findIndex((n) => n.id === id)
        if (idx >= 0) {
            _currentNotifications.splice(idx, 1)
        }
        return _currentNotifications
    })
}

export function updateDisplayNotificationProgress(id: string, progress: number): void {
    notifications.update((_currentNotifications) => {
        const notification = _currentNotifications.find((n) => n.id === id)
        if (notification) {
            notification.progress = Math.min(Math.max(progress, 0), 100)
        }
        return _currentNotifications
    })
}

export function updateDisplayNotification(id: string, updateData: INotification): void {
    notifications.update((_currentNotifications) => {
        const notification = _currentNotifications.find((n) => n.id === id)
        if (notification) {
            notification.message = updateData.message
            notification.subMessage = updateData.subMessage
            notification.progress = updateData.progress
            notification.actions = updateData.actions
            notification.timeout = updateData.timeout ?? DEFAULT_NOTIFICATION_DURATION

            if (notification.timeout !== NOTIFICATION_DURATION_NONE) {
                setTimeout(() => removeDisplayNotification(notification.id), notification.timeout)
            }
        }
        return _currentNotifications
    })
}
