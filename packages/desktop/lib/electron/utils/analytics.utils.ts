import { app, ipcMain } from 'electron'
import os from 'os'
import { Identify, identify, init, track } from '@amplitude/analytics-node'

import features from '@features/features'

import { getPlatformVersion } from './diagnostics.utils'
import { getMachineId } from './os.utils'

export function initialiseAnalytics(): void {
    if (features.analytics.enabled && process.env.AMPLITUDE_API_KEY) {
        // Initialise Amplitude with API key
        init(process.env.AMPLITUDE_API_KEY, { logLevel: 0 })

        setInitialIdentify()
        // Register event handlers
        ipcMain.handle('track-event', (_e, event, properties) => handleTrackEvent(event, properties))
    } else {
        if (features.analytics.enabled && !process.env.AMPLITUDE_API_KEY) {
            console.warn('Analytics is enabled but no API key is set')
        }
        ipcMain.handle('track-event', () => {})
    }
}

function handleTrackEvent(event: string, properties: Record<string, unknown>): void {
    track(event, properties, { device_id: getMachineId() })
}

function setInitialIdentify(): void {
    const identifyObj = new Identify()

    // Application Information
    identifyObj.set('app_name', app.getName())
    identifyObj.set('app_version', app.getVersion())

    // Platform Information
    identifyObj.setOnce('platform', os.platform())
    identifyObj.setOnce('platform_architecture', os.arch())
    identifyObj.set('platform_version', getPlatformVersion())

    identify(identifyObj, { device_id: getMachineId() })
}
