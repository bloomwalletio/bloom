<script lang="ts">
    import { onMount } from 'svelte'

    import { ContactBookRoute } from '../contact-book-route.enum'

    import { Icon, Text } from '@ui'
    import { FontWeight } from '@ui/enums'
    import { DrawerTemplate, ContactCard } from '@components'

    import { clearSelectedContact, ContactManager, IContact, setSelectedContact } from '@core/contacts'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'

    import { Icon as IconEnum } from '@auxiliary/icon'

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
    <button
        slot="footer"
        type="button"
        on:click={onAddContactClick}
        class="w-full flex justify-center items-center text-blue-500 gap-2"
    >
        <Icon icon={IconEnum.Plus} width={12} height={12} />
        <Text fontSize="14" fontWeight={FontWeight.semibold} classes="text-blue-500" overrideColor>
            {localize(`views.dashboard.drawers.contactBook.${ContactBookRoute.ContactList}.addContact`)}
        </Text>
    </button>
</DrawerTemplate>
