import { appSettings, Platform } from '@core/app'
import { generateRandomId, PartiallyOptional } from '@core/utils'
import { get } from 'svelte/store'
import { DEFAULT_NOTIFICATION_DURATION, NOTIFICATION_DURATION_NONE } from '../constants'
import { INotification } from '../interfaces'
import { notifications, removeDisplayNotification } from '../stores'

type optionalDataKeys = 'duration'
type omittedDataKeys = 'id' | 'creationTime'

type NotificationData = Omit<PartiallyOptional<INotification, optionalDataKeys>, omittedDataKeys>

export function showNotification(
    notificationData: NotificationData,
    systemNotification?: boolean,
    appNotification: boolean = true
): string {
    const notification: INotification = {
        id: generateRandomId(),
        creationTime: Date.now(),
        variant: notificationData.variant,
        text: notificationData.text,
        duration: notificationData.duration ?? DEFAULT_NOTIFICATION_DURATION,
        action: notificationData.action,
    }

    if (systemNotification) {
        showSystemNotification(notification)
    }

    if (appNotification) {
        showAppNotification(notification)
    }

    return notification.id
}

function showAppNotification(notification: INotification): void {
    notifications.update((_currentNotifications) => {
        _currentNotifications.push(notification)
        return _currentNotifications
    })

    if (notification.duration !== NOTIFICATION_DURATION_NONE) {
        setTimeout(() => removeDisplayNotification(notification.id), notification.duration)
    }
}

function showSystemNotification(notification: INotification): void {
    if (get(appSettings).notifications && Platform.NotificationManager) {
        Platform.NotificationManager.notify(notification.text, {})
    }
}
