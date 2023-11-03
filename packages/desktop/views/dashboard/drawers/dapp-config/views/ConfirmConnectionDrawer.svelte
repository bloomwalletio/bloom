<script lang="ts">
    import { Button } from '@bloomwalletio/ui'
    import { Spinner } from '@ui'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'
    import { DrawerTemplate } from '@components'
    import { sessionProposal } from '@auxiliary/wallet-connect/stores'
    import { getAllEvmAddresses, approveSession } from '@auxiliary/wallet-connect/utils'
    import DappInformationCard from '../components/DappInformationCard.svelte'
    import { closeDrawer } from '@desktop/auxiliary/drawer'
    import { handleError } from '@core/error/handlers'
    import { showNotification } from '@auxiliary/notification'
    import { getAllNetworkIds } from '@core/network/utils'

    export let drawerRouter: Router<unknown>

    const chains = getAllNetworkIds()
    const addresses: string[] = getAllEvmAddresses(chains)

    let loading = false

    async function onConfirmClick(): Promise<void> {
        try {
            loading = true
            await approveSession($sessionProposal, addresses)

            showNotification({
                variant: 'success',
                text: localize('notifications.newDappConnected'),
            })
            closeDrawer()
        } catch (error) {
            handleError(error)
        } finally {
            loading = false
        }
    }
</script>

<DrawerTemplate title={localize('views.dashboard.drawers.dapps.confirmConnection.title')} {drawerRouter}>
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
        width="full"
        on:click={onConfirmClick}
        disabled={!addresses.length || loading}
        busy={loading}
        text={localize('actions.confirm')}
    />
</DrawerTemplate>
