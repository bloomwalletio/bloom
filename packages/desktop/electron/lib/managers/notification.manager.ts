import { ipcRenderer } from 'electron'

export default class NotificationManager {
    /**
     * Create and show a native notification
     * @param message - the notification message
     * @param contextData - data to associate with the notification
     * @returns void
     */
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
