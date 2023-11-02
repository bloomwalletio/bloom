<script lang="ts">
    import { selectedDapp } from '@auxiliary/wallet-connect/stores'
    import { DrawerTemplate } from '@components/drawers'
    import { Link, Table, Text } from '@bloomwalletio/ui'
    import { Router } from '@core/router'
    import { onMount } from 'svelte'
    import { DappConfigRoute } from '../dapp-config-route.enum'
    import { localize } from '@core/i18n'
    import { openUrlInBrowser } from '@core/app/utils'
    import { DappActionsMenu } from '@components/menus'

    export let drawerRouter: Router<unknown>

    const localeKey = 'views.dashboard.drawers.dapps.details'

    onMount(() => {
        if (!$selectedDapp) {
            drawerRouter.goTo(DappConfigRoute.ConnectedDapps)
        }
    })
</script>

<DrawerTemplate {drawerRouter}>
    <div slot="header" class="flex flex-row items-center w-full justify-between">
        <Text type="h6">{localize(`${localeKey}.title`)}</Text>
        <DappActionsMenu {drawerRouter} dapp={$selectedDapp} />
    </div>
    <div class="w-full h-full flex flex-col gap-8">
        <div class="flex flex-row gap-3">
            <img class="dapp-icon" src={$selectedDapp.metadata.icons[0]} alt={$selectedDapp.metadata.name} />
            <div class="flex flex-col items-start">
                <Text type="body1" fontWeight="bold">{$selectedDapp.metadata.name}</Text>
                <Link text={$selectedDapp.metadata.url} on:click={() => openUrlInBrowser($selectedDapp.metadata.url)} />
            </div>
        </div>
        {#if $selectedDapp.metadata?.description || $selectedDapp.metadata?.verifyUrl}
            <Table
                orientation="vertical"
                items={[
                    {
                        key: localize(`${localeKey}.description`),
                        value: $selectedDapp.metadata.description || undefined,
                    },
                    {
                        key: localize(`${localeKey}.verifyUrl`), // TODO: instead of showing this url, show a boolean if it is verified or not
                        value: $selectedDapp.metadata.verifyUrl || undefined,
                        copyable: true,
                    },
                ]}
            />
        {/if}
    </div>
</DrawerTemplate>

<style lang="scss">
    .dapp-icon {
        @apply w-10 h-10 rounded-full;
    }
</style>
