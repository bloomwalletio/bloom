import { Router } from '@core/router'
import { appRouter } from '@core/router/routers/app-router'
import { get, writable } from 'svelte/store'
import { CampaignsRoute } from './campaigns-route.enum'

export const campaignsRoute = writable<CampaignsRoute>(undefined)
export const campaignsRouter = writable<CampaignsRouter>(undefined)

export class CampaignsRouter extends Router<CampaignsRoute> {
    protected breadcrumb: string | undefined
    constructor() {
        super(CampaignsRoute.Gallery, campaignsRoute)
    }

    previous(): void {
        if (this.history.length > 0) {
            super.previous()
        } else {
            get(appRouter)?.previous()
        }
    }

    setBreadcrumb(breadcrumb: string | undefined): void {
        this.breadcrumb = breadcrumb
    }

    getBreadcrumb(): string | undefined {
        return this.breadcrumb
    }
}
