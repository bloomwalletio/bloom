<script lang="ts">
    import { localize } from '@core/i18n'
    import { IscpChain } from '@core/network'
    import { Table } from '@bloomwalletio/ui'

    export let evmNetwork: IscpChain

    const localeKey = 'views.dashboard.drawers.networkConfig.chain'
</script>

<Table
    orientation="vertical"
    items={[
        {
            key: localize(`${localeKey}.chainId`),
            value: evmNetwork.chainId ?? undefined,
            copyable: true,
        },
        {
            key: localize(`${localeKey}.aliasAddress`),
            value: evmNetwork.aliasAddress ?? undefined,
            copyable: true,
        },
        {
            key: localize(`${localeKey}.rpcEndpoint`),
            value: evmNetwork.rpcEndpoint ?? undefined,
            copyable: true,
        },
        {
            key: localize(`${localeKey}.explorerUrl`),
            value: evmNetwork.explorerUrl ?? undefined,
            copyable: true,
        },
    ]}
/>
