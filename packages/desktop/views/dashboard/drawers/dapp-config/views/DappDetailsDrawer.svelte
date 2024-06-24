<script lang="ts">
    import { getPersistedDapp, selectedDapp } from '@auxiliary/wallet-connect/stores'
    import { DrawerTemplate } from '@components/drawers'
    import { Router } from '@core/router'
    import { onMount } from 'svelte'
    import { localize } from '@core/i18n'
    import { Table, Text } from '@bloomwalletio/ui'
    import { DappActionsMenu } from '@components/menus'
    import { ConnectionSummary } from '../components'
    import { DappInfo } from '@ui'
    import { IConnectedDapp } from '@auxiliary/wallet-connect/interface'
    import { DappConfigRoute } from '../dapp-config-route.enum'
    import { SupportedNamespaces } from '@auxiliary/wallet-connect/types'
    import { normalizeSessionNamespace } from '@auxiliary/wallet-connect/utils'

    export let drawerRouter: Router<unknown>

    const localeKey = 'views.dashboard.drawers.dapps.details'
    const dapp = structuredClone($selectedDapp) as IConnectedDapp
    const persistedDapp = dapp?.metadata ? getPersistedDapp(dapp?.metadata.url) : undefined

    const supportedNamespaces = getSupportedNamespaces()
    function getSupportedNamespaces(): SupportedNamespaces | undefined {
        if (dapp.session) {
            return normalizeSessionNamespace(dapp.session.namespaces)
        }

        return persistedDapp?.supported
    }

    onMount(() => {
        if (!$selectedDapp) {
            drawerRouter.previous()
        }
    })
</script>

<DrawerTemplate {drawerRouter} onBack={() => ($selectedDapp = undefined)}>
    <div slot="header" class="flex flex-row items-center w-full justify-between">
        <Text type="h6">{localize(`${localeKey}.title`)}</Text>
        <DappActionsMenu {drawerRouter} {dapp} />
    </div>
    <div class="w-full h-full flex flex-col space-y-6 overflow-hidden">
        <DappInfo metadata={dapp.metadata} verifiedState={persistedDapp?.verificationState} />

        <div class="flex-grow overflow-hidden">
            <div class="h-full space-y-6 overflow-scroll px-6 pb-4">
                {#if dapp.metadata?.description}
                    <Table
                        items={[{ key: localize('general.description'), value: dapp.metadata.description }]}
                        orientation="vertical"
                    />
                {/if}
                {#if supportedNamespaces}
                    <ConnectionSummary
                        requiredNamespaces={dapp.session?.requiredNamespaces}
                        editable={!!dapp.session}
                        {supportedNamespaces}
                        onEditPermissionsClick={() => drawerRouter.goTo(DappConfigRoute.EditPermissions)}
                        onEditNetworksClick={() => drawerRouter.goTo(DappConfigRoute.EditNetworks)}
                        onEditAccountsClick={() => drawerRouter.goTo(DappConfigRoute.EditAccounts)}
                    />
                {/if}
            </div>
        </div>
    </div>
</DrawerTemplate>
