import { get, writable } from 'svelte/store'

import { AppStage } from '../enums'

/**
 * The store containing the app stage or release environment of the application.
 */
export const appStage = writable<AppStage>(AppStage.ALPHA)

export function getAppStage(): AppStage {
    return get(appStage)
}
