import { writable } from 'svelte/store'

import { getActiveProfile } from '@core/profile'
import { Router } from '@core/router'

import { ContactBookRoute } from './contact-book-route.enum'

export const contactBookRoute = writable<ContactBookRoute | null>(null)
export const contactBookRouter = writable<ContactBookRouter | null>(null)

export class ContactBookRouter extends Router<ContactBookRoute> {
    constructor() {
        const hasContacts = Object.keys(getActiveProfile()?.contacts).length > 0
        const initialRoute = hasContacts ? ContactBookRoute.ContactList : ContactBookRoute.AddContact
        super(initialRoute, contactBookRoute)
    }
}
