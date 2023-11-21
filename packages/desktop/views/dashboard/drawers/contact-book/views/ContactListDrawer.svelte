<script lang="ts">
    import { Button, IconName } from '@bloomwalletio/ui'
    import { DrawerTemplate, EmptyListPlaceholder } from '@components'
    import { ContactManager, IContact, clearSelectedContact, setSelectedContact } from '@core/contact'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'
    import features from '@features/features'
    import { onMount } from 'svelte'
    import { ContactBookRoute } from '../contact-book-route.enum'
    import { ContactList } from './components'

    export let drawerRouter: Router<unknown>

    const contacts = ContactManager.listContacts()
    $: hasContacts = contacts.length > 0

    function onAddContactClick(): void {
        drawerRouter.goTo(ContactBookRoute.AddContact)
    }

    function onContactClick(contact: IContact): void {
        setSelectedContact(contact)
        drawerRouter.goTo(ContactBookRoute.ContactInformation)
    }

    onMount(() => {
        clearSelectedContact()
    })
</script>

<DrawerTemplate
    title={localize(`views.dashboard.drawers.contactBook.${ContactBookRoute.ContactList}.title`)}
    {drawerRouter}
>
    {#if hasContacts}
        <div class="px-6">
            <ContactList {contacts} {onContactClick} />
        </div>
    {:else}
        <div class="w-full h-full flex items-center justify-center px-6">
            <EmptyListPlaceholder
                title={localize(`views.dashboard.drawers.contactBook.${ContactBookRoute.ContactList}.emptyHeader`)}
                subtitle={localize(`views.dashboard.drawers.contactBook.${ContactBookRoute.ContactList}.emptyBody`)}
                icon={IconName.Users}
            />
        </div>
    {/if}
    <div slot="footer" class="flex justify-center">
        {#if features.contacts.addContact.enabled}
            <Button
                variant="text"
                icon={IconName.Plus}
                text={localize(`views.dashboard.drawers.contactBook.${ContactBookRoute.ContactList}.addContact`)}
                on:click={onAddContactClick}
            />
        {/if}
    </div>
</DrawerTemplate>
