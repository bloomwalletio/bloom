<script lang="ts">
    import { localize } from '@core/i18n'
    import { NetworkId } from '@core/network'
    import { getBaseToken } from '@core/profile/actions'
    import { formatTokenAmount } from '@core/token'
    import { NetworkLabel } from '@ui'
    import { Table } from '@bloomwalletio/ui'

    export let destinationNetworkId: NetworkId | undefined = undefined
    export let estimatedGasFee: bigint | undefined = undefined
    export let maxGasFee: bigint | undefined = undefined
</script>

<Table
    items={[
        {
            key: localize('general.destinationNetwork'),
            slot: {
                component: NetworkLabel,
                props: {
                    networkId: destinationNetworkId,
                },
            },
        },
        {
            key: localize('general.estimatedFee'),
            value: estimatedGasFee ? formatTokenAmount(estimatedGasFee, getBaseToken()) : undefined,
        },
        {
            key: localize('general.maxFees'),
            value: maxGasFee ? formatTokenAmount(maxGasFee, getBaseToken()) : undefined,
        },
    ]}
/>
