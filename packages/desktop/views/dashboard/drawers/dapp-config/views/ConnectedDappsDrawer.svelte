<script lang="ts">
    import {
        connectedDapps,
        getPersistedDappNamespacesForDapp,
        setSelectedDapp,
    } from '@auxiliary/wallet-connect/stores'
    import { Button, IconName, Tabs } from '@bloomwalletio/ui'
    import { DrawerTemplate, EmptyListPlaceholder } from '@components'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'
    import DappCard from '../components/DappCard.svelte'
    import { DappConfigRoute } from '../dapp-config-route.enum'
    import { IConnectedDapp } from '@auxiliary/wallet-connect/interface'
    import { updateDrawerProps } from '@desktop/auxiliary/drawer'

    export let drawerRouter: Router<unknown>

    const tabs = [
        {
            key: localize('views.dashboard.drawers.dapps.dappsList.paired.tab'),
            value: localize('views.dashboard.drawers.dapps.dappsList.paired.tab'),
        },
        {
            key: localize('views.dashboard.drawers.dapps.dappsList.expired.tab'),
            value: localize('views.dashboard.drawers.dapps.dappsList.expired.tab'),
        },
    ]
    let selectedTab = tabs[0]
    let selectedIndex = 0

    $: connectedDappsForProfile = $connectedDapps.filter(
        (dapp) => !!getPersistedDappNamespacesForDapp(dapp.metadata?.url)
    )
    $: displayedDapps = connectedDappsForProfile.filter((dapp) => !dapp.session || selectedIndex === 0)

    function onDappCardClick(connectedDapp: IConnectedDapp): void {
        setSelectedDapp(connectedDapp)
        updateDrawerProps({
            onClose: () => {
                setSelectedDapp(undefined)
            },
        })
        drawerRouter.goTo(DappConfigRoute.DappDetails)
    }

    function onConnectDappClick(): void {
        drawerRouter.goTo(DappConfigRoute.InputCode)
    }
</script>

<DrawerTemplate title={localize('views.dashboard.drawers.dapps.dappsList.title')} {drawerRouter}>
    <div class="px-6 pb-6">
        <Tabs bind:selectedTab bind:selectedIndex {tabs} />
    </div>
    {#if displayedDapps.length}
        <div class="h-full flex flex-col scrollable px-6 items-start gap-3">
            {#each displayedDapps as dapp}
                <DappCard {dapp} onClick={() => onDappCardClick(dapp)} />
            {/each}
        </div>
    {:else}
        <div class="w-full h-full flex flex-col items-center justify-center gap-6 px-6">
            <EmptyListPlaceholder
                title={localize(
                    `views.dashboard.drawers.dapps.dappsList.${selectedIndex === 0 ? 'paired' : 'expired'}.emptyTitle`
                )}
                subtitle={localize(
                    `views.dashboard.drawers.dapps.dappsList.${
                        selectedIndex === 0 ? 'paired' : 'expired'
                    }.emptySubtitle`
                )}
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
