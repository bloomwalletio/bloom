import { app, ipcMain } from 'electron'
import os from 'os'
import { Identify, identify, init, track } from '@amplitude/analytics-node'
import { CountryApi } from '@auxiliary/country/api'

import features from '@features/features'

import { getPlatformVersion } from './diagnostics.utils'
import { getMachineId } from './os.utils'
import { getDataFromApp } from './storage.utils'
import { IPersistedProfile } from '@core/profile'

export async function initialiseAnalytics(): Promise<void> {
    if (features.analytics.enabled && process.env.AMPLITUDE_API_KEY) {
        // Initialise Amplitude with API key
        init(process.env.AMPLITUDE_API_KEY, { logLevel: 0 })

        await setInitialIdentify()
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

async function getCountryCode(): Promise<string> {
    const api = new CountryApi()
    const countryCode = await api.getCountryCode()
    return countryCode ?? ''
}

async function getProfilesAndAccountsCount(): Promise<{ profiles: number; accounts: number }> {
    const userDataPath = app.getPath('userData')
    const appName = app.getName()

    let profiles: IPersistedProfile[] = []
    try {
        const data = await getDataFromApp(appName, userDataPath)
        if (!data) {
            return { profiles: 0, accounts: 0 }
        }
        const separator = String.fromCharCode(1)
        Object.values(data).forEach(({ key, value }) => {
            if (key.split(separator)[1] === 'profiles') {
                profiles = JSON.parse(value)
                return
            }
        })
    } catch (err) {
        console.error(err)
        return { profiles: 0, accounts: 0 }
    }

    const profilesCount = profiles.length
    const accountsCount = profiles.reduce((acc, profile) => acc + Object.keys(profile.accountPersistedData).length, 0)

    return { profiles: profilesCount, accounts: accountsCount }
}

async function setInitialIdentify(): Promise<void> {
    const identifyObj = new Identify()

    // Application Information
    identifyObj.set('app_name', app.getName())
    identifyObj.set('app_version', app.getVersion())

    // Platform Information
    identifyObj.setOnce('platform', os.platform())
    identifyObj.setOnce('platform_architecture', os.arch())
    identifyObj.set('platform_version', getPlatformVersion())

    // User Information
    identifyObj.setOnce('country_code', await getCountryCode())
    const { profiles, accounts } = await getProfilesAndAccountsCount()
    identifyObj.set('profile_count', profiles)
    identifyObj.set('account_count', accounts)

    identify(identifyObj, { device_id: getMachineId() })
}
