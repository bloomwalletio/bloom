<script lang="ts">
    import { localize } from '@core/i18n'
    import { IEvmNetwork, IIscChain, NetworkType } from '@core/network'
    import { Table } from '@bloomwalletio/ui'

    export let network: IEvmNetwork

    const localeKey = 'views.dashboard.drawers.networkConfig.chain'

    function isIscChain(network: IEvmNetwork): network is IIscChain {
        return network.type === NetworkType.Isc
    }
</script>

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
