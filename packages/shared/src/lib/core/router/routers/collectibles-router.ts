import { writable } from 'svelte/store'

import { Router } from '../classes'
import { CollectiblesRoute } from '../enums'

export const collectiblesRouter = writable<CollectiblesRouter | undefined>(undefined)
export const collectiblesRoute = writable<CollectiblesRoute | undefined>(undefined)
export const collectiblesBreadcrumb = writable<string | undefined>(undefined)

export class CollectiblesRouter extends Router<CollectiblesRoute> {
    protected breadcrumb: string | undefined

    constructor() {
        super(CollectiblesRoute.Gallery, collectiblesRoute)
    }

    setBreadcrumb(breadcrumb: string | undefined): void {
        this.breadcrumb = breadcrumb
        collectiblesBreadcrumb.set(breadcrumb)
    }

    getBreadcrumb(): string | undefined {
        return this.breadcrumb
    }
}
