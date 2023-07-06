import { ipcRenderer } from 'electron'
import type { IDeepLinkManager } from '@core/app'

export default class DeepLinkManager implements IDeepLinkManager {
    public checkDeepLinkRequestExists(): void {
        ipcRenderer.send('check-deep-link-request-exists')
    }

    public clearDeepLinkRequest(): void {
        ipcRenderer.send('clear-deep-link-request')
    }
}
