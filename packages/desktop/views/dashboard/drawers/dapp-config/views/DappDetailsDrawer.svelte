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

    $: persistedNamespaces = $selectedDapp?.metadata
        ? getPersistedDappNamespacesForDapp($selectedDapp.metadata.url)
        : undefined
    onMount(() => {
        if (!$selectedDapp) {
            drawerRouter.previous()
        }
    })
</script>

<DrawerTemplate {drawerRouter}>
    <div slot="header" class="flex flex-row items-center w-full justify-between">
        <Text type="h6">{localize(`${localeKey}.title`)}</Text>
        <DappActionsMenu {drawerRouter} dapp={$selectedDapp} />
    </div>
    <div class="w-full h-full flex flex-col space-y-6 overflow-hidden">
        <DappInformationCard metadata={$selectedDapp.metadata} />

        <div class="flex-grow overflow-hidden">
            <div class="h-full space-y-6 overflow-scroll px-6 pb-4">
                {#if $selectedDapp.metadata?.description}
                    <Table
                        items={[{ key: localize('general.description'), value: $selectedDapp.metadata.description }]}
                        orientation="vertical"
                    />
                {/if}
                {#if persistedNamespaces}
                    <ConnectionSummary
                        requiredNamespaces={$selectedDapp.session?.requiredNamespaces}
                        editable={!!$selectedDapp.session}
                        {persistedNamespaces}
                        {drawerRouter}
                    />
                {/if}
            </div>
        </div>
    </div>
</DrawerTemplate>
