<script lang="ts">
    import { onMount } from 'svelte'
    import { AddressBox, NetworkInput } from '@ui'
    import { localize } from '@core/i18n'
    import { selectedAccount } from '@core/account/stores'
    import { setClipboard } from '@core/utils'
    import { isEvmChain, isStardustNetwork, network, NetworkId } from '@core/network'
    import { generateAndStoreEvmAddressForAccounts, pollL2BalanceForAccount } from '@core/layer-2/actions'
    import { activeProfile } from '@core/profile/stores'
    import { checkActiveProfileAuthAsync } from '@core/profile/actions'
    import { LedgerAppName } from '@core/ledger'
    import PopupTemplate from '../PopupTemplate.svelte'
    import { handleError } from '@core/error/handlers'

    export let selectedNetworkId: NetworkId = $network.getMetadata().id
    $: selectedNetworkId, updateNetworkNameAndAddress()

    let networkName: string
    let receiveAddress: string
    async function updateNetworkNameAndAddress(): Promise<void> {
        if (isEvmChain(selectedNetworkId)) {
            const { name, coinType } = $network.getChain(selectedNetworkId)?.getConfiguration() ?? {}
            networkName = name
            receiveAddress = $selectedAccount.evmAddresses?.[coinType]
            if (receiveAddress) return

            try {
                await checkActiveProfileAuthAsync(LedgerAppName.Ethereum)
            } catch (error) {
                return
            }

            try {
                await generateAndStoreEvmAddressForAccounts($activeProfile.type, coinType, $selectedAccount)
                pollL2BalanceForAccount($selectedAccount)
                receiveAddress = $selectedAccount.evmAddresses?.[coinType]
            } catch (err) {
                handleError(err)
            }
        } else if (isStardustNetwork(selectedNetworkId)) {
            networkName = $network.getMetadata().name
            receiveAddress = $selectedAccount.depositAddress
        } else {
            networkName = undefined
            receiveAddress = undefined
        }
    }

    onMount(() => {
        updateNetworkNameAndAddress()
    })
</script>

<PopupTemplate
    title={localize('popups.receiveAddress.title')}
    description={localize('popups.receiveAddress.body')}
    continueButton={{
        text: localize('actions.copyAddress'),
        onClick: () => setClipboard(receiveAddress),
        disabled: !receiveAddress,
    }}
>
    <div class="space-y-5 flex flex-auto flex-col shrink-0">
        <NetworkInput bind:networkId={selectedNetworkId} />
        {#if receiveAddress}
            <AddressBox
                address={receiveAddress}
                title={localize('popups.receiveAddress.networkAddress', { networkName })}
                showQr
            />
        {/if}
    </div>
</PopupTemplate>
