import { ipcRenderer } from 'electron'

export default class DeepLinkManager {
    public static checkDeepLinkRequestExists(): void {
        ipcRenderer.send('check-deep-link-request-exists')
    }

    public static clearDeepLinkRequest(): void {
        ipcRenderer.send('clear-deep-link-request')
    }
}
