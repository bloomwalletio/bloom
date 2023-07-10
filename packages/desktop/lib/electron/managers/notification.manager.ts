import { ipcRenderer } from 'electron'
import type { INotificationManager } from '@core/app'

export default class NotificationManager implements INotificationManager {
    public notify(message: string, contextData: unknown): void {
        const notification = new Notification('Bloom', {
            body: message,
            data: contextData,
        })

        notification.onclick = (event: NotificationEventMap['click']): void => {
            ipcRenderer.send('notification-activated', (event.target as Notification).data)
        }
    }
}
