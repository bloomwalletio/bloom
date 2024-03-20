import { powerMonitor } from 'electron'
import { windows } from '../constants/windows.constant'

export function registerPowerMonitorListeners(): void {
    powerMonitor.on('suspend', () => {
        // MacOS, Windows and Linux
        windows.main?.webContents?.send('lock-screen')
    })
    powerMonitor.on('lock-screen', () => {
        // MacOS and Windows
        windows.main?.webContents?.send('lock-screen')
    })
}
