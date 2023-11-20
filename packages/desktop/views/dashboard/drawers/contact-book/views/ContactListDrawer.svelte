<script lang="ts">
    import { Button, Icon, IconName, Text } from '@bloomwalletio/ui'
    import { DrawerTemplate } from '@components'
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
        <div class="w-full h-full flex flex-col items-center justify-center gap-6 px-6">
            <empty-list-icon>
                <Icon name={IconName.Users} size="md" customColor="primary-500" />
            </empty-list-icon>
            <div class="flex flex-col items-center justify-center px-20 gap-4">
                <Text type="h6" align="center">
                    {localize(`views.dashboard.drawers.contactBook.${ContactBookRoute.ContactList}.emptyHeader`)}
                </Text>
                <Text textColor="secondary" align="center">
                    {localize(`views.dashboard.drawers.contactBook.${ContactBookRoute.ContactList}.emptyBody`)}
                </Text>
            </div>
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

<style lang="scss">
    empty-list-icon {
        @apply flex items-center justify-center text-center;
        @apply h-24 w-24 rounded-full shadow-elevation-4;
        @apply bg-surface dark:bg-surface-dark;
    }
</style>
