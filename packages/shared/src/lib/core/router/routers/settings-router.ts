import { get, writable } from 'svelte/store'

import { Router } from '../classes'
import { SettingsRoute, SettingsRouteNoProfile } from '../enums'

export const settingsRouter = writable<SettingsRouter | undefined>(undefined)
export const settingsRoute = writable<SettingsRoute | undefined>(undefined)

const settingsChildRoute = writable<string | null>(null)

export class SettingsRouter extends Router<SettingsRoute | SettingsRouteNoProfile> {
    constructor() {
        super(SettingsRoute.General, settingsRoute)
    }

    goToChildRoute(route: SettingsRoute, childRoute: string): void {
        super.goTo(route)
        settingsChildRoute.set(childRoute)
    }

    reset(): void {
        super.reset()
        settingsChildRoute.set(null)
    }

    getChildRouteAndReset(): string | null {
        const childRoute = get(settingsChildRoute)
        settingsChildRoute.set(null)
        return childRoute
    }
}
