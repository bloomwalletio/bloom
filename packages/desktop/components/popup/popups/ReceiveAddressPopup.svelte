<script lang="ts">
    import { notificationsManager } from '@auxiliary/wallet-connect/notifications'
    import { IAccountState, getAddressFromAccountForNetwork } from '@core/account'
    import { selectedAccount } from '@core/account/stores'
    import { handleError } from '@core/error/handlers'
    import { localize } from '@core/i18n'
    import { generateAndStoreEvmAddressForAccounts, pollEvmBalancesForAccount } from '@core/layer-2/actions'
    import { LedgerAppName } from '@core/ledger'
    import { IEvmNetwork, NetworkId, NetworkNamespace, getActiveNetworkId, getNetwork } from '@core/network'
    import { checkActiveProfileAuth } from '@core/profile/actions'
    import { activeProfile } from '@core/profile/stores'
    import { setClipboard } from '@core/utils'
    import { AddressBox, NetworkInput } from '@ui'
    import { onMount } from 'svelte'
    import PopupTemplate from '../PopupTemplate.svelte'
    import { ProfileType } from '@core/profile'

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
            generateAddress(account, network)
        }
    }

    async function generateAddress(account: IAccountState, network: IEvmNetwork): Promise<void> {
        try {
            await checkActiveProfileAuth(LedgerAppName.Ethereum)
        } catch {
            return
        }

        try {
            await generateAndStoreEvmAddressForAccounts($activeProfile.type, network.coinType, account)
            if (account.index === 0 && $activeProfile.type === ProfileType.Software) {
                try {
                    await notificationsManager.registerAccount(account, network.id, network.coinType)
                } catch (error) {
                    console.error(error)
                }
            }
            pollEvmBalancesForAccount($activeProfile.id, account)
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
        <NetworkInput mergeLayer2Options bind:networkId={selectedNetworkId} />
        {#if receiveAddress}
            <AddressBox
                address={receiveAddress}
                title={localize('popups.receiveAddress.networkAddress', { networkName })}
                showQr
            />
        {/if}
    </div>
</PopupTemplate>
