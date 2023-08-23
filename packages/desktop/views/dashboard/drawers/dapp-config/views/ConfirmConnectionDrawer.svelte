<script lang="ts">
    import { Button } from '@ui'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'
    import { DrawerTemplate } from '@components'
    import { approveSession } from '@auxiliary/wallet-connect/utils/approveSession'
    import { sessionProposal } from '@auxiliary/wallet-connect/stores'
    import Spinner from '@ui/Spinner.svelte'
    import DappInformationCard from '../components/DappInformationCard.svelte'

    export let drawerRouter: Router<unknown>

    const addresses: string[] = []

    async function onConfirmClick(): Promise<void> {
        await approveSession($sessionProposal, addresses)
        drawerRouter.previous()
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
    <Button slot="footer" classes="w-full" onClick={onConfirmClick} disabled={!addresses.length}>
        {localize('actions.confirm')}
    </Button>
</DrawerTemplate>
