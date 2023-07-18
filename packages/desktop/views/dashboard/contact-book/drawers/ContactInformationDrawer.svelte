<script lang="ts">
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { Button, FlatIconName } from '@bloom-labs/ui'
    import { ContactAddressCard, ContactMetadataTable, DrawerTemplate } from '@components'
    import { ContactManager, selectedContact } from '@core/contact'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'
    import { MeatballMenuButton, MenuItem, Modal, Text } from '@ui'
    import { FontWeight } from '@ui/enums'
    import features from '@features/features'
    import { ContactBookRoute } from '../contact-book-route.enum'

    export let drawerRouter: Router<unknown>

    let modal: Modal

    function onEditContactClick(): void {
        drawerRouter.goTo(ContactBookRoute.EditContact)
    }

    function onRemoveContactClick(): void {
        drawerRouter.goTo(ContactBookRoute.RemoveContact)
    }

    function onAddNetworkAddressClick(): void {
        drawerRouter.goTo(ContactBookRoute.AddNetworkAddress)
    }
</script>

<DrawerTemplate title={''} {drawerRouter}>
    <div slot="header" class="flex justify-between flex-1">
        <div class="flex items-center gap-2">
            <span class="h-5 w-5 rounded-full" style="background-color: {$selectedContact?.color}" />
            <Text fontSize={'text-16'} fontWeight={FontWeight.semibold} classes="w-48 truncate">
                {$selectedContact?.name}
            </Text>
        </div>
        <contact-information-menu class="block relative mr-4">
            <MeatballMenuButton onClick={modal?.toggle} />
            <Modal bind:this={modal} position={{ right: '0' }} classes="mt-1.5">
                <div class="flex flex-col">
                    {#if features.contacts.editContact.enabled}
                        <MenuItem
                            icon={IconEnum.Edit}
                            iconProps={{ height: 18 }}
                            title={localize(
                                `views.dashboard.drawers.contactBook.${ContactBookRoute.ContactInformation}.editContact`
                            )}
                            onClick={onEditContactClick}
                        />
                    {/if}
                    {#if features.contacts.removeContact.enabled}
                        <MenuItem
                            icon={IconEnum.Delete}
                            title={localize(
                                `views.dashboard.drawers.contactBook.${ContactBookRoute.ContactInformation}.removeContact`
                            )}
                            onClick={onRemoveContactClick}
                            variant="error"
                        />
                    {/if}
                </div>
            </Modal>
        </contact-information-menu>
    </div>
    <div class="flex flex-col gap-3">
        <ContactMetadataTable contactMetadata={$selectedContact} />
        <contact-addresses class="flex flex-col gap-4">
            {#each Object.entries(ContactManager.getNetworkContactAddressMapForContact($selectedContact.id)) as [networkId, contactAddressMap]}
                <ContactAddressCard {networkId} {contactAddressMap} {drawerRouter} />
            {/each}
        </contact-addresses>
    </div>
    {#if features.contacts.addNetworkAddress.enabled}
        <Button
            slot="footer"
            class="w-full"
            on:click={onAddNetworkAddressClick}
            flatIcon={FlatIconName.Add}
            text={localize(
                `views.dashboard.drawers.contactBook.${ContactBookRoute.ContactInformation}.addNetworkAddress`
            )}
        />
    {/if}
</DrawerTemplate>
