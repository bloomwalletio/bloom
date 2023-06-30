<script lang="ts">
    import { onMount } from 'svelte'
    import { localize } from '@core/i18n'
    import { DrawerTemplate, ContactCard } from '@components'
    import { Router } from '@core/router'
    import { ContactBookRoute } from '../contact-book-route.enum'
    import { ContactManager, clearSelectedContact } from '@core/contacts'
    import { Icon } from '@ui'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { IContact, setSelectedContact } from '@core/contacts'

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
    <div class="h-full flex flex-col justify-between">
        <div class="flex flex-col justify-between gap-4 mb-6">
            {#each contacts as contact}
                <ContactCard {contact} onCardClick={() => onContactClick(contact)} />
            {/each}
        </div>

        <button
            type="button"
            class="flex flex-row items-center justify-center w-full space-x-2 bg-transparent text-blue-500 px-8 py-3 text-15 rounded-lg"
            on:click|stopPropagation={onAddContactClick}
        >
            <Icon icon={IconEnum.Plus} height={12} />
            {localize(`views.dashboard.drawers.contactBook.${ContactBookRoute.ContactList}.addContact`)}
        </button>
    </div>
</DrawerTemplate>
