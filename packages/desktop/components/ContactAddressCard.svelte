<script lang="ts">
    import { Button, Text, MeatballMenuButton, NetworkIcon } from '@ui'
    import { ButtonSize } from '@ui/enums'
    import { IContactAddressMap } from '@core/contacts'

    export let networkId: string
    export let contactAddressMap: IContactAddressMap
</script>

<div class="flex flex-col justify-between bg-white mt-6 p-6 gap-4 border border-gray-200 rounded-2xl">
    <div class="flex justify-between">
        <div class="flex">
            <NetworkIcon {networkId} />
            <Text fontSize="text-16">{networkId}</Text>
        </div>
        <MeatballMenuButton onClick={() => {}} />
    </div>
    {#each Object.values(contactAddressMap) as contactAddress}
        <div class="flex justify-between items-center">
            <div class="flex flex-col">
                <Text color="gray-600" overrideColor>{contactAddress.addressName}</Text>
                <Text fontSize="text-16">{contactAddress.address}</Text>
            </div>
            <icon-container class="flex text-blue-500">
                <Button size={ButtonSize.Small}>Send</Button>
            </icon-container>
        </div>
    {/each}
</div>
