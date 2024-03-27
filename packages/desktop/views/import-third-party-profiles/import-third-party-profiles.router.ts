import { appRouter, Subrouter } from '@core/router'
import { get, writable } from 'svelte/store'
import { ImportThirdPartyProfilesRoute } from './import-third-party-profiles-route.enum'

export const importThirdPartyProfilesRoute = writable<ImportThirdPartyProfilesRoute>(undefined)
export const importThirdPartyProfilesRouter = writable<ImportThirdPartyProfilesRouter>(undefined)

export class ImportThirdPartyProfilesRouter extends Subrouter<ImportThirdPartyProfilesRoute> {
    constructor() {
        super(ImportThirdPartyProfilesRoute.SelectApps, importThirdPartyProfilesRoute, get(appRouter))
    }

    next(): void {
        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case ImportThirdPartyProfilesRoute.SelectApps:
                this.setNext(ImportThirdPartyProfilesRoute.ImportProfiles)
                break
            case ImportThirdPartyProfilesRoute.ImportProfiles:
                break
        }
    }
}
