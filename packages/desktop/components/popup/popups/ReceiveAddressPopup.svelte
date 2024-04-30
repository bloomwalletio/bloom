<script lang="ts">
    import { onMount } from 'svelte'
    import { AddressBox, NetworkInput } from '@ui'
    import { localize } from '@core/i18n'
    import { selectedAccount } from '@core/account/stores'
    import { setClipboard } from '@core/utils'
    import { getActiveNetworkId, getNetwork, NetworkId, NetworkNamespace } from '@core/network'
    import { generateAndStoreEvmAddressForAccounts, pollEvmBalancesForAccount } from '@core/layer-2/actions'
    import { activeProfile } from '@core/profile/stores'
    import { checkActiveProfileAuth } from '@core/profile/actions'
    import { LedgerAppName } from '@core/ledger'
    import PopupTemplate from '../PopupTemplate.svelte'
    import { handleError } from '@core/error/handlers'
    import { IAccountState, getAddressFromAccountForNetwork } from '@core/account'

    let selectedNetworkId: NetworkId | undefined = getActiveNetworkId()
    $: selectedNetworkId, updateNetworkNameAndAddress()

    let networkName: string | undefined
    let receiveAddress: string | undefined
    function updateNetworkNameAndAddress(): void {
        if (!selectedNetworkId) {
            return
        }

        const account = $selectedAccount as IAccountState
        const network = getNetwork(selectedNetworkId)

        networkName = network?.name
        receiveAddress = getAddressFromAccountForNetwork(account, selectedNetworkId)
        if (!receiveAddress && network?.namespace === NetworkNamespace.Evm) {
            generateAddress(account, network.coinType)
        }
    }

    async function generateAddress(account: IAccountState, coinType: number): Promise<void> {
        try {
            await checkActiveProfileAuth(LedgerAppName.Ethereum)
        } catch {
            return
        }

        try {
            await generateAndStoreEvmAddressForAccounts($activeProfile.type, coinType, account)
            pollEvmBalancesForAccount(account)
            updateNetworkNameAndAddress()
        } catch (error) {
            handleError(error)
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
        onClick: () => receiveAddress && setClipboard(receiveAddress),
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
