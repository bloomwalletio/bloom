<script lang="ts">
    import { IEvmNetwork, calculateGasFee } from '@core/network'
    import { IconName, Menu, Text, type IMenuItem } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { EvmTransactionData, GasSpeed } from '@core/layer-2'
    import { IGasPricesBySpeed } from '@core/layer-2/interfaces'
    import { formatTokenAmount } from '@core/token'

    export let selectedGasSpeed: GasSpeed = GasSpeed.Required
    export let sourceNetwork: IEvmNetwork
    export let gasPrices: IGasPricesBySpeed
    export let transaction: EvmTransactionData
    export let storageDeposit: bigint

    let menu: Menu | undefined
    let anchor: HTMLElement | undefined = undefined

    function onChooseGasPriceClick(selected: GasSpeed): void {
        selectedGasSpeed = selected
    }

    $: items = setItems(gasPrices, selectedGasSpeed)
    function setItems(gasPrices: IGasPricesBySpeed, selectedGasSpeed: GasSpeed): IMenuItem[] {
        const _items = [
            {
                icon: IconName.ClockPlus,
                title: localize('general.required'),
                subtitle: formatTokenAmount(
                    calculateGasFee(transaction.estimatedGas, gasPrices.average) + storageDeposit,
                    sourceNetwork.baseToken
                ),
                selected: selectedGasSpeed === GasSpeed.Required,
                onClick: () => onChooseGasPriceClick(GasSpeed.Required),
            },
        ]

        if (gasPrices.slow) {
            _items.push({
                icon: IconName.ClockPlus,
                title: localize('general.slow'),
                subtitle: formatTokenAmount(
                    calculateGasFee(transaction.estimatedGas, gasPrices.slow) + storageDeposit,
                    sourceNetwork.baseToken
                ),
                selected: selectedGasSpeed === GasSpeed.Slow,
                onClick: () => onChooseGasPriceClick(GasSpeed.Slow),
            })
        }

        if (gasPrices.average) {
            _items.push({
                icon: IconName.CalendarDate,
                title: localize('general.average'),
                subtitle: formatTokenAmount(
                    calculateGasFee(transaction.estimatedGas, gasPrices.average) + storageDeposit,
                    sourceNetwork.baseToken
                ),
                selected: selectedGasSpeed === GasSpeed.Average,
                onClick: () => onChooseGasPriceClick(GasSpeed.Average),
            })
        }

        if (gasPrices.fast) {
            _items.push({
                icon: IconName.CalendarPlus,
                title: localize('general.fast'),
                subtitle: formatTokenAmount(
                    calculateGasFee(transaction.estimatedGas, gasPrices.fast) + storageDeposit,
                    sourceNetwork.baseToken
                ),
                selected: selectedGasSpeed === GasSpeed.Fast,
                onClick: () => onChooseGasPriceClick(GasSpeed.Fast),
            })
        }
        return _items
    }

    $: disabled = items.length < 2

    $: estimatedGasFee = calculateGasFee(transaction.estimatedGas, gasPrices[selectedGasSpeed])
</script>

<Menu bind:this={menu} {disabled} compact={false} placement="top-end" {items}>
    <button
        bind:this={anchor}
        slot="anchor"
        class="flex items-center justify-center {disabled ? 'cursor-default' : 'cursor-pointer'}"
        {disabled}
    >
        <div class="flex flex-row items-center">
            <Text textColor={disabled ? 'secondary' : 'brand'} fontWeight="medium">
                {formatTokenAmount(estimatedGasFee, sourceNetwork.baseToken)}
            </Text>
        </div>
    </button>
</Menu>
