<script lang="ts">
    import { pairWithNewDapp } from '@auxiliary/wallet-connect/actions'
    import { Alert, Button, SidebarToast, TextInput } from '@bloomwalletio/ui'
    import { DrawerTemplate } from '@components'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'
    import { onMount } from 'svelte'
    import { rejectAndClearSessionInitiationRequest, validateConnectionCodeUri } from '@auxiliary/wallet-connect/utils'
    import { updateDrawerProps } from '@desktop/auxiliary/drawer'

    export let drawerRouter: Router<unknown>
    export let initialWalletConnectUri: string = ''

    let walletConnectUri: string = initialWalletConnectUri
    let error: string | undefined
    const localeKey = 'views.dashboard.drawers.dapps.inputConnectionCode'

    $: isDeprecated = String(error) === 'Error: ' + localize('error.walletConnect.deprecatedVersion')

    function onConnectClick(): void {
        if (isValid()) {
            try {
                pairWithNewDapp(walletConnectUri)
                updateDrawerProps({
                    onClose: () => void rejectAndClearSessionInitiationRequest(),
                })
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

<DrawerTemplate title={localize(`${localeKey}.title`)} {drawerRouter}>
    <div class="h-full flex flex-col gap-4 justify-between px-6">
        <div class="flex flex-col gap-4">
            <SidebarToast
                color="neutral"
                header={localize(`${localeKey}.addDapp`)}
                body={localize(`${localeKey}.addDappDescription`)}
                dismissable={false}
            />
            <TextInput bind:value={walletConnectUri} {error} label={localize(`${localeKey}.inputLabel`)} autofocus />
        </div>
        {#if isDeprecated}
            <Alert variant="danger" text={localize(`${localeKey}.deprecated`)} />
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
