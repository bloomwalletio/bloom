import { ipcRenderer } from 'electron'

/** Deep link manager */
// Runs in renderer process
export class DeepLinkManager {
    public static checkDeepLinkRequestExists(): void {
        ipcRenderer.send('check-deep-link-request-exists')
    }

    public static clearDeepLinkRequest(): void {
        ipcRenderer.send('clear-deep-link-request')
    }
}

export default new DeepLinkManager()
