import { writable } from 'svelte/store'
import { IAppUpdateState } from '../interfaces'

const DEFAULT_APP_UPDATE_STATE: IAppUpdateState = {
    progress: 0,
    minutesRemaining: -1,
    busy: false,
    complete: false,
    error: false,
}

export const appUpdateState = writable<IAppUpdateState>(DEFAULT_APP_UPDATE_STATE)

export function resetAppUpdateState(): void {
    appUpdateState.set(DEFAULT_APP_UPDATE_STATE)
}

export function updateAppUpdateState(state: Partial<IAppUpdateState>): void {
    appUpdateState.update((current) => ({
        ...current,
        ...state,
    }))
}
