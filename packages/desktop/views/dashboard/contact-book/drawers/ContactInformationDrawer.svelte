<script lang="ts">
    import { Table } from '@bloom-labs/ui'

    import { ContactBookRoute } from '../contact-book-route.enum'

    import { Icon, Modal, MeatballMenuButton, MenuItem, Text } from '@ui'
    import { FontWeight } from '@ui/enums'
    import { ContactAddressCard, DrawerTemplate } from '@components'

    import { ContactManager, selectedContact } from '@core/contacts'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'

    import { Icon as IconEnum } from '@auxiliary/icon'

    export let drawerRouter: Router<unknown>

    let modal: Modal

    let contactMetadataValues: { key: string; value: string }[]

    $: $selectedContact?.name, contactMetadataValues = [
        { key: 'Name', value: $selectedContact?.name },
        { key: 'Note', value: $selectedContact?.note },
    ]

    function onEditContactClick(): void {
        drawerRouter.goTo(ContactBookRoute.UpdateContact)
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
            <span class="h-5 w-5 rounded-full" style="background-color: {$selectedContact?.color}"></span>
            <Text fontSize={'text-16'} fontWeight={FontWeight.semibold} classes="w-64 truncate">
                {$selectedContact?.name}
            </Text>
        </div>
        <contact-information-menu class="block relative mr-8">
            <MeatballMenuButton onClick={modal?.toggle} />
            <Modal bind:this={modal} position={{ right: '0' }} classes="mt-1.5">
                <div class="flex flex-col">
                    <MenuItem
                        icon={IconEnum.Edit}
                        title={localize(`views.dashboard.drawers.contactBook.${ContactBookRoute.ContactInformation}.editContact`)}
                        onClick={onEditContactClick}
                    />
                    <MenuItem
                        icon={IconEnum.Delete}
                        title={localize(`views.dashboard.drawers.contactBook.${ContactBookRoute.ContactInformation}.removeContact`)}
                        onClick={onRemoveContactClick}
                        variant="error"
                    />
                </div>
            </Modal>
        </contact-information-menu>
    </div>
    <div class="flex flex-col gap-3">
        <Table orientation="vertical" items={contactMetadataValues} />
        <contact-addresses class="flex flex-col gap-4">
            {#each Object.entries(ContactManager.getNetworkContactAddressMapForContact($selectedContact.id)) as [networkId, contactAddressMap]}
                <ContactAddressCard {networkId} {contactAddressMap} {drawerRouter} />
            {/each}
        </contact-addresses>
    </div>
    <button
        slot="footer"
        type="button"
        on:click={onAddNetworkAddressClick}
        class="w-full flex justify-center items-center text-blue-500 gap-2"
    >
        <Icon icon={IconEnum.Plus} width={12} height={12} />
        <Text fontSize="14" fontWeight={FontWeight.semibold} classes="text-blue-500" overrideColor>
            {localize(`views.dashboard.drawers.contactBook.${ContactBookRoute.ContactInformation}.addNetworkAddress`)}
        </Text>
    </button>
</DrawerTemplate>
