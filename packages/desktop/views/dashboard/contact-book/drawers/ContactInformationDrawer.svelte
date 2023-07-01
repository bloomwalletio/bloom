<script lang="ts">
    import { Table } from '@bloom-labs/ui'
    import { ContactAddressCard, DrawerTemplate } from '@components'
    import { Icon, Modal, MeatballMenuButton, MenuItem, Text } from '@ui'
    import { FontWeight } from '@ui/enums'
    import { Router } from '@core/router'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { ContactManager, selectedContact } from 'shared/src/lib/core/contacts'

    export let drawerRouter: Router<unknown>

    let modal: Modal

    $: contactMetadataValues = [
        { key: 'Name', value: $selectedContact?.name },
        { key: 'Note', value: $selectedContact?.note },
    ]
</script>

<DrawerTemplate title={''} {drawerRouter}>
    <div slot="header" class="flex justify-between flex-1">
        <div class="flex items-center gap-2">
            <span class="h-4 w-4 bg-blue-500 rounded-full inline-block" />
            <Text fontSize={'text-16'} fontWeight={FontWeight.semibold}>{$selectedContact?.name}</Text>
        </div>
        <contact-information-menu class="block relative mr-8">
            <MeatballMenuButton onClick={modal?.toggle} />
            <Modal bind:this={modal} position={{ right: '0' }} classes="mt-1.5">
                <div class="flex flex-col">
                    <MenuItem icon={IconEnum.Edit} title={'Edit contact'} onClick={() => {}} />
                    <MenuItem icon={IconEnum.Delete} title={'Remove contact'} onClick={() => {}} variant="error" />
                </div>
            </Modal>
        </contact-information-menu>
    </div>
    <div class="h-full flex flex-col justify-between">
        <div class="flex flex-col gap-3">
            <Table orientation="vertical" items={contactMetadataValues} />
            <div class="flex flex-col gap-4">
                {#each Object.entries(ContactManager.getNetworkContactAddressMapForContact($selectedContact.id)) as [networkId, contactAddressMap]}
                    <ContactAddressCard {networkId} {contactAddressMap} />
                {/each}
            </div>
        </div>
        <button type="button" class="flex justify-center items-center text-blue-500 gap-2">
            <Icon icon={IconEnum.Plus} width={12} height={12} />
            <Text fontSize="text-14" fontWeight={FontWeight.semibold} classes="text-blue-500" overrideColor>
                Add network address
            </Text>
        </button>
    </div>
</DrawerTemplate>
