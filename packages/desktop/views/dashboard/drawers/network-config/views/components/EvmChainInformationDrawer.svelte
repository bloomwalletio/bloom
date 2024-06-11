<script lang="ts">
    import { localize } from '@core/i18n'
    import { IEvmNetwork, isIscNetwork } from '@core/network'
    import { Table, Text, Toggle } from '@bloomwalletio/ui'
    import { DrawerTemplate } from '@components/drawers'
    import { NetworkConfigRoute } from '../../network-config-route.enum'
    import { Router } from '@core/router'
    import { LedgerAppName } from '@core/ledger'
    import { checkActiveProfileAuth } from '@core/profile/actions'
    import { notificationsManager } from '@auxiliary/wallet-connect/notifications'
    import { handleError } from '@core/error/handlers'
    import { selectedAccount } from '@core/account/stores'

    export let drawerRouter: Router<NetworkConfigRoute>
    export let network: IEvmNetwork

    const localeKey = 'views.dashboard.drawers.networkConfig.chain'

    const trackedAccounts = notificationsManager.trackedNetworkAddresses
    let isRegistered = false
    $: $trackedAccounts,
        (isRegistered = !!$selectedAccount && notificationsManager.isRegistered($selectedAccount, network))

    async function enableNotifications(): Promise<void> {
        if (!$selectedAccount) {
            return
        }

        try {
            await checkActiveProfileAuth(LedgerAppName.Ethereum)
        } catch (error) {
            return
        }

        try {
            if (isRegistered) {
                await notificationsManager.unregisterAccount($selectedAccount, network)
            } else {
                await notificationsManager.registerAccount($selectedAccount, network)
            }
            isRegistered = !isRegistered
        } catch (err) {
            handleError(err)
        }
    }
</script>

<DrawerTemplate title={network.name} {drawerRouter}>
    <div class="w-full h-full px-6">
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
        <div class="flex gap-4 p-4">
            <Toggle
                label={localize('views.dashboard.dappNotifications.enable')}
                checked={isRegistered}
                size="md"
                rounded="rounded-full"
                onClick={() => enableNotifications()}
            />
            <Text type="sm" align="center">{localize('views.dashboard.dappNotifications.enable')}</Text>
        </div>
    </div>
</DrawerTemplate>
