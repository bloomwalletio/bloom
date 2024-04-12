<script lang="ts">
    import { DrawerTemplate } from '@components'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'
    import { NetworkConfigRoute } from '../'
    import { AddIscpChainForm } from './components'
    import { Button } from '@bloomwalletio/ui'

    export let drawerRouter: Router<NetworkConfigRoute>

    let form: AddIscpChainForm
    let disabled: boolean
</script>

<DrawerTemplate title={localize('views.dashboard.drawers.networkConfig.addChain.title')} {drawerRouter}>
    <AddIscpChainForm bind:this={form} bind:disabled />
    <div slot="footer">
        <Button text={localize('actions.addChain')} on:click={form.onSubmitClick} width="full" {disabled} />
    </div>
</DrawerTemplate>
