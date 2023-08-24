<script lang="ts">
    import { Icon, TextHint } from '@ui'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'
    import { DrawerTemplate } from '@components'
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'
    import { connectedDapps } from '@auxiliary/wallet-connect/stores'
    import DappCard from '../components/DappCard.svelte'

    export let drawerRouter: Router<unknown>

    function onConnectDappClick(): void {
        openPopup({
            id: PopupId.InitWalletConnect,
        })
    }
</script>

<DrawerTemplate title={localize('views.dashboard.drawers.dApps.dAppsList.title')} {drawerRouter}>
    {#if $connectedDapps.length}
        <connected-dapps class="flex flex-col gap-4 scrollable">
            {#each $connectedDapps as connectedDapp}
                {#if connectedDapp.metadata}
                    <DappCard {connectedDapp} />
                {/if}
            {/each}
        </connected-dapps>
    {:else}
        <TextHint info text={localize('views.dashboard.drawers.dApps.dAppsList.hint')} />
    {/if}

    <button
        type="button"
        class="flex flex-row items-center justify-center w-full space-x-2 bg-transparent text-blue-500 px-8 py-3 text-15 rounded-lg"
        slot="footer"
        on:click|stopPropagation={onConnectDappClick}
    >
        <Icon icon={IconEnum.Plus} height={12} />
        {localize('views.dashboard.drawers.dApps.dAppsList.connectDapp')}
    </button>
</DrawerTemplate>
