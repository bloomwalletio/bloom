<script lang="ts">
    import { Button, IconName } from '@bloomwalletio/ui'
    import { ContactActionsMenu, ContactAddressCard, ContactMetadataTable, DrawerTemplate } from '@components'
    import { ContactManager, selectedContact } from '@core/contact'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'
    import features from '@features/features'
    import { ContactAvatar, Text } from '@ui'
    import { FontWeight } from '@ui/enums'
    import { ContactBookRoute } from '../contact-book-route.enum'

    export let drawerRouter: Router<unknown>

    function onAddNetworkAddressClick(): void {
        drawerRouter.goTo(ContactBookRoute.AddNetworkAddress)
    }
</script>

<DrawerTemplate title={''} {drawerRouter}>
    <div slot="header" class="flex justify-between flex-1">
        <div class="flex flex-row items-center gap-2">
            <ContactAvatar contact={$selectedContact} />
            <Text fontSize={'text-16'} fontWeight={FontWeight.semibold} classes="w-48 truncate">
                {$selectedContact?.name}
            </Text>
        </div>
        <ContactActionsMenu {drawerRouter} />
    </div>
    <div class="flex flex-col gap-3">
        <ContactMetadataTable contactMetadata={$selectedContact} />
        <contact-addresses class="flex flex-col gap-4">
            {#each Object.entries(ContactManager.getNetworkContactAddressMapForContact($selectedContact.id)) as [networkId, contactAddressMap]}
                <ContactAddressCard contact={$selectedContact} {networkId} {contactAddressMap} {drawerRouter} />
            {/each}
        </contact-addresses>
    </div>
    <div slot="footer" class="flex justify-center">
        {#if features.contacts.addNetworkAddress.enabled}
            <Button
                variant="text"
                icon={IconName.Plus}
                text={localize(
                    `views.dashboard.drawers.contactBook.${ContactBookRoute.ContactInformation}.addNetworkAddress`
                )}
                width="full"
                on:click={onAddNetworkAddressClick}
            />
        {/if}
    </div>
</DrawerTemplate>
