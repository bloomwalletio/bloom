<script lang="ts">
    import { pairWithNewDapp } from '@auxiliary/wallet-connect/actions'
    import { Alert } from '@bloomwalletio/ui'
    import { DrawerTemplate } from '@components'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'
    import { onMount } from 'svelte'
    import { validateConnectionCodeUri } from '@auxiliary/wallet-connect/utils'
    import { Button, TextInput } from '@ui'

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
    <div class="flex flex-col gap-4">
        <Alert variant="info" text={localize('views.dashboard.drawers.dapps.inputConnectionCode.hint')} />

        <TextInput
            bind:value={walletConnectUri}
            {error}
            label={localize('views.dashboard.drawers.dapps.inputConnectionCode.inputLabel')}
            placeholder={localize('views.dashboard.drawers.dapps.inputConnectionCode.inputLabel')}
        />
        {#if isDeprecated}
            <Alert variant="warning" text={localize('views.dashboard.drawers.dapps.inputConnectionCode.deprecated')} />
        {/if}
    </div>
    <Button slot="footer" classes="w-full" onClick={onConnectClick} disabled={!walletConnectUri}>
        {localize('actions.continue')}
    </Button>
</DrawerTemplate>
