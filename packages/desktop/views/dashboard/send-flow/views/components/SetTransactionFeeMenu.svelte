<script lang="ts">
    import { BigIntLike } from '@ethereumjs/util'
    import { IconName, Menu, Text, type IMenuItem } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { GasSpeed } from '@core/layer-2'
    import { IGasPricesBySpeed } from '@core/layer-2/interfaces'

    export let selectedGasSpeed: GasSpeed = GasSpeed.Required
    export let gasPrices: IGasPricesBySpeed
    export let gasUnit: BigIntLike | undefined
    export let disabled: boolean = false
    export let formatGasFee: (gasUnit: BigIntLike | undefined, gasPrice: bigint | undefined) => string

    let menu: Menu | undefined
    let anchor: HTMLElement | undefined = undefined

    function onChooseGasPriceClick(selected: GasSpeed): void {
        selectedGasSpeed = selected
    }

    $: items = setItems(gasPrices, selectedGasSpeed)
    function setItems(gasPrices: IGasPricesBySpeed, selectedGasSpeed: GasSpeed): IMenuItem[] {
        const gasPriceSlow = gasPrices.required > (gasPrices.slow ?? 0) ? gasPrices.required : gasPrices.slow
        const _items = [
            {
                icon: IconName.ClockPlus,
                title: localize('general.slow'),
                subtitle: formatGasFee(gasUnit, gasPriceSlow),
                selected: selectedGasSpeed === GasSpeed.Slow,
                onClick: () => onChooseGasPriceClick(GasSpeed.Slow),
            },
        ]

        if (gasPrices.average) {
            _items.push({
                icon: IconName.CalendarDate,
                title: localize('general.average'),
                subtitle: formatGasFee(gasUnit, gasPrices.average),
                selected: selectedGasSpeed === GasSpeed.Average,
                onClick: () => onChooseGasPriceClick(GasSpeed.Average),
            })
        }

        if (gasPrices.fast) {
            _items.push({
                icon: IconName.CalendarPlus,
                title: localize('general.fast'),
                subtitle: formatGasFee(gasUnit, gasPrices.fast),
                selected: selectedGasSpeed === GasSpeed.Fast,
                onClick: () => onChooseGasPriceClick(GasSpeed.Fast),
            })
        }
        return _items
    }

    $: _disabled = disabled || items.length < 2
</script>

<Menu bind:this={menu} disabled={_disabled} compact={false} placement="top-end" {items}>
    <button
        bind:this={anchor}
        slot="anchor"
        class="flex items-center justify-center {_disabled ? 'cursor-default' : 'cursor-pointer'}"
        disabled={_disabled}
    >
        <div class="flex flex-row items-center">
            <Text textColor={_disabled ? 'secondary' : 'brand'} fontWeight="medium">
                {formatGasFee(gasUnit, gasPrices[selectedGasSpeed])}
            </Text>
        </div>
    </button>
</Menu>
