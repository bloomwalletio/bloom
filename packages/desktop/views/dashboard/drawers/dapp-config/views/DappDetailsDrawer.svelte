<script lang="ts">
    import { getPersistedDappNamespacesForDapp, selectedDapp } from '@auxiliary/wallet-connect/stores'
    import { DrawerTemplate } from '@components/drawers'
    import { Router } from '@core/router'
    import { onMount } from 'svelte'
    import { localize } from '@core/i18n'
    import { Table, Text } from '@bloomwalletio/ui'
    import { DappActionsMenu } from '@components/menus'
    import { ConnectionSummary, DappInformationCard } from '../components'

    export let drawerRouter: Router<unknown>

    const localeKey = 'views.dashboard.drawers.dapps.details'
    const dapp = structuredClone($selectedDapp)

    $: persistedNamespaces = dapp?.metadata ? getPersistedDappNamespacesForDapp(dapp?.metadata.url) : undefined

    onMount(() => {
        if (!$selectedDapp) {
            drawerRouter.previous()
        }
    })
</script>

<DrawerTemplate {drawerRouter}>
    <div slot="header" class="flex flex-row items-center w-full justify-between">
        <Text type="h6">{localize(`${localeKey}.title`)}</Text>
        <DappActionsMenu {drawerRouter} {dapp} />
    </div>
    <div class="w-full h-full flex flex-col space-y-6 overflow-hidden">
        <DappInformationCard metadata={dapp?.metadata} />

        <div class="flex-grow overflow-hidden">
            <div class="h-full space-y-6 overflow-scroll px-6 pb-4">
                {#if dapp?.metadata?.description}
                    <Table
                        items={[{ key: localize('general.description'), value: dapp.metadata.description }]}
                        orientation="vertical"
                    />
                {/if}
                {#if persistedNamespaces}
                    <ConnectionSummary
                        requiredNamespaces={dapp.session?.requiredNamespaces}
                        editable={!!dapp.session}
                        {persistedNamespaces}
                        {drawerRouter}
                    />
                {/if}
            </div>
        </div>
    </div>
</DrawerTemplate>
