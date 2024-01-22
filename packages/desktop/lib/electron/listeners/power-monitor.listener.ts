import { powerMonitor } from 'electron'

export function registerPowerMonitorListeners(mainWindow: Electron.WebContents | undefined): void {
    powerMonitor.on('suspend', () => {
        // MacOS, Windows and Linux
        mainWindow?.send('lock-screen')
    })
    powerMonitor.on('lock-screen', () => {
        // MacOS and Windows
        mainWindow?.send('lock-screen')
    })
}
