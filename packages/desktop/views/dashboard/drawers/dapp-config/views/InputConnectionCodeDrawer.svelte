<script lang="ts">
    import { pairWithNewDapp } from '@auxiliary/wallet-connect/actions'
    import { validateConnectionCode } from '@auxiliary/wallet-connect/utils/validateConnectionCode'
    import { Alert } from '@bloomwalletio/ui'
    import { DrawerTemplate } from '@components'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'
    import { Button, TextInput } from '@ui'

    export let drawerRouter: Router<unknown>

    let walletConnectUri: string = ''
    let error: string | undefined

    function onConnectClick(): void {
        try {
            validateConnectionCode(walletConnectUri)
            pairWithNewDapp(walletConnectUri)

            drawerRouter.next()
        } catch (err) {
            error = err
        }
    }
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
    </div>
    <Button slot="footer" classes="w-full" onClick={onConnectClick} disabled={!walletConnectUri}>
        {localize('actions.continue')}
    </Button>
</DrawerTemplate>
