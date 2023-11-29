import { ipcRenderer } from 'electron'
import type { IDeepLinkManager } from '@core/app'

export default class DeepLinkManager implements IDeepLinkManager {
    public checkForDeepLinkRequest(): void {
        ipcRenderer.send('check-for-deep-link-request')
    }

    public clearDeepLinkRequest(): void {
        ipcRenderer.send('clear-deep-link-request')
    }
}
