<script lang="ts">
    import { Table, TableRow } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { EvmTransactionData, GasSpeed, IGasPricesBySpeed } from '@core/layer-2'
    import { IEvmNetwork, NetworkId } from '@core/network'
    import { NetworkLabel } from '@ui'
    import SetTransactionFeeMenu from './SetTransactionFeeMenu.svelte'

    export let selectedGasSpeed: GasSpeed = GasSpeed.Required
    export let sourceNetwork: IEvmNetwork
    export let destinationNetworkId: NetworkId | undefined = undefined
    export let transaction: EvmTransactionData
    export let gasPrices: IGasPricesBySpeed
    export let storageDeposit: bigint = BigInt(0)

    const { gasLimit, estimatedGas } = transaction
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
    {#if estimatedGas}
        <TableRow
            item={{
                key: localize('general.estimatedFee'),
            }}
        >
            <div slot="boundValue">
                <SetTransactionFeeMenu
                    bind:selectedGasSpeed
                    {sourceNetwork}
                    {gasPrices}
                    gasUnit={estimatedGas}
                    {storageDeposit}
                />
            </div>
        </TableRow>
    {/if}
    {#if gasLimit}
        <TableRow
            item={{
                key: localize('general.maxFees'),
            }}
        >
            <div slot="boundValue">
                <SetTransactionFeeMenu
                    bind:selectedGasSpeed
                    {sourceNetwork}
                    {gasPrices}
                    gasUnit={gasLimit}
                    {storageDeposit}
                    disabled={!!estimatedGas}
                />
            </div>
        </TableRow>
    {/if}
</Table>
