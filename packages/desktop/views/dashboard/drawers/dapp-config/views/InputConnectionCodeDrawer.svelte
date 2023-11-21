<script lang="ts">
    import { pairWithNewDapp } from '@auxiliary/wallet-connect/actions'
    import { Alert, Button, TextInput } from '@bloomwalletio/ui'
    import { DrawerTemplate } from '@components'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'
    import { onMount } from 'svelte'
    import { validateConnectionCodeUri } from '@auxiliary/wallet-connect/utils'

    export let drawerRouter: Router<unknown>
    export let initialWalletConnectUri: string = ''

    let walletConnectUri: string = initialWalletConnectUri
    let error: string | undefined

    $: isDeprecated = String(error) === 'Error: ' + localize('error.walletConnect.deprecatedVersion')

    function onConnectClick(): void {
        if (isValid()) {
            try {
                pairWithNewDapp(walletConnectUri)

                drawerRouter.next()
            } catch (err) {
                error = err
            }
        }
    }

    function isValid(): boolean {
        error = ''
        try {
            validateConnectionCodeUri(walletConnectUri)
        } catch (err) {
            error = err
        }
        return !error
    }

    onMount(() => {
        if (initialWalletConnectUri) {
            isValid()
        }
    })
</script>

<DrawerTemplate title={localize('views.dashboard.drawers.dapps.inputConnectionCode.title')} {drawerRouter}>
    <div class="h-full flex flex-col gap-4 justify-between px-6">
        <div class="flex flex-col gap-4">
            <Alert variant="info" text={localize('views.dashboard.drawers.dapps.inputConnectionCode.hint')} />
            <TextInput
                bind:value={walletConnectUri}
                {error}
                label={localize('views.dashboard.drawers.dapps.inputConnectionCode.inputLabel')}
            />
        </div>
        {#if isDeprecated}
            <Alert variant="danger" text={localize('views.dashboard.drawers.dapps.inputConnectionCode.deprecated')} />
        {/if}
    </div>
    <Button
        slot="footer"
        width="full"
        on:click={onConnectClick}
        disabled={!walletConnectUri}
        text={localize('actions.continue')}
    />
</DrawerTemplate>
