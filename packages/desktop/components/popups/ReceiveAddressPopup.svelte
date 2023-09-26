<script lang="ts">
    import { Button, Text } from '@bloomwalletio/ui'
    import { QR, AddressBox, NetworkInput } from '@ui'
    import { localize } from '@core/i18n'
    import { selectedAccount } from '@core/account/stores'
    import { setClipboard } from '@core/utils'
    import { ETHEREUM_COIN_TYPE, isEvmChain, isStardustNetwork, network, NetworkId } from '@core/network'

    let selectedNetworkId = $network.getMetadata().id
    $: updateNetworkNameAndAddress(selectedNetworkId)

    let networkName: string
    let receiveAddress: string
    function updateNetworkNameAndAddress(networkId: NetworkId): void {
        if (isStardustNetwork(networkId)) {
            networkName = $network.getMetadata().name
            receiveAddress = $selectedAccount.depositAddress
        } else if (isEvmChain(networkId)) {
            networkName = $network.getChain(networkId).getConfiguration().name
            receiveAddress = $selectedAccount.evmAddresses[ETHEREUM_COIN_TYPE]
        } else {
            networkName = undefined
            receiveAddress = undefined
        }
    }
</script>

<receive-address-popup class="w-full h-full space-y-4 flex flex-auto flex-col shrink-0">
    <Text type="h5" textColor="text-brand">{localize('popups.receiveAddress.title')}</Text>
    <Text type="body2" textColor="text-secondary">{localize('popups.receiveAddress.body')}</Text>
    <NetworkInput bind:networkId={selectedNetworkId} />
    {#if receiveAddress}
        <div
            class="w-full py-6 space-y-6 flex flex-col justify-center items-center rounded-xl border border-solid border-stroke bg-surface-1"
        >
            <Text type="h6" textColor="text-brand"
                >{localize('popups.receiveAddress.networkAddress', { networkName })}</Text
            >
            <QR data={receiveAddress} />
            <AddressBox address={receiveAddress} clearBackground isCopyable />
        </div>
    {/if}
    <Button
        text={localize('actions.copyAddress')}
        disabled={!receiveAddress}
        on:click={() => setClipboard(receiveAddress)}
    />
</receive-address-popup>
