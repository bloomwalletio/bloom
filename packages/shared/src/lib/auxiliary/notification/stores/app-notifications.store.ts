import { writable } from 'svelte/store'
import { Notification } from '../types'

export const appNotifications = writable<Notification[]>([])

export function addAppNotification(notification: Notification): void {
    appNotifications.update((_currentNotifications) => {
        _currentNotifications.push(notification)
        return _currentNotifications
    })
}

export function removeAppNotification(id: string): void {
    appNotifications.update((_currentNotifications) => {
        const idx = _currentNotifications.findIndex((n) => n.id === id)
        if (idx >= 0) {
            _currentNotifications.splice(idx, 1)
        }
        return _currentNotifications
    })
}
