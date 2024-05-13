<script lang="ts">
    import { Table } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { IEvmNetwork, NetworkId } from '@core/network'
    import { formatTokenAmount } from '@core/token'
    import { NetworkLabel } from '@ui'

    export let sourceNetwork: IEvmNetwork
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
            value: estimatedGasFee ? formatTokenAmount(estimatedGasFee, sourceNetwork.baseToken) : undefined,
        },
        {
            key: localize('general.maxFees'),
            value: maxGasFee ? formatTokenAmount(maxGasFee, sourceNetwork.baseToken) : undefined,
        },
    ]}
/>
