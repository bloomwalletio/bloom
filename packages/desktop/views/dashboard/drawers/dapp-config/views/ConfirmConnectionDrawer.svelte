<script lang="ts">
    import { Button, Spinner } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'
    import { DrawerTemplate } from '@components'
    import OneClickAuthFlow from './OneClickAuthFlow.svelte'
    import SessionProposalFlow from './SessionProposalFlow.svelte'
    import { sessionInitiationRequest } from '@auxiliary/wallet-connect/stores'
    import { closeDrawer } from '@desktop/auxiliary/drawer'
    import { SessionInitiationType } from '@auxiliary/wallet-connect/enums'

    export let drawerRouter: Router<unknown>

    const localeKey = 'views.dashboard.drawers.dapps.confirmConnection'
</script>

{#if $sessionInitiationRequest?.type === SessionInitiationType.SessionProposal}
    <SessionProposalFlow sessionProposal={$sessionInitiationRequest.payload} {drawerRouter} />
{:else if $sessionInitiationRequest?.type === SessionInitiationType.SessionAuthenticate}
    <OneClickAuthFlow sessionProposal={$sessionInitiationRequest.payload} {drawerRouter} />
{:else}
    <DrawerTemplate title={localize(`${localeKey}.title`)} {drawerRouter}>
        <div class="w-full h-full flex items-center justify-center">
            <Spinner size="lg" textColor="primary" />
        </div>
        <div slot="footer" class="flex flex-row gap-2">
            <Button variant="outlined" width="full" on:click={closeDrawer} text={localize('actions.cancel')} />
        </div>
    </DrawerTemplate>
{/if}
