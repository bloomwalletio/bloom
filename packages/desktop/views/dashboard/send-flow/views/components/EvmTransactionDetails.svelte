<script lang="ts">
    import { Table, TableRow } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { EvmTransactionData, GasSpeed, IGasPricesBySpeed } from '@core/layer-2'
    import { calculateGasFee, IEvmNetwork, NetworkId } from '@core/network'
    import { formatTokenAmount } from '@core/token/utils'
    import { Subject } from '@core/wallet'
    import { BigIntLike } from '@ethereumjs/util'
    import { NetworkLabel } from '@ui'
    import SetTransactionFeeMenu from './SetTransactionFeeMenu.svelte'

    export let selectedGasSpeed: GasSpeed = GasSpeed.Required
    export let sourceNetwork: IEvmNetwork
    export let destinationNetworkId: NetworkId | undefined = undefined
    export let recipient: Subject | undefined = undefined
    export let transaction: EvmTransactionData
    export let gasPrices: IGasPricesBySpeed
    export let storageDeposit: bigint = BigInt(0)
    export let busy: boolean

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
            key: localize('general.recipient'),
            value: recipient?.address,
            copyable: true,
            truncate: {
                firstCharCount: 10,
                endCharCount: 10,
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
                <SetTransactionFeeMenu
                    bind:selectedGasSpeed
                    {gasPrices}
                    gasUnit={gasLimit}
                    {formatGasFee}
                    disabled={busy}
                />
            </div>
        </TableRow>
    {/if}
</Table>
