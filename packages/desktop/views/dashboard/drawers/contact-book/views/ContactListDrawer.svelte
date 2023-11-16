<script lang="ts">
    import { IconName, Button, Text } from '@bloomwalletio/ui'
    import { ContactCard, DrawerTemplate } from '@components'
    import { ContactManager, IContact, clearSelectedContact, setSelectedContact } from '@core/contact'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'
    import features from '@features/features'
    import { onMount } from 'svelte'
    import { ContactBookRoute } from '../contact-book-route.enum'

    export let drawerRouter: Router<unknown>

    $: hasContacts = Object.keys(contactGroupings).length > 0

    const contactGroupings = getGroupingsForContactList()
    function getGroupingsForContactList(): { [letter: string]: IContact[] } {
        const contacts = ContactManager.listContacts().sort((a, b) =>
            a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        )

        const groupings: { [letter: string]: IContact[] } = {}
        for (const contact of contacts) {
            const lowercaseInitial = contact.name[0]?.toLowerCase()

            if (!(lowercaseInitial in groupings)) {
                groupings[lowercaseInitial] = []
            }
            groupings[lowercaseInitial].push(contact)
        }
        return groupings
    }

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
    {#if hasContacts}
        <contact-list class="flex flex-col justify-between gap-4 mb-6">
            {#each Object.keys(contactGroupings) as letter}
                <div class="flex flex-col justify-between gap-2">
                    <Text type="body1" textColor="brand">{letter.toUpperCase()}</Text>
                    {#each contactGroupings[letter] as contact}
                        <ContactCard {contact} onCardClick={() => onContactClick(contact)} />
                    {/each}
                </div>
            {/each}
        </contact-list>
    {:else}
        TODO
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
