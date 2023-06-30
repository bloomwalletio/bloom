<script lang="ts">
    import { Table } from '@bloom-labs/ui'
    import { ContactAddressCard, DrawerTemplate } from '@components'
    import { Icon, Link, Modal, MeatballMenuButton, MenuItem, Text } from '@ui'
    import { Router } from '@core/router'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { ContactManager, selectedContact } from 'shared/src/lib/core/contacts'
    import { onMount } from 'svelte'

    export let drawerRouter: Router<unknown>

    const contactMetadataValues: { key: string; value: string }[] = []

    let modal: Modal

    onMount(() => {
        if ($selectedContact) {
            contactMetadataValues.push(
                { key: 'Name', value: $selectedContact?.name },
                { key: 'Note', value: $selectedContact?.note }
            )
        }
    })
</script>

<DrawerTemplate title={''} {drawerRouter}>
    <div slot="header" class="flex justify-between flex-1">
        <div class="flex items-center gap-2">
            <span class="h-4 w-4 bg-blue-500 rounded-full inline-block" />
            <Text fontSize={'text-16'}>Matthew Maxwell</Text>
        </div>
        <MeatballMenuButton onClick={modal?.toggle} classes="mr-8" />
    </div>
    <Modal bind:this={modal} position={{ right: '0' }} classes="mt-1.5">
        <div class="flex flex-col">
            <MenuItem icon={IconEnum.Edit} title={'Edit contact'} onClick={() => {}} />
            <MenuItem icon={IconEnum.Delete} title={'Remove contact'} onClick={() => {}} variant="error" />
        </div>
    </Modal>

    <div class="h-full flex flex-col justify-between">
        <div class="flex flex-col space-y-6">
            <Table orientation="vertical" items={contactMetadataValues} />
            <div class="flex flex-col space-y-4">
                {#each Object.entries(ContactManager.getNetworkContactAddressMapForContact($selectedContact.id)) as [networkId, contactAddressMap]}
                    <ContactAddressCard {networkId} {contactAddressMap} />
                {/each}
            </div>
        </div>
        <div class="flex justify-center items-end text-blue-500 gap-2">
            <Icon icon={IconEnum.Plus} width={12} height={12} />
            <Link>Add network address</Link>
        </div>
    </div>
</DrawerTemplate>
