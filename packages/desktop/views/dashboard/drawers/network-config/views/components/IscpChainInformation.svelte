<script lang="ts">
    import { localize } from '@core/i18n'
    import { IIscpChainConfiguration } from '@core/network'
    import { Table } from '@bloomwalletio/ui'

    export let chainConfiguration: IIscpChainConfiguration

    const localeKey = 'views.dashboard.drawers.networkConfig.chain'
</script>

<Table
    orientation="vertical"
    items={[
        {
            key: localize(`${localeKey}.chainId`),
            value: chainConfiguration.chainId ?? undefined,
            copyable: true,
        },
        {
            key: localize(`${localeKey}.aliasAddress`),
            value: chainConfiguration.aliasAddress ?? undefined,
            copyable: true,
        },
        {
            key: localize(`${localeKey}.rpcEndpoint`),
            value: chainConfiguration.rpcEndpoint ?? undefined,
            copyable: true,
        },
        {
            key: localize(`${localeKey}.explorerUrl`),
            value: chainConfiguration.explorerUrl ?? undefined,
            copyable: true,
        },
    ]}
/>
