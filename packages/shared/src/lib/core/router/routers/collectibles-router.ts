import { writable } from 'svelte/store'

import { Router } from '../classes'
import { CollectiblesRoute } from '../enums'

export const collectiblesRouter = writable<CollectiblesRouter>(null)
export const collectiblesRoute = writable<CollectiblesRoute>(null)

export class CollectiblesRouter extends Router<CollectiblesRoute> {
    protected breadcrumb: string | undefined

    constructor() {
        super(CollectiblesRoute.Gallery, collectiblesRoute)
    }

    setBreadcrumb(breadcrumb: string | undefined): void {
        this.breadcrumb = breadcrumb
    }

    getBreadcrumb(): string | undefined {
        return this.breadcrumb
    }
}
