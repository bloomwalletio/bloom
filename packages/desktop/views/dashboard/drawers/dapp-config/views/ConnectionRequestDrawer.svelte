<script lang="ts">
    import { Alert, Button, Checkbox } from '@bloomwalletio/ui'
    import { Spinner } from '@ui'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'
    import { DrawerTemplate } from '@components'
    import { sessionProposal } from '@auxiliary/wallet-connect/stores'
    import { closeDrawer } from '@desktop/auxiliary/drawer'
    import { showNotification } from '@auxiliary/notification'
    import DappInformationCard from '../components/DappInformationCard.svelte'

    enum SessionVerification {
        Valid = 'VALID',
        Invalid = 'INVALID',
        Unknown = 'UNKNOWN',
    }

    export let drawerRouter: Router<unknown>

    let acceptedInsecureConnection = false
    $: isInsecure =
        !$sessionProposal || $sessionProposal.verifyContext.verified.validation !== SessionVerification.Valid

    function onRejectClick(): void {
        $sessionProposal = undefined
        closeDrawer()

        showNotification({
            variant: 'error',
            text: localize('notifications.newDappConnection.rejected'),
        })
    }

    function onContinueClick(): void {
        drawerRouter.next()
    }
</script>

<DrawerTemplate title={localize('views.dashboard.drawers.dapps.connectionRequest.title')} {drawerRouter}>
    <div class="w-full h-full flex flex-col justify-between">
        {#if $sessionProposal}
            <DappInformationCard metadata={$sessionProposal.params.proposer.metadata} />

            <div class="px-6">
                {#if isInsecure}
                    <div class="flex flex-col gap-8">
                        <Alert
                            variant="danger"
                            text={localize('views.dashboard.drawers.dapps.connectionRequest.insecure')}
                        />
                        <Checkbox
                            label={localize('views.dashboard.drawers.dapps.connectionRequest.acceptInsecureConnection')}
                            bind:checked={acceptedInsecureConnection}
                        />
                    </div>
                {:else}
                    <Alert variant="warning" text={localize('views.dashboard.drawers.dapps.connectionRequest.hint')} />
                {/if}
            </div>
        {:else}
            <div class="w-full h-full flex items-center justify-center">
                <Spinner busy size={50} />
            </div>
        {/if}
    </div>
    <div class="flex flex-row gap-2" slot="footer">
        <Button width="full" variant="outlined" on:click={onRejectClick} text={localize('actions.reject')} />
        <Button
            width="full"
            on:click={onContinueClick}
            disabled={isInsecure && !acceptedInsecureConnection}
            text={localize('actions.continue')}
        />
    </div>
</DrawerTemplate>
