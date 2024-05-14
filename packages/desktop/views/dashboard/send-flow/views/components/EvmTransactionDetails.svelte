<script lang="ts">
	import SetTransactionFeeButton from './SetTransactionFeeButton.svelte';
    import { Table, TableRow } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { IEvmNetwork, NetworkId } from '@core/network'
    import { formatTokenAmount } from '@core/token'
    import { NetworkLabel } from '@ui'
    import { EvmTransactionData, IGasPrices } from '@core/layer-2'

    export let selectedGasSpeed: 'required' | 'slow' | 'average' | 'fast' = 'required'
    export let sourceNetwork: IEvmNetwork
    export let destinationNetworkId: NetworkId | undefined = undefined
    export let estimatedGasFee: bigint | undefined = undefined
    export let maxGasFee: bigint | undefined = undefined
    export let transaction: EvmTransactionData
    export let gasPrices: IGasPrices | undefined = undefined
    export let storageDeposit: bigint | undefined = undefined
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
            key: localize('general.maxFees'),
            value: maxGasFee ? formatTokenAmount(maxGasFee, sourceNetwork.baseToken) : undefined,
        },
    ]}
>
    <TableRow
        item={{
            key: localize('general.estimatedFee'),
        }}
    >
        <div slot="boundValue">
            <SetTransactionFeeButton
                {gasPrices}
            />
        </div>
    </TableRow>
    <TableRow
        item={{
            key: localize('general.maxFees'),
            value: maxGasFee ? formatTokenAmount(maxGasFee, sourceNetwork.baseToken) : undefined,
        }}
/>
</Table>
