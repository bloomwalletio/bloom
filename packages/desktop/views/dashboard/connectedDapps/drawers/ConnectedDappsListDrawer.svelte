<script lang="ts">
    import { Icon } from '@ui'
    import { NetworkConfigRoute, networkConfigRouter } from '@desktop/routers'
    import { clearSelectedChain } from '@core/network'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { localize } from '@core/i18n'
    import { onMount } from 'svelte'
    import { Router } from '@core/router'
    import { DrawerTemplate } from '@components'

    export let drawerRouter: Router<unknown>

    function onConnectDappClick(): void {
        $networkConfigRouter.goTo(NetworkConfigRoute.AddChain)
    }

    onMount(() => {
        clearSelectedChain()
    })
</script>

<DrawerTemplate title={localize('views.dashboard.drawers.connectedDapps.connectedDappsList.title')} {drawerRouter}>
    <connected-chains-drawer class="h-full flex flex-col justify-between">
        <div class="flex flex-col gap-4">
            <!-- add list here -->
        </div>
    </connected-chains-drawer>

    <button
        type="button"
        class="flex flex-row items-center justify-center w-full space-x-2 bg-transparent text-blue-500 px-8 py-3 text-15 rounded-lg"
        slot="footer"
        on:click|stopPropagation={onConnectDappClick}
    >
        <Icon icon={IconEnum.Plus} height={12} />
        {localize('actions.connectDapp')}
    </button>
</DrawerTemplate>
