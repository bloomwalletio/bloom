import { writable } from 'svelte/store'

import { Router } from '@core/router'
import { ContactBookRoute } from './contact-book-route.enum'

export const contactBookRoute = writable<ContactBookRoute | null>(null)
export const contactBookRouter = writable<ContactBookRouter | null>(null)

export class ContactBookRouter extends Router<ContactBookRoute> {
    constructor() {
        super(ContactBookRoute.ContactList, contactBookRoute)
    }
}
