<script lang="ts">
    import { notificationsManager } from '@auxiliary/wallet-connect/notifications'
    import { Table, Text, Toggle } from '@bloomwalletio/ui'
    import { DrawerTemplate } from '@components/drawers'
    import { handleError } from '@core/error/handlers'
    import { localize } from '@core/i18n'
    import { LedgerAppName } from '@core/ledger'
    import { IEvmNetwork, isIscNetwork } from '@core/network'
    import { checkActiveProfileAuth } from '@core/profile/actions'
    import { activeAccounts } from '@core/profile/stores'
    import { Router } from '@core/router'
    import { NetworkConfigRoute } from '../../network-config-route.enum'
    import NetworkActionsMenu from './NetworkActionsMenu.svelte'

    export let drawerRouter: Router<NetworkConfigRoute>
    export let network: IEvmNetwork

    const localeKey = 'views.dashboard.drawers.networkConfig.chain'

    // Register for account index 0 only
    $: notificationAccount = $activeAccounts[0]

    const trackedAccounts = notificationsManager.trackedNetworkAddresses
    let isRegistered = false
    $: $trackedAccounts,
        (isRegistered = !!notificationAccount && notificationsManager.isRegistered(notificationAccount, network.id))

    let busy = false
    async function enableNotifications(): Promise<void> {
        busy = true
        try {
            if (!isRegistered) {
                await checkActiveProfileAuth(LedgerAppName.Ethereum)
            }
        } catch (error) {
            busy = false
            return
        }

        try {
            if (isRegistered) {
                await notificationsManager.unregisterAccount(notificationAccount, network.id)
            } else {
                await notificationsManager.registerAccount(notificationAccount, network.id, network.coinType)
            }
        } catch (err) {
            handleError(err)
        } finally {
            busy = false
        }
    }
</script>

<DrawerTemplate {drawerRouter}>
    <div slot="header" class="flex flex-row items-center w-full justify-between">
        <Text type="h6">{network.name}</Text>
        <NetworkActionsMenu {drawerRouter} {network} />
    </div>
    <div class="w-full h-full px-6 space-y-4">
        <Table
            orientation="vertical"
            items={[
                {
                    key: localize(`${localeKey}.chainId`),
                    value: network.chainId ?? undefined,
                    copyable: true,
                },
                {
                    key: localize(`${localeKey}.rpcEndpoint`),
                    value: network.rpcEndpoint ?? undefined,
                    copyable: true,
                },
                {
                    key: localize(`${localeKey}.explorerUrl`),
                    value: network.explorerUrl ?? undefined,
                    copyable: true,
                },
                ...(isIscNetwork(network)
                    ? [
                          {
                              key: localize(`${localeKey}.aliasAddress`),
                              value: network.aliasAddress ?? undefined,
                              copyable: true,
                          },
                      ]
                    : []),
            ]}
        />
        <hr />
        <Text type="body2">{localize('views.dashboard.dappNotifications.title')}</Text>
        <div class="flex gap-4">
            <Toggle
                label={localize('views.dashboard.dappNotifications.enable')}
                checked={isRegistered}
                size="md"
                rounded="rounded-full"
                onClick={() => enableNotifications()}
                disabled={busy}
            />
            <Text type="sm" align="center"
                >{localize(`general.${busy ? 'saving' : isRegistered ? 'enabled' : 'disabled'}`)}</Text
            >
        </div>
    </div>
</DrawerTemplate>
