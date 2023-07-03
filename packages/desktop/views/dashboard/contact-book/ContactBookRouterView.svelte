<script lang="ts">
    import { onDestroy, onMount } from 'svelte'
    import {
        ContactInformationDrawer,
        ContactListDrawer,
        AddContactDrawer,
        AddNetworkAddressDrawer,
        UpdateContactDrawer,
        RemoveContactDrawer,
        UpdateNetworkAddressesDrawer,
        RemoveNetworkAddressesDrawer,
    } from './drawers'
    import { ContactBookRoute } from './contact-book-route.enum'
    import { ContactBookRouter, contactBookRouter, contactBookRoute } from './contact-book-router'
    import { clearSelectedContact } from '@core/contacts'

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
{:else if $contactBookRoute === ContactBookRoute.UpdateContact}
    <UpdateContactDrawer drawerRouter={$contactBookRouter} />
{:else if $contactBookRoute === ContactBookRoute.RemoveContact}
    <RemoveContactDrawer drawerRouter={$contactBookRouter} />
{:else if $contactBookRoute === ContactBookRoute.UpdateNetworkAddresses}
    <UpdateNetworkAddressesDrawer drawerRouter={$contactBookRouter} />
{:else if $contactBookRoute === ContactBookRoute.RemoveNetworkAddresses}
    <RemoveNetworkAddressesDrawer drawerRouter={$contactBookRouter} />
{/if}
