<script lang="ts">
    import { localize } from '@core/i18n'
    import { NetworkId } from '@core/network'
    import { getBaseToken } from '@core/profile/actions'
    import { formatTokenAmountBestMatch } from '@core/token'
    import { BigIntLike } from '@ethereumjs/util'
    import { NetworkLabel } from '@ui'
    import { Table } from '@bloomwalletio/ui'

    export let destinationNetworkId: NetworkId | undefined = undefined
    export let estimatedGasFee: number | undefined = undefined
    export let maxGasFee: BigIntLike | undefined = undefined
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
            value: estimatedGasFee ? formatTokenAmountBestMatch(Number(estimatedGasFee), getBaseToken()) : undefined,
        },
        {
            key: localize('general.maxFees'),
            value: maxGasFee ? formatTokenAmountBestMatch(Number(maxGasFee), getBaseToken()) : undefined,
        },
    ]}
/>
