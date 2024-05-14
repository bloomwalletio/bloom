<script lang="ts">
    import SetTransactionFeeMenu from './SetTransactionFeeMenu.svelte'
    import { Table, TableRow } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { IEvmNetwork, NetworkId, calculateGasFee } from '@core/network'
    import { formatTokenAmount } from '@core/token'
    import { NetworkLabel } from '@ui'
    import { EvmTransactionData, GasSpeed, IGasPricesBySpeed } from '@core/layer-2'

    export let selectedGasSpeed: GasSpeed = GasSpeed.Required
    export let sourceNetwork: IEvmNetwork
    export let destinationNetworkId: NetworkId | undefined = undefined
    export let transaction: EvmTransactionData
    export let gasPrices: IGasPricesBySpeed
    export let storageDeposit: bigint

    const { gasLimit, estimatedGas } = transaction
    $: maxGasFee = calculateGasFee(gasLimit, gasPrices[selectedGasSpeed]) + storageDeposit
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
    ]}
>
    <TableRow
        item={{
            key: localize('general.estimatedFee'),
        }}
    >
        <div slot="boundValue">
            <SetTransactionFeeMenu bind:selectedGasSpeed {sourceNetwork} {gasPrices} {estimatedGas} {storageDeposit} />
        </div>
    </TableRow>
    <TableRow
        item={{
            key: localize('general.maxFees'),
            value: maxGasFee ? formatTokenAmount(maxGasFee, sourceNetwork.baseToken) : undefined,
        }}
    />
</Table>
