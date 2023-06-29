import { ipcRenderer } from 'electron'

export default class NotificationManager {
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
