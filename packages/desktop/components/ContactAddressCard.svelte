<script lang="ts">
    import { Button, Text, MeatballMenuButton, MenuItem, Modal, NetworkIcon } from '@ui'
    import { ButtonSize, FontWeight } from '@ui/enums'
    import { IContactAddressMap } from '@core/contacts'
    import { NetworkId } from '@core/network'
    import { setClipboard, truncateString } from '@core/utils'
    import { Icon as IconEnum } from '@auxiliary/icon'

    export let networkId: string
    export let contactAddressMap: IContactAddressMap

    let modal: Modal

    function onAddressClick(address: string): void {
        setClipboard(address, true)
    }
</script>

<div class="flex flex-col justify-between bg-white p-6 gap-4 border border-solid border-gray-200 rounded-xl">
    <div class="flex justify-between">
        <div class="flex items-center gap-2">
            <NetworkIcon networkId={NetworkId.Testnet} />
            <Text fontSize="text-16" fontWeight={FontWeight.semibold}>{networkId}</Text>
        </div>
        <contact-address-menu class="block relative">
            <MeatballMenuButton onClick={modal?.toggle} />
            <Modal bind:this={modal} position={{ right: '0' }} classes="mt-1.5">
                <div class="flex flex-col">
                    <MenuItem icon={IconEnum.Edit} title={'Edit network addresses'} onClick={() => {}} />
                    <MenuItem icon={IconEnum.Delete} title={'Remove network'} onClick={() => {}} variant="error" />
                </div>
            </Modal>
        </contact-address-menu>
    </div>
    {#each Object.values(contactAddressMap) as contactAddress}
        <div class="flex justify-between items-center">
            <div class="flex flex-col">
                <Text overrideColor classes="text-gray-600" fontWeight={FontWeight.medium}>
                    {contactAddress.addressName}
                </Text>
                <button type="button" on:click={() => onAddressClick(contactAddress.address)}>
                    <Text fontSize="text-16" fontWeight={FontWeight.medium}>
                        {truncateString(contactAddress.address, 9, 9)}
                    </Text>
                </button>
            </div>
            <icon-container class="flex text-blue-500">
                <Button size={ButtonSize.Small}>Send</Button>
            </icon-container>
        </div>
    {/each}
</div>
