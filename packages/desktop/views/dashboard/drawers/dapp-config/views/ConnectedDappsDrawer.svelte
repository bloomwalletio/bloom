<script lang="ts">
    import { connectedDapps, setSelectedDapp } from '@auxiliary/wallet-connect/stores'
    import { Alert, Button, IconName } from '@bloomwalletio/ui'
    import { DrawerTemplate } from '@components'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'
    import DappCard from '../components/DappCard.svelte'
    import { DappConfigRoute } from '../dapp-config-route.enum'
    import { IConnectedDapp } from '@auxiliary/wallet-connect/interface'

    export let drawerRouter: Router<unknown>

    function onDappCardClick(connectedDapp: IConnectedDapp): void {
        setSelectedDapp(connectedDapp)
        drawerRouter.goTo(DappConfigRoute.DappDetails)
    }

    function onConnectDappClick(): void {
        drawerRouter.goTo(DappConfigRoute.InputCode)
    }
</script>

<DrawerTemplate title={localize('views.dashboard.drawers.dapps.dappsList.title')} {drawerRouter}>
    {#if $connectedDapps.length}
        <connected-dapps class="flex flex-col gap-4 scrollable">
            {#each $connectedDapps as connectedDapp}
                {#if connectedDapp.metadata}
                    <DappCard {connectedDapp} onClick={() => onDappCardClick(connectedDapp)} />
                {/if}
            {/each}
        </connected-dapps>
    {:else}
        <Alert variant="info" text={localize('views.dashboard.drawers.dapps.dappsList.hint')} />
    {/if}
    <div slot="footer" class="flex justify-center">
        <Button
            variant="text"
            icon={IconName.Plus}
            text={localize('views.dashboard.drawers.dapps.dappsList.connectDapp')}
            on:click={onConnectDappClick}
        />
    </div>
</DrawerTemplate>
