import { writable } from 'svelte/store'
import { doesProfileHaveContacts } from '@core/contact'
import { Router } from '@core/router'
import { ContactBookRoute } from './contact-book-route.enum'

export const contactBookRoute = writable<ContactBookRoute | null>(null)
export const contactBookRouter = writable<ContactBookRouter | null>(null)

export class ContactBookRouter extends Router<ContactBookRoute> {
    constructor() {
        const initialRoute = doesProfileHaveContacts() ? ContactBookRoute.ContactList : ContactBookRoute.AddContact
        super(initialRoute, contactBookRoute)
    }
}
