<script lang="ts">
    import {
        connectedDapps,
        getPersistedDappNamespacesForDapp,
        setSelectedDapp,
    } from '@auxiliary/wallet-connect/stores'
    import { Button, IconName, Pill } from '@bloomwalletio/ui'
    import { DrawerTemplate, EmptyListPlaceholder } from '@components'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'
    import DappCard from '../components/DappCard.svelte'
    import { DappConfigRoute } from '../dapp-config-route.enum'
    import { IConnectedDapp } from '@auxiliary/wallet-connect/interface'

    export let drawerRouter: Router<unknown>

    $: connectedDappsForProfile = $connectedDapps.filter(
        (dapp) => !!getPersistedDappNamespacesForDapp(dapp.metadata.url)
    )

    function onDappCardClick(connectedDapp: IConnectedDapp): void {
        setSelectedDapp(connectedDapp)
        drawerRouter.goTo(DappConfigRoute.DappDetails)
    }

    function onConnectDappClick(): void {
        drawerRouter.goTo(DappConfigRoute.InputCode)
    }
</script>

<DrawerTemplate title={localize('views.dashboard.drawers.dapps.dappsList.title')} {drawerRouter}>
    {#if connectedDappsForProfile.length}
        {@const connectedDappList = connectedDappsForProfile.filter((dapp) => !!dapp.session)}
        {@const disconnectedDappList = connectedDappsForProfile.filter((dapp) => !dapp.session)}
        <div class="h-full flex flex-col gap-8 scrollable px-6">
            {#if connectedDappList.length}
                <div class="flex flex-col items-start gap-3">
                    <Pill color="success">{localize('general.connected')}</Pill>
                    {#each connectedDappList as dapp}
                        <DappCard {dapp} onClick={() => onDappCardClick(dapp)} />
                    {/each}
                </div>
            {/if}
            {#if disconnectedDappList.length}
                <div class="flex flex-col items-start gap-3">
                    <Pill color="danger">{localize('general.disconnected')}</Pill>
                    {#each disconnectedDappList as dapp}
                        <DappCard {dapp} onClick={() => onDappCardClick(dapp)} />
                    {/each}
                </div>
            {/if}
        </div>
    {:else}
        <div class="w-full h-full flex flex-col items-center justify-center gap-6 px-6">
            <EmptyListPlaceholder
                title={localize('views.dashboard.drawers.dapps.dappsList.emptyTitle')}
                subtitle={localize('views.dashboard.drawers.dapps.dappsList.emptySubtitle')}
                icon={IconName.LinkBroken}
            />
        </div>
    {/if}
    <div slot="footer" class="flex justify-center p-3">
        <Button
            variant="text"
            icon={IconName.Plus}
            text={localize('views.dashboard.drawers.dapps.dappsList.connectDapp')}
            on:click={onConnectDappClick}
        />
    </div>
</DrawerTemplate>
