<script lang="ts">
    import { DrawerTemplate } from '@components'
    import { Icon } from '@ui'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { connectedDapps } from '@auxiliary/wallet-connect/stores'
    import { Alert } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'
    import DappCard from '../components/DappCard.svelte'
    import { DappConfigRoute } from '../dapp-config-route.enum'

    export let drawerRouter: Router<unknown>

    function onConnectDappClick(): void {
        drawerRouter.goTo(DappConfigRoute.InputCode)
    }
</script>

<DrawerTemplate title={localize('views.dashboard.drawers.dapps.dappsList.title')} {drawerRouter}>
    {#if $connectedDapps.length}
        <connected-dapps class="flex flex-col gap-4 scrollable">
            {#each $connectedDapps as connectedDapp}
                {#if connectedDapp.metadata}
                    <DappCard {connectedDapp} />
                {/if}
            {/each}
        </connected-dapps>
    {:else}
        <Alert variant="info" text={localize('views.dashboard.drawers.dapps.dappsList.hint')} />
    {/if}

    <button
        type="button"
        class="flex flex-row items-center justify-center w-full space-x-2 bg-transparent text-blue-500 px-8 py-3 text-15 rounded-lg"
        slot="footer"
        on:click|stopPropagation={onConnectDappClick}
    >
        <Icon icon={IconEnum.Plus} height={12} />
        {localize('views.dashboard.drawers.dapps.dappsList.connectDapp')}
    </button>
</DrawerTemplate>
