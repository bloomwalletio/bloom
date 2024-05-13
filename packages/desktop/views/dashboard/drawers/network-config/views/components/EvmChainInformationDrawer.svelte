<script lang="ts">
    import { localize } from '@core/i18n'
    import { IEvmNetwork, isIscNetwork } from '@core/network'
    import { Table } from '@bloomwalletio/ui'
    import { DrawerTemplate } from '@components/drawers'
    import { NetworkConfigRoute } from '../../network-config-route.enum'
    import { Router } from '@core/router'

    export let drawerRouter: Router<NetworkConfigRoute>
    export let network: IEvmNetwork

    const localeKey = 'views.dashboard.drawers.networkConfig.chain'
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
    </div>
</DrawerTemplate>
