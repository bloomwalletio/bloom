import { writable } from 'svelte/store'

import { Router } from '../classes'
import { BuySellRoute } from '../enums'

export const buySellRouter = writable<BuySellRouter>(null)
export const buySellRoute = writable<BuySellRoute>(null)

export class BuySellRouter extends Router<BuySellRoute> {
    protected breadcrumb: string | undefined

    constructor() {
        super(BuySellRoute.Main, buySellRoute)
    }

    setBreadcrumb(breadcrumb: string | undefined): void {
        this.breadcrumb = breadcrumb
    }

    getBreadcrumb(): string | undefined {
        return this.breadcrumb
    }
}
