import { writable } from 'svelte/store'

import { persistent } from '@core/utils/store'

import { DEFAULT_APP_SETTINGS } from '../constants/default-app-settings.constant'
import { IAppSettings } from '../interfaces'
import { darkMode } from './dark-mode.store'
import { Platform } from '../classes/platform.class'

/**
 * The store containing the application settings used throughout the entire app.
 */
export const appSettings = persistent<IAppSettings>('settings', DEFAULT_APP_SETTINGS)

/**
 * The store containing the initial application settings from the beginning of the current
 * session.
 *
 * CAUTION: This variable is READ-ONLY - you write at your own risk.
 */
export const initAppSettings = writable<Readonly<Partial<IAppSettings>>>(DEFAULT_APP_SETTINGS)

export function updateAppSettings(partialSettings: Partial<IAppSettings>): void {
    appSettings.update((state) => ({ ...state, ...partialSettings }))
}

appSettings.subscribe(async (state) => {
    if (state.theme) {
        await Platform.updateTheme(state.theme)
        const shouldBeDarkMode = await Platform.shouldBeDarkMode()
        darkMode.set(shouldBeDarkMode)
    }
})
