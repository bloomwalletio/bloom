<script lang="ts">
    import { FlatIconName, Button } from '@bloom-labs/ui'
    import { ContactCard, DrawerTemplate } from '@components'
    import { ContactManager, IContact, clearSelectedContact, setSelectedContact } from '@core/contact'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'
    import features from '@features/features'
    import { onMount } from 'svelte'
    import { ContactBookRoute } from '../contact-book-route.enum'

    export let drawerRouter: Router<unknown>

    const contacts = ContactManager.listContacts()

    function onContactClick(contact: IContact): void {
        setSelectedContact(contact)
        drawerRouter.goTo(ContactBookRoute.ContactInformation)
    }

    function onAddContactClick(): void {
        drawerRouter.goTo(ContactBookRoute.AddContact)
    }

    onMount(() => {
        clearSelectedContact()
    })
</script>

<DrawerTemplate
    title={localize(`views.dashboard.drawers.contactBook.${ContactBookRoute.ContactList}.title`)}
    {drawerRouter}
>
    <contact-list class="flex flex-col justify-between gap-4 mb-6">
        {#each contacts as contact}
            <ContactCard {contact} onCardClick={() => onContactClick(contact)} />
        {/each}
    </contact-list>
    {#if features.contacts.addContact.enabled}
        <Button
            class="w-full"
            variant="info"
            icon={FlatIconName.Add}
            text={localize(`views.dashboard.drawers.contactBook.${ContactBookRoute.ContactList}.addContact`)}
            on:click={onAddContactClick}
        />
    {/if}
</DrawerTemplate>
