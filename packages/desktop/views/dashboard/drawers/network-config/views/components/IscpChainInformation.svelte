<script lang="ts">
    import { localize } from '@core/i18n'
    import { IscpChain } from '@core/network'
    import { Table } from '@bloomwalletio/ui'

    export let chain: IscpChain

    const localeKey = 'views.dashboard.drawers.networkConfig.chain'
</script>

<Table
    orientation="vertical"
    items={[
        {
            key: localize(`${localeKey}.chainId`),
            value: chain.chainId ?? undefined,
            copyable: true,
        },
        {
            key: localize(`${localeKey}.aliasAddress`),
            value: chain.aliasAddress ?? undefined,
            copyable: true,
        },
        {
            key: localize(`${localeKey}.rpcEndpoint`),
            value: chain.rpcEndpoint ?? undefined,
            copyable: true,
        },
        {
            key: localize(`${localeKey}.explorerUrl`),
            value: chain.explorerUrl ?? undefined,
            copyable: true,
        },
    ]}
/>
