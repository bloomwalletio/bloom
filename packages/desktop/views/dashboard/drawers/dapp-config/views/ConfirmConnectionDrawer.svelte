<script lang="ts">
    import { Alert, Button, Link, Text, Tile } from '@bloomwalletio/ui'
    import { Spinner } from '@ui'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'
    import { DrawerTemplate } from '@components'
    import { sessionProposal } from '@auxiliary/wallet-connect/stores'
    import { getAllEvmAddresses, approveSession } from '@auxiliary/wallet-connect/utils'
    import { closeDrawer } from '@desktop/auxiliary/drawer'
    import { handleError } from '@core/error/handlers'
    import { showNotification } from '@auxiliary/notification'
    import { getAllNetworkIds } from '@core/network/utils'

    export let drawerRouter: Router<unknown>

    const chains = getAllNetworkIds()
    const addresses: string[] = getAllEvmAddresses(chains)

    $: isInsecure = !$sessionProposal || $sessionProposal.verifyContext.verified.validation !== 'VALID'

    let loading = false

    function onRejectClick(): void {
        $sessionProposal = undefined
        closeDrawer()

        showNotification({
            variant: 'error',
            text: localize('notifications.newDappConnection.rejected'),
        })
    }

    async function onConfirmClick(): Promise<void> {
        try {
            loading = true
            await approveSession($sessionProposal, addresses)

            showNotification({
                variant: 'success',
                text: localize('notifications.newDappConnection.success'),
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
    <div class="w-full h-full flex flex-col justify-between">
        {#if $sessionProposal}
            <Tile variant="contained">
                {@const metadata = $sessionProposal?.params.proposer.metadata}
                <div class="flex flex-row gap-4 items-center">
                    <img class="dapp-image" src={metadata?.icons?.[0]} alt={metadata?.name} />
                    <div class="flex flex-col">
                        <Text type="body1" fontWeight="bold">
                            {metadata?.name}
                        </Text>
                        <Link text={metadata?.url} />
                    </div>
                </div>
            </Tile>
            {#if isInsecure}
                <Alert variant="danger" text={localize('views.dashboard.drawers.dapps.confirmConnection.insecure')} />
            {:else}
                <Alert variant="warning" text={localize('views.dashboard.drawers.dapps.confirmConnection.hint')} />
            {/if}
        {:else}
            <div class="w-full h-full flex items-center justify-center">
                <Spinner busy size={50} />
            </div>
        {/if}
    </div>
    <div class="flex flex-row gap-2" slot="footer">
        <Button
            width="full"
            variant="outlined"
            on:click={onRejectClick}
            disabled={!addresses.length || loading}
            busy={loading}
            text={localize('actions.reject')}
        />
        <Button
            width="full"
            on:click={onConfirmClick}
            disabled={!addresses.length || loading || isInsecure}
            busy={loading}
            text={localize('actions.confirm')}
        />
    </div>
</DrawerTemplate>

<style lang="scss">
    .dapp-image {
        width: 40px;
        height: 40px;
        border-radius: 40px;
    }
</style>
