<script lang="ts">
    import { Button, Spinner } from '@ui'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'
    import { DrawerTemplate } from '@components'
    import { sessionProposal } from '@auxiliary/wallet-connect/stores'
    import { getAllEvmAddresses, approveSession } from '@auxiliary/wallet-connect/utils'
    import DappInformationCard from '../components/DappInformationCard.svelte'
    import { closeDrawer } from '@desktop/auxiliary/drawer'
    import { handleError } from '@core/error/handlers'

    export let drawerRouter: Router<unknown>

    // This is used so that we can test with different dapps, as there are no shimmerEvm dapps ready for test
    // EIP155: 1 is for Ethereum main chain and EIP155:5 is for the Goerli testnet
    const chains = ['eip155:1', 'eip155:5']
    const addresses: string[] = getAllEvmAddresses(chains)

    let loading = false

    async function onConfirmClick(): Promise<void> {
        try {
            loading = true
            await approveSession($sessionProposal, addresses)
            closeDrawer()
        } catch (error) {
            handleError(error)
        } finally {
            loading = false
        }
    }
</script>

<DrawerTemplate title={localize('views.dashboard.drawers.dApps.confirmConnection.title')} {drawerRouter}>
    <div class="w-full h-full">
        {#if $sessionProposal}
            <DappInformationCard />
        {:else}
            <div class="w-full h-full flex items-center justify-center">
                <Spinner busy size={50} />
            </div>
        {/if}
    </div>
    <Button
        slot="footer"
        classes="w-full"
        onClick={onConfirmClick}
        disabled={!addresses.length || loading}
        isBusy={loading}
    >
        {localize('actions.confirm')}
    </Button>
</DrawerTemplate>
