<script lang="ts">
    import { onMount } from 'svelte'
    import { Button, Text } from '@bloomwalletio/ui'
    import { AddressBox, NetworkInput, QR } from '@ui'
    import { localize } from '@core/i18n'
    import { selectedAccount } from '@core/account/stores'
    import { setClipboard } from '@core/utils'
    import { isEvmChain, isStardustNetwork, network, NetworkId } from '@core/network'
    import { generateAndStoreEvmAddressForAccounts } from '@core/layer-2/actions'
    import { activeProfile } from '@core/profile/stores'
    import { checkActiveProfileAuth } from '@core/profile/actions'
    import { LedgerAppName } from '@core/ledger'

    export let selectedNetworkId: NetworkId = $network.getMetadata().id
    $: selectedNetworkId, updateNetworkNameAndAddress()

    let networkName: string
    let receiveAddress: string
    function updateNetworkNameAndAddress(): void {
        if (isStardustNetwork(selectedNetworkId)) {
            networkName = $network.getMetadata().name
            receiveAddress = $selectedAccount.depositAddress
        } else if (isEvmChain(selectedNetworkId)) {
            const { id, name, coinType } = $network.getChain(selectedNetworkId)?.getConfiguration() ?? {}
            networkName = name
            receiveAddress = $selectedAccount.evmAddresses?.[coinType]
            if (!receiveAddress) {
                void checkActiveProfileAuth(
                    async () => {
                        await generateAndStoreEvmAddressForAccounts($activeProfile.type, coinType, $selectedAccount)
                        networkName = name
                        receiveAddress = $selectedAccount.evmAddresses?.[coinType]
                    },
                    { ledger: true, stronghold: true, props: { selectedNetworkId: id } },
                    LedgerAppName.Ethereum
                )
            }
        } else {
            networkName = undefined
            receiveAddress = undefined
        }
    }

    onMount(() => {
        updateNetworkNameAndAddress()
    })
</script>

<receive-address-popup class="w-full h-full space-y-4 flex flex-auto flex-col shrink-0">
    <Text type="h5" textColor="brand">{localize('popups.receiveAddress.title')}</Text>
    <Text type="body2" textColor="secondary">{localize('popups.receiveAddress.body')}</Text>
    <NetworkInput bind:networkId={selectedNetworkId} />
    {#if receiveAddress}
        <div
            class="w-full py-6 space-y-6 flex flex-col justify-center items-center rounded-xl border border-solid border-stroke dark:border-stroke-dark bg-surface-1 dark:bg-surface-1-dark"
        >
            <Text type="h6" textColor="brand">{localize('popups.receiveAddress.networkAddress', { networkName })}</Text>
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
