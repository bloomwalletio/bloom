import { Router } from '@core/router'
import { writable } from 'svelte/store'
import { ContactBookRoute } from './contact-book-route.enum'

export const contactBookRoute = writable<ContactBookRoute>(undefined)
export const contactBookRouter = writable<ContactBookRouter>(undefined)

export class ContactBookRouter extends Router<ContactBookRoute> {
    constructor() {
        super(ContactBookRoute.ContactList, contactBookRoute)
    }
}
