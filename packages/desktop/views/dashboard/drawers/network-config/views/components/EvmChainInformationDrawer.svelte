<script lang="ts">
    import { localize } from '@core/i18n'
    import { IEvmNetwork, IIscChain, NetworkType } from '@core/network'
    import { Table } from '@bloomwalletio/ui'
    import { DrawerTemplate } from '@components/drawers'
    import { NetworkConfigRoute } from '../../network-config-route.enum'
    import { Router } from '@core/router'

    export let drawerRouter: Router<NetworkConfigRoute>
    export let network: IEvmNetwork

    const localeKey = 'views.dashboard.drawers.networkConfig.chain'

    function isIscChain(network: IEvmNetwork): network is IIscChain {
        return network.type === NetworkType.Isc
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
                ...(isIscChain(network)
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
