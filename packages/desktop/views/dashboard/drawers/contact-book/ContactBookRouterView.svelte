<script lang="ts">
    import { onDestroy, onMount } from 'svelte'
    import {
        AddContactDrawer,
        AddNetworkAddressDrawer,
        ContactInformationDrawer,
        ContactListDrawer,
        EditContactDrawer,
        EditNetworkAddressesDrawer,
        RemoveContactDrawer,
        RemoveNetworkAddressesDrawer,
    } from './views'
    import { ContactBookRoute } from './contact-book-route.enum'
    import { ContactBookRouter, contactBookRouter, contactBookRoute } from './contact-book-router'
    import { clearSelectedContact } from '@core/contact'

    onMount(() => {
        $contactBookRouter = new ContactBookRouter()
    })

    onDestroy(() => {
        $contactBookRouter.reset()
        $contactBookRouter = null
        clearSelectedContact()
    })
</script>

{#if $contactBookRoute === ContactBookRoute.ContactList}
    <ContactListDrawer drawerRouter={$contactBookRouter} />
{:else if $contactBookRoute === ContactBookRoute.AddContact}
    <AddContactDrawer drawerRouter={$contactBookRouter} />
{:else if $contactBookRoute === ContactBookRoute.AddNetworkAddress}
    <AddNetworkAddressDrawer drawerRouter={$contactBookRouter} />
{:else if $contactBookRoute === ContactBookRoute.ContactInformation}
    <ContactInformationDrawer drawerRouter={$contactBookRouter} />
{:else if $contactBookRoute === ContactBookRoute.EditContact}
    <EditContactDrawer drawerRouter={$contactBookRouter} />
{:else if $contactBookRoute === ContactBookRoute.RemoveContact}
    <RemoveContactDrawer drawerRouter={$contactBookRouter} />
{:else if $contactBookRoute === ContactBookRoute.EditNetworkAddresses}
    <EditNetworkAddressesDrawer drawerRouter={$contactBookRouter} />
{:else if $contactBookRoute === ContactBookRoute.RemoveNetworkAddresses}
    <RemoveNetworkAddressesDrawer drawerRouter={$contactBookRouter} />
{/if}
