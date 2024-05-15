<script lang="ts">
    import { BigIntLike } from '@ethereumjs/util'
    import { Table, TableRow } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { EvmTransactionData, GasSpeed, IGasPricesBySpeed } from '@core/layer-2'
    import { IEvmNetwork, NetworkId, calculateGasFee } from '@core/network'
    import { NetworkLabel } from '@ui'
    import SetTransactionFeeMenu from './SetTransactionFeeMenu.svelte'
    import { formatTokenAmount } from '@core/token/utils'

    export let selectedGasSpeed: GasSpeed = GasSpeed.Required
    export let sourceNetwork: IEvmNetwork
    export let destinationNetworkId: NetworkId | undefined = undefined
    export let transaction: EvmTransactionData
    export let gasPrices: IGasPricesBySpeed
    export let storageDeposit: bigint = BigInt(0)

    const { gasLimit, estimatedGas } = transaction

    function formatGasFee(gasUnit: BigIntLike | undefined, gasPrice: bigint | undefined): string {
        const gasFee = calculateGasFee(gasUnit, gasPrice) + storageDeposit
        return formatTokenAmount(gasFee, sourceNetwork.baseToken)
    }
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
            value: estimatedGas ? formatGasFee(estimatedGas, gasPrices[selectedGasSpeed]) : undefined,
        },
    ]}
>
    {#if gasLimit}
        <TableRow
            item={{
                key: localize('general.maxFees'),
            }}
        >
            <div slot="boundValue">
                <SetTransactionFeeMenu bind:selectedGasSpeed {gasPrices} gasUnit={gasLimit} {formatGasFee} />
            </div>
        </TableRow>
    {/if}
</Table>
