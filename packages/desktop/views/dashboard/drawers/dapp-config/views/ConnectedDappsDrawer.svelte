<script lang="ts">
    import {
        clearSelectedDapp,
        connectedDapps,
        persistedDapps,
        setSelectedDapp,
    } from '@auxiliary/wallet-connect/stores'
    import { Button, IconName, Tabs, Text } from '@bloomwalletio/ui'
    import { DappListActionsMenu, DrawerTemplate, EmptyListPlaceholder } from '@components'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'
    import DappCard from '../components/DappCard.svelte'
    import { DappConfigRoute } from '../dapp-config-route.enum'
    import { IConnectedDapp } from '@auxiliary/wallet-connect/interface'
    import { updateDrawerProps } from '@desktop/auxiliary/drawer'
    import { activeProfileId } from '@core/profile/stores'

    export let drawerRouter: Router<unknown>

    const localeKey = 'views.dashboard.drawers.dapps.dappsList'
    const tabs = [
        {
            key: localize(`${localeKey}.paired.tab`),
            value: localize(`${localeKey}.paired.tab`),
        },
        {
            key: localize(`${localeKey}.expired.tab`),
            value: localize(`${localeKey}.expired.tab`),
        },
    ]
    let selectedTab = tabs[0]
    let selectedIndex = 0

    $: connectedDappsForProfile = $connectedDapps.filter(
        (dapp) => !!$persistedDapps[$activeProfileId as string]?.[dapp.metadata?.url ?? '']
    )
    $: displayedDapps = connectedDappsForProfile.filter(
        (dapp) => (selectedIndex === 0 && !!dapp.sessionTopic) || (selectedIndex === 1 && !dapp.sessionTopic)
    )

    function onDappCardClick(connectedDapp: IConnectedDapp): void {
        setSelectedDapp(connectedDapp)
        updateDrawerProps({
            onClose: () => clearSelectedDapp(),
        })
        drawerRouter.goTo(DappConfigRoute.DappDetails)
    }

    function onConnectDappClick(): void {
        drawerRouter.goTo(DappConfigRoute.InputCode)
    }
</script>

<DrawerTemplate {drawerRouter}>
    <div slot="header" class="flex flex-row items-center w-full justify-between">
        <Text type="h6">{localize(`${localeKey}.title`)}</Text>
        <DappListActionsMenu {drawerRouter} />
    </div>
    <div class="h-full flex flex-col">
        <div class="px-6 pb-6">
            <Tabs bind:selectedTab bind:selectedIndex {tabs} />
        </div>
        <div class="flex-grow">
            {#if displayedDapps.length}
                <div class="h-full flex flex-col scrollable px-6 items-start gap-3">
                    {#each displayedDapps as dapp}
                        <DappCard {dapp} disabled={selectedIndex === 1} onClick={() => onDappCardClick(dapp)} />
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
        </div>
    </div>
    <div slot="footer" class="flex justify-center p-3">
        <Button
            variant="text"
            icon={IconName.Plus}
            text={localize('views.dashboard.drawers.dapps.dappsList.connectDapp')}
            on:click={onConnectDappClick}
        />
    </div>
</DrawerTemplate>
