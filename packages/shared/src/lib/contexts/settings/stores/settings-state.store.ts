import { writable } from 'svelte/store'

export interface ISettingsState {
    open: boolean
}

export const DEFAULT_SETTINGS_STATE: ISettingsState = {
    open: false,
}

export const settingsState = writable<ISettingsState>(DEFAULT_SETTINGS_STATE)

export function openSettings(): void {
    settingsState.update((state) => ({
        ...state,
        open: true,
    }))
}

export function closeSettings(): void {
    settingsState.update((state) => ({
        ...state,
        open: false,
    }))
}
