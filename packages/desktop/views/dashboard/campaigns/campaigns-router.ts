import { Router } from '@core/router'
import { appRouter } from '@core/router/routers/app-router'
import { get, writable } from 'svelte/store'
import { CampaignsRoute } from './campaigns-route.enum'

export const campaignsRoute = writable<CampaignsRoute>(undefined)
export const campaignsRouter = writable<CampaignsRouter>(undefined)

export class CampaignsRouter extends Router<CampaignsRoute> {
    constructor() {
        super(CampaignsRoute.Gallery, campaignsRoute)
    }

    next(): void {
        let nextRoute: CampaignsRoute

        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case CampaignsRoute.Gallery: {
                nextRoute = CampaignsRoute.CampaignDetails
                break
            }
        }

        this.setNext(nextRoute)
    }

    previous(): void {
        if (this.history.length > 0) {
            super.previous()
        } else {
            get(appRouter).previous()
        }
    }
}
